import { Produto } from '@/types/produtos'
import { supabase } from '@/lib/supabase'
import { cacheTag } from 'next/cache'
import logger from '@/lib/logger'

const LOG_PREFIX = '[produtos]'

/** Colunas de produto usadas nas queries (evita select *) */
const PRODUTO_COLUMNS =
  'id, nome, descricao, preco, categoria, destaque, imagem, ingredientes, disponivel, created_at, updated_at'

/** Codifica cursor para paginação (nome, id) */
function encodeCursor(nome: string, id: string): string {
  return Buffer.from(JSON.stringify({ n: nome, i: id }), 'utf-8').toString('base64url')
}

/** Decodifica cursor retornado pelo cliente */
function decodeCursor(cursor: string): { nome: string; id: string } | null {
  try {
    const decoded = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf-8'))
    if (decoded?.n != null && decoded?.i != null) {
      return { nome: String(decoded.n), id: String(decoded.i) }
    }
  } catch {
    // cursor inválido
  }
  return null
}

export async function getCachedProdutos(categoria?: string) {
  'use cache'
  cacheTag('produtos')
  logger.debug(`${LOG_PREFIX} getCachedProdutos chamada`, { categoria })
  const service = new ProdutosService()
  const result = categoria ? await service.findByCategoria(categoria) : await service.findAll()
  logger.debug(`${LOG_PREFIX} getCachedProdutos finalizada`, { categoria, count: result.length })
  return result
}

export async function getCachedProduto(id: string) {
  'use cache'
  cacheTag('produtos', id)
  logger.debug(`${LOG_PREFIX} getCachedProduto chamada`, { produtoId: id })
  const produto = await new ProdutosService().findById(id)
  logger.debug(`${LOG_PREFIX} getCachedProduto finalizada`, { produtoId: id, found: !!produto })
  return produto
}

export async function getCachedDestaques() {
  'use cache'
  cacheTag('produtos')
  logger.debug(`${LOG_PREFIX} getCachedDestaques chamada`)
  const result = await new ProdutosService().findDestaques()
  logger.debug(`${LOG_PREFIX} getCachedDestaques finalizada`, { count: result.length })
  return result
}

export class ProdutosService {
  async findAll(): Promise<Produto[]> {
    logger.debug(`${LOG_PREFIX} findAll - iniciando consulta`)
    const { data, error } = await supabase.from('produtos').select(PRODUTO_COLUMNS)
    if (error) {
      logger.error(`${LOG_PREFIX} findAll - erro ao buscar produtos`, {
        error: error?.message ?? error,
      })
      throw error
    }
    const items = data ?? []
    logger.info(`${LOG_PREFIX} findAll - finalizado`, { count: items.length })
    return items
  }

  async findById(id: string): Promise<Produto | null> {
    logger.debug(`${LOG_PREFIX} findById - buscando produto`, { produtoId: id })
    const { data, error } = await supabase.from('produtos').select(PRODUTO_COLUMNS).eq('id', id)
    if (error) {
      logger.error(`${LOG_PREFIX} findById - erro`, {
        produtoId: id,
        error: error?.message ?? error,
      })
      throw error
    }
    const produto = (data && data[0]) ?? null
    if (!produto) logger.info(`${LOG_PREFIX} findById - produto não encontrado`, { produtoId: id })
    else
      logger.debug(`${LOG_PREFIX} findById - produto encontrado`, {
        produtoId: id,
        nome: produto.nome,
      })
    return produto
  }

  async findByCategoria(categoria: string): Promise<Produto[]> {
    logger.debug(`${LOG_PREFIX} findByCategoria - iniciando consulta`, { categoria })
    const { data, error } = await supabase
      .from('produtos')
      .select(PRODUTO_COLUMNS)
      .eq('categoria', categoria)
    if (error) {
      logger.error(`${LOG_PREFIX} findByCategoria - erro`, {
        categoria,
        error: error?.message ?? error,
      })
      throw error
    }
    const items = data ?? []
    logger.info(`${LOG_PREFIX} findByCategoria - finalizado`, { categoria, count: items.length })
    return items
  }

