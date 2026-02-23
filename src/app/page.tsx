import { HomeBanner } from '@/components/home-banner/HomeBanner'
import { QuickAccess } from '@/components/quick-access'
import { PostCard } from '@/components/blog/PostCard'
import { getCachedPosts } from '@/services/blogService'
import Link from 'next/link'
import { UtensilsCrossed, Calendar, Waves } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { getMultipleFeatureToggles } from '@/lib/feature-toggles'

export type HomePageToggles = {
  eventos_enabled: boolean
  beach_tennis_enabled: boolean
  blog_enabled: boolean
}

export default async function Home() {
  const { eventos_enabled, beach_tennis_enabled, blog_enabled } = await getMultipleFeatureToggles([
    'eventos_enabled',
    'beach_tennis_enabled',
    'blog_enabled',
  ])

  const quickAccessItems = [
    {
      href: '/cardapio',
      title: 'Cardápio',
      icon: UtensilsCrossed,
    },
    ...(eventos_enabled
      ? [
          {
            href: '/eventos',
            title: 'Eventos',
            icon: Calendar,
          },
        ]
      : []),
    ...(beach_tennis_enabled
      ? [
          {
            href: '/beach-tennis',
            title: 'Beach Tennis',
            icon: Waves,
          },
        ]
      : []),
  ]

  const latestPost = blog_enabled ? (await getCachedPosts({ page: 1, limit: 1 })).posts[0] : null

  return (
    <div className="w-full -mt-px">
      <HomeBanner />
      <h2 className="text-center text-xl font-semibold mt-6 mb-2">Use nosso acesso rápido</h2>
      <QuickAccess items={quickAccessItems} />

      <div className="container mx-auto max-w-6xl px-4 pt-4">
        <Separator className="bg-border/70" />
      </div>

      {blog_enabled ? (
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
      ) : null}
    </div>
  )
}
