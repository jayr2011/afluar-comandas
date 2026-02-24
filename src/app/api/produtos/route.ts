import { NextRequest, NextResponse } from 'next/server'
import { ProdutosService } from '@/services/productsService'
import { getCachedDestaques } from '@/services/productsService'
import { getUserFromRequest } from '@/lib/supabase-server'
import { getSupabaseAdmin } from '@/lib/supabase'
import logger from '@/lib/logger'
import { z } from 'zod'
import { rateLimiters, withRateLimit } from '@/lib/rate-limit'

const productsService = new ProdutosService()

const produtoSchema = z.object({
  nome: z.string().min(3).max(200),
  descricao: z.string().max(500).optional().default(''),
  preco: z.number().positive().max(9999.99),
  categoria: z.string().min(1).max(100),
  imagem: z.string().optional().default(''),
  destaque: z.boolean().optional().default(false),
  ingredientes: z.string().max(1000).optional().default(''),
})

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const categoria = searchParams.get('categoria')
  const destaque = searchParams.get('destaque')
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
  const offset = (page - 1) * limit

  try {
    let dados
    let total = 0

    if (categoria) {
      dados = await productsService.findByCategoriaPaginated(categoria, offset, limit)
      total = await productsService.countByCategoria(categoria)
    } else if (destaque === 'true') {
      dados = await getCachedDestaques()
      total = dados.length
    } else {
      dados = await productsService.findAllPaginated(offset, limit)
      total = await productsService.countAll()
    }

    return NextResponse.json({
      data: dados,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    logger.error('[produtos:route] erro ao listar produtos', {
      error: error instanceof Error ? error.message : error,
    })

    return NextResponse.json(
      { error: 'Erro interno ao processar a lista de produtos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request)
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  // Rate limiting para criação de produtos (admin)
  const rateLimitResponse = await withRateLimit(rateLimiters.api, `user:${user.id}`)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  try {
    const body = await request.json()

    const parsed = produtoSchema.safeParse(body)
    if (!parsed.success) {
      const errors = parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`)
      return NextResponse.json({ error: 'Dados inválidos', details: errors }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()
    const { data: novoProduto, error: insertError } = await supabaseAdmin
      .from('produtos')
      .insert(parsed.data)
      .select()
      .single()

    if (insertError) {
      const pgError = insertError as { code?: string; message?: string }

      logger.error('[produtos:route] erro ao criar produto', {
        userId: user.id,
        code: pgError.code,
        error: pgError.message ?? insertError,
      })

      if (pgError.code === '42501') {
        return NextResponse.json(
          { error: 'Sem permissão para criar produto (RLS).' },
          { status: 403 }
        )
      }

      return NextResponse.json(
        { error: 'Não foi possível criar o produto no momento.' },
        { status: 500 }
      )
    }

    return NextResponse.json(novoProduto, { status: 201 })
  } catch (error) {
    logger.error('[produtos:route] erro ao criar produto', {
      error: error instanceof Error ? error.message : error,
    })

    return NextResponse.json({ error: 'Erro interno ao criar produto.' }, { status: 500 })
  }
}
