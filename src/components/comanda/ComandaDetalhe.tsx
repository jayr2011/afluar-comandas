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
import {
  fecharComanda,
  confirmarPedidoComanda,
  cancelarComanda,
  removerItemComanda,
  alterarQuantidadeItemComanda,
} from '@/app/comanda/action'
import { type CriarComandaState } from '@/app/comanda/schemas'
import type { ComandaComItens } from '@/types/comanda'
import { formatPrice } from '@/lib/utils'
import { Trash2, Minus, Plus } from 'lucide-react'

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

  const [alterarQtdState, alterarQtdAction, isAlterandoQtd] = useActionState(
    async (_prev: CriarComandaState, formData: FormData) => {
      try {
        await alterarQuantidadeItemComanda(formData)
        return { ok: true, message: '' }
      } catch (e) {
        return {
          ok: false,
          message: e instanceof Error ? e.message : 'Erro ao alterar.',
        }
      }
    },
    INITIAL_FECHAR_STATE
  )

  const [removerState, removerAction, isRemovendo] = useActionState(
    async (_prev: CriarComandaState, formData: FormData) => {
      try {
        await removerItemComanda(formData)
        return { ok: true, message: 'Item removido.' }
      } catch (e) {
        return {
          ok: false,
          message: e instanceof Error ? e.message : 'Erro ao remover.',
        }
      }
    },
    INITIAL_FECHAR_STATE
  )

  const [confirmarState, confirmarAction, isConfirmando] = useActionState(
    async (_prev: CriarComandaState, formData: FormData) => {
      try {
        await confirmarPedidoComanda(formData)
        return { ok: true, message: 'Pedido confirmado e enviado para a cozinha.' }
      } catch (e) {
        return {
          ok: false,
          message: e instanceof Error ? e.message : 'Erro ao confirmar.',
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
  const isConfirmada = comanda.status === 'confirmada'
  const isEditavel = isAberta || isConfirmada
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
                  : comanda.status === 'confirmada'
                    ? 'secondary'
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
                    className="flex justify-between items-center gap-2 py-2 border-b border-border/50 last:border-0"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="font-medium">
                        {item.produto?.nome ?? 'Produto'}
                      </span>
                      {isAberta ? (
                        <div className="flex items-center gap-1 mt-1">
                          <form action={alterarQtdAction} className="contents">
                            <input type="hidden" name="itemId" value={item.id} />
                            <input type="hidden" name="delta" value="-1" />
                            <Button
                              type="submit"
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 shrink-0"
                              disabled={isAlterandoQtd}
                              aria-label="Diminuir quantidade"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                          </form>
                          <span className="min-w-6 text-center text-sm font-medium tabular-nums">
                            {item.quantidade}
                          </span>
                          <form action={alterarQtdAction} className="contents">
                            <input type="hidden" name="itemId" value={item.id} />
                            <input type="hidden" name="delta" value="1" />
                            <Button
                              type="submit"
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 shrink-0"
                              disabled={isAlterandoQtd}
                              aria-label="Aumentar quantidade"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </form>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm ml-2 block mt-1">
                          x{item.quantidade}
                        </span>
                      )}
                    </div>
                    <span className="font-medium shrink-0">
                      {formatPrice(Number(item.subtotal))}
                    </span>
                    {isEditavel && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            aria-label={`Remover ${item.produto?.nome ?? 'item'} da comanda`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover item?</AlertDialogTitle>
                            <AlertDialogDescription>
                              {item.produto?.nome ?? 'Este item'} (x
                              {item.quantidade}) será removido da comanda.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
                            <form action={removerAction} className="w-full">
                              <input
                                type="hidden"
                                name="itemId"
                                value={item.id}
                              />
                              <AlertDialogAction asChild>
                                <Button
                                  type="submit"
                                  variant="destructive"
                                  disabled={isRemovendo}
                                  className="w-full"
                                >
                                  {isRemovendo ? 'Removendo...' : 'Remover'}
                                </Button>
                              </AlertDialogAction>
                            </form>
                            <AlertDialogCancel className="w-full">Cancelar</AlertDialogCancel>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
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

        {(isAberta || isConfirmada) && (
          <CardFooter className="flex flex-col gap-2 border-t pt-4">
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/cardapio">Adicionar itens</Link>
            </Button>
            {isAberta && temItens && (
              <form action={confirmarAction} className="w-full">
                <input
                  type="hidden"
                  name="comandaId"
                  value={comanda.id}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={isConfirmando}
                  className="w-full"
                >
                  {isConfirmando ? 'Confirmando...' : 'Confirmar pedido'}
                </Button>
              </form>
            )}
            {isConfirmada && (
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
                <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
                  <form action={cancelarAction} className="w-full">
                    <input
                      type="hidden"
                      name="comandaId"
                      value={comanda.id}
                    />
                    <AlertDialogAction asChild>
                      <Button
                        type="submit"
                        variant="outline"
                        className="w-full"
                      >
                        Sim, cancelar
                      </Button>
                    </AlertDialogAction>
                  </form>
                  <AlertDialogCancel className="w-full">Voltar</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        )}
      </Card>

      {(fecharState.message ||
        confirmarState.message ||
        cancelarState.message ||
        removerState.message ||
        alterarQtdState.message) && (
        <p
          className={
            fecharState.ok ||
            confirmarState.ok ||
            cancelarState.ok ||
            removerState.ok ||
            alterarQtdState.ok
              ? 'text-sm text-emerald-600'
              : 'text-sm text-destructive'
          }
        >
          {fecharState.message ||
            confirmarState.message ||
            cancelarState.message ||
            removerState.message ||
            alterarQtdState.message}
        </p>
      )}
    </div>
  )
}
