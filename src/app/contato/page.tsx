import Link from 'next/link'
import { MapPin, Clock, ExternalLink, Instagram, Phone, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const contatosInfo = [
  {
    icon: Phone,
    titulo: 'WhatsApp',
    descricao: 'Fale diretamente conosco',
    valor: '+55 91 98590-9595',
    link: 'https://wa.me/5591985909595',
    cta: 'Enviar Mensagem',
    destaque: true,
  },
  {
    icon: Instagram,
    titulo: 'Instagram',
    descricao: 'Siga nosso dia a dia',
    valor: '@afluar_restaurante',
    link: 'https://www.instagram.com/afluar_restaurante/',
    cta: 'Seguir no Instagram',
    destaque: false,
  },
]

const informacoesAdicionais = [
  {
    icon: MapPin,
    titulo: 'Localização',
    descricao: 'Belém - PA, com vista para a Baía do Guajará',
    link: 'https://maps.app.goo.gl/SEU_LINK_AQUI',
    isExternal: true,
  },
  {
    icon: Clock,
    titulo: 'Horário de Funcionamento',
    descricao: 'Seg a Dom: 11h às 23h',
    link: null,
    isExternal: false,
  },
]

export default function Contato() {
  const heroId = 'contato-hero'
  const canaisId = 'contato-canais'
  const infoId = 'contato-info'
  const ctaId = 'contato-cta'

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-primary/5">
      {/* Hero Section */}
      <section aria-labelledby={heroId} className="relative py-20 px-4 overflow-hidden">
        <div
          className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-top-left"
          aria-hidden="true"
        />
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Contato
            </div>
            <h1
              id={heroId}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight"
            >
              Vamos Conversar?
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light">
              Estamos prontos para atender você
            </p>
          </div>
        </div>
      </section>

      {/* Canais de Contato */}
      <section aria-labelledby={canaisId} className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 id={canaisId} className="sr-only">
            Canais de contato
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {contatosInfo.map(contato => {
              const Icon = contato.icon
              return (
                <article
                  key={contato.titulo}
                  className={`bg-card rounded-2xl p-8 border hover:shadow-2xl transition-all duration-300 group ${
                    contato.destaque ? 'border-primary shadow-lg md:scale-105' : 'border-primary/10'
                  }`}
                >
                  <div
                    className={`h-16 w-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${
                      contato.destaque
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-primary/10 text-primary'
                    }`}
                    aria-hidden="true"
                  >
                    <Icon className="h-8 w-8" aria-hidden="true" />
                  </div>

                  <h3 className="text-2xl font-bold text-foreground mb-2">{contato.titulo}</h3>

                  <p className="text-muted-foreground mb-4">{contato.descricao}</p>

                  <p className="text-lg font-semibold text-primary mb-6">{contato.valor}</p>

                  <Button
                    asChild
                    className={`w-full ${
                      contato.destaque
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                        : 'bg-primary/10 hover:bg-primary/20 text-primary'
                    }`}
                    size="lg"
                  >
                    <a
                      href={contato.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${contato.cta} (abre em nova janela)`}
                    >
                      {contato.cta}
                    </a>
                  </Button>
                </article>
              )
            })}
          </div>

          {/* Informações Adicionais */}
          <section aria-labelledby={infoId}>
            <h2 id={infoId} className="sr-only">
              Informações adicionais
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {informacoesAdicionais.map(info => {
                const Icon = info.icon
                const CardContent = (
                  <>
                    <div className="flex items-start gap-4">
                      <div
                        className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0"
                        aria-hidden="true"
                      >
                        <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
                          {info.titulo}
                          {info.link && (
                            <ExternalLink className="h-4 w-4 text-primary" aria-hidden="true" />
                          )}
                        </h4>
                        <p className="text-muted-foreground">{info.descricao}</p>
                      </div>
                    </div>
                  </>
                )

                return info.link ? (
                  <a
                    key={info.titulo}
                    href={info.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${info.titulo}: ${info.descricao} (abre em nova janela)`}
                    className="block bg-card rounded-xl p-6 border border-primary/10 hover:border-primary hover:shadow-lg transition-all cursor-pointer group"
                  >
                    {CardContent}
                  </a>
                ) : (
                  <div
                    key={info.titulo}
                    className="bg-card rounded-xl p-6 border border-primary/10"
                  >
                    {CardContent}
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </section>

      {/* Call to Action */}
      <section aria-labelledby={ctaId} className="py-16 px-4 bg-primary/5">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 id={ctaId} className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Prefere nos visitar pessoalmente?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Venha conhecer nosso espaço e desfrutar da vista mais linda de Belém
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Link href="/cardapio">Ver Cardápio</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary/10"
            >
              <Link href="/eventos">Eventos Especiais</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
