import { supabase } from '@/lib/supabase'
import { Pedido } from '@/types/database'
import { CartItem } from '@/types/carrinho'

interface CheckoutFormData {
    nome: string;
    whatsapp: string;
    rua: string;
    numero: string;
    bairro: string;
    complemento?: string;
}

export async function registrarPedido(formData: CheckoutFormData, carrinho: CartItem[]): Promise<Pedido> {
    const totalCalculado = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0)
    const { data, error } = await supabase
        .from('pedidos')
        .insert([{
            cliente_nome: formData.nome,
            cliente_whatsapp: formData.whatsapp,
            endereco_rua: formData.rua,
            endereco_numero: formData.numero,
            endereco_bairro: formData.bairro,
            endereco_complemento: formData.complemento,
            itens_json: carrinho,
            valor_total: totalCalculado,
            status_pagamento: 'pendente'
        }])
        .select()
        .single()

    if (error) {
        console.error('Erro ao registrar pedido:', error)
        throw new Error('Não foi possível registrar o pedido. Tente novamente.')
    }

    return data
}