'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { CartItem } from '@/types/carrinho'
import { Minus, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'

interface CartItemRowProps {
  item: CartItem
  onRemove?: (id: string) => void
  onDecreaseQty?: (item: CartItem) => void
  onIncreaseQty?: (item: CartItem) => void
}

export function CartItemRow({ item, onRemove, onDecreaseQty, onIncreaseQty }: CartItemRowProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 border rounded-lg group">
      <div className="flex gap-3 sm:gap-4 min-w-0">
        <Link
          href={`/cardapio/${item.id}`}
          className="flex gap-3 sm:gap-4 min-w-0 flex-1 hover:opacity-90 transition-opacity"
        >
          {item.imagem && (
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded overflow-hidden">
              <Image src={item.imagem} alt={item.nome} fill className="object-cover" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base sm:text-lg wrap-break-word hover:underline">
              {item.nome}
            </h3>
          </div>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 h-8 w-8 -mt-1 -mr-1"
          onClick={() => onRemove?.(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 min-w-0 -mt-2 sm:mt-0">
        {item.descricao && (
          <Accordion type="single" collapsible className="w-full mt-1">
            <AccordionItem value={`descricao-${item.id}`} className="border-b-0">
              <AccordionTrigger className="py-2 justify-start gap-2 [&>svg]:shrink-0 text-sm hover:no-underline">
                Descrição do prato
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm">
                {item.descricao}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        <p className="font-bold mt-2 text-sm sm:text-base">R$ {item.preco.toFixed(2)}</p>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-2 border-t pt-3 sm:border-0 sm:pt-0 sm:flex-col sm:items-end">
        <span className="text-sm text-muted-foreground sm:hidden">Quantidade</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => onDecreaseQty?.(item)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center font-medium text-sm">{item.quantidade}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => onIncreaseQty?.(item)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
