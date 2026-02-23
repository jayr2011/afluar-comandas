import { HomeBanner } from '@/components/home-banner/HomeBanner'
import { QuickAccess } from '@/components/quick-access'
import { PostCard } from '@/components/blog/PostCard'
import { getCachedPosts } from '@/services/blogService'
import Link from 'next/link'
import { UtensilsCrossed, Calendar, Waves } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default async function Home() {
  const quickAccessItems = [
    {
      href: '/cardapio',
      title: 'Cardápio',
      icon: UtensilsCrossed,
    },
    {
      href: '/eventos',
      title: 'Eventos',
      icon: Calendar,
    },
    {
      href: '/beach-tennis',
      title: 'Beach Tennis',
      icon: Waves,
    },
  ]

  const { posts } = await getCachedPosts({ page: 1, limit: 1 })
  const latestPost = posts[0]

  return (
    <div className="w-full -mt-px">
      <HomeBanner />
      <h2 className="text-center text-xl font-semibold mt-6 mb-2">Use nosso acesso rápido</h2>
      <QuickAccess items={quickAccessItems} />

      <div className="container mx-auto max-w-6xl px-4 pt-4">
        <Separator className="bg-border/70" />
      </div>

      <section className="container mx-auto max-w-6xl px-4 pb-8 pt-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Último post do blog</h2>
          <Link href="/blog" className="text-sm font-medium text-primary hover:underline">
            Ver todos
          </Link>
        </div>

        {latestPost ? (
          <div className="max-w-xl">
            <PostCard post={latestPost} />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhum post publicado até o momento.</p>
        )}
      </section>
    </div>
  )
}
