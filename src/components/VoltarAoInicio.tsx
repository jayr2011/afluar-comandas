'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

const ROUTES = ['/cardapio', '/comanda']

export function VoltarAoInicio() {
  const pathname = usePathname()

  const shouldShow = ROUTES.some(
    route => pathname === route || pathname.startsWith(`${route}/`)
  )

  if (!shouldShow) return null

  return (
    <div className="sticky top-20 z-30 -mb-px border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto max-w-6xl px-4 py-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Voltar ao início"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
          Voltar ao inicio
        </Link>
      </div>
    </div>
  )
}
