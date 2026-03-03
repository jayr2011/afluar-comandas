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
  comandaId: z.uuid(),
  formaPagamento: z.string().optional(),
})

export const confirmarPedidoComandaSchema = z.object({
  comandaId: z.uuid(),
})

export const cancelarComandaSchema = z.object({
  comandaId: z.uuid(),
})

export const removerItemComandaSchema = z.object({
  itemId: z.uuid(),
})

export const alterarQuantidadeItemSchema = z.object({
  itemId: z.uuid(),
  delta: z
    .string()
    .transform(Number)
    .refine(n => n === 1 || n === -1, 'Delta deve ser 1 ou -1'),
})
