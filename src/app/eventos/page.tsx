'use client'

import { Calendar, Users, Sparkles, Heart, PartyPopper, Wine, Camera, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const tiposEventos = [
  {
    icon: Heart,
    titulo: "Casamentos",
    descricao: "Celebre o dia mais importante da sua vida com uma vista inesquecível da Baía do Guajará",
    destaque: true
  },
  {
    icon: PartyPopper,
    titulo: "Aniversários",
    descricao: "Comemore sua data especial em um cenário paradisíaco à beira da baía",
    destaque: false
  },
  {
    icon: Wine,
    titulo: "Eventos Corporativos",
    descricao: "Impressione seus clientes e colaboradores com gastronomia de alta qualidade e vista privilegiada",
    destaque: false
  },
  {
    icon: Users,
    titulo: "Confraternizações",
    descricao: "Reúna amigos e família em um ambiente sofisticado com o pôr do sol mais bonito de Belém",
    destaque: false
  }
]

const diferenciais = [
  {
    icon: MapPin,
    titulo: "Vista Panorâmica",
    descricao: "Localização privilegiada com vista deslumbrante para a Baía do Guajará"
  },
  {
    icon: Sparkles,
    titulo: "Gastronomia Exclusiva",
    descricao: "Menu personalizado com o melhor da culinária amazônica contemporânea"
  },
  {
    icon: Camera,
    titulo: "Cenário dos Sonhos",
    descricao: "O pôr do sol mais fotogênico de Belém como cenário do seu evento"
  },
  {
    icon: Calendar,
    titulo: "Planejamento Completo",
    descricao: "Equipe especializada para cuidar de cada detalhe do seu evento"
  }
]

export default function Eventos() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-primary/5">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-top-left"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Calendar className="h-4 w-4" />
              Eventos Especiais
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
              Seu Momento Perfeito
              <br />
              <span className="text-foreground">Com Vista Para o Paraíso</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-3xl mx-auto mb-8">
              Celebre os momentos mais importantes da sua vida com a 
              <span className="font-semibold text-primary"> vista mais deslumbrante da Baía do Guajará</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6"
              >
                <a href="/contato">Solicitar Orçamento</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tipos de Eventos */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Eventos Que Realizamos
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Do íntimo ao grandioso, transformamos seu evento em uma experiência única
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {tiposEventos.map((evento, index) => {
              const Icon = evento.icon
              return (
                <div
                  key={index}
                  className={`bg-card rounded-2xl p-8 border hover:shadow-xl transition-all duration-300 group ${
                    evento.destaque ? 'border-primary shadow-lg' : 'border-primary/10'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`h-14 w-14 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform ${
                      evento.destaque ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                    }`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold text-foreground">
                          {evento.titulo}
                        </h3>
                        {evento.destaque && (
                          <Badge className="bg-primary text-primary-foreground">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {evento.descricao}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Por Que Escolher o Afluar?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Mais que um restaurante, um cenário de sonhos para suas celebrações
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {diferenciais.map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  key={index}
                  className="bg-card rounded-xl p-6 border border-primary/10 hover:border-primary/30 hover:shadow-lg transition-all duration-300 text-center group"
                >
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
                    <Icon className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {item.titulo}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.descricao}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Destaque da Vista */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-card rounded-3xl shadow-2xl overflow-hidden border border-primary/20">
            <div className="p-8 md:p-12 text-center">
              <MapPin className="h-16 w-16 text-primary mx-auto mb-6" />
              
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                A Vista Mais Privilegiada de Belém
              </h2>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
                Imagine seu evento com o <span className="font-semibold text-primary">pôr do sol 
                refletindo nas águas da Baía do Guajará</span> ao fundo. Um cenário que 
                transforma qualquer celebração em um momento cinematográfico e inesquecível.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed mb-8 italic">
                "Cada mesa tem vista para o rio. Cada momento se torna uma memória eterna."
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <a href="/contato">Agendar Visita</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Sparkles className="h-12 w-12 text-primary mx-auto mb-6" />
          
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Pronto Para Criar Memórias Inesquecíveis?
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Entre em contato e descubra como podemos tornar seu evento extraordinário 
            com a melhor vista de Belém como cenário
          </p>
          
          <Button 
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6"
          >
            <a href="/contato">Falar com Nosso Time</a>
          </Button>
        </div>
      </section>
    </div>
  )
}