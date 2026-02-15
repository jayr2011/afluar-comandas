import { NextResponse } from 'next/server'
import { ProdutosService } from '@/services/productsService'

const productsService = new ProdutosService()

/**
 * @file src/app/api/produtos/route.ts
 * @description Endpoints da API para gestão de produtos.
 * Utiliza o Next.js App Router (Route Handlers).
 */

/**
 * Manipulador para requisições GET.
 *
 * Responsável por listar produtos com suporte a filtros via Query Parameters.
 * Conecta-se à camada de serviço para obter os dados.
 *
 * @param {Request} request - Objeto de requisição nativo do Next.js/Web API.
 * @returns {Promise<NextResponse>} Retorna um JSON com array de produtos ou objeto de erro.
 *
 * @example
 * // Listar todos os produtos
 * GET /api/produtos
 *
 * @example
 * // Filtrar por categoria
 * GET /api/produtos?categoria=Pratos%20Principais
 *
 * @example
 * // Listar apenas destaques
 * GET /api/produtos?destaque=true
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categoria = searchParams.get('categoria')
  const destaque = searchParams.get('destaque')

  try {
    let dados

    if (categoria) {
      dados = await productsService.findByCategoria(categoria)
    } else if (destaque === 'true') {
      dados = await productsService.findDestaques()
    } else {
      dados = await productsService.findAll()
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

/**
 * Manipulador para requisições POST.
 *
 * Recebe dados JSON e cria um novo produto no sistema.
 * Inclui validações básicas de integridade dos dados.
 *
 * @param {Request} request - Deve conter um corpo JSON com { nome, preco, categoria, ... }
 * @returns {Promise<NextResponse>} Retorna o produto criado (201) ou erro de validação (400).
 */
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
      return NextResponse.json(
        { error: 'Categoria é obrigatória.' },
        { status: 400 }
      )
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