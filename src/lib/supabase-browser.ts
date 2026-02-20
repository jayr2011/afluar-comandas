import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | null = null

function getBrowserClient(): ReturnType<typeof createBrowserClient> {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return client
}

export const supabaseBrowser = new Proxy({} as ReturnType<typeof createBrowserClient>, {
  get(_, prop) {
    return (getBrowserClient() as unknown as Record<string, unknown>)[prop as string]
  },
})
