import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import logger from '@/lib/logger'

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const method = request.method
  const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? undefined
  const userAgent = request.headers.get('user-agent') ?? undefined
  const traceId = request.headers.get('x-request-id') ?? undefined

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
          try {
            logger.debug('[auth:proxy] cookies gravados', {
              path,
              cookieNames: cookiesToSet.map(c => c.name),
              traceId,
            })
          } catch (e) {
            logger.error('[auth:proxy] erro ao logar cookies gravados', {
              path,
              error: e instanceof Error ? e.message : e,
              traceId,
            })
          }
        },
      },
    }
  )

  try {
    const { data, error } = await supabase.auth.getUser()
    const user = data?.user ?? null

    if (error) {
      logger.error('[auth:proxy] supabase.auth.getUser retornou erro', {
        path,
        method,
        error: error?.message ?? error,
        traceId,
      })
    }

    if (!user && path.startsWith('/admin/painel')) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/admin'
      logger.warn('[auth:proxy] acesso negado a rota protegida (não autenticado)', {
        path,
        method,
        redirectTo: loginUrl.pathname,
        ip,
        traceId,
      })
      return NextResponse.redirect(loginUrl)
    }

    logger.info('[auth:proxy] requisição autenticada ou pública processada', {
      path,
      method,
      userId: user?.id,
      ip,
      ua: userAgent,
      traceId,
    })

    return supabaseResponse
  } catch (err) {
    logger.error('[auth:proxy] erro inesperado ao processar proxy', {
      path,
      method,
      error: err instanceof Error ? err.message : err,
      traceId,
    })
    return supabaseResponse
  }
}

export const config = {
  matcher: ['/admin/painel/:path*'],
}
