'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AdminBackButton() {
  const pathname = usePathname()

  if (pathname === '/admin' || pathname === '/admin/painel') {
    return null
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-4">
      <Button asChild variant="ghost" className="-ml-2">
        <Link href="/admin/painel" className="inline-flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar ao painel
        </Link>
      </Button>
    </div>
  )
}
