'use client'

import { Waves, Leaf, UtensilsCrossed, Sparkles } from "lucide-react"

export default function Experiencia() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-top-left"></div>
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Nossa História
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
              Onde o Rio encontra o Requinte
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground font-light">
              Descubra o Afluar
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-card rounded-2xl shadow-xl p-8 md:p-12 border border-primary/10">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg md:text-xl text-foreground/90 leading-relaxed mb-6">
                Existe uma Belém que não está nos mapas, mas no paladar. No Afluar, 
                nós não servimos pratos; nós <span className="font-semibold text-primary">traduzimos 
                a força da Amazônia</span> em uma experiência de alta gastronomia que você 
                não encontrará em nenhum outro lugar.
              </p>

              <p className="text-lg md:text-xl text-foreground/90 leading-relaxed mb-6">
                Imagine o primeiro toque do <span className="font-semibold text-primary">tucupi negro</span>, 
                perfeitamente equilibrado, despertando seus sentidos enquanto o aroma do jambu 
                fresco anuncia uma dormência festiva na boca. Aqui, o rústico das nossas 
                raízes se funde à sofisticação de técnicas contemporâneas.
              </p>

              <p className="text-lg md:text-xl text-foreground/90 leading-relaxed mb-6">
                Seja pela textura aveludada do nosso <span className="font-semibold text-primary">açaí 
                artesanal</span> ou pela complexidade de um pirarucu grelhado no ponto exato, 
                cada garfada no Afluar é um mergulho nas águas profundas do Pará, servido 
                com a elegância que você merece.
              </p>

              <p className="text-2xl font-semibold text-primary text-center mt-12 mb-8 italic">
                Não é apenas jantar. É o fluxo da nossa história no seu prato.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-xl shadow-lg text-center border border-primary/10 hover:shadow-xl transition-shadow">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Waves className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">
                Da Amazônia
              </h3>
              <p className="text-muted-foreground">
                Ingredientes frescos e autênticos direto das águas e florestas paraenses
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-lg text-center border border-primary/10 hover:shadow-xl transition-shadow">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossed className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">
                Alta Gastronomia
              </h3>
              <p className="text-muted-foreground">
                Técnicas contemporâneas que elevam o tradicional ao extraordinário
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-lg text-center border border-primary/10 hover:shadow-xl transition-shadow">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">
                Experiência Única
              </h3>
              <p className="text-muted-foreground">
                Cada prato conta uma história da cultura e tradição paraense
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
