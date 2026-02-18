import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/footer'
import { Suspense } from 'react'
import './globals.css'

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
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Suspense fallback={<div>Loading...</div>}>
          <Footer />
        </Suspense>
      </body>
    </html>
  )
}
