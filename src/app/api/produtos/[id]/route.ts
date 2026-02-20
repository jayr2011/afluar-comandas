import { NextResponse } from 'next/server'
import { getCachedProduto } from '@/services/productsService'
import logger from '@/lib/logger'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: 'ID do produto é obrigatório' }, { status: 400 })
  }

  try {
    const produto = await getCachedProduto(id)

    if (!produto) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    return NextResponse.json(produto)
  } catch (error) {
    logger.error('Erro ao buscar produto:', error)
    return NextResponse.json({ error: 'Erro interno ao processar a requisição' }, { status: 500 })
  }
}
