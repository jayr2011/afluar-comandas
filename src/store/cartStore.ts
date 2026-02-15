import { create } from 'zustand'
import { CartItem } from '@/types/carrinho'

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ 
    items: [...state.items, item] 
  })),
  removeItem: (id) => set((state) => ({ 
    items: state.items.filter(i => i.id !== id) 
  })),
  updateQuantity: (id, qty) => set((state) => ({ 
    items: state.items.map(i => 
      i.id === id ? { ...i, quantidade: qty } : i
    ) 
  })),
}))

export const useCartItem = (id: string) => 
  useCartStore(state => state.items.find(i => i.id === id))