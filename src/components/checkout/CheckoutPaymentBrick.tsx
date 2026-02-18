'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { initMercadoPago, Payment } from '@mercadopago/sdk-react'
import { CreditCard } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

const publicKey =
  process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY ?? process.env.NEXT_PUBLIC_MP_PUBLIC_KEY ?? ''

export interface OrderDataPayload {
  formData: {
    nome: string
    whatsapp: string
    rua: string
    numero: string
    bairro: string
    complemento?: string
  }
  cart: Array<{ id: string; nome: string; preco: number; quantidade: number }>
}

export interface CheckoutPaymentBrickProps {
  preferenceId: string
  amount: number
  orderData: OrderDataPayload
}

export function CheckoutPaymentBrick({
  preferenceId,
  amount,
  orderData,
}: CheckoutPaymentBrickProps) {
  const router = useRouter()
  const clearCart = useCartStore(state => state.clearCart)
  const [mounted, setMounted] = useState(false)
  const [paymentReady, setPaymentReady] = useState(false)

  useEffect(() => {
    if (publicKey) {
      initMercadoPago(publicKey)
    }
    const t = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(t)
  }, [])

  const handleSubmit = useCallback(
    async (param: { formData: Record<string, unknown> }) => {
      const res = await fetch('/api/checkout/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...param.formData, orderData }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error ?? 'Não foi possível processar o pagamento.')
      }
      clearCart()
      const orderId = data.orderId as string | undefined
      router.push(orderId ? `/checkout/sucesso?pedido=${orderId}` : '/checkout/sucesso')
    },
    [orderData, clearCart, router]
  )

  if (!publicKey) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        <p className="text-sm">
          Pagamento não configurado. Defina <code>NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY</code> no
          .env.local
        </p>
      </div>
    )
  }

  if (!mounted) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-lg border bg-muted/30">
        <p className="text-muted-foreground">Carregando formulário de pagamento...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <CreditCard className="h-4 w-4" />
        <span className="text-sm">Valor a pagar: R$ {amount.toFixed(2)}</span>
      </div>
      {!paymentReady && (
        <div className="flex min-h-[280px] items-center justify-center rounded-lg border bg-muted/20">
          <p className="text-muted-foreground">Preparando pagamento...</p>
        </div>
      )}
      <div className={paymentReady ? undefined : 'hidden'}>
        <Payment
          initialization={{
            amount,
            preferenceId,
          }}
          customization={{
            paymentMethods: {
              creditCard: 'all',
              debitCard: 'all',
              ticket: 'all',
              bankTransfer: 'all',
              prepaidCard: 'all',
              mercadoPago: 'all',
            },
          }}
          onSubmit={handleSubmit as never}
          onReady={() => setPaymentReady(true)}
          onError={error => {
            console.error('Payment Brick error:', error)
          }}
        />
      </div>
    </div>
  )
}
