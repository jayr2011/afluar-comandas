import { create } from 'zustand'
import { Produto } from '@/types/produtos'

interface ProductsStore {
  products: Map<string, Produto>
  setProducts: (products: Produto[]) => void
  setProduct: (product: Produto) => void
  getProductById: (id: string) => Produto | undefined
}

export const useProductsStore = create<ProductsStore>((set, get) => ({
  products: new Map(),
  setProducts: (products) =>
    set((state) => {
      const next = new Map(state.products)
      products.forEach((p) => next.set(p.id, p))
      return { products: next }
    }),
  setProduct: (product) =>
    set((state) => {
      const next = new Map(state.products)
      next.set(product.id, product)
      return { products: next }
    }),
  getProductById: (id) => get().products.get(id),
}))
