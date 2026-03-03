'use server'

import { unstable_noStore } from 'next/cache'
import { getSupabaseAdmin } from '@/lib/supabase'
import logger from '@/lib/logger'
import { revalidatePath } from 'next/cache'
import { setComandaCookie, clearComandaCookie } from '@/lib/comanda-cookie'
import type { ComandaComItens } from '@/types/comanda'
import {
  criarComandaSchema,
  fecharComandaSchema,
  confirmarPedidoComandaSchema,
  cancelarComandaSchema,
  removerItemComandaSchema,
  alterarQuantidadeItemSchema,
  type CriarComandaState,
} from './schemas'

const LOG_PREFIX = '[comanda]'

export async function fecharComanda(formData: FormData) {
  const validated = fecharComandaSchema.parse(Object.fromEntries(formData))
  const supabase = getSupabaseAdmin()

  const { error } = await supabase.rpc('fechar_comanda', {
    p_comanda_id: validated.comandaId,
  })

  if (error) {
    logger.error(`${LOG_PREFIX} erro ao fechar`, { error })
    throw new Error(error.message)
  }

  await clearComandaCookie()
  revalidatePath('/comanda')
}

export async function confirmarPedidoComanda(formData: FormData) {
  const validated = confirmarPedidoComandaSchema.parse(Object.fromEntries(formData))
  const { getComandaCookie } = await import('@/lib/comanda-cookie')
  const comandaId = await getComandaCookie()

  if (!comandaId || comandaId !== validated.comandaId) {
    throw new Error('Comanda inválida.')
  }

  const supabase = getSupabaseAdmin()
  const confirmadaEm = new Date().toISOString()

  const { count } = await supabase
    .from('pedidos_comanda')
    .select('*', { count: 'exact', head: true })
    .eq('comanda_id', validated.comandaId)

  const proximoNumero = (count ?? 0) + 1

  const { data: novoPedido, error: erroPedido } = await supabase
    .from('pedidos_comanda')
    .insert({
      comanda_id: validated.comandaId,
      numero: proximoNumero,
      confirmado_em: confirmadaEm,
    })
    .select('id')
    .single()

  if (erroPedido || !novoPedido) {
    logger.error(`${LOG_PREFIX} erro ao criar pedido`, {
      comandaId: validated.comandaId,
      error: erroPedido?.message,
    })
    throw new Error('Não foi possível criar o pedido.')
  }

  const { error: erroUpdateItens } = await supabase
    .from('comanda_itens')
    .update({ pedido_id: novoPedido.id })
    .eq('comanda_id', validated.comandaId)
    .is('pedido_id', null)
    .neq('status', 'cancelado')

  if (erroUpdateItens) {
    logger.error(`${LOG_PREFIX} erro ao vincular itens ao pedido`, {
      error: erroUpdateItens.message,
    })
    throw new Error('Não foi possível vincular itens ao pedido.')
  }

  const { error } = await supabase
    .from('comandas')
    .update({ status: 'confirmada', confirmada_em: confirmadaEm })
    .eq('id', validated.comandaId)
    .eq('status', 'aberta')

  if (error) {
    logger.error(`${LOG_PREFIX} erro ao confirmar pedido`, {
      comandaId: validated.comandaId,
      error: error.message,
    })
    throw new Error(error.message)
  }

  revalidatePath('/comanda')
}

export async function cancelarComanda(formData: FormData) {
  const validated = cancelarComandaSchema.parse(Object.fromEntries(formData))
  const supabase = getSupabaseAdmin()

  const { error } = await supabase
    .from('comandas')
    .update({ status: 'cancelada', cancelada_em: new Date().toISOString() })
    .eq('id', validated.comandaId)
    .in('status', ['aberta', 'confirmada'])

  if (error) {
    logger.error(`${LOG_PREFIX} erro ao cancelar`, { error })
    throw new Error(error.message)
  }

  await clearComandaCookie()
  revalidatePath('/comanda')
}

export async function removerItemComanda(formData: FormData) {
  const validated = removerItemComandaSchema.parse(Object.fromEntries(formData))
  const { getComandaCookie } = await import('@/lib/comanda-cookie')
  const comandaId = await getComandaCookie()

  if (!comandaId) {
    throw new Error('Nenhuma comanda vinculada.')
  }

  const supabase = getSupabaseAdmin()

  const { data: item } = await supabase
    .from('comanda_itens')
    .select('pedido_id')
    .eq('id', validated.itemId)
    .eq('comanda_id', comandaId)
    .single()

  if (item?.pedido_id) {
    throw new Error('Itens de pedidos confirmados não podem ser removidos.')
  }

  const { error } = await supabase
    .from('comanda_itens')
    .update({ status: 'cancelado' })
    .eq('id', validated.itemId)
    .eq('comanda_id', comandaId)

  if (error) {
    logger.error(`${LOG_PREFIX} erro ao remover item`, {
      itemId: validated.itemId,
      error: error.message,
    })
    throw new Error(error.message)
  }

  revalidatePath('/comanda')
}

