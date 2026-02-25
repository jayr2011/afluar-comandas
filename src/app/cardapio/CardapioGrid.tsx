'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product-card/ProductCard'
import { Plus, ChevronDown, Filter } from 'lucide-react'
import type { Produto } from '@/types/produtos'
import { useCartStore } from '@/store/cartStore'
import { useProductsStore } from '@/store/productsStore'
import { showAddToCartToast } from '@/components/add-to-cart-sonner/AddToCartSonnerComponent'
import { CATEGORIAS_CARDAPIO, produtoNaCategoria, type SlugCategoria } from './categorias'
import { cn } from '@/lib/utils'
import { useRealtimeProdutos } from '@/hooks/useRealtimeProdutos'

interface CardapioGridProps {
  produtos: Produto[]
  checkoutEnabled: boolean
}

export function CardapioGrid({ produtos, checkoutEnabled }: CardapioGridProps) {
  const addProduct = useCartStore(state => state.addProduct)
  const setProducts = useProductsStore(state => state.setProducts)
  const [filtroSelecionado, setFiltroSelecionado] = useState<SlugCategoria | 'destaques' | null>(
    null
  )
  const [filtrosAbertos, setFiltrosAbertos] = useState(false)

  const produtosRealtime = useRealtimeProdutos(produtos)

  useEffect(() => {
    setProducts(produtosRealtime)
  }, [produtosRealtime, setProducts])

  const produtosFiltrados = useMemo(() => {
    if (!filtroSelecionado) return produtosRealtime
    if (filtroSelecionado === 'destaques') return produtosRealtime.filter(p => p.destaque)
    return produtosRealtime.filter(p => produtoNaCategoria(p.categoria, filtroSelecionado))
  }, [produtosRealtime, filtroSelecionado])

  const handleAddToCart = (produto: Produto) => {
    addProduct(produto)
    showAddToCartToast(produto.nome)
  }

  const labelFiltroAtivo =
    filtroSelecionado === null
      ? 'Filtros'
      : filtroSelecionado === 'destaques'
        ? 'Destaques'
        : (CATEGORIAS_CARDAPIO.find(c => c.slug === filtroSelecionado)?.label ?? 'Filtros')

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFiltrosAbertos(prev => !prev)}
          aria-expanded={filtrosAbertos}
          aria-controls="cardapio-filtros"
          className="gap-2 p-5 border-primary/10 border-2 rounded-2xl"
        >
          <Filter className="h-4 w-4" aria-hidden="true" />
          {labelFiltroAtivo}
          <ChevronDown
            aria-hidden="true"
            className={cn('h-4 w-4 transition-transform', filtrosAbertos && 'rotate-180')}
          />
        </Button>
        {filtrosAbertos && (
          <div
            id="cardapio-filtros"
            className="flex flex-wrap gap-2 justify-center animate-in fade-in slide-in-from-top-2 duration-300"
          >
            <Button
              variant={filtroSelecionado === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setFiltroSelecionado(null)
                setFiltrosAbertos(false)
              }}
              className={cn(
                filtroSelecionado === null &&
                  'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
            >
              Todos
            </Button>
            <Button
              variant={filtroSelecionado === 'destaques' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setFiltroSelecionado('destaques')
                setFiltrosAbertos(false)
              }}
              className={cn(
                filtroSelecionado === 'destaques' &&
                  'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
            >
              Destaques
            </Button>
            {CATEGORIAS_CARDAPIO.map(({ slug, label }) => (
              <Button
                key={slug}
                variant={filtroSelecionado === slug ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setFiltroSelecionado(slug)
                  setFiltrosAbertos(false)
                }}
                className={cn(
                  filtroSelecionado === slug &&
                    'bg-primary text-primary-foreground hover:bg-primary/90'
                )}
              >
                {label}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {produtosFiltrados.map(produto => (
          <ProductCard
            key={produto.id}
            product={produto}
            priority={produto.destaque}
            href={`/cardapio/${produto.id}`}
          >
            {checkoutEnabled ? (
              <Button
                onClick={() => handleAddToCart(produto)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 relative z-10"
                size="lg"
                aria-label={`Adicionar ${produto.nome} ao carrinho`}
              >
                <Plus className="h-5 w-5" aria-hidden="true" />
                Adicionar
              </Button>
            ) : null}
          </ProductCard>
        ))}
      </div>
    </div>
  )
}
