import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL não está definida.')
  return url
}

function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY não está definida.')
  return key
}

function createSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = createClient(getSupabaseUrl(), getSupabaseAnonKey())
  }
  return supabaseClient
}

/** Cliente público (anon) – criado só quando usado, para o build da Vercel não quebrar sem env. */
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
    if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY não está definida.')
    supabaseAdmin = createClient(getSupabaseUrl(), key, { auth: { persistSession: false } })
  }
  return supabaseAdmin
}
