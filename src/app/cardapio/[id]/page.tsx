import { Metadata } from 'next'
import Link from 'next/link'
import { getCachedProduto } from '@/services/productsService'
import { ErrorState } from '@/components/feedback'
import { Button } from '@/components/ui/button'
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

  return {
    title: `${produto.nome} | Afluar`,
    description: produto.descricao || `Confira o ${produto.nome} no cardápio do Afluar Entregas.`,
    openGraph: {
      title: `${produto.nome} | Afluar`,
      description: produto.descricao || `Confira o ${produto.nome} no cardápio do Afluar Entregas.`,
      images: [
        {
          url: produto.imagem,
          width: 800,
          height: 600,
          alt: produto.nome,
        },
      ],
    },
  }
}

export default async function ProdutoDetalhePage({ params }: PageProps) {
  const { id } = await params
  const produto = await getCachedProduto(id)

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

  return <ProdutoDetalheClient produto={produto} />
}
