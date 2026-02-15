'use client'

import { memo, useState } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

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
}

export const ProductCard = memo(({ product, children}: ProductCardProps) => {

  const [imageLoading, setImageLoading] = useState(true)

  return (
    <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-primary/10 hover:shadow-2xl transition-all duration-300 group">
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

      {/* Conteúdo */}
      <div className="p-6">
        <p className="text-sm text-primary font-medium mb-2">
          {product.categoria}
        </p>

        <h3 className="text-2xl font-bold text-foreground mb-3">
          {product.nome}
        </h3>

        <p className="text-muted-foreground leading-relaxed mb-6">
          {product.descricao}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-primary">
              R$ {product.preco.toFixed(2)}
            </p>
          </div>
          
          {/* Área para o botão */}
          {children}
        </div>
      </div>
    </div>
  )
})

ProductCard.displayName = 'ProductCard'
