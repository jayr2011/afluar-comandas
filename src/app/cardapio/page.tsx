'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useProdutos } from '@/hooks/useProducts'
import { ProductCard } from "@/components/product-card"
import { Loader2, ShoppingCart, Plus } from 'lucide-react'
import type { Produto } from '@/types/produtos'
import { useCartStore } from '@/store/cartStore'
import { EmptyState, ErrorState } from "@/components/feedback"

export default function Cardapio() {
  const { produtos, loading, error, refetch } = useProdutos()
  const addProduct = useCartStore((state) => state.addProduct)

  const handleAddToCart = (produto: Produto) => {
    addProduct(produto)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-background to-primary/5">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando cardápio...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <ErrorState
        title="Ops!"
        message={error}
        fullScreen
        action={
          <Button onClick={refetch} className="bg-primary hover:bg-primary/90">
            Tentar Novamente
          </Button>
        }
      />
    )
  }

  if (produtos.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Cardápio em breve"
        description="Estamos preparando nossos pratos especiais para você!"
        fullScreen
        action={
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/contato">Fale Conosco</Link>
          </Button>
        }
      />
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-primary/5">
      {/* Hero Section */}
      <section className="relative py-4 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-top-left"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <ShoppingCart className="h-4 w-4" />
              Cardápio
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
              Sabores da Amazônia
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground font-light">
              Cada prato conta uma história
            </p>
          </div>
        </div>
      </section>

      {/* Menu Grid - AGORA COM PRODUCTCARD */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {produtos.map((produto) => (
              <ProductCard key={produto.id} product={produto} priority={produto.destaque}>
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
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-8 px-4 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Não encontrou o que procura?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Entre em contato conoscos para conhecer todo o nosso menu especial
          </p>
          <Button 
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Link href="/contato">Falar com a gente</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
