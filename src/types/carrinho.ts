import { Produto } from "./produtos";

/** Item do carrinho com todas as informações do produto para uso em cards e telas */
export interface CartItem extends Produto {
  quantidade: number;
}

export interface Carrinho {
  itens: CartItem[];
  valorTotal: number;
  quantidadeTotal: number;
}