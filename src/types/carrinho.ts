import { CardapioItem } from "./database";

export interface CartItem extends CardapioItem {
    quantidade: number;
}

export interface Carrinho {
    itens: CartItem[];
    valorTotal: number;
    quantidadeTotal: number;
}