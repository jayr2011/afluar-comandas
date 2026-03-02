'use client'

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

        <form className="space-y-4" onSubmit={event => event.preventDefault()}>
          <div className="space-y-2">
            <Label htmlFor="nome-garcom">Nome do garçom</Label>
            <Input id="nome-garcom" name="nomeGarcom" type="text" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="numero-comanda">Numero da comanda</Label>
            <Input id="numero-comanda" name="numeroComanda" type="text" />
          </div>

          <Button type="submit" className="w-full">
            Vincular
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
