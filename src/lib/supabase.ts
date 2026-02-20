import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import logger from '@/lib/logger'

function getRequiredEnvVar(name: string): string {
  const value = process.env[name]
  if (!value || value.trim() === '') {
    logger.error('[supabase] variável de ambiente ausente', { envVar: name })
    throw new Error(
      `Variável de ambiente ${name} não está definida. Configure no painel da Vercel.`
    )
  }
  return value
}

let supabaseClient: SupabaseClient | null = null

function getSupabaseUrl(): string {
  logger.debug('[supabase] obtendo URL do Supabase (variável de ambiente)', {
    envVar: 'NEXT_PUBLIC_SUPABASE_URL',
  })
  return getRequiredEnvVar('NEXT_PUBLIC_SUPABASE_URL')
}

function getSupabaseAnonKey(): string {
  logger.debug('[supabase] obtendo Anon Key do Supabase (variável de ambiente)', {
    envVar: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  })
  return getRequiredEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

function createSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    const url = getSupabaseUrl()
    const anonKey = getSupabaseAnonKey()
    logger.info('[supabase] inicializando cliente público', {
      urlPresent: !!url,
      anonKeyPresent: !!anonKey,
    })

    if (!url || !anonKey) {
      logger.error('[supabase] URL ou Anon Key ausentes', {
        urlPresent: !!url,
        anonKeyPresent: !!anonKey,
      })
      throw new Error('NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY são obrigatórias.')
    }

    try {
      supabaseClient = createClient(url, anonKey)
      logger.info('[supabase] cliente público criado com sucesso')
    } catch (err) {
      logger.error('[supabase] falha ao criar cliente público', {
        error: err instanceof Error ? err.message : err,
      })
      throw err
    }
  }
  return supabaseClient
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return (createSupabaseClient() as unknown as Record<string, unknown>)[prop as string]
  },
})

let supabaseAdmin: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  if (typeof window !== 'undefined') {
    logger.error(
      '[supabase] tentativa de chamar getSupabaseAdmin() no cliente (uso somente no servidor)'
    )
    throw new Error('getSupabaseAdmin() só pode ser usada no servidor.')
  }
  if (!supabaseAdmin) {
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    logger.debug('[supabase] criando cliente admin', {
      envVar: 'SUPABASE_SERVICE_ROLE_KEY',
      keyPresent: !!key,
    })
    if (!key) {
      logger.error('[supabase] SUPABASE_SERVICE_ROLE_KEY ausente', {
        envVar: 'SUPABASE_SERVICE_ROLE_KEY',
      })
      throw new Error('SUPABASE_SERVICE_ROLE_KEY não está definida. Configure no painel da Vercel.')
    }
    try {
      supabaseAdmin = createClient(getSupabaseUrl(), key, { auth: { persistSession: false } })
      logger.info('[supabase] cliente admin criado com sucesso')
    } catch (err) {
      logger.error('[supabase] falha ao criar cliente admin', {
        error: err instanceof Error ? err.message : err,
      })
      throw err
    }
  }
  return supabaseAdmin
}
