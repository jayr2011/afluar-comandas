import { createClient, type SupabaseClient } from '@supabase/supabase-js'

function getRequiredEnvVar(name: string): string {
  const value = process.env[name]
  if (!value || value.trim() === '') {
    throw new Error(
      `Variável de ambiente ${name} não está definida. Configure no painel da Vercel.`
    )
  }
  return value
}

let supabaseClient: SupabaseClient | null = null

function getSupabaseUrl(): string {
  return getRequiredEnvVar('NEXT_PUBLIC_SUPABASE_URL')
}

function getSupabaseAnonKey(): string {
  return getRequiredEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

function createSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    const url = getSupabaseUrl()
    const anonKey = getSupabaseAnonKey()

    if (!url || !anonKey) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY são obrigatórias.')
    }

    supabaseClient = createClient(url, anonKey)
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
    throw new Error('getSupabaseAdmin() só pode ser usada no servidor.')
  }
  if (!supabaseAdmin) {
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!key) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY não está definida. Configure no painel da Vercel.')
    }
    supabaseAdmin = createClient(getSupabaseUrl(), key, { auth: { persistSession: false } })
  }
  return supabaseAdmin
}