export async function alterarQuantidadeItemComanda(formData: FormData) {
  const validated = alterarQuantidadeItemSchema.parse(Object.fromEntries(formData))
  const { getComandaCookie } = await import('@/lib/comanda-cookie')
  const comandaId = await getComandaCookie()

  if (!comandaId) {
    throw new Error('Nenhuma comanda vinculada.')
  }

  const supabase = getSupabaseAdmin()

  const { data: itemCheck } = await supabase
    .from('comanda_itens')
    .select('pedido_id')
    .eq('id', validated.itemId)
    .eq('comanda_id', comandaId)
    .single()

  if (itemCheck?.pedido_id) {
    throw new Error('Itens de pedidos confirmados não podem ser alterados.')
  }

  const { data: item, error: fetchError } = await supabase
    .from('comanda_itens')
    .select('quantidade, preco_unitario')
    .eq('id', validated.itemId)
    .eq('comanda_id', comandaId)
    .single()

  if (fetchError || !item) {
    logger.error(`${LOG_PREFIX} erro ao buscar item para alterar`, {
      itemId: validated.itemId,
      error: fetchError?.message,
    })
    throw new Error('Item não encontrado.')
  }

  const qtdAtual = Number(item.quantidade ?? 0)
  const precoUnitario = Number(item.preco_unitario ?? 0)
  const novaQuantidade = qtdAtual + validated.delta

  if (novaQuantidade < 1) {
    const formData = new FormData()
    formData.append('itemId', validated.itemId)
    await removerItemComanda(formData)
    revalidatePath('/comanda')
    return
  }

  const novoSubtotal = precoUnitario * novaQuantidade

  const { error } = await supabase
    .from('comanda_itens')
    .update({ quantidade: novaQuantidade, subtotal: novoSubtotal })
    .eq('id', validated.itemId)
    .eq('comanda_id', comandaId)

  if (error) {
    logger.error(`${LOG_PREFIX} erro ao alterar quantidade`, {
      itemId: validated.itemId,
      error: error.message,
    })
    throw new Error(error.message)
  }

  revalidatePath('/comanda')
}

