import { ChefHat } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface IngredientesSectionProps {
  ingredientes: string
  className?: string
}

export function IngredientesSection({ ingredientes, className }: IngredientesSectionProps) {
  const itens = ingredientes
    .split(',')
    .map(i => i.trim())
    .filter(Boolean)

  if (itens.length === 0) return null

  const headingId = `ingredientes-${crypto.randomUUID()}`

  return (
    <section className={className} aria-labelledby={headingId}>
      <div className="flex items-center gap-2 mb-3">
        <ChefHat className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
        <h2 id={headingId} className="text-lg font-semibold">
          Ingredientes
        </h2>
      </div>
      <ul className="flex flex-wrap gap-2 list-none m-0 p-0">
        {itens.map(item => (
          <li key={item}>
            <Badge variant="secondary" className="font-normal text-sm px-3 py-1">
              {item}
            </Badge>
          </li>
        ))}
      </ul>
    </section>
  )
}
