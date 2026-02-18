'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CartHeader, CartItemList, CartSummary } from '@/components/cart'
import { EmptyState } from '@/components/feedback'
import { useCartStore } from '@/store/cartStore'

export default function CarrinhoPage() {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const clearCart = useCartStore((state) => state.clearCart)
  const totalPrice = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.preco * item.quantidade, 0)
  )

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-b from-background to-primary/5">
        <EmptyState
          icon={ShoppingCart}
          title="Seu carrinho está vazio"
          description="Adicione pratos deliciosos do nosso cardápio para começar seu pedido."
          fullScreen
          action={
            <Button asChild className="bg-primary hover:bg-primary/90" size="lg">
              <Link href="/cardapio">Ver cardápio</Link>
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <CartHeader />

        <div className="grid lg:grid-cols-3 gap-8">
          <CartItemList
            items={items}
            onRemoveItem={removeItem}
            onDecreaseQty={(item) => updateQuantity(item.id, item.quantidade - 1)}
            onIncreaseQty={(item) => updateQuantity(item.id, item.quantidade + 1)}
          />

          <div className="lg:col-span-1">
            <CartSummary
              subtotal={totalPrice}
              onCheckout={() => undefined}
              onClear={clearCart}
              isCheckoutDisabled={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
