'use server'
import { revalidateTag } from 'next/cache'
import { ProdutosService } from '@/services/productsService'
import { Produto } from '@/types/produtos'

const service = new ProdutosService()

export async function criarProduto(produto: Omit<Produto, 'id'>) {
  const result = await service.create(produto)
  revalidateTag('produtos', 'layout')
  return result
}

export async function atualizarProduto(id: string, produto: Partial<Produto>) {
  const result = await service.update(id, produto)
  revalidateTag('produtos', 'layout')
  return result
}

export async function deletarProduto(id: string) {
  const result = await service.delete(id)
  revalidateTag('produtos', 'layout')
  return result
}
