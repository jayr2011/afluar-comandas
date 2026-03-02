'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { IngredientesSection } from '@/components/ingredientes-section'
import { ArrowLeft } from 'lucide-react'
import { Produto } from '@/types/produtos'
import { formatPrice } from '@/lib/utils'

interface ProdutoDetalheClientProps {
  produto: Produto
}

export function ProdutoDetalheClient({ produto }: ProdutoDetalheClientProps) {
  const [imageLoading, setImageLoading] = useState(true)

  const categoriaFormatada = produto.categoria
    ? produto.categoria.charAt(0).toUpperCase() + produto.categoria.slice(1)
    : ''

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-primary/5">
      <section className="relative py-4 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-top-left" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <Button
            asChild
            variant="ghost"
            className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <Link href="/cardapio" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao cardápio
            </Link>
          </Button>
        </div>
      </section>

      <section className="pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <article className="overflow-hidden rounded-2xl shadow-xl border border-primary/10 bg-card">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative w-full aspect-square md:aspect-auto md:min-h-100 bg-primary/10">
                {imageLoading && <Skeleton className="absolute inset-0 w-full h-full" />}
                <Image
                  src={produto.imagem}
                  alt={produto.nome}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  onLoad={() => setImageLoading(false)}
                />
                {produto.destaque && (
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground z-10">
                    Destaque
                  </Badge>
                )}
              </div>

              <div className="p-8 md:p-10 flex flex-col gap-6">
                <div>
                  <p className="text-sm font-medium text-primary mb-2">{categoriaFormatada}</p>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">{produto.nome}</h1>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    {produto.descricao}
                  </p>
                  {produto.ingredientes && (
                    <IngredientesSection ingredientes={produto.ingredientes} />
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-auto pt-4">
                  <p className="text-3xl font-bold text-primary">{formatPrice(produto.preco)}</p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}
