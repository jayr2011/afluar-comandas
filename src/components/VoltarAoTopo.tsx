'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ROUTES_COM_SCROLL = ['/cardapio', '/comanda']
const SCROLL_THRESHOLD = 300

export function VoltarAoTopo() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  const shouldShow = ROUTES_COM_SCROLL.some(
    route => pathname === route || pathname.startsWith(`${route}/`)
  )

  useEffect(() => {
    if (!shouldShow) return

    const handleScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [shouldShow])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!shouldShow || !visible) return null

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
      className="fixed bottom-24 right-6 z-40 h-12 w-12 rounded-full shadow-lg transition-opacity hover:scale-105"
    >
      <ArrowUp className="h-5 w-5" aria-hidden />
    </Button>
  )
}
