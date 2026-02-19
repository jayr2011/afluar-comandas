'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from '@/types/carrinho'
import { Produto } from '@/types/produtos'

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  addProduct: (produto: Produto, quantidade?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: item =>
        set(state => {
          const existingItem = state.items.find(currentItem => currentItem.id === item.id)

          if (existingItem) {
            return {
              items: state.items.map(currentItem =>
                currentItem.id === item.id
                  ? { ...currentItem, quantidade: currentItem.quantidade + item.quantidade }
                  : currentItem
              ),
            }
          }

          return {
            items: [...state.items, item],
          }
        }),
      addProduct: (produto, quantidade = 1) =>
        set(state => {
          const existingItem = state.items.find(i => i.id === produto.id)
          if (existingItem) {
            return {
              items: state.items.map(i =>
                i.id === produto.id ? { ...i, quantidade: i.quantidade + quantidade } : i
              ),
            }
          }
          return {
            items: [...state.items, { ...produto, quantidade }],
          }
        }),
      removeItem: id =>
        set(state => ({
          items: state.items.filter(i => i.id !== id),
        })),
      updateQuantity: (id, qty) =>
        set(state => {
          if (qty <= 0) {
            return {
              items: state.items.filter(item => item.id !== id),
            }
          }

          return {
            items: state.items.map(item => (item.id === id ? { ...item, quantidade: qty } : item)),
          }
        }),
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantidade, 0),
      getTotalPrice: () =>
        get().items.reduce((total, item) => total + item.preco * item.quantidade, 0),
    }),
    {
      name: 'cart-storage',
      skipHydration: true,
    }
  )
)

export const useCartItem = (id: string) => useCartStore(state => state.items.find(i => i.id === id))