  async findDestaques(): Promise<Produto[]> {
    logger.debug(`${LOG_PREFIX} findDestaques - iniciando consulta`)
    const { data, error } = await supabase
      .from('produtos')
      .select(PRODUTO_COLUMNS)
      .eq('destaque', true)
    if (error) {
      logger.error(`${LOG_PREFIX} findDestaques - erro`, { error: error?.message ?? error })
      throw error
    }
    const items = data ?? []
    logger.info(`${LOG_PREFIX} findDestaques - finalizado`, { count: items.length })
    return items
  }

  /**
   * Paginação por cursor (keyset) - O(1) independente da profundidade.
   * Preferir sobre findAllPaginated (offset) para escalabilidade.
   */
  async findAllPaginatedByCursor(
    cursor: string | null,
    limit: number
  ): Promise<{ data: Produto[]; nextCursor: string | null }> {
    logger.debug(`${LOG_PREFIX} findAllPaginatedByCursor`, { limit, hasCursor: !!cursor })

    let query = supabase
      .from('produtos')
      .select(PRODUTO_COLUMNS)
      .order('nome', { ascending: true })
      .order('id', { ascending: true })
      .limit(limit + 1)

    if (cursor) {
      const decoded = decodeCursor(cursor)
      if (decoded) {
        const n = `"${String(decoded.nome).replace(/"/g, '\\"')}"`
        const i = decoded.id
        query = query.or(`nome.gt.${n},and(nome.eq.${n},id.gt.${i})`)
      }
    }

    const { data, error } = await query
    if (error) {
      logger.error(`${LOG_PREFIX} findAllPaginatedByCursor - erro`, { error: error.message })
      throw error
    }

    const items = data ?? []
    const hasMore = items.length > limit
    const result = hasMore ? items.slice(0, limit) : items
    const last = result[result.length - 1]
    const nextCursor = hasMore && last ? encodeCursor(String(last.nome), String(last.id)) : null

    return { data: result as Produto[], nextCursor }
  }

  async findByCategoriaPaginatedByCursor(
    categoria: string,
    cursor: string | null,
    limit: number
  ): Promise<{ data: Produto[]; nextCursor: string | null }> {
    let query = supabase
      .from('produtos')
      .select(PRODUTO_COLUMNS)
      .eq('categoria', categoria)
      .order('nome', { ascending: true })
      .order('id', { ascending: true })
      .limit(limit + 1)

    if (cursor) {
      const decoded = decodeCursor(cursor)
      if (decoded) {
        const n = `"${String(decoded.nome).replace(/"/g, '\\"')}"`
        const i = decoded.id
        query = query.or(`nome.gt.${n},and(nome.eq.${n},id.gt.${i})`)
      }
    }

    const { data, error } = await query
    if (error) throw error

    const items = data ?? []
    const hasMore = items.length > limit
    const result = hasMore ? items.slice(0, limit) : items
    const last = result[result.length - 1]
    const nextCursor = hasMore && last ? encodeCursor(String(last.nome), String(last.id)) : null

    return { data: result as Produto[], nextCursor }
  }

  /** @deprecated Use findAllPaginatedByCursor. Mantido para compatibilidade. */
  async findAllPaginated(offset: number, limit: number): Promise<Produto[]> {
    logger.debug(`${LOG_PREFIX} findAllPaginated - iniciando consulta`, { offset, limit })
    const { data, error } = await supabase
      .from('produtos')
      .select(PRODUTO_COLUMNS)
      .range(offset, offset + limit - 1)
      .order('nome')
    if (error) {
      logger.error(`${LOG_PREFIX} findAllPaginated - erro`, {
        offset,
        limit,
        error: error?.message ?? error,
      })
      throw error
    }
    const items = data ?? []
    logger.info(`${LOG_PREFIX} findAllPaginated - finalizado`, {
      offset,
      limit,
      count: items.length,
    })
    return items
  }

