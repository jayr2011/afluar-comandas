'use client'

import { memo, useState, useId } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn, formatPrice } from '@/lib/utils'

const DESCRICAO_MAX_CARACTERES = 100

export interface Product {
  id: string
  nome: string
  descricao: string
  preco: number
  imagem: string
  categoria: string
  destaque?: boolean
  disponivel?: boolean
}

interface ProductCardProps {
  product: Product
  children?: React.ReactNode
  priority?: boolean
  className?: string
  href?: string
}

export const ProductCard = memo(({ product, children, className, href }: ProductCardProps) => {
  const [imageLoading, setImageLoading] = useState(true)
  const [descricaoExpandida, setDescricaoExpandida] = useState(false)
  const headingId = useId()

  const descricaoLonga = product.descricao.length > DESCRICAO_MAX_CARACTERES
  const textoDescricao =
    descricaoLonga && !descricaoExpandida
      ? `${product.descricao.slice(0, DESCRICAO_MAX_CARACTERES).trim()}...`
      : product.descricao

  const contentBlock = (
    <>
      <div className="relative w-full h-64 bg-primary/10 overflow-hidden">
        {imageLoading && <Skeleton className="absolute inset-0 w-full h-full" aria-hidden="true" />}
        <Image
          src={product.imagem}
          alt={product.nome}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          onLoad={() => setImageLoading(false)}
        />
        {product.destaque && (
          <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground z-10">
            Destaque
          </Badge>
        )}
      </div>

      <CardContent className="p-6 relative">
        <p className="text-sm text-primary font-medium mb-2">{product.categoria}</p>
        <h3 id={headingId} className="text-2xl font-bold mb-3 leading-none">
          {href ? (
            <Link
              href={href}
              className="before:absolute before:inset-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
              aria-label={`Ver detalhes de ${product.nome}`}
            >
              {product.nome}
            </Link>
          ) : (
            product.nome
          )}
        </h3>
        <p className="leading-relaxed mb-2 text-base text-muted-foreground">
          {textoDescricao}
          {descricaoLonga && (
            <Button
              type="button"
              variant="link"
              size="sm"
              aria-expanded={descricaoExpandida}
              aria-controls={`${headingId}-desc`}
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                setDescricaoExpandida(prev => !prev)
              }}
              className="p-0! relative z-10 ml-2"
            >
              {descricaoExpandida ? 'Ver menos' : 'Ver mais'}
              {descricaoExpandida ? (
                <ChevronUp aria-hidden="true" />
              ) : (
                <ChevronDown aria-hidden="true" />
              )}
            </Button>
          )}
        </p>
        <Separator className="mb-6 mt-4" aria-hidden="true" />
      </CardContent>
    </>
  )

  return (
    <Card
      role="article"
      aria-labelledby={headingId}
      className={cn(
        'relative overflow-hidden rounded-2xl shadow-xl border-primary/10 hover:shadow-2xl transition-all duration-300 group p-0 gap-0',
        className
      )}
    >
      {contentBlock}
      <CardFooter className="flex flex-row items-center justify-between px-6 pb-6 pt-0 relative z-10">
        <p className="text-3xl font-bold text-primary">{formatPrice(product.preco)}</p>
        {children}
      </CardFooter>
    </Card>
  )
})

ProductCard.displayName = 'ProductCard'
