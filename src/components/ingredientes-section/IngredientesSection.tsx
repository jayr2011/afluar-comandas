'use client'

import { ChefHat } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface IngredientesSectionProps {
  ingredientes: string
  className?: string
}

export function IngredientesSection({ ingredientes, className }: IngredientesSectionProps) {
  const itens = ingredientes.split(',').map((i) => i.trim()).filter(Boolean)

  if (itens.length === 0) return null

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-3">
        <ChefHat className="h-5 w-5 text-primary shrink-0" />
        <h2 className="text-lg font-semibold">Ingredientes</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {itens.map((item) => (
          <Badge
            key={item}
            variant="secondary"
            className="font-normal text-sm px-3 py-1"
          >
            {item}
          </Badge>
        ))}
      </div>
    </div>
  )
}
