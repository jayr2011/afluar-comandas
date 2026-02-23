'use client'

import { useCartStore } from '@/store/cartStore'

export function useCart() {
  const items = useCartStore(state => state.items)
  const removeItem = useCartStore(state => state.removeItem)
  const updateQuantity = useCartStore(state => state.updateQuantity)
  const clearCart = useCartStore(state => state.clearCart)
  const totalPrice = useCartStore(state =>
    state.items.reduce((sum, item) => sum + item.preco * item.quantidade, 0)
  )

  const handleDecreaseQty = (itemId: string, currentQty: number) => {
    updateQuantity(itemId, currentQty - 1)
  }

  const handleIncreaseQty = (itemId: string, currentQty: number) => {
    updateQuantity(itemId, currentQty + 1)
  }

  return {
    items,
    totalPrice,
    removeItem,
    updateQuantity,
    clearCart,
    handleDecreaseQty,
    handleIncreaseQty,
    isEmpty: items.length === 0,
  }
}
