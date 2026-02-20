'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ShoppingCart, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

const TOAST_DURATION_MS = 5000

export function AddToCartSonnerComponent({
  id,
  productName,
}: {
  id: string | number
  productName?: string
}) {
  const router = useRouter()
  const [progress, setProgress] = useState(100)
  const reduceMotion = useSyncExternalStore(
    callback => {
      const mq = window.matchMedia('(prefer-reduced-motion: reduce)')
      mq.addEventListener('change', callback)
      return () => mq.removeEventListener('change', callback)
    },
    () => window.matchMedia('(prefer-reduced-motion: reduce)').matches,
    () => true
  )

  useEffect(() => {
    if (reduceMotion) return
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const remaining = Math.max(0, 100 - (elapsed / TOAST_DURATION_MS) * 100)
      setProgress(remaining)
      if (remaining > 0) {
        requestAnimationFrame(tick)
      }
    }
    requestAnimationFrame(tick)
  }, [reduceMotion])

  const handleGoToCart = () => {
    toast.dismiss(id)
    router.push('/carrinho')
  }

  const handleContinue = () => {
    toast.dismiss(id)
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Notificação: item adicionado ao carrinho"
      className="flex flex-col gap-4 p-4 min-w-70 rounded-lg border border-border bg-background shadow-lg"
    >
      <div className="flex items-start gap-3">
        <div
          className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0"
          aria-hidden="true"
        >
          <ShoppingCart className="h-5 w-5 text-primary" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">Item adicionado ao carrinho!</p>
          <p className="text-muted-foreground text-sm mt-0.5">
            {productName ? (
              <>
                <span className="font-medium text-foreground">{productName}</span> foi adicionado.
                Deseja ir ao carrinho ou continuar comprando?
              </>
            ) : (
              'Deseja ir ao carrinho ou continuar comprando?'
            )}
          </p>
        </div>
      </div>
      <div className="flex gap-2" role="group" aria-label="Ações disponíveis">
        <Button
          variant="outline"
          size="sm"
          onClick={handleContinue}
          className="flex-1 gap-1.5 h-9"
          aria-label="Continuar comprando"
        >
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          Continuar
        </Button>
        <Button
          size="sm"
          onClick={handleGoToCart}
          className="flex-1 gap-1.5 h-9 bg-primary hover:bg-primary/90"
          aria-label="Ir ao carrinho"
        >
          <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          Ir ao carrinho
        </Button>
      </div>
      {!reduceMotion && (
        <Progress
          value={progress}
          className="mt-2 h-1.5"
          aria-label="Tempo restante da notificação"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
        />
      )}
    </div>
  )
}

export function showAddToCartToast(productName?: string) {
  toast.custom(id => <AddToCartSonnerComponent id={id} productName={productName} />, {
    duration: TOAST_DURATION_MS,
  })
}
