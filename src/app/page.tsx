import { HomeBanner } from '@/components/home-banner/HomeBanner'
import { QuickAccess } from '@/components/quick-access'
import { UtensilsCrossed, Calendar, Waves } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { getMultipleFeatureToggles } from '@/lib/feature-toggles'

export type HomePageToggles = {
  eventos_enabled: boolean
  beach_tennis_enabled: boolean
}

export default async function Home() {
  const { eventos_enabled, beach_tennis_enabled } = await getMultipleFeatureToggles([
    'eventos_enabled',
    'beach_tennis_enabled',
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

  return (
    <div className="w-full -mt-px">
      <h1 className="sr-only">Afluar - Restaurante de Culinária Amazônica</h1>
      <HomeBanner />
      <h2 className="text-center text-xl font-semibold mt-6 mb-2">Use nosso acesso rápido</h2>
      <QuickAccess items={quickAccessItems} />

      <div className="container mx-auto max-w-6xl px-4 pt-4">
        <Separator className="bg-border/70" />
      </div>
    </div>
  )
}
