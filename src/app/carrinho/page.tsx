"use client"

import { CartEmpty, CartHeader, CartItemsList, CartSummary } from "@/components/cart"
import { CartItem } from "@/types/carrinho"

export default function CarrinhoPage() {
  // Descomente quando integrar com Zustand
  // const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore()
  
  // Dados temporários para exemplo
  const items: CartItem[] = []
  const totalPrice = 0

  if (items.length === 0) {
    return (
      <CartEmpty />
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CartHeader />
      
      <div className="grid lg:grid-cols-3 gap-8">
        <CartItemsList
          items={items}
          onRemoveItem={() => undefined}
          onDecreaseQty={() => undefined}
          onIncreaseQty={() => undefined}
        />

        {/* Resumo do pedido */}
        <div className="lg:col-span-1">
          <CartSummary
            subtotal={totalPrice}
            onCheckout={() => undefined}
            onClear={() => undefined}
            isCheckoutDisabled={items.length === 0}
          />
        </div>
      </div>
    </div>
  )
}
