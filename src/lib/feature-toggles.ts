import { cacheTag } from 'next/cache'
import { supabase } from '@/lib/supabase'
import logger from '@/lib/logger'

const LOG_PREFIX = '[feature-toggles]'

export const FEATURE_TOGGLE_DEFINITIONS = [
  {
    key: 'blog_enabled',
    title: 'Blog habilitado',
    description: 'Exibe páginas e listagens do blog para visitantes.',
  },
  {
    key: 'eventos_enabled',
    title: 'Eventos habilitados',
    description: 'Mostra seção e páginas de eventos no site.',
  },
  {
    key: 'beach_tennis_enabled',
    title: 'Beach Tennis habilitado',
    description: 'Ativa páginas e chamadas para a modalidade Beach Tennis.',
  },
] as const

export type FeatureToggleKey = (typeof FEATURE_TOGGLE_DEFINITIONS)[number]['key']

export type FeatureToggle = {
  key: FeatureToggleKey
  title: string
  description: string
  enabled: boolean
  updatedAt: string | null
}

const FEATURE_TOGGLE_KEYS = FEATURE_TOGGLE_DEFINITIONS.map(item => item.key)

export function isFeatureToggleKey(value: string): value is FeatureToggleKey {
  return FEATURE_TOGGLE_KEYS.includes(value as FeatureToggleKey)
}

export async function getFeatureToggles(): Promise<FeatureToggle[]> {
  'use cache'
  cacheTag('feature-toggles')

  logger.debug(`${LOG_PREFIX} carregando toggles`)
  const { data, error } = await supabase
    .from('feature_toggles')
    .select('key, enabled, updated_at')
    .in('key', FEATURE_TOGGLE_KEYS)

  if (error) {
    logger.error(`${LOG_PREFIX} erro ao buscar toggles`, { error: error.message })
    throw error
  }

  const enabledMap = new Map(
    (data ?? []).map(item => [item.key, { enabled: !!item.enabled, updatedAt: item.updated_at }])
  )

  return FEATURE_TOGGLE_DEFINITIONS.map(item => ({
    key: item.key,
    title: item.title,
    description: item.description,
    enabled: enabledMap.get(item.key)?.enabled ?? false,
    updatedAt: enabledMap.get(item.key)?.updatedAt ?? null,
  }))
}

export async function getFeatureTogglesMap(): Promise<Map<FeatureToggleKey, boolean>> {
  'use cache'
  cacheTag('feature-toggles-map')

  const toggles = await getFeatureToggles()
  return new Map(toggles.map(t => [t.key, t.enabled]))
}

export async function getMultipleFeatureToggles(
  keys: FeatureToggleKey[]
): Promise<Record<FeatureToggleKey, boolean>> {
  const togglesMap = await getFeatureTogglesMap()

  const result = {} as Record<FeatureToggleKey, boolean>
  for (const key of keys) {
    result[key] = togglesMap.get(key) ?? false
  }
  return result
}

export async function isFeatureEnabled(key: FeatureToggleKey): Promise<boolean> {
  const togglesMap = await getFeatureTogglesMap()
  return togglesMap.get(key) ?? false
}