  async countAll(): Promise<number> {
    logger.debug(`${LOG_PREFIX} countAll - iniciando contagem`)
    const { count, error } = await supabase
      .from('produtos')
      .select('*', { count: 'exact', head: true })
    if (error) {
      logger.error(`${LOG_PREFIX} countAll - erro`, { error: error?.message ?? error })
      throw error
    }
    const total = count || 0
    logger.debug(`${LOG_PREFIX} countAll - finalizado`, { count: total })
    return total
  }

  async findByCategoriaPaginated(
    categoria: string,
    offset: number,
    limit: number
  ): Promise<Produto[]> {
    logger.debug(`${LOG_PREFIX} findByCategoriaPaginated - iniciando consulta`, {
      categoria,
      offset,
      limit,
    })
    const { data, error } = await supabase
      .from('produtos')
      .select(PRODUTO_COLUMNS)
      .eq('categoria', categoria)
      .range(offset, offset + limit - 1)
      .order('nome')
    if (error) {
      logger.error(`${LOG_PREFIX} findByCategoriaPaginated - erro`, {
        categoria,
        offset,
        limit,
        error: error?.message ?? error,
      })
      throw error
    }
    const items = data ?? []
    logger.info(`${LOG_PREFIX} findByCategoriaPaginated - finalizado`, {
      categoria,
      offset,
      limit,
      count: items.length,
    })
    return items
  }

  async countByCategoria(categoria: string): Promise<number> {
    logger.debug(`${LOG_PREFIX} countByCategoria - iniciando contagem`, { categoria })
    const { count, error } = await supabase
      .from('produtos')
      .select('*', { count: 'exact', head: true })
      .eq('categoria', categoria)
    if (error) {
      logger.error(`${LOG_PREFIX} countByCategoria - erro`, {
        categoria,
        error: error?.message ?? error,
      })
      throw error
    }
    const total = count || 0
    logger.debug(`${LOG_PREFIX} countByCategoria - finalizado`, { categoria, count: total })
    return total
  }

  async create(produto: Omit<Produto, 'id'>): Promise<Produto> {
    logger.debug(`${LOG_PREFIX} create - criando produto`, {
      nome: produto.nome,
      categoria: produto.categoria,
    })
    const { data, error } = await supabase.from('produtos').insert(produto).select().single()
    if (error) {
      logger.error(`${LOG_PREFIX} create - erro ao criar produto`, {
        nome: produto.nome,
        categoria: produto.categoria,
        error: error?.message ?? error,
      })
      throw error
    }
    logger.info(`${LOG_PREFIX} create - produto criado`, { produtoId: data?.id, nome: data?.nome })
    return data
  }

  async update(id: string, produto: Partial<Produto>): Promise<Produto | null> {
    logger.debug(`${LOG_PREFIX} update - atualizando produto`, {
      produtoId: id,
      updateKeys: Object.keys(produto),
    })
    const { data, error } = await supabase
      .from('produtos')
      .update(produto)
      .eq('id', id)
      .select()
      .single()
    if (error) {
      logger.error(`${LOG_PREFIX} update - erro ao atualizar produto`, {
        produtoId: id,
        updateKeys: Object.keys(produto),
        error: error?.message ?? error,
      })
      throw error
    }
    logger.info(`${LOG_PREFIX} update - produto atualizado`, { produtoId: id })
    return data || null
  }

  async delete(id: string): Promise<boolean> {
    logger.debug(`${LOG_PREFIX} delete - deletando produto`, { produtoId: id })
    const { error } = await supabase.from('produtos').delete().eq('id', id)
    if (error) {
      logger.error(`${LOG_PREFIX} delete - erro ao deletar produto`, {
        produtoId: id,
        error: error?.message ?? error,
      })
      throw error
    }
    logger.info(`${LOG_PREFIX} delete - produto deletado`, { produtoId: id })
    return true
  }
}
