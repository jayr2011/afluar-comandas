import { NextResponse } from 'next/server'
import { ProdutosService } from '@/services/productsService'
import { getCachedDestaques } from '@/services/productsService'
import { z } from 'zod'

const productsService = new ProdutosService()

const produtoSchema = z.object({
  nome: z.string().min(3).max(200),
  descricao: z.string().max(500).optional().default(''),
  preco: z.number().positive().max(9999.99),
  categoria: z.string().min(1).max(100),
  imagem: z.string().url().optional().default(''),
  destaque: z.boolean().optional().default(false),
  ingredientes: z.string().max(1000).optional().default(''),
})

function verifyAdminApiKey(request: Request): boolean {
  const apiKey = request.headers.get('x-api-key')
  const validKey = process.env.ADMIN_API_KEY

  if (!validKey) {
    console.warn('[produtos] ADMIN_API_KEY não configurada - autenticação desabilitada')
    return false
  }

  return apiKey === validKey
}

export async function GET(request: Request) {
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
    console.error('Erro fatal ao buscar produtos:', error)

    return NextResponse.json(
      { error: 'Erro interno ao processar a lista de produtos' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  if (!verifyAdminApiKey(request)) {
    return NextResponse.json(
      { error: 'Chave de API não autorizada para esta operação' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()

    const parsed = produtoSchema.safeParse(body)
    if (!parsed.success) {
      const errors = parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`)
      return NextResponse.json({ error: 'Dados inválidos', details: errors }, { status: 400 })
    }

    const novoProduto = await productsService.create(parsed.data)

    return NextResponse.json(novoProduto, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar produto:', error)

    return NextResponse.json(
      { error: 'Dados inválidos ou formato de requisição incorreto.' },
      { status: 400 }
    )
  }
}
