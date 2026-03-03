export interface Comanda {
  id: string
  numero_comanda: number
  cliente_nome: string
  garcom_id: string
  garcom_nome?: string | null
  status: 'aberta' | 'confirmada' | 'fechada' | 'cancelada'
  valor_total: number
  observacoes: string | null
  created_at: string
  updated_at: string
  fechada_em: string | null
  cancelada_em: string | null
  confirmada_em?: string | null
}

export interface ComandaItem {
  id: string
  comanda_id: string
  produto_id: string
  quantidade: number
  preco_unitario: number
  subtotal: number
  observacoes: string | null
  status: string
  created_at?: string
  pedido_id?: string | null
  produto?: {
    id: string
    nome: string
  }
}

export interface PedidoComanda {
  id: string
  comanda_id: string
  numero: number
  confirmado_em: string
  itens: ComandaItem[]
  valor_total: number
}

export interface ComandaComItens extends Comanda {
  itens: ComandaItem[]
  pedidos?: PedidoComanda[]
}
