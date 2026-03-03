'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { fecharComanda, cancelarComanda } from '@/app/comanda/action'
import { type CriarComandaState } from '@/app/comanda/schemas'
import type { ComandaComItens } from '@/types/comanda'
import { formatPrice } from '@/lib/utils'

interface ComandaDetalheProps {
  comanda: ComandaComItens
}

const INITIAL_FECHAR_STATE: CriarComandaState = { ok: false, message: '' }

export function ComandaDetalhe({ comanda }: ComandaDetalheProps) {
  const [fecharState, fecharAction, isFechando] = useActionState(
    async (_prev: CriarComandaState, formData: FormData) => {
      try {
        await fecharComanda(formData)
        return { ok: true, message: 'Comanda fechada.' }
      } catch (e) {
        return {
          ok: false,
          message: e instanceof Error ? e.message : 'Erro ao fechar.',
        }
      }
    },
    INITIAL_FECHAR_STATE
  )

  const [cancelarState, cancelarAction, isCancelando] = useActionState(
    async (_prev: CriarComandaState, formData: FormData) => {
      try {
        await cancelarComanda(formData)
        return { ok: true, message: 'Comanda cancelada.' }
      } catch (e) {
        return {
          ok: false,
          message: e instanceof Error ? e.message : 'Erro ao cancelar.',
        }
      }
    },
    INITIAL_FECHAR_STATE
  )

  const isAberta = comanda.status === 'aberta'
  const temItens = comanda.itens && comanda.itens.length > 0

  return (
    <div className="space-y-6">
      <Card className="border-primary/10">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="text-xl">
                Comanda #{comanda.numero_comanda}
              </CardTitle>
              <CardDescription>
                Cliente: {comanda.cliente_nome}
              </CardDescription>
            </div>
            <Badge
              variant={
                comanda.status === 'aberta'
                  ? 'default'
                  : comanda.status === 'fechada'
                    ? 'secondary'
                    : 'destructive'
              }
            >
              {comanda.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {temItens ? (
            <>
              <Separator />
              <ul className="space-y-2">
                {comanda.itens.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center py-2 border-b border-border/50 last:border-0"
                  >
                    <div>
                      <span className="font-medium">
                        {item.produto?.nome ?? 'Produto'}
                      </span>
                      <span className="text-muted-foreground text-sm ml-2">
                        x{item.quantidade}
                      </span>
                    </div>
                    <span className="font-medium">
                      {formatPrice(Number(item.subtotal))}
                    </span>
                  </li>
                ))}
              </ul>
              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">
                  {formatPrice(Number(comanda.valor_total))}
                </span>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-sm">
              Nenhum item adicionado ainda. Adicione itens pelo cardápio.
            </p>
          )}
        </CardContent>

        {isAberta && (
          <CardFooter className="flex flex-col gap-2 border-t pt-4">
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/cardapio">Adicionar itens</Link>
            </Button>
            {temItens && (
              <form action={fecharAction} className="w-full">
                <input
                  type="hidden"
                  name="comandaId"
                  value={comanda.id}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={isFechando}
                  className="w-full"
                >
                  {isFechando ? 'Fechando...' : 'Fechar comanda'}
                </Button>
              </form>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isCancelando}
                  className="w-full"
                >
                  {isCancelando ? 'Cancelando...' : 'Cancelar comanda'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancelar comanda?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação é irreversível. Todos os itens da comanda serão
                    descartados.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Voltar</AlertDialogCancel>
                  <form action={cancelarAction}>
                    <input
                      type="hidden"
                      name="comandaId"
                      value={comanda.id}
                    />
                    <AlertDialogAction asChild>
                      <Button type="submit" variant="destructive">
                        Sim, cancelar
                      </Button>
                    </AlertDialogAction>
                  </form>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        )}
      </Card>

      {(fecharState.message || cancelarState.message) && (
        <p
          className={
            fecharState.ok || cancelarState.ok
              ? 'text-sm text-emerald-600'
              : 'text-sm text-destructive'
          }
        >
          {fecharState.message || cancelarState.message}
        </p>
      )}
    </div>
  )
}
