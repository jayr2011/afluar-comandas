import Link from 'next/link'
import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { getCachedProdutos } from '@/services/productsService'
import logger from '@/lib/logger'
import { SaudacaoCliente } from '@/components/SaudacaoCliente'
import { getComandaCookie } from '@/lib/comanda-cookie'
import { getComandaData } from '@/app/comanda/action'
import { CardapioGrid } from './CardapioGrid'
import { CardapioErrorAction } from './CardapioErrorAction'
import { EmptyState, ErrorState } from '@/components/feedback'

export const metadata: Metadata = {
  title: 'Cardápio - Afluar | Culinária Amazônica em Belém',
  description: 'Conheça nosso cardápio de peixes frescos e frutos do mar da Amazônia em Belém.',
  keywords: [
    'cardápio Belém',
    'menu Amazônia',
    'peixe fresco Belém',
    'frutos do mar Pará',
    'cardápio online',
  ],
  alternates: {
    canonical: 'https://afluar.com.br/cardapio',
  },
  openGraph: {
    title: 'Cardápio - Afluar | Culinária Amazônica',
    description: 'Cardápio com peixes frescos e frutos do mar da Amazônia.',
    url: 'https://afluar.com.br/cardapio',
    images: [
      {
        url: new URL('/logo/afluar.jpg', 'https://afluar.com.br').href,
        width: 1200,
        height: 630,
        alt: 'Cardápio Afluar - Culinária Amazônica',
      },
    ],
  },
}

export default async function Cardapio() {
  let produtos
  let error: string | null = null
  const comandaId = await getComandaCookie()
  const comanda = comandaId ? await getComandaData(comandaId) : null
  const clienteNome = comanda?.cliente_nome
  const comandaAberta =
    !!comanda && (comanda.status === 'aberta' || comanda.status === 'confirmada')

  try {
    produtos = await getCachedProdutos()
  } catch (err) {
    logger.error('Erro ao carregar cardápio:', err)
    error = 'Não foi possível carregar o cardápio. Tente novamente.'
  }

  if (error) {
    return <ErrorState title="Ops!" message={error} fullScreen action={<CardapioErrorAction />} />
  }

  if (!produtos || produtos.length === 0) {
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
      <section className="relative py-4 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-top-left" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12">
            <SaudacaoCliente clienteNome={clienteNome} className="text-muted-foreground mb-4" />
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

      <section className="py-4 px-4">
        <div className="container mx-auto max-w-6xl">
          <CardapioGrid produtos={produtos} comandaAberta={comandaAberta} />
        </div>
      </section>

      <section className="py-8 px-4 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Não encontrou o que procura?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Entre em contato conosco para conhecer todo o nosso menu especial
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
