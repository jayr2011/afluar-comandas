import { create } from 'zustand'
import { Produto } from '@/types/produtos'
import logger from '@/lib/logger'

interface ProductsStore {
  products: Map<string, Produto>
  setProducts: (products: Produto[]) => void
  setProduct: (product: Produto) => void
  getProductById: (id: string) => Produto | undefined
}

const LOG_PREFIX = '[store:produtos]'

export const useProductsStore = create<ProductsStore>((set, get) => ({
  products: new Map(),

  setProducts: (products: Produto[]) =>
    set(state => {
      logger.debug(`${LOG_PREFIX} setProducts - início`, { incomingCount: products.length })
      const next = new Map(state.products)
      products.forEach(p => next.set(p.id, p))
      logger.info(`${LOG_PREFIX} setProducts - concluído`, {
        prevCount: state.products.size,
        newCount: next.size,
      })
      return { products: next }
    }),

  setProduct: (product: Produto) =>
    set(state => {
      const exists = state.products.has(product.id)
      logger.debug(`${LOG_PREFIX} setProduct - ${exists ? 'atualizando' : 'inserindo'}`, {
        produtoId: product.id,
      })
      const next = new Map(state.products)
      next.set(product.id, product)
      logger.info(`${LOG_PREFIX} setProduct - concluído`, {
        produtoId: product.id,
        nome: product.nome,
        existedBefore: exists,
      })
      return { products: next }
    }),

  getProductById: (id: string) => {
    const produto = get().products.get(id)
    if (produto) {
      logger.debug(`${LOG_PREFIX} getProductById - cache hit`, {
        produtoId: id,
        nome: produto.nome,
      })
    } else {
      logger.debug(`${LOG_PREFIX} getProductById - cache miss`, { produtoId: id })
    }
    return produto
  },
}))
