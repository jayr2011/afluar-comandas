'use server'

import { updateTag } from 'next/cache'
import { requireAuthenticatedUser } from '@/lib/supabase-server'
import { getSupabaseAdmin } from '@/lib/supabase'
import {
  FEATURE_TOGGLE_DEFINITIONS,
  FeatureToggle,
  FeatureToggleKey,
  isFeatureToggleKey,
} from '@/lib/feature-toggles'
import logger from '@/lib/logger'

const LOG_PREFIX = '[admin:toggles]'

export async function listAdminFeatureToggles(): Promise<FeatureToggle[]> {
  const user = await requireAuthenticatedUser()
  logger.debug(`${LOG_PREFIX} listagem solicitada`, { userId: user.id })

  const supabaseAdmin = getSupabaseAdmin()
  const keys = FEATURE_TOGGLE_DEFINITIONS.map(item => item.key)

  const { data, error } = await supabaseAdmin
    .from('feature_toggles')
    .select('key, enabled, updated_at')
    .in('key', keys)

  if (error) {
    logger.error(`${LOG_PREFIX} erro ao listar toggles`, {
      userId: user.id,
      error: error.message,
    })
    throw error
  }

  const map = new Map(
    (data ?? []).map(item => [item.key, { enabled: !!item.enabled, updatedAt: item.updated_at }])
  )

  return FEATURE_TOGGLE_DEFINITIONS.map(item => ({
    key: item.key,
    title: item.title,
    description: item.description,
    enabled: map.get(item.key)?.enabled ?? false,
    updatedAt: map.get(item.key)?.updatedAt ?? null,
  }))
}

export async function updateFeatureToggle(input: { key: string; enabled: boolean }) {
  const user = await requireAuthenticatedUser()

  if (!isFeatureToggleKey(input.key)) {
    logger.warn(`${LOG_PREFIX} tentativa de atualização com chave inválida`, {
      userId: user.id,
      key: input.key,
    })
    return { ok: false as const, error: 'Toggle inválido.' }
  }

  const key: FeatureToggleKey = input.key
  logger.debug(`${LOG_PREFIX} atualizando toggle`, { userId: user.id, key, enabled: input.enabled })

  const supabaseAdmin = getSupabaseAdmin()

  const { error } = await supabaseAdmin.from('feature_toggles').upsert(
    {
      key,
      enabled: input.enabled,
      updated_by: user.id,
    },
    { onConflict: 'key' }
  )

  if (error) {
    logger.error(`${LOG_PREFIX} erro ao atualizar toggle`, {
      userId: user.id,
      key,
      enabled: input.enabled,
      error: error.message,
    })
    return { ok: false as const, error: 'Não foi possível atualizar o toggle.' }
  }

  updateTag('feature-toggles')
  logger.info(`${LOG_PREFIX} toggle atualizado`, { userId: user.id, key, enabled: input.enabled })

  return { ok: true as const }
}