export async function getComandaData(comandaId: string): Promise<ComandaComItens | null> {
  unstable_noStore()
  const supabase = getSupabaseAdmin()

  logger.info(`${LOG_PREFIX} getComandaData iniciando`, { comandaId })

  const { data: comandaBase, error: comandaError } = await supabase
    .from('comandas')
    .select(
      'id, numero_comanda, cliente_nome, garcom_id, status, valor_total, observacoes, created_at, updated_at, fechada_em, cancelada_em, confirmada_em'
    )
    .eq('id', comandaId)
    .single()

  if (comandaError || !comandaBase) {
    logger.info(`${LOG_PREFIX} getComandaData - comanda não encontrada`, {
      comandaId,
      error: comandaError?.message,
      code: comandaError?.code,
    })
    return null
  }

  let garcomNome: string | null = null
  if (comandaBase.garcom_id) {
    const { data: garcom } = await supabase
      .from('garcons')
      .select('nome')
      .eq('id', comandaBase.garcom_id)
      .maybeSingle()
    garcomNome = garcom?.nome ?? null
  }
  const comanda = { ...comandaBase, garcom_nome: garcomNome }

  logger.info(`${LOG_PREFIX} getComandaData - comanda encontrada`, {
    comandaId,
    numeroComanda: comanda.numero_comanda,
  })

  const { data: itensCarrinho, error: itensError } = await supabase
    .from('comanda_itens')
    .select(
      'id, comanda_id, produto_id, quantidade, preco_unitario, subtotal, observacoes, status, created_at, pedido_id, produtos(id, nome)'
    )
    .eq('comanda_id', comandaId)
    .neq('status', 'cancelado')
    .is('pedido_id', null)

  if (itensError) {
    logger.warn(`${LOG_PREFIX} erro ao buscar itens do carrinho`, { error: itensError.message })
  }

  const formatarItem = (item: Record<string, unknown>) => {
    const { produtos, ...rest } = item
    const p = produtos as { id: string; nome: string } | null | undefined
    const produto =
      p && typeof p === 'object' && 'id' in p && 'nome' in p
        ? { id: p.id, nome: p.nome }
        : undefined
    return { ...rest, produto }
  }

  const itensFormatados = (itensCarrinho ?? []).map(formatarItem)
  const valorTotalCarrinho = itensFormatados.reduce(
    (acc: number, item: Record<string, unknown>) => acc + Number(item.subtotal ?? 0),
    0
  )

  const { data: pedidosRaw } = await supabase
    .from('pedidos_comanda')
    .select('id, numero, confirmado_em')
    .eq('comanda_id', comandaId)
    .order('numero', { ascending: true })

  const pedidos: Array<{
    id: string
    comanda_id: string
    numero: number
    confirmado_em: string
    itens: ComandaComItens['itens']
    valor_total: number
  }> = []

  if (pedidosRaw) {
    for (const ped of pedidosRaw) {
      const { data: itensPedido } = await supabase
        .from('comanda_itens')
        .select(
          'id, comanda_id, produto_id, quantidade, preco_unitario, subtotal, observacoes, status, created_at, pedido_id, produtos(id, nome)'
        )
        .eq('pedido_id', ped.id)
        .neq('status', 'cancelado')

      const itensPedFormatados = (itensPedido ?? []).map(formatarItem) as ComandaComItens['itens']
      const valorPedido = itensPedFormatados.reduce(
        (acc: number, item) => acc + Number(item.subtotal ?? 0),
        0
      )
      pedidos.push({
        id: ped.id,
        comanda_id: comandaId,
        numero: ped.numero,
        confirmado_em: ped.confirmado_em,
        itens: itensPedFormatados,
        valor_total: valorPedido,
      })
    }
  }

  const valorTotalGeral = valorTotalCarrinho + pedidos.reduce((acc, p) => acc + p.valor_total, 0)

  return {
    ...comanda,
    valor_total: valorTotalGeral,
    itens: itensFormatados as ComandaComItens['itens'],
    pedidos,
  }
}

export async function adicionarItemComanda(
  comandaId: string,
  produtoId: string,
  quantidade: number,
  observacoes?: string | null
): Promise<{ ok: boolean; message: string }> {
  const supabase = getSupabaseAdmin()

  const { data: comandaStatus } = await supabase
    .from('comandas')
    .select('status')
    .eq('id', comandaId)
    .single()

  const usarInsertDireto = comandaStatus?.status === 'confirmada'

  const fazerInsertDireto = async () => {
    const { data: produto } = await supabase
      .from('produtos')
      .select('preco')
      .eq('id', produtoId)
      .single()

    if (!produto || produto.preco == null) {
      logger.error(`${LOG_PREFIX} produto não encontrado ou sem preço`, { produtoId })
      return { ok: false, message: 'Produto não encontrado.' }
    }

    const precoUnitario = Number(produto.preco)
    const subtotal = precoUnitario * quantidade

    const { error: insertError } = await supabase.from('comanda_itens').insert({
      comanda_id: comandaId,
      produto_id: produtoId,
      quantidade,
      preco_unitario: precoUnitario,
      subtotal,
      observacoes: observacoes ?? null,
      status: 'pendente',
    })

    if (insertError) {
      logger.error(`${LOG_PREFIX} erro ao inserir item`, {
        comandaId,
        produtoId,
        error: insertError.message,
      })
      return { ok: false, message: insertError.message }
    }

    logger.info(`${LOG_PREFIX} adicionarItemComanda - insert direto sucesso`, {
      comandaId,
      produtoId,
    })
    return { ok: true, message: 'Item adicionado.' }
  }

  if (usarInsertDireto) {
    logger.info(`${LOG_PREFIX} adicionarItemComanda - comanda confirmada, usando insert direto`, {
      comandaId,
      produtoId,
    })
    const result = await fazerInsertDireto()
    if (!result.ok) return result
  } else {
    const params = {
      p_comanda_id: comandaId,
      p_produto_id: produtoId,
      p_quantidade: quantidade,
      p_observacoes: observacoes ?? null,
    }
    logger.info(`${LOG_PREFIX} adicionarItemComanda - chamando RPC`, params)

    const { error } = await supabase.rpc('adicionar_item_comanda', params)

    if (error) {
      logger.warn(`${LOG_PREFIX} RPC falhou, tentando insert direto`, {
        comandaId,
        produtoId,
        error: error.message,
      })
      const result = await fazerInsertDireto()
      if (!result.ok) return result
    } else {
      logger.info(`${LOG_PREFIX} adicionarItemComanda - RPC sucesso`, { comandaId, produtoId })
    }
  }

  revalidatePath('/comanda')
  revalidatePath('/cardapio')
  return { ok: true, message: 'Item adicionado.' }
}

