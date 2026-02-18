'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product-card/ProductCard'
import { Plus } from 'lucide-react'
import type { Produto } from '@/types/produtos'
import { useCartStore } from '@/store/cartStore'
import { useProductsStore } from '@/store/productsStore'
import { showAddToCartToast } from '@/components/add-to-cart-sonner/AddToCartSonnerComponent'

interface CardapioGridProps {
  produtos: Produto[]
}

export function CardapioGrid({ produtos }: CardapioGridProps) {
  const addProduct = useCartStore(state => state.addProduct)
  const setProducts = useProductsStore(state => state.setProducts)

  useEffect(() => {
    setProducts(produtos)
  }, [produtos, setProducts])

  const handleAddToCart = (produto: Produto) => {
    addProduct(produto)
    showAddToCartToast(produto.nome)
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {produtos.map(produto => (
        <ProductCard
          key={produto.id}
          product={produto}
          priority={produto.destaque}
          href={`/cardapio/${produto.id}`}
        >
          <Button
            onClick={() => handleAddToCart(produto)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            Adicionar
          </Button>
        </ProductCard>
      ))}
    </div>
  )
}
