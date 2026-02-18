'use server'

import { z } from 'zod'
import { getSupabaseAdmin } from '@/lib/supabase'
import { preferenceClient } from '@/lib/mercadopago'
import { resolveCartItemsFromDb } from '@/lib/resolveCartItems'
import { Pedido } from '@/types/database'
import { CartItem } from '@/types/carrinho'
import { checkoutFormSchema } from '@/lib/validations/checkout'

const cartItemSchema = z.object({
  id: z.string().min(1).max(50),
  quantidade: z
    .number()
    .int('Quantidade deve ser inteira')
    .min(1, 'Quantidade mínima: 1')
    .max(50, 'Quantidade máxima por item: 50'),
})

const cartSchema = z.array(cartItemSchema).min(1, 'Carrinho vazio')

export async function criarPreferenciaPagamento(
  carrinho: CartItem[]
): Promise<{ preferenceId: string; amount: number }> {
  const parsedCart = cartSchema.safeParse(carrinho)
  if (!parsedCart.success) {
    const msg = parsedCart.error.issues.map(iss => iss.message).join('. ')
    throw new Error(msg)
  }

  const validatedCart = parsedCart.data
  const { items: resolvedItems, total: totalCalculado } =
    await resolveCartItemsFromDb(validatedCart)

  const items = resolvedItems.map(item => ({
    id: item.id,
    title: item.nome,
    quantity: item.quantidade,
    unit_price: item.preco,
  }))

  if (!preferenceClient) {
    throw new Error('Pagamento não configurado. Defina MERCADOPAGO_ACCESS_TOKEN.')
  }

  const preferenceBody = {
    items,
  }

  const preference = await preferenceClient.create({ body: preferenceBody as never }).catch(err => {
    console.error('Erro ao criar preferência MP:', err)
    return null
  })

  if (!preference?.id) {
    throw new Error('Não foi possível iniciar o pagamento. Tente novamente.')
  }

  return {
    preferenceId: preference.id,
    amount: totalCalculado,
  }
}

export async function registrarPedido(
  formData: z.input<typeof checkoutFormSchema>,
  carrinho: CartItem[]
): Promise<Pedido> {
  const parsedForm = checkoutFormSchema.safeParse(formData)
  if (!parsedForm.success) {
    const msg = parsedForm.error.issues.map(iss => iss.message).join('. ')
    throw new Error(msg)
  }

  const parsedCart = cartSchema.safeParse(carrinho)
  if (!parsedCart.success) {
    const msg = parsedCart.error.issues.map(iss => iss.message).join('. ')
    throw new Error(msg)
  }

  const validatedForm = parsedForm.data
  const validatedCart = parsedCart.data
  const { items: itens, total: totalCalculado } = await resolveCartItemsFromDb(validatedCart)

  const { data, error } = await getSupabaseAdmin()
    .from('pedidos')
    .insert([
      {
        cliente_nome: validatedForm.nome,
        cliente_whatsapp: validatedForm.whatsapp,
        endereco_rua: validatedForm.rua,
        endereco_numero: validatedForm.numero,
        endereco_bairro: validatedForm.bairro,
        endereco_complemento: validatedForm.complemento,
        itens_json: itens,
        valor_total: totalCalculado,
        status_pagamento: 'pendente',
        external_reference: '',
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Erro ao registrar pedido:', error)
    throw new Error('Não foi possível registrar o pedido. Tente novamente.')
  }

  return data
}
