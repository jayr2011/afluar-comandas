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

  const { error } = await supabase
    .from('comandas')
    .update({ status: 'confirmada' })
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

  const { data: comanda, error: comandaError } = await supabase
    .from('comandas')
    .select('*')
    .eq('id', comandaId)
    .single()

  if (comandaError || !comanda) {
    logger.info(`${LOG_PREFIX} getComandaData - comanda não encontrada`, {
      comandaId,
      error: comandaError?.message,
      code: comandaError?.code,
    })
    return null
  }

  logger.info(`${LOG_PREFIX} getComandaData - comanda encontrada`, {
    comandaId,
    numeroComanda: comanda.numero_comanda,
  })

  const { data: itens, error: itensError } = await supabase
    .from('comanda_itens')
    .select(
      'id, comanda_id, produto_id, quantidade, preco_unitario, subtotal, observacoes, status, produtos(id, nome)'
    )
    .eq('comanda_id', comandaId)
    .neq('status', 'cancelado')

  logger.info(`${LOG_PREFIX} getComandaData - itens buscados`, {
    comandaId,
    itensCount: itens?.length ?? 0,
    itensError: itensError?.message ?? null,
    itensRaw: itens ?? [],
  })

  if (itensError) {
    logger.warn(`${LOG_PREFIX} erro ao buscar itens`, { error: itensError.message })
  }

  const itensFormatados = (itens ?? []).map((item: Record<string, unknown>) => {
    const { produtos, ...rest } = item
    const p = produtos as { id: string; nome: string } | null | undefined
    const produto =
      p && typeof p === 'object' && 'id' in p && 'nome' in p
        ? { id: p.id, nome: p.nome }
        : undefined
    return { ...rest, produto }
  })

  const valorTotalCalculado = itensFormatados.reduce(
    (acc: number, item: Record<string, unknown>) =>
      acc + Number(item.subtotal ?? 0),
    0
  )

  return {
    ...comanda,
    valor_total: valorTotalCalculado,
    itens: itensFormatados,
  }
}

export async function adicionarItemComanda(
  comandaId: string,
  produtoId: string,
  quantidade: number,
  observacoes?: string | null
): Promise<{ ok: boolean; message: string }> {
  const supabase = getSupabaseAdmin()

  const params = {
    p_comanda_id: comandaId,
    p_produto_id: produtoId,
    p_quantidade: quantidade,
    p_observacoes: observacoes ?? null,
  }
  logger.info(`${LOG_PREFIX} adicionarItemComanda - chamando RPC`, params)

  const { data: rpcData, error } = await supabase.rpc('adicionar_item_comanda', params)

  if (error) {
    logger.error(`${LOG_PREFIX} erro ao adicionar item`, {
      comandaId,
      produtoId,
      error: error.message,
    })
    return { ok: false, message: error.message }
  }

  logger.info(`${LOG_PREFIX} adicionarItemComanda - RPC sucesso`, {
    comandaId,
    produtoId,
    rpcData,
  })

  revalidatePath('/comanda')
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
