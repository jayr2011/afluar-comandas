'use client'

import { memo, useState } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

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
}

export const ProductCard = memo(({ product, children, className }: ProductCardProps) => {
  const [imageLoading, setImageLoading] = useState(true)

  return (
    <Card
      className={cn(
        'overflow-hidden rounded-2xl shadow-xl border-primary/10 hover:shadow-2xl transition-all duration-300 group p-0 gap-0',
        className
      )}
    >
      {/* Imagem do Produto */}
      <div className="relative w-full h-64 bg-primary/10 overflow-hidden">
        {imageLoading && (
          <Skeleton className="absolute inset-0 w-full h-full" />
        )}
        <Image
          src={product.imagem}
          alt={product.nome}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          onLoadingComplete={() => setImageLoading(false)}
        />
        {product.destaque && (
          <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground z-10">
            Destaque
          </Badge>
        )}
      </div>

      <CardContent className="p-6">
        <p className="text-sm text-primary font-medium mb-2">
          {product.categoria}
        </p>
        <CardTitle className="text-2xl font-bold mb-3">
          {product.nome}
        </CardTitle>
        <CardDescription className="leading-relaxed mb-6 text-base">
          {product.descricao}
        </CardDescription>
        <Separator className="mb-6" />
      </CardContent>
      <CardFooter className="flex flex-row items-center justify-between px-6 pb-6 pt-0">
        <p className="text-3xl font-bold text-primary">
          R$ {product.preco.toFixed(2)}
        </p>
        {children}
      </CardFooter>
    </Card>
  )
})

ProductCard.displayName = 'ProductCard'
