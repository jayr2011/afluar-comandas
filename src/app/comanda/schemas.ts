import { z } from 'zod'

export const criarComandaSchema = z.object({
  nomeCliente: z.string().trim().min(2, 'Informe o nome do cliente.'),
  nomeGarcom: z.string().trim().min(2, 'Informe o nome do garçom.'),
})

export type CriarComandaState = {
  ok: boolean
  message: string
  comandaId?: string
  numeroComanda?: number
}

export const INITIAL_CRIAR_COMANDA_STATE: CriarComandaState = {
  ok: false,
  message: '',
}

export const fecharComandaSchema = z.object({
  comandaId: z.string().uuid(),
  formaPagamento: z.string().optional(),
})

export const cancelarComandaSchema = z.object({
  comandaId: z.string().uuid(),
})
