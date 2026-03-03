'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { adicionarItemComandaAction } from '@/app/comanda/action'
import { ShoppingCart, Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { clampQuantidade, isMensagemSucesso } from './utils'

const QUANTIDADE_MIN = 1
const QUANTIDADE_MAX = 99

interface AdicionarComandaButtonProps {
  produtoId: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  children?: React.ReactNode
  /** Exibe o seletor de quantidade. Padrão: true */
  showQuantitySelector?: boolean
}

export function AdicionarComandaButton({
  produtoId,
  variant = 'default',
  size = 'default',
  className,
  children,
  showQuantitySelector = true,
}: AdicionarComandaButtonProps) {
  const router = useRouter()
  const [quantidade, setQuantidade] = useState(1)
  const [isPending, setIsPending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleClick() {
    setIsPending(true)
    setMessage(null)
    const qty = showQuantitySelector ? quantidade : 1
    const result = await adicionarItemComandaAction(produtoId, qty)
    setIsPending(false)
    setMessage(result.message)
    if (result.ok) {
      router.refresh()
      setQuantidade(1)
    }
  }

  const isSmall = size === 'sm'

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {showQuantitySelector && (
          <div
            className={cn(
              'flex items-center overflow-hidden rounded-md border border-input bg-background',
              isSmall ? 'h-8' : 'h-10'
            )}
          >
            <Button
              type="button"
              variant="ghost"
              size={isSmall ? 'sm' : 'default'}
              className="h-full shrink-0 px-2.5"
              onClick={() => setQuantidade(q => clampQuantidade(q - 1, QUANTIDADE_MIN, QUANTIDADE_MAX))}
              disabled={quantidade <= QUANTIDADE_MIN}
              aria-label="Diminuir quantidade"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span
              className={cn(
                'min-w-7 flex items-center justify-center font-medium tabular-nums',
                isSmall ? 'text-sm' : 'text-base'
              )}
              aria-label={`Quantidade: ${quantidade}`}
            >
              {quantidade}
            </span>
            <Button
              type="button"
              variant="ghost"
              size={isSmall ? 'sm' : 'default'}
              className="h-full shrink-0 px-2.5"
              onClick={() => setQuantidade(q => clampQuantidade(q + 1, QUANTIDADE_MIN, QUANTIDADE_MAX))}
              disabled={quantidade >= QUANTIDADE_MAX}
              aria-label="Aumentar quantidade"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
        <Button
          onClick={handleClick}
          disabled={isPending}
          variant={variant}
          size={size}
          className={cn('shrink-0', className)}
        >
          {children ?? (
            <>
              <ShoppingCart className="shrink-0 h-4 w-4" />
              {isPending ? 'Adicionando...' : 'Adicionar à comanda'}
            </>
          )}
        </Button>
      </div>
      {message && (
        <p
          className={`text-sm ${
            isMensagemSucesso(message)
              ? 'text-emerald-600'
              : 'text-destructive'
          }`}
        >
          {message}
          {isMensagemSucesso(message) ? (
            <a href="/comanda" className="ml-2 underline">
              Ver comanda
            </a>
          ) : null}
        </p>
      )}
    </div>
  )
}
