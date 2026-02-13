import { NextResponse } from 'next/server'
import { ProdutosController } from '@/app/controller/productController'

/**
 * API routes for produtos.
 *
 * Query params (GET):
 * - `categoria` (string): filtra produtos pela categoria.
 * - `destaque` (string): se 'true', retorna apenas produtos em destaque.
 *
 * Responses:
 * - 200: dados dos produtos (array ou objeto).
 * - 201: produto criado (POST).
 * - 400: requisição inválida ou erro de validação.
 * - 500: erro interno ao listar produtos.
 */
const produtosController = new ProdutosController()

export async function GET(request: Request) {
  /**
   * GET /api/produtos
   *
   * - Se o query param `categoria` estiver presente, retorna produtos daquela categoria.
   * - Se `destaque=true`, retorna apenas produtos em destaque.
   * - Caso contrário, retorna todos os produtos.
   *
   * Retorna um JSON com o array de produtos ou um objeto de erro com status apropriado.
   */
  const { searchParams } = new URL(request.url)
  const categoria = searchParams.get('categoria')
  const destaque = searchParams.get('destaque')

  if (categoria) {
    const result = await produtosController.listarPorCategoria(categoria)
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    return NextResponse.json(result.data)
  }

  if (destaque === 'true') {
    const result = await produtosController.listarDestaques()
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    return NextResponse.json(result.data)
  }

  const result = await produtosController.listarProdutos()
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }
  
  return NextResponse.json(result.data)
}

export async function POST(request: Request) {
  try {
    /**
     * POST /api/produtos
     *
     * Cria um novo produto. Espera um corpo JSON compatível com o tipo `Produto` (sem `id`).
     * Retorna 201 com o produto criado quando bem‑sucedido ou 400 com mensagem de erro
     * quando os dados forem inválidos/insuficientes.
     */
    const body = await request.json()
    const result = await produtosController.criarProduto(body)
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    
    return NextResponse.json(result.data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }
}
