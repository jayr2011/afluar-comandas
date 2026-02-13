// src/app/layout.tsx
import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar/navbar'
import './globals.css'

export const metadata: Metadata = {
  title: 'Afluar - Sistema de Pedidos Online',
  description: 'Faça seu pedido com entrega',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