export async function adicionarItemComandaAction(
  produtoId: string,
  quantidade: number = 1
): Promise<{ ok: boolean; message: string }> {
  const { getComandaCookie } = await import('@/lib/comanda-cookie')
  const comandaId = await getComandaCookie()

  logger.info(`${LOG_PREFIX} adicionarItemComandaAction - cookie lido`, {
    comandaId: comandaId ?? null,
    produtoId,
    quantidade,
  })

  if (!comandaId) {
    return { ok: false, message: 'Nenhuma comanda vinculada. Abra uma comanda primeiro.' }
  }

  return adicionarItemComanda(comandaId, produtoId, quantidade)
}

export async function criarComandaAction(
  _prevState: CriarComandaState,
  formData: FormData
): Promise<CriarComandaState> {
  const parsed = criarComandaSchema.safeParse({
    nomeCliente: formData.get('nomeCliente'),
    nomeGarcom: formData.get('nomeGarcom'),
  })

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Dados inválidos para criar comanda.'
    return {
      ok: false,
      message: firstError,
    }
  }

  const { nomeCliente, nomeGarcom } = parsed.data
  const supabase = getSupabaseAdmin()

  const { data: rpcData, error: rpcError } = await supabase.rpc('criar_comanda_por_nome_garcom', {
    p_nome_cliente: nomeCliente,
    p_nome_garcom: nomeGarcom,
  })

  if (!rpcError && rpcData && rpcData.length > 0) {
    const novaComanda = rpcData[0] as { comanda_id: string; numero_comanda: number }

    logger.info(`${LOG_PREFIX} comanda criada via rpc`, {
      comandaId: novaComanda.comanda_id,
      numeroComanda: novaComanda.numero_comanda,
      nomeCliente,
      nomeGarcom,
    })

    await setComandaCookie(novaComanda.comanda_id)

    return {
      ok: true,
      message: `Comanda #${novaComanda.numero_comanda} criada com sucesso.`,
      comandaId: novaComanda.comanda_id,
      numeroComanda: novaComanda.numero_comanda,
    }
  }

  if (rpcError) {
    logger.warn(`${LOG_PREFIX} rpc indisponível, usando fallback`, {
      error: rpcError.message,
      nomeCliente,
      nomeGarcom,
    })
  }

  const { data: garcons, error: garcomError } = await supabase
    .from('garcons')
    .select('id, nome')
    .eq('ativo', true)
    .ilike('nome', nomeGarcom)

  if (garcomError) {
    logger.error(`${LOG_PREFIX} erro ao buscar garçom`, {
      error: garcomError.message,
      nomeGarcom,
    })
    return {
      ok: false,
      message: 'Não foi possível validar o garçom agora. Tente novamente.',
    }
  }

  if (!garcons || garcons.length === 0) {
    return {
      ok: false,
      message: 'Garçom não encontrado ou inativo.',
    }
  }

  if (garcons.length > 1) {
    return {
      ok: false,
      message: 'Há mais de um garçom com esse nome. Use um identificador único.',
    }
  }

  const garcomId = garcons[0].id

  const { data: novaComanda, error: comandaError } = await supabase
    .from('comandas')
    .insert({
      cliente_nome: nomeCliente,
      garcom_id: garcomId,
    })
    .select('id, numero_comanda')
    .single()

  if (comandaError) {
    logger.error(`${LOG_PREFIX} erro ao criar comanda`, {
      error: comandaError.message,
      nomeCliente,
      nomeGarcom,
      garcomId,
    })
    return {
      ok: false,
      message: 'Não foi possível criar a comanda. Tente novamente.',
    }
  }

  logger.info(`${LOG_PREFIX} comanda criada`, {
    comandaId: novaComanda.id,
    numeroComanda: novaComanda.numero_comanda,
    nomeCliente,
    garcomId,
  })

  await setComandaCookie(novaComanda.id)

  return {
    ok: true,
    message: `Comanda #${novaComanda.numero_comanda} criada com sucesso.`,
    comandaId: novaComanda.id,
    numeroComanda: novaComanda.numero_comanda,
  }
}
