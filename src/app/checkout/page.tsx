'use client'

import Link from 'next/link'
import { useRef, useState, type SubmitEventHandler } from 'react'
import { ArrowLeft, MapPin, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCartStore } from '@/store/cartStore'
import { criarPreferenciaPagamento } from '@/app/api/checkout/actions'
import { getEnderecoPorCep } from '@/app/checkout/actions-cep'
import { checkoutFormClientSchema, type CheckoutFormErrors } from '@/lib/validations/checkout'
import { ShoppingCart } from 'lucide-react'
import { CheckoutBreadcrumb } from '@/components/checkout/CheckoutBreadcrumb'
import { CheckoutPaymentBrick } from '@/components/checkout/CheckoutPaymentBrick'
import { EmptyState } from '@/components/feedback'

type CheckoutStep = 'endereco' | 'pagamento'

export default function CheckoutPage() {
  const items = useCartStore(state => state.items)
  const formRef = useRef<HTMLFormElement>(null)
  const [step, setStep] = useState<CheckoutStep>('endereco')
  const [checkoutFormData, setCheckoutFormData] = useState<{
    nome: string
    whatsapp: string
    rua: string
    numero: string
    bairro: string
    complemento?: string
  } | null>(null)
  const [paymentData, setPaymentData] = useState<{
    preferenceId: string
    amount: number
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<CheckoutFormErrors>({})
  const [cepLoading, setCepLoading] = useState(false)
  const [cepError, setCepError] = useState<string | null>(null)

  const totalPrice = items.reduce((sum, i) => sum + i.preco * i.quantidade, 0)

  const handleBuscarCep = async () => {
    const form = formRef.current
    if (!form) return
    const cepInput = form.cep as HTMLInputElement
    const cep = cepInput?.value?.replace(/\D/g, '') ?? ''
    if (cep.length !== 8) {
      setCepError('CEP deve ter 8 dígitos')
      return
    }
    setCepError(null)
    setCepLoading(true)
    try {
      const endereco = await getEnderecoPorCep(cep)
      if (endereco) {
        const ruaInput = form.rua as HTMLInputElement
        const bairroInput = form.bairro as HTMLInputElement
        if (ruaInput) ruaInput.value = endereco.logradouro
        if (bairroInput) bairroInput.value = endereco.bairro
      } else {
        setCepError('CEP não encontrado')
      }
    } catch {
      setCepError('Não foi possível buscar o CEP. Tente novamente.')
    } finally {
      setCepLoading(false)
    }
  }

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async e => {
    e.preventDefault()
    if (items.length === 0) return

    const form = e.currentTarget
    const rawData = {
      nome: (form.nome as HTMLInputElement).value,
      whatsapp: (form.whatsapp as HTMLInputElement).value,
      rua: (form.rua as HTMLInputElement).value,
      numero: (form.numero as HTMLInputElement).value,
      bairro: (form.bairro as HTMLInputElement).value,
      complemento: (form.complemento as HTMLInputElement).value,
    }

    const parsed = checkoutFormClientSchema.safeParse(rawData)
    if (!parsed.success) {
      const errors: CheckoutFormErrors = {}
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof CheckoutFormErrors
        if (field && !errors[field]) {
          errors[field] = issue.message
        }
      }
      setFieldErrors(errors)
      setError(null)
      return
    }

    setFieldErrors({})
    setError(null)
    setLoading(true)

    const formData = {
      nome: parsed.data.nome.trim(),
      whatsapp: parsed.data.whatsapp.trim(),
      rua: parsed.data.rua.trim(),
      numero: parsed.data.numero.trim(),
      bairro: parsed.data.bairro.trim(),
      complemento: parsed.data.complemento?.trim() || undefined,
    }

    try {
      const { preferenceId, amount } = await criarPreferenciaPagamento(items)
      setCheckoutFormData(formData)
      setPaymentData({ preferenceId, amount })
      setStep('pagamento')
    } catch (err) {
      setFieldErrors({})
      setError(err instanceof Error ? err.message : 'Não foi possível iniciar o pagamento.')
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

  if (step === 'pagamento' && paymentData && checkoutFormData) {
    return (
      <div className="min-h-screen bg-linear-to-b from-background to-primary/5">
        <div className="container mx-auto max-w-xl px-4 py-8">
          <Button asChild variant="ghost" className="mb-4 -ml-2">
            <Link href="/carrinho" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao carrinho
            </Link>
          </Button>
          <CheckoutBreadcrumb currentStep="pagamento" className="mb-6" />
          <h1 className="text-3xl font-bold mb-6">Pagamento</h1>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Finalize seu pedido</CardTitle>
              <CardDescription>
                Escolha a forma de pagamento. Valor total: R$ {paymentData.amount.toFixed(2)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CheckoutPaymentBrick
                preferenceId={paymentData.preferenceId}
                amount={paymentData.amount}
                orderData={{ formData: checkoutFormData, cart: items }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-primary/5">
      <div className="container mx-auto max-w-xl px-4 py-8">
        <Button asChild variant="ghost" className="mb-4 -ml-2">
          <Link href="/carrinho" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao carrinho
          </Link>
        </Button>
        <CheckoutBreadcrumb currentStep="endereco" className="mb-6" />

        <h1 className="text-3xl font-bold mb-6">Endereço de entrega</h1>

        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Resumo do pedido
            </CardTitle>
            <CardDescription>
              {items.length} {items.length === 1 ? 'item' : 'itens'} · R$ {totalPrice.toFixed(2)}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dados para entrega</CardTitle>
            <CardDescription>
              Preencha seus dados e o endereço onde deseja receber o pedido
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  name="nome"
                  type="text"
                  required
                  placeholder="Seu nome"
                  aria-invalid={!!fieldErrors.nome}
                />
                {fieldErrors.nome && <p className="text-destructive text-sm">{fieldErrors.nome}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp *</Label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  required
                  placeholder="(00) 00000-0000"
                  aria-invalid={!!fieldErrors.whatsapp}
                />
                {fieldErrors.whatsapp && (
                  <p className="text-destructive text-sm">{fieldErrors.whatsapp}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <div className="flex gap-2">
                  <Input
                    id="cep"
                    name="cep"
                    type="text"
                    placeholder="00000-000"
                    maxLength={9}
                    aria-invalid={!!cepError}
                    className="flex-1"
                    onChange={e => {
                      const v = e.target.value.replace(/\D/g, '')
                      if (v.length <= 5) {
                        e.target.value = v
                      } else {
                        e.target.value = `${v.slice(0, 5)}-${v.slice(5, 8)}`
                      }
                      setCepError(null)
                    }}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleBuscarCep}
                    disabled={cepLoading}
                  >
                    {cepLoading ? (
                      'Buscando...'
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-1" />
                        Buscar
                      </>
                    )}
                  </Button>
                </div>
                {cepError && <p className="text-destructive text-sm">{cepError}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rua">Rua *</Label>
                <Input
                  id="rua"
                  name="rua"
                  type="text"
                  required
                  placeholder="Nome da rua"
                  aria-invalid={!!fieldErrors.rua}
                />
                {fieldErrors.rua && <p className="text-destructive text-sm">{fieldErrors.rua}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numero">Número *</Label>
                  <Input
                    id="numero"
                    name="numero"
                    type="text"
                    required
                    placeholder="Nº"
                    aria-invalid={!!fieldErrors.numero}
                  />
                  {fieldErrors.numero && (
                    <p className="text-destructive text-sm">{fieldErrors.numero}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro *</Label>
                  <Input
                    id="bairro"
                    name="bairro"
                    type="text"
                    required
                    placeholder="Bairro"
                    aria-invalid={!!fieldErrors.bairro}
                  />
                  {fieldErrors.bairro && (
                    <p className="text-destructive text-sm">{fieldErrors.bairro}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  name="complemento"
                  type="text"
                  placeholder="Apto, bloco, ref."
                  aria-invalid={!!fieldErrors.complemento}
                />
                {fieldErrors.complemento && (
                  <p className="text-destructive text-sm">{fieldErrors.complemento}</p>
                )}
              </div>

              {error && <p className="text-destructive text-sm">{error}</p>}

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Enviando...' : 'Ir para pagamento'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
