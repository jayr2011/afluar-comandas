import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { Navbar } from '@/components/bavbar'
import { Footer } from '@/components/footer/Footer'
import { CartHydration } from '@/components/cart/CartHydration'
import { isFeatureEnabled } from '@/lib/feature-toggles'
import { Suspense } from 'react'
import './globals.css'
import { Montserrat, Roboto } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
})

function NavbarFallback() {
  return (
    <header
      role="banner"
      className="sticky top-0 z-50 w-full bg-primary border-b border-primary/20 shadow-lg"
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="h-12 w-12 bg-primary-foreground/20 rounded-full animate-pulse" />
        <div className="hidden md:flex gap-8">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-4 w-16 bg-primary-foreground/20 rounded animate-pulse" />
          ))}
        </div>
        <div className="h-11 w-11 bg-primary-foreground/20 rounded animate-pulse" />
      </div>
    </header>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL('https://afluar.com.br'),
  title: 'Afluar - Culinária Amazônica',
  description:
    'Sabores da Amazônia em Belém: restaurante em Belém no centro histórico, vista para a Baía do Guajará. Cardápio online, delivery e pagamento pelo Mercado Pago. Peixe frescos.',
  keywords: [
    'restaurante Belém',
    'culinária amazônica',
    'peixe fresco Belém',
    'delivery Belém',
    'Afluar',
    'restaurante centro histórico Belém',
  ],
  authors: [{ name: 'Afluar' }],
  creator: 'Afluar',
  publisher: 'Afluar',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://afluar.com.br',
    languages: {
      'pt-BR': 'https://afluar.com.br',
    },
  },
  openGraph: {
    title: 'Afluar - Culinária Amazônica',
    description:
      'Restaurante à beira da Baía do Guajará, centro histórico. Cardápio online e delivery.',
    url: 'https://afluar.com.br',
    siteName: 'Afluar',
    images: [
      {
        url: new URL('/logo/afluar.jpg', 'https://afluar.com.br').href,
        width: 1200,
        height: 630,
        alt: 'Afluar - Restaurante de Culinária Amazônica em Belém',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Afluar - Culinária Amazônica',
    description: 'Restaurante mais requintado de Belém. Peça online!',
    images: [new URL('/logo/afluar.jpg', 'https://afluar.com.br').href],
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const checkoutEnabled = await isFeatureEnabled('checkout_enabled')

  return (
    <html
      className={`${montserrat.variable} ${roboto.variable}`}
      lang="pt-BR"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://picsum.photos" />
        <link rel="dns-prefetch" href="https://picsum.photos" />
        {process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <>
            <link rel="preconnect" href={new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin} />
            <link rel="dns-prefetch" href={new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin} />
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Restaurant',
              name: 'Afluar',
              description:
                'Restaurante de culinária amazônica em Belém do Pará. Peixes frescos, frutos do mar e pratos regionais com vista para a Baía do Guajará.',
              url: 'https://afluar.com.br',
              telephone: '+5591985909595',
              priceRange: '$$',
              servesCuisine: [
                'Culinária Amazônica',
                'Frutos do Mar',
                'Cozinha Paraense',
                'Açaí Fresco',
              ],
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'R. São Boaventura, 104 - Cidade Velha',
                addressLocality: 'Belém',
                addressRegion: 'PA',
                addressCountry: 'BR',
                postalCode: '66020-550',
              },
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                  opens: '12:00',
                  closes: '23:00',
                },
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Saturday', 'Sunday'],
                  opens: '12:00',
                  closes: '00:00',
                },
              ],
              image: 'https://afluar.com.br/logo/afluar.jpg',
              logo: 'https://afluar.com.br/logo/afluar.jpg',
              sameAs: [
                'https://www.instagram.com/afluar_restaurante/',
                'https://wa.me/5591985909595',
              ],
              potentialAction: {
                '@type': 'OrderAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://afluar.com.br/cardapio',
                },
                name: 'Ver Cardápio',
              },
            }),
          }}
        />
      </head>
      <body>
        <Toaster
          richColors
          position="bottom-right"
          closeButton
          toastOptions={{
            style: {
              background: 'var(--background)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
            },
          }}
        />
        <CartHydration />
        <Suspense fallback={<NavbarFallback />}>
          <Navbar checkoutEnabled={checkoutEnabled} />
        </Suspense>
        <main id="main-content" className="min-h-screen">
          {children}
        </main>
        <Suspense fallback={<div>Loading...</div>}>
          <Footer />
        </Suspense>
      </body>
    </html>
  )
}
