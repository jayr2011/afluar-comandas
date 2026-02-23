import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { paymentClient } from '@/lib/mercadopago'
import { resolveCartItemsFromDb } from '@/lib/resolveCartItems'
import { randomUUID } from 'crypto'
import { checkoutFormSchema } from '@/lib/validations/checkout'
import logger from '@/lib/logger'
import { isFeatureEnabled } from '@/lib/feature-toggles'
type CartItemPayload = { id: string; nome: string; preco: number; quantidade: number }

function parseNumber(v: unknown): number | null {
  if (typeof v === 'number' && !Number.isNaN(v)) return v
  if (typeof v === 'string') {
    const n = Number(v.replace(',', '.'))
    return Number.isFinite(n) ? n : null
  }
  return null
}
function isCartItem(x: unknown): x is CartItemPayload {
  if (!x || typeof x !== 'object') return false
  const o = x as unknown as Record<string, unknown>
  const preco = parseNumber(o.preco)
  const quantidade = typeof o.quantidade === 'number' ? o.quantidade : Number(o.quantidade)
  return (
    typeof o.id === 'string' &&
    o.id.length >= 1 &&
    typeof o.nome === 'string' &&
    o.nome.length >= 1 &&
    preco !== null &&
    preco > 0 &&
    Number.isInteger(quantidade) &&
    quantidade >= 1
  )
}
function toCartItem(x: unknown): CartItemPayload | null {
  if (!isCartItem(x)) return null
  const o = x as unknown as Record<string, unknown>
  const preco = parseNumber(o.preco)!
  const quantidade = typeof o.quantidade === 'number' ? o.quantidade : Number(o.quantidade)
  return { id: o.id as string, nome: o.nome as string, preco, quantidade }
}

export async function POST(request: NextRequest) {
  const checkoutEnabled = await isFeatureEnabled('checkout_enabled')
  if (!checkoutEnabled) {
    logger.warn('[process-payment] tentativa com checkout desabilitado')
    return NextResponse.json({ error: 'Checkout temporariamente indisponível.' }, { status: 503 })
  }

  const hasPaymentClient = !!paymentClient
  logger.debug('[process-payment] Início - paymentClient disponível:', hasPaymentClient)

  if (!paymentClient) {
    return NextResponse.json({ error: 'Pagamento não configurado' }, { status: 503 })
  }

  let body: Record<string, unknown> & { orderData?: { formData?: unknown; cart?: unknown[] } }
  try {
    body = await request.json()
    logger.debug('[process-payment] Body recebido:', JSON.stringify(body).slice(0, 500))
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const orderData = body.orderData
  if (
    !orderData ||
    typeof orderData !== 'object' ||
    !orderData.formData ||
    !Array.isArray(orderData.cart)
  ) {
    logger.warn('[process-payment] orderData inválido:', !!body.orderData, typeof body.orderData)
    return NextResponse.json({ error: 'orderData (formData e cart) obrigatório' }, { status: 400 })
  }

  const parsedForm = checkoutFormSchema.safeParse(orderData.formData)
  if (!parsedForm.success) {
    const msg = parsedForm.error.issues.map(i => i.message).join('; ')
    logger.warn('[process-payment] Validação formData:', msg)
    return NextResponse.json({ error: 'Dados do pedido inválidos', details: msg }, { status: 400 })
  }

  const cartRaw = orderData.cart.filter(isCartItem)
  const cartSent = cartRaw.map(toCartItem).filter((x): x is CartItemPayload => x !== null)
  if (cartSent.length === 0) {
    return NextResponse.json({ error: 'Carrinho vazio ou itens inválidos' }, { status: 400 })
  }

  const cartInput = cartSent.map(({ id, quantidade }) => ({ id, quantidade }))
  let cart: CartItemPayload[]
  let transactionAmount: number
  try {
    const resolved = await resolveCartItemsFromDb(cartInput)
    cart = resolved.items
    transactionAmount = resolved.total
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Produtos não encontrados'
    logger.error('[process-payment]', message)
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const validatedForm = parsedForm.data
  if (!Number.isFinite(transactionAmount) || transactionAmount <= 0) {
    return NextResponse.json({ error: 'Valor do pedido inválido' }, { status: 400 })
  }

  const idempotencyKey = randomUUID()

  let result: Record<string, unknown>
  try {
    const paymentData = {
      transaction_amount: transactionAmount,
      payment_method_id: (body.payment_method_id as string) || (body.paymentMethodId as string),
      token: body.token as string,
      issuer_id: body.issuer_id ? Number(body.issuer_id) : undefined,
      installments: Number(body.installments) || 1,
      payer: body.payer as { email: string; identification?: { type: string; number: string } },
      description: `Pedido - ${validatedForm.nome}`,
    }

    logger.debug('[process-payment] Dados do pagamento:', JSON.stringify(paymentData).slice(0, 500))
    logger.debug(
      '[process-payment] transaction_amount:',
      paymentData.transaction_amount,
      typeof paymentData.transaction_amount
    )
    logger.debug(
      '[process-payment] issuer_id:',
      paymentData.issuer_id,
      typeof paymentData.issuer_id
    )

    result = (await paymentClient.create({
      body: paymentData,
      requestOptions: { idempotencyKey },
    })) as unknown as Record<string, unknown>
  } catch (err) {
    logger.error('Erro ao processar pagamento MP:', err)
    return NextResponse.json(
      { error: 'Não foi possível processar o pagamento. Tente novamente.' },
      { status: 502 }
    )
  }

  const rawId = result?.id ?? (result as { body?: { id?: number } })?.body?.id
  const paymentId = rawId != null ? String(rawId) : null
  const status =
    (result?.status as string | undefined) ??
    (result as { body?: { status?: string } })?.body?.status ??
    (result as { data?: { status?: string } })?.data?.status
  const statusStr = typeof status === 'string' ? status : undefined

  logger.debug('[process-payment] Resposta MP:', {
    paymentId,
    status: statusStr,
    keys: Object.keys(result || {}),
  })

  if (!paymentId) {
    return NextResponse.json(
      {
        error: 'Pagamento não foi criado. Tente novamente.',
        code: 'payment_creation_failed',
        details: statusStr ? `Status: ${statusStr}` : undefined,
      },
      { status: 400 }
    )
  }

  const approved = statusStr === 'approved' || statusStr === 'authorized'

  const { data: pedido, error: insertError } = await getSupabaseAdmin()
    .from('pedidos')
    .insert([
      {
        cliente_nome: validatedForm.nome,
        cliente_whatsapp: validatedForm.whatsapp,
        endereco_rua: validatedForm.rua,
        endereco_numero: validatedForm.numero,
        endereco_bairro: validatedForm.bairro,
        endereco_complemento: validatedForm.complemento ?? null,
        itens_json: cart,
        valor_total: transactionAmount,
        status_pagamento: approved ? 'pago' : 'pendente',
        mercado_pago_id: paymentId,
      },
    ])
    .select('id')
    .single()

  if (insertError || !pedido) {
    logger.error('Erro ao registrar pedido após pagamento:', insertError)
    return NextResponse.json(
      {
        error:
          'Pagamento processado, mas falha ao registrar pedido. Entre em contato com o suporte.',
      },
      { status: 502 }
    )
  }

  const pedidoId = typeof pedido.id === 'string' ? pedido.id : String(pedido.id)
  await getSupabaseAdmin()
    .from('pedidos')
    .update({ external_reference: pedidoId })
    .eq('id', pedido.id)

  return NextResponse.json({ ok: true, orderId: pedido.id, paymentId, status: statusStr })
}
