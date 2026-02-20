export interface Produto {
  id: string
  nome: string
  descricao: string
  preco: number
  categoria: string
  destaque: boolean
  imagem: string
  ingredientes?: string
  created_at?: string
  updated_at?: string
}

export interface CategoriaEnum {
  PRATOS_PRINCIPAIS: 'Pratos Principais'
  SOBREMESAS: 'Sobremesas'
  BEBIDAS: 'Bebidas'
  ENTRADAS: 'Entradas'
}
