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

export const confirmarPedidoComandaSchema = z.object({
  comandaId: z.string().uuid(),
})

export const cancelarComandaSchema = z.object({
  comandaId: z.string().uuid(),
})

export const removerItemComandaSchema = z.object({
  itemId: z.string().uuid(),
})

export const alterarQuantidadeItemSchema = z.object({
  itemId: z.string().uuid(),
  delta: z
    .string()
    .transform(Number)
    .refine((n) => n === 1 || n === -1, 'Delta deve ser 1 ou -1'),
})
