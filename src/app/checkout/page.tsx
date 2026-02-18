'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cartStore'
import { registrarPedido } from '@/app/api/checkout/actions'
import { ShoppingCart } from 'lucide-react'
import { EmptyState } from '@/components/feedback'

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalPrice = items.reduce((sum, i) => sum + i.preco * i.quantidade, 0)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (items.length === 0) return

    const form = e.currentTarget
    const formData = {
      nome: (form.nome as HTMLInputElement).value.trim(),
      whatsapp: (form.whatsapp as HTMLInputElement).value.trim(),
      rua: (form.rua as HTMLInputElement).value.trim(),
      numero: (form.numero as HTMLInputElement).value.trim(),
      bairro: (form.bairro as HTMLInputElement).value.trim(),
      complemento: (form.complemento as HTMLInputElement).value.trim() || undefined,
    }

    if (!formData.nome || !formData.whatsapp || !formData.rua || !formData.numero || !formData.bairro) {
      setError('Preencha todos os campos obrigatórios.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const pedido = await registrarPedido(formData, items)
      clearCart()
      router.push(`/checkout/sucesso?pedido=${pedido.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível registrar o pedido.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-background to-primary/5">
        <div className="container mx-auto px-4 py-8">
          <Button asChild variant="ghost" className="mb-6 -ml-2">
            <Link href="/carrinho" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao carrinho
            </Link>
          </Button>
          <EmptyState
            icon={ShoppingCart}
            title="Seu carrinho está vazio"
            description="Adicione pratos do cardápio para finalizar seu pedido."
            fullScreen
            action={
              <Button asChild className="bg-primary hover:bg-primary/90" size="lg">
                <Link href="/cardapio">Ver cardápio</Link>
              </Button>
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-primary/5">
      <div className="container mx-auto max-w-xl px-4 py-8">
        <Button asChild variant="ghost" className="mb-6 -ml-2">
          <Link href="/carrinho" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao carrinho
          </Link>
        </Button>

        <h1 className="text-3xl font-bold mb-6">Finalizar pedido</h1>

        <div className="mb-6 p-4 bg-muted/50 rounded-lg">
          <p className="font-medium">
            {items.length} {items.length === 1 ? 'item' : 'itens'} · R$ {totalPrice.toFixed(2)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium mb-1">Nome *</label>
            <input
              id="nome"
              name="nome"
              type="text"
              required
              className="w-full px-3 py-2 border rounded-md bg-background"
              placeholder="Seu nome"
            />
          </div>
          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium mb-1">WhatsApp *</label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              required
              className="w-full px-3 py-2 border rounded-md bg-background"
              placeholder="(00) 00000-0000"
            />
          </div>
          <div>
            <label htmlFor="rua" className="block text-sm font-medium mb-1">Rua *</label>
            <input id="rua" name="rua" type="text" required className="w-full px-3 py-2 border rounded-md bg-background" placeholder="Nome da rua" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="numero" className="block text-sm font-medium mb-1">Número *</label>
              <input id="numero" name="numero" type="text" required className="w-full px-3 py-2 border rounded-md bg-background" placeholder="Nº" />
            </div>
            <div>
              <label htmlFor="bairro" className="block text-sm font-medium mb-1">Bairro *</label>
              <input id="bairro" name="bairro" type="text" required className="w-full px-3 py-2 border rounded-md bg-background" placeholder="Bairro" />
            </div>
          </div>
          <div>
            <label htmlFor="complemento" className="block text-sm font-medium mb-1">Complemento</label>
            <input id="complemento" name="complemento" type="text" className="w-full px-3 py-2 border rounded-md bg-background" placeholder="Apto, bloco, ref." />
          </div>

          {error && (
            <p className="text-destructive text-sm">{error}</p>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? 'Enviando...' : 'Confirmar pedido'}
          </Button>
        </form>
      </div>
    </div>
  )
}
