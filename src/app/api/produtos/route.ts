import { NextResponse } from 'next/server'
import { ProdutosService } from '@/services/productsService'
import { getCachedProdutos, getCachedDestaques } from '@/services/productsService'

const productsService = new ProdutosService()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categoria = searchParams.get('categoria')
  const destaque = searchParams.get('destaque')

  try {
    let dados

    if (categoria) {
      dados = await getCachedProdutos(categoria)
    } else if (destaque === 'true') {
      dados = await getCachedDestaques()
    } else {
      dados = await getCachedProdutos()
    }

    return NextResponse.json(dados)
  } catch (error) {
    console.error('Erro fatal ao buscar produtos:', error)

    return NextResponse.json(
      { error: 'Erro interno ao processar a lista de produtos' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.nome || body.nome.trim().length < 3) {
      return NextResponse.json(
        { error: 'Nome inválido: deve ter pelo menos 3 caracteres.' },
        { status: 400 }
      )
    }

    if (!body.preco || typeof body.preco !== 'number' || body.preco <= 0) {
      return NextResponse.json(
        { error: 'Preço inválido: deve ser um número maior que zero.' },
        { status: 400 }
      )
    }

    if (!body.categoria) {
      return NextResponse.json({ error: 'Categoria é obrigatória.' }, { status: 400 })
    }

    const novoProduto = await productsService.create(body)

    return NextResponse.json(novoProduto, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar produto:', error)

    return NextResponse.json(
      { error: 'Dados inválidos ou formato de requisição incorreto.' },
      { status: 400 }
    )
  }
}
