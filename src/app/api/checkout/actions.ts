'use server'

import { z } from 'zod'
import { getSupabaseAdmin } from '@/lib/supabase'
import { preferenceClient } from '@/lib/mercadopago'
import { resolveCartItemsFromDb } from '@/lib/resolveCartItems'
import { Pedido } from '@/types/database'
import { CartItem } from '@/types/carrinho'
import { checkoutFormSchema } from '@/lib/validations/checkout'
import logger from '@/lib/logger'
import { isFeatureEnabled } from '@/lib/feature-toggles'
import { rateLimiters, throwIfRateLimited } from '@/lib/rate-limit'

const cartItemSchema = z.object({
  id: z.string().min(1).max(50),
  quantidade: z
    .number()
    .int('Quantidade deve ser inteira')
    .min(1, 'Quantidade mínima: 1')
    .max(50, 'Quantidade máxima por item: 50'),
})

const cartSchema = z.array(cartItemSchema).min(1, 'Carrinho vazio')

const LOG_PREFIX = '[checkout]'

export async function criarPreferenciaPagamento(
  carrinho: CartItem[]
): Promise<{ preferenceId: string; amount: number }> {
  await throwIfRateLimited(rateLimiters.checkout)

  const checkoutEnabled = await isFeatureEnabled('checkout_enabled')
  if (!checkoutEnabled) {
    logger.warn(`${LOG_PREFIX} tentativa de criar preferência com checkout desabilitado`)
    throw new Error('Checkout temporariamente indisponível.')
  }

  const parsedCart = cartSchema.safeParse(carrinho)
  if (!parsedCart.success) {
    const issues = parsedCart.error.issues.map(i => i.message)
    logger.warn(`${LOG_PREFIX} validação do carrinho falhou`, {
      issues,
      itemCount: carrinho.length,
    })
    const msg = issues.join('. ')
    throw new Error(msg)
  }

  const validatedCart = parsedCart.data
  const { items: resolvedItems, total: totalCalculado } =
    await resolveCartItemsFromDb(validatedCart)

  const items = resolvedItems.map(item => ({ id: item.id, quantity: item.quantidade }))

  logger.info(`${LOG_PREFIX} criando preferência de pagamento`, {
    itemCount: items.length,
    itemIds: items.map(i => i.id),
    amount: totalCalculado,
  })

  if (!preferenceClient) {
    logger.error(`${LOG_PREFIX} MercadoPago não configurado (token ausente)`)
    throw new Error('Pagamento não configurado. Defina MERCADOPAGO_ACCESS_TOKEN.')
  }

  const preferenceBody = {
    items: resolvedItems.map(item => ({
      id: item.id,
      title: item.nome,
      quantity: item.quantidade,
      unit_price: item.preco,
    })),
  }

  const preference = await preferenceClient.create({ body: preferenceBody as never }).catch(err => {
    logger.error(`${LOG_PREFIX} falha ao criar preferência MercadoPago`, {
      error: err instanceof Error ? err.message : String(err),
      itemCount: items.length,
      amount: totalCalculado,
    })
    return null
  })

  if (!preference?.id) {
    logger.error(`${LOG_PREFIX} preferência de pagamento não criada`, {
      itemCount: items.length,
      amount: totalCalculado,
    })
    throw new Error('Não foi possível iniciar o pagamento. Tente novamente.')
  }

  logger.info(`${LOG_PREFIX} preferência de pagamento criada`, {
    preferenceId: preference.id,
    amount: totalCalculado,
  })

  return {
    preferenceId: preference.id,
    amount: totalCalculado,
  }
}

export async function registrarPedido(
  formData: z.input<typeof checkoutFormSchema>,
  carrinho: CartItem[]
): Promise<Pedido> {
  // Rate limiting para registro de pedidos
  await throwIfRateLimited(rateLimiters.checkout)

  const checkoutEnabled = await isFeatureEnabled('checkout_enabled')
  if (!checkoutEnabled) {
    logger.warn(`${LOG_PREFIX} tentativa de registrar pedido com checkout desabilitado`)
    throw new Error('Checkout temporariamente indisponível.')
  }

  const parsedForm = checkoutFormSchema.safeParse(formData)
  if (!parsedForm.success) {
    const issues = parsedForm.error.issues.map(i => i.message)
    logger.warn(`${LOG_PREFIX} validação do formulário de checkout falhou`, { issues })
    const msg = issues.join('. ')
    throw new Error(msg)
  }

  const parsedCart = cartSchema.safeParse(carrinho)
  if (!parsedCart.success) {
    const issues = parsedCart.error.issues.map(i => i.message)
    logger.warn(`${LOG_PREFIX} validação do carrinho ao registrar pedido falhou`, { issues })
    const msg = issues.join('. ')
    throw new Error(msg)
  }

  const validatedForm = parsedForm.data
  const validatedCart = parsedCart.data
  const { items: itens, total: totalCalculado } = await resolveCartItemsFromDb(validatedCart)

  logger.info(`${LOG_PREFIX} registrando pedido`, {
    cliente: validatedForm.nome?.split(' ')[0] ?? null,
    itemCount: itens.length,
    amount: totalCalculado,
  })

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
    logger.error(`${LOG_PREFIX} erro ao registrar pedido no banco`, {
      error: error?.message ?? error,
      cliente: validatedForm.nome?.split(' ')[0] ?? null,
      itemCount: itens.length,
      amount: totalCalculado,
    })
    throw new Error('Não foi possível registrar o pedido. Tente novamente.')
  }

  logger.info(`${LOG_PREFIX} pedido registrado no banco`, { pedidoId: data?.id })

  return data
}
