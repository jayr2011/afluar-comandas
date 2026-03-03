import type { ComandaItem, PedidoComanda } from '@/types/comanda'

/** Status possíveis de uma comanda */
export type ComandaStatus = 'aberta' | 'confirmada' | 'fechada' | 'cancelada'

/** Variantes do Badge para exibição do status */
export type BadgeVariant = 'default' | 'secondary' | 'destructive'

/**
 * Verifica se a comanda está com status "aberta"
 */
export function isComandaAberta(status: string): boolean {
  return status === 'aberta'
}

/**
 * Verifica se a comanda está com status "confirmada"
 */
export function isComandaConfirmada(status: string): boolean {
  return status === 'confirmada'
}

/**
 * Verifica se a comanda tem itens no carrinho
 */
export function temItensCarrinho(
  itens: ComandaItem[] | null | undefined
): itens is ComandaItem[] {
  return Boolean(itens && itens.length > 0)
}

/**
 * Calcula o total do carrinho somando os subtotais dos itens
 */
export function calcularTotalCarrinho(itens: ComandaItem[]): number {
  return itens.reduce((acc, i) => acc + Number(i.subtotal ?? 0), 0)
}

/**
 * Calcula o total somando os valores de todos os pedidos
 */
export function calcularTotalPedidos(pedidos: PedidoComanda[]): number {
  return pedidos.reduce((acc, p) => acc + p.valor_total, 0)
}

/**
 * Retorna a variante do Badge conforme o status da comanda
 */
export function getBadgeVariant(status: ComandaStatus): BadgeVariant {
  if (status === 'aberta') return 'default'
  if (status === 'fechada') return 'secondary'
  return 'destructive'
}

/**
 * Retorna o label no plural/singular para quantidade de itens
 */
export function formatarLabelItens(count: number): string {
  return count === 1 ? 'item' : 'itens'
}

/**
 * Garante que a quantidade fique dentro do intervalo [min, max]
 */
export function clampQuantidade(
  q: number,
  min: number,
  max: number
): number {
  return Math.max(min, Math.min(max, q))
}

/**
 * Verifica se a mensagem indica sucesso (item adicionado)
 */
export function isMensagemSucesso(message: string | null): boolean {
  if (!message) return false
  return message.includes('adicionado') || message.includes('Item')
}
