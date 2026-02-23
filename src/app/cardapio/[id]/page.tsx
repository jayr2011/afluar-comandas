import { Metadata } from 'next'
import Link from 'next/link'
import { getCachedProduto } from '@/services/productsService'
import { ErrorState } from '@/components/feedback'
import { Button } from '@/components/ui/button'
import { isFeatureEnabled } from '@/lib/feature-toggles'
import { ProdutoDetalheClient } from './ProdutoDetalheClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const produto = await getCachedProduto(id)

  if (!produto) {
    return {
      title: 'Produto não encontrado | Afluar',
    }
  }

  const imageUrl = produto.imagem?.startsWith('http')
    ? produto.imagem
    : new URL(produto.imagem || '/logo/afluar.jpg', 'https://afluar.com.br').href

  return {
    title: `${produto.nome} | Afluar`,
    description:
      produto.descricao ||
      `Conheça o ${produto.nome} no cardápio do Afluar. Prato típico da culinária amazônica em Belém.`,
    keywords: [produto.nome, 'cardápio Afluar', 'culinária amazônica', 'Belém', 'delivery'],
    alternates: {
      canonical: `https://afluar.com.br/cardapio/${id}`,
    },
    openGraph: {
      title: `${produto.nome} | Afluar - Culinária Amazônica`,
      description:
        produto.descricao ||
        `Conheça o ${produto.nome}, prato típico da culinária amazônica em Belém. Peça online!`,
      url: `https://afluar.com.br/cardapio/${id}`,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: produto.nome,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${produto.nome} | Afluar`,
      description: produto.descricao || `Conheça o ${produto.nome} no cardápio do Afluar.`,
      images: [imageUrl],
    },
  }
}

export default async function ProdutoDetalhePage({ params }: PageProps) {
  const { id } = await params
  const produto = await getCachedProduto(id)
  const checkoutEnabled = await isFeatureEnabled('checkout_enabled')

  if (!produto) {
    return (
      <ErrorState
        title="Produto não encontrado"
        message="Este prato não existe ou foi removido do cardápio."
        fullScreen
        action={
          <div className="flex gap-4">
            <Button asChild variant="outline">
              <Link href="/cardapio">Voltar ao Cardápio</Link>
            </Button>
          </div>
        }
      />
    )
  }

  return <ProdutoDetalheClient produto={produto} checkoutEnabled={checkoutEnabled} />
}
