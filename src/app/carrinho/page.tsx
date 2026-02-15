"use client"

import { CartEmpty, CartHeader, CartItemsList, CartSummary } from "@/components/cart"
import { useCartStore } from "@/store/cartStore"

export default function CarrinhoPage() {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const clearCart = useCartStore((state) => state.clearCart)
  const totalPrice = useCartStore((state) => state.getTotalPrice())

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-primary/5">
      {items.length === 0 ? (
        <CartEmpty />
      ) : (
        <div className="container mx-auto px-4 py-8">
          <CartHeader />
          
          <div className="grid lg:grid-cols-3 gap-8">
            <CartItemsList
              items={items}
              onRemoveItem={removeItem}
              onDecreaseQty={(item) => updateQuantity(item.id, item.quantidade - 1)}
              onIncreaseQty={(item) => updateQuantity(item.id, item.quantidade + 1)}
            />

            {/* Resumo do pedido */}
            <div className="lg:col-span-1">
              <CartSummary
                subtotal={totalPrice}
                onCheckout={() => undefined}
                onClear={clearCart}
                isCheckoutDisabled={items.length === 0}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
