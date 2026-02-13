'use client'

import Image from "next/image"
import { ShoppingCart, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Produto } from '@/types/produtos'
import { useProdutos } from '@/hooks/useProducts'

export default function Cardapio() {
  const { produtos, loading, error, refetch } = useProdutos()

  const handleAddToCart = (produto: Produto) => {
    console.log('Adicionar ao carrinho:', produto.nome)
    alert(`${produto.nome} adicionado ao carrinho!`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-primary/5">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando cardápio...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-primary/5">
        <div className="text-center max-w-md px-4">
          <ShoppingCart className="h-16 w-16 text-primary/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Ops!</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button 
            onClick={refetch}
            className="bg-primary hover:bg-primary/90"
          >
            Tentar Novamente
          </Button>
        </div>
      </div>
    )
  }

  if (produtos.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-primary/5">
        <div className="text-center max-w-md px-4">
          <ShoppingCart className="h-16 w-16 text-primary/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Cardápio em breve</h2>
          <p className="text-muted-foreground mb-6">
            Estamos preparando nossos pratos especiais para você!
          </p>
          <Button 
            asChild
            className="bg-primary hover:bg-primary/90"
          >
            <a href="/contato">Fale Conosco</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
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

      {/* Menu Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {produtos.map((produto) => (
              <div
                key={produto.id}
                className="bg-card rounded-2xl shadow-xl overflow-hidden border border-primary/10 hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Imagem do Produto */}
                <div className="relative w-full h-64 bg-primary/10 overflow-hidden">
                  <Image
                    src={produto.imagem}
                    alt={produto.nome}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={produto.destaque}
                  />
                  
                  {produto.destaque && (
                    <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground z-10">
                      Destaque
                    </Badge>
                  )}
                </div>

                {/* Conteúdo */}
                <div className="p-6">
                  <p className="text-sm text-primary font-medium mb-2">
                    {produto.categoria}
                  </p>

                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {produto.nome}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {produto.descricao}
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-primary">
                        R$ {produto.preco.toFixed(2)}
                      </p>
                    </div>
                    
                    <Button 
                      onClick={() => handleAddToCart(produto)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                      size="lg"
                    >
                      <Plus className="h-5 w-5" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-primary/5">
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
            <a href="/contato">Falar com a gente</a>
          </Button>
        </div>
      </section>
    </div>
  )
}