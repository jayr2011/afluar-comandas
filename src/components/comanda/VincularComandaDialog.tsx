'use client'

import { useEffect, useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { criarComandaAction } from '@/app/comanda/action'
import { INITIAL_CRIAR_COMANDA_STATE, type CriarComandaState } from '@/app/comanda/schemas'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type VincularComandaDialogProps = {
  triggerLabel?: string
}

export function VincularComandaDialog({
  triggerLabel = 'Vincular comanda',
}: VincularComandaDialogProps) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState<CriarComandaState, FormData>(
    criarComandaAction,
    INITIAL_CRIAR_COMANDA_STATE
  )

  useEffect(() => {
    if (state.ok && state.comandaId) {
      router.push(`/comanda?c=${state.comandaId}`)
    }
  }, [state.ok, state.comandaId, router])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full sm:w-auto">
          {triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vincular comanda</DialogTitle>
          <DialogDescription>
            Informe os dados para vincular a comanda ao atendimento.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" action={formAction}>
          <div className="space-y-2">
            <Label htmlFor="nome-cliente">Nome do cliente</Label>
            <Input id="nome-cliente" name="nomeCliente" type="text" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nome-garcom">Nome do garçom</Label>
            <Input id="nome-garcom" name="nomeGarcom" type="text" required />
          </div>

          {state.message ? (
            <p className={state.ok ? 'text-sm text-emerald-600' : 'text-sm text-destructive'}>
              {state.message}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Vinculando...' : 'Vincular'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
