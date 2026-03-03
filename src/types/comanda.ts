export interface Comanda {
  id: string
  numero_comanda: number
  cliente_nome: string
  garcom_id: string
  status: 'aberta' | 'fechada' | 'cancelada'
  valor_total: number
  observacoes: string | null
  created_at: string
  updated_at: string
  fechada_em: string | null
  cancelada_em: string | null
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
  produto?: {
    id: string
    nome: string
  }
}

export interface ComandaComItens extends Comanda {
  itens: ComandaItem[]
}
