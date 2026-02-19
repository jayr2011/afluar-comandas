'use server'
import { revalidateTag } from 'next/cache'
import { requireAuthenticatedUser } from '@/lib/supabase-server'
import { ProdutosService } from '@/services/productsService'
import { Produto } from '@/types/produtos'
import logger from '@/lib/logger'

const service = new ProdutosService()
const LOG_PREFIX = '[admin:painel]'

export async function criarProduto(produto: Omit<Produto, 'id'>) {
  const user = await requireAuthenticatedUser()
  logger.debug(`${LOG_PREFIX} criarProduto - início`, {
    userId: user?.id,
    produto: { nome: produto.nome, categoria: produto.categoria },
  })

  try {
    const result = await service.create(produto)
    revalidateTag('produtos', 'layout')
    logger.info(`${LOG_PREFIX} produto criado`, {
      produtoId: result.id,
      nome: result.nome,
      userId: user?.id,
    })
    return result
  } catch (err) {
    logger.error(`${LOG_PREFIX} erro ao criar produto`, {
      error: err instanceof Error ? err.message : String(err),
      produto: { nome: produto.nome, categoria: produto.categoria },
      userId: user?.id,
    })
    throw err
  }
}

export async function atualizarProduto(id: string, produto: Partial<Produto>) {
  const user = await requireAuthenticatedUser()
  logger.debug(`${LOG_PREFIX} atualizarProduto - início`, {
    produtoId: id,
    userId: user?.id,
    updateKeys: Object.keys(produto),
  })

  try {
    const result = await service.update(id, produto)
    revalidateTag('produtos', 'layout')
    if (!result) {
      logger.warn(`${LOG_PREFIX} atualizarProduto - produto não encontrado`, {
        produtoId: id,
        userId: user?.id,
      })
      return null
    }
    logger.info(`${LOG_PREFIX} produto atualizado`, { produtoId: id, userId: user?.id })
    return result
  } catch (err) {
    logger.error(`${LOG_PREFIX} erro ao atualizar produto`, {
      produtoId: id,
      error: err instanceof Error ? err.message : String(err),
      userId: user?.id,
    })
    throw err
  }
}

export async function deletarProduto(id: string) {
  const user = await requireAuthenticatedUser()
  logger.debug(`${LOG_PREFIX} deletarProduto - início`, { produtoId: id, userId: user?.id })

  try {
    const result = await service.delete(id)
    revalidateTag('produtos', 'layout')
    logger.info(`${LOG_PREFIX} produto deletado`, { produtoId: id, userId: user?.id })
    return result
  } catch (err) {
    logger.error(`${LOG_PREFIX} erro ao deletar produto`, {
      produtoId: id,
      error: err instanceof Error ? err.message : String(err),
      userId: user?.id,
    })
    throw err
  }
}
