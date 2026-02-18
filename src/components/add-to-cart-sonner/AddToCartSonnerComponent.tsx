'use client'

import { useEffect, useState } from 'react'
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

  useEffect(() => {
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
  }, [])

  const handleGoToCart = () => {
    toast.dismiss(id)
    router.push('/carrinho')
  }

  const handleContinue = () => {
    toast.dismiss(id)
  }

  return (
    <div className="flex flex-col gap-4 p-4 min-w-[280px] rounded-lg border border-border bg-background shadow-lg">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <ShoppingCart className="h-5 w-5 text-primary" />
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
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleContinue} className="flex-1 gap-1.5 h-9">
          <ShoppingBag className="h-4 w-4" />
          Continuar
        </Button>
        <Button
          size="sm"
          onClick={handleGoToCart}
          className="flex-1 gap-1.5 h-9 bg-primary hover:bg-primary/90"
        >
          <ShoppingCart className="h-4 w-4" />
          Ir ao carrinho
        </Button>
      </div>
      <Progress value={progress} className="mt-2 h-1.5" />
    </div>
  )
}

export function showAddToCartToast(productName?: string) {
  toast.custom(id => <AddToCartSonnerComponent id={id} productName={productName} />, {
    duration: TOAST_DURATION_MS,
  })
}
