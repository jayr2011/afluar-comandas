'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlusIcon, LogOut, Settings2, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase-browser'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

type ProdutoFormData = {
  nome: string
  descricao: string
  preco: string
  categoria: string
  imagem: string
  ingredientes: string
  destaque: boolean
}

const initialFormData: ProdutoFormData = {
  nome: '',
  descricao: '',
  preco: '',
  categoria: '',
  imagem: '',
  ingredientes: '',
  destaque: false,
}

export default function Painel() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [formData, setFormData] = useState<ProdutoFormData>(initialFormData)

  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data: { user } }: { data: { user: unknown } }) => {
      if (!user) router.push('/admin')
      setChecking(false)
    })
  }, [router])

  async function handleLogout() {
    setChecking(true)
    await supabaseBrowser.auth.signOut()
    router.push('/admin')
  }

  function updateFormField<K extends keyof ProdutoFormData>(field: K, value: ProdutoFormData[K]) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  function parsePreco(rawValue: string) {
    const normalized = rawValue.trim().replace(/\./g, '').replace(',', '.')
    return Number(normalized)
  }

  async function handleImageUpload(file?: File | null) {
    if (!file) return

    setIsUploadingImage(true)

    try {
      const payload = new FormData()
      payload.append('file', file)
      payload.append('categoria', formData.categoria)

      const response = await fetch('/api/admin/produtos/upload-image', {
        method: 'POST',
        body: payload,
      })

      const result = (await response.json().catch(() => null)) as {
        url?: string
        error?: string
      } | null

      if (!response.ok || !result?.url) {
        if (response.status === 401) {
          toast.error('Sessão expirada. Faça login novamente.')
          router.push('/admin')
          return
        }

        throw new Error(result?.error ?? 'Falha ao enviar imagem.')
      }

      updateFormField('imagem', result.url)
      toast.success('Imagem enviada para o Supabase com sucesso.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Falha ao enviar imagem.')
    } finally {
      setIsUploadingImage(false)
    }
  }

  async function handleCreateProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const preco = parsePreco(formData.preco)
    const precoComDuasCasas = Math.round(preco * 100) / 100

    if (!formData.nome.trim() || !formData.categoria.trim()) {
      toast.error('Nome e categoria são obrigatórios.')
      return
    }

    if (!Number.isFinite(precoComDuasCasas) || precoComDuasCasas <= 0) {
      toast.error('Informe um preço válido maior que zero.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome.trim(),
          descricao: formData.descricao.trim(),
          preco: precoComDuasCasas,
          categoria: formData.categoria.trim(),
          imagem: formData.imagem.trim(),
          ingredientes: formData.ingredientes.trim(),
          destaque: formData.destaque,
        }),
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string
          details?: string[]
        } | null

        if (response.status === 401) {
          toast.error('Sessão expirada. Faça login novamente.')
          router.push('/admin')
          return
        }

        const details = payload?.details?.join(' ') ?? ''
        const message = payload?.error ?? 'Não foi possível criar o produto.'
        throw new Error(details ? `${message} ${details}` : message)
      }

      toast.success('Produto criado com sucesso!')
      setFormData(initialFormData)
      setIsDialogOpen(false)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao criar produto.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (checking) return null

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-4">
        <h1>Painel do admin</h1>
        <Button variant="ghost" aria-label="Sair" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>
      <div className="flex flex-col gap-4 p-4">
        <h2>Produtos</h2>
        <Dialog
          open={isDialogOpen}
          onOpenChange={open => {
            if (!isSubmitting) setIsDialogOpen(open)
          }}
        >
          <DialogTrigger asChild>
            <Button aria-label="Adicionar produto">
              <PlusIcon className="w-4 h-4 mr-2" />
              Adicionar produto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo produto</DialogTitle>
              <DialogDescription>
                Preencha os dados para adicionar um produto ao cardápio.
              </DialogDescription>
            </DialogHeader>

            <form className="space-y-4" onSubmit={handleCreateProduct}>
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={event => updateFormField('nome', event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Input
                  id="categoria"
                  value={formData.categoria}
                  onChange={event => updateFormField('categoria', event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preco">Preço</Label>
                <Input
                  id="preco"
                  value={formData.preco}
                  onChange={event => updateFormField('preco', event.target.value)}
                  inputMode="decimal"
                  placeholder="Ex: 39,90"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imagem">URL da imagem</Label>
                <Input
                  id="imagem"
                  value={formData.imagem}
                  onChange={event => updateFormField('imagem', event.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    asChild
                    disabled={isUploadingImage}
                  >
                    <label className="cursor-pointer">
                      {isUploadingImage ? 'Enviando imagem...' : 'Enviar imagem para Supabase'}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={event => {
                          const file = event.target.files?.[0] ?? null
                          void handleImageUpload(file)
                          event.currentTarget.value = ''
                        }}
                      />
                    </label>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ingredientes">Ingredientes</Label>
                <Textarea
                  id="ingredientes"
                  value={formData.ingredientes}
                  onChange={event => updateFormField('ingredientes', event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={event => updateFormField('descricao', event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destaque">Destaque</Label>
                <Select
                  value={formData.destaque ? 'true' : 'false'}
                  onValueChange={value => updateFormField('destaque', value === 'true')}
                >
                  <SelectTrigger id="destaque" className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Não</SelectItem>
                    <SelectItem value="true">Sim</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar produto'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <Button asChild variant="outline" aria-label="Gerenciar toggles">
          <Link href="/admin/toggles">
            <Settings2 className="w-4 h-4 mr-2" />
            Gerenciar toggles
          </Link>
        </Button>
      </div>
    </div>
  )
}
