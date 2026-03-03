'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { adicionarItemComandaAction } from '@/app/comanda/action'
import { ShoppingCart } from 'lucide-react'

interface AdicionarComandaButtonProps {
  produtoId: string
  quantidade?: number
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  children?: React.ReactNode
}

export function AdicionarComandaButton({
  produtoId,
  quantidade = 1,
  variant = 'default',
  size = 'default',
  className,
  children,
}: AdicionarComandaButtonProps) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleClick() {
    setIsPending(true)
    setMessage(null)
    const result = await adicionarItemComandaAction(produtoId, quantidade)
    setIsPending(false)
    setMessage(result.message)
    if (result.ok) {
      router.refresh()
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleClick}
        disabled={isPending}
        variant={variant}
        size={size}
        className={className}
      >
        {children ?? (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isPending ? 'Adicionando...' : 'Adicionar à comanda'}
          </>
        )}
      </Button>
      {message && (
        <p
          className={`text-sm ${
            message.includes('adicionado') || message.includes('Item')
              ? 'text-emerald-600'
              : 'text-destructive'
          }`}
        >
          {message}
          {message.includes('adicionado') || message.includes('Item') ? (
            <a href="/comanda" className="ml-2 underline">
              Ver comanda
            </a>
          ) : null}
        </p>
      )}
    </div>
  )
}
