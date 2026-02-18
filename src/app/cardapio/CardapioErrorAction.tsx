'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function CardapioErrorAction() {
  const router = useRouter()

  return (
    <Button onClick={() => router.refresh()} className="bg-primary hover:bg-primary/90">
      Tentar Novamente
    </Button>
  )
}
