import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { type NextRequest } from 'next/server'
import logger from '@/lib/logger'

function createRouteClient(request: NextRequest) {
  logger.debug('[supabase:server] criando client de rota', { path: request.nextUrl?.pathname })
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll() {},
      },
    }
  )
}

async function createActionClient() {
  const cookieStore = await cookies()
  logger.debug('[supabase:server] criando client de ação (Action API)', {
    cookieCount: cookieStore.getAll().length,
  })
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    }
  )
}

export async function getUserFromRequest(request: NextRequest) {
  const supabase = createRouteClient(request)
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) {
      logger.error('[supabase:server] falha ao obter usuário da requisição', {
        path: request.nextUrl?.pathname,
        error: error?.message ?? error,
      })
      return null
    }
    logger.debug('[supabase:server] usuário obtido da requisição', { userId: user?.id })
    return user
  } catch (err) {
    logger.error('[supabase:server] erro inesperado ao obter usuário', {
      error: err instanceof Error ? err.message : err,
    })
    return null
  }
}

export async function requireAuthenticatedUser() {
  const supabase = await createActionClient()
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) {
      logger.error('[supabase:server] erro ao recuperar usuário autenticado', {
        error: error?.message ?? error,
      })
      throw new Error('Não autorizado')
    }
    if (!user) {
      logger.warn('[supabase:server] usuário não autenticado (requireAuthenticatedUser)')
      throw new Error('Não autorizado')
    }
    logger.debug('[supabase:server] usuário autenticado', { userId: user.id })
    return user
  } catch (err) {
    logger.error('[supabase:server] erro inesperado em requireAuthenticatedUser', {
      error: err instanceof Error ? err.message : err,
    })
    throw err instanceof Error ? err : new Error('Não autorizado')
  }
}
