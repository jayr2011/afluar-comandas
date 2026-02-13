export interface Produto {
  id: number
  nome: string
  descricao: string
  preco: number
  categoria: string
  destaque: boolean
  imagem: string
}

export interface CategoriaEnum {
  PRATOS_PRINCIPAIS: 'Pratos Principais'
  SOBREMESAS: 'Sobremesas'
  BEBIDAS: 'Bebidas'
  ENTRADAS: 'Entradas'
}
