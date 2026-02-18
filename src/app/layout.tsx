import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/footer'
import { Suspense } from 'react'
import './globals.css'

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
  title: 'Afluar - Sistema de Pedidos Online',
  description: 'Faça seu pedido com entrega',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
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
        <Suspense fallback={<NavbarFallback />}>
          <Navbar />
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
