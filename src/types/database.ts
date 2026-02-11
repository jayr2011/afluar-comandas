export interface CardapioItem {
    id: string;
    nome: string;
    descricao?: string;
    preco: number;
    imagem_url?: string;
}

export interface ItemPedido extends CardapioItem {
    quantidade: number;
}

export interface Pedido {
    id: string;
    created_at: string;
    cliente_nome: string;
    cliente_whatsapp: string;
    endereco_rua: string;
    endereco_numero: string;
    endereco_bairro: string;
    endereco_complemento?: string;
    itens_json: ItemPedido[]; 
    valor_total: number;
    status_pagamento: 'pendente' | 'pago' | 'cancelado' | 'reembolsado' | 'estornado' | 'em disputa';
    mercado_pago_id?: string;
    external_reference: string;
}