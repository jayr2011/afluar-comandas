'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CartHeader, CartItemList, CartSummary } from '@/components/cart'
import { CheckoutBreadcrumb } from '@/components/checkout/CheckoutBreadcrumb'
import { EmptyState } from '@/components/feedback'
import { useCartStore } from '@/store/cartStore'

export default function CarrinhoPage() {
  const router = useRouter()
  const [showClearDialog, setShowClearDialog] = useState(false)
  const items = useCartStore(state => state.items)
  const removeItem = useCartStore(state => state.removeItem)
  const updateQuantity = useCartStore(state => state.updateQuantity)
  const clearCart = useCartStore(state => state.clearCart)
  const totalPrice = useCartStore(state =>
    state.items.reduce((sum, item) => sum + item.preco * item.quantidade, 0)
  )

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-b from-background to-primary/5">
        <div className="container mx-auto px-4 pt-4">
          <Link
            href="/cardapio"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao cardápio
          </Link>
        </div>
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
        <Link
          href="/cardapio"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao cardápio
        </Link>
        <CheckoutBreadcrumb currentStep="carrinho" className="mb-6" />
        <CartHeader />

        <div className="grid lg:grid-cols-3 gap-8">
          <CartItemList
            items={items}
            onRemoveItem={removeItem}
            onDecreaseQty={item => updateQuantity(item.id, item.quantidade - 1)}
            onIncreaseQty={item => updateQuantity(item.id, item.quantidade + 1)}
          />

          <div className="lg:col-span-1">
            <CartSummary
              subtotal={totalPrice}
              checkoutLabel="Finalizar compra"
              onCheckout={() => router.push('/checkout')}
              onClear={() => setShowClearDialog(true)}
              isCheckoutDisabled={false}
            />
          </div>
        </div>
      </div>

      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Limpar carrinho?</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover todos os itens do carrinho? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearDialog(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                clearCart()
                setShowClearDialog(false)
              }}
            >
              Limpar carrinho
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
