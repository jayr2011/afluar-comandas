'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CheckoutSucessoPage() {
  const searchParams = useSearchParams()
  const pedidoId = searchParams.get('pedido')

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-background to-primary/5 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Pedido realizado!</h1>
        <p className="text-muted-foreground mb-6">
          {pedidoId
            ? `Seu pedido #${pedidoId.slice(0, 8)} foi registrado. Em breve entraremos em contato pelo WhatsApp.`
            : 'Obrigado pelo seu pedido! Em breve entraremos em contato.'}
        </p>
        <Button asChild className="bg-primary hover:bg-primary/90" size="lg">
          <Link href="/cardapio">Ver cardápio</Link>
        </Button>
      </div>
    </div>
  )
}
