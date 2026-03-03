import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { NextRequest } from 'next/server'

const mockCreateServerClient = vi.fn()
const mockLoggerDebug = vi.fn()
const mockLoggerInfo = vi.fn()
const mockLoggerError = vi.fn()
const mockLoggerWarn = vi.fn()

vi.mock('@supabase/ssr', () => ({
  createServerClient: (url: string, key: string, options?: unknown) =>
    mockCreateServerClient(url, key, options),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('@/lib/logger', () => ({
  default: {
    debug: (msg: unknown, meta?: unknown) => mockLoggerDebug(msg, meta),
    info: (msg: unknown, meta?: unknown) => mockLoggerInfo(msg, meta),
    error: (msg: unknown, meta?: unknown) => mockLoggerError(msg, meta),
    warn: (msg: unknown, meta?: unknown) => mockLoggerWarn(msg, meta),
  },
}))

function createMockRequest(overrides?: Partial<{ pathname: string; cookieCount: number }>) {
  const getAll = vi.fn(() =>
    Array.from({ length: overrides?.cookieCount ?? 0 }, () => ({} as { name: string; value: string }))
  )
  return {
    nextUrl: { pathname: overrides?.pathname ?? '/test' },
    cookies: { getAll },
  } as unknown as NextRequest
}

const fakeUser = { id: 'user-1', app_metadata: { role: 'admin' } }
const fakeClient = {
  auth: {
    getUser: vi.fn(),
  },
}

describe('getUserFromRequest', () => {
  const originalEnv = process.env

  beforeEach(async () => {
    vi.resetModules()
    vi.clearAllMocks()
    process.env = { ...originalEnv }
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key'
    mockCreateServerClient.mockImplementation((_url: string, _key: string, options?: { cookies?: { getAll?: () => unknown; setAll?: (c: unknown[]) => void } }) => {
      options?.cookies?.getAll?.()
      return fakeClient
    })
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('chama logger.debug ao criar client de rota', async () => {
    const { getUserFromRequest } = await import('@/lib/supabase-server')
    fakeClient.auth.getUser.mockResolvedValue({ data: { user: null }, error: null })

    await getUserFromRequest(createMockRequest())

    expect(mockLoggerDebug).toHaveBeenCalledWith('[supabase:server] criando client de rota', {
      path: '/test',
    })
  })

  it('invoca cookies.getAll do request ao criar client de rota', async () => {
    const req = createMockRequest()
    const { getUserFromRequest } = await import('@/lib/supabase-server')
    fakeClient.auth.getUser.mockResolvedValue({ data: { user: null }, error: null })

    await getUserFromRequest(req)

    expect(req.cookies.getAll).toHaveBeenCalled()
  })

  it('chama createServerClient com URL e Anon Key', async () => {
    const { getUserFromRequest } = await import('@/lib/supabase-server')
    fakeClient.auth.getUser.mockResolvedValue({ data: { user: null }, error: null })

    await getUserFromRequest(createMockRequest())

    expect(mockCreateServerClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'anon-key',
      expect.objectContaining({
        cookies: expect.any(Object),
      })
    )
  })

  it('retorna user quando getUser tem sucesso', async () => {
    const { getUserFromRequest } = await import('@/lib/supabase-server')
    fakeClient.auth.getUser.mockResolvedValue({ data: { user: fakeUser }, error: null })

    const result = await getUserFromRequest(createMockRequest())

    expect(result).toEqual(fakeUser)
  })

  it('chama logger.debug quando usuário é obtido', async () => {
    const { getUserFromRequest } = await import('@/lib/supabase-server')
    fakeClient.auth.getUser.mockResolvedValue({ data: { user: fakeUser }, error: null })

    await getUserFromRequest(createMockRequest())

    expect(mockLoggerDebug).toHaveBeenCalledWith('[supabase:server] usuário obtido da requisição', {
      userId: 'user-1',
    })
  })

  it('retorna null quando getUser retorna error', async () => {
    const { getUserFromRequest } = await import('@/lib/supabase-server')
    fakeClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'Token inválido' },
    })

    const result = await getUserFromRequest(createMockRequest())

    expect(result).toBeNull()
  })

  it('chama logger.error quando getUser retorna error', async () => {
    const { getUserFromRequest } = await import('@/lib/supabase-server')
    fakeClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'Token inválido' },
    })

    await getUserFromRequest(createMockRequest())

    expect(mockLoggerError).toHaveBeenCalledWith(
      '[supabase:server] falha ao obter usuário da requisição',
      expect.objectContaining({ error: 'Token inválido' })
    )
  })

  it('chama logger.error com error objeto quando error não tem message', async () => {
    const { getUserFromRequest } = await import('@/lib/supabase-server')
    const errObj = { code: 'invalid' }
    fakeClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: errObj,
    })

    await getUserFromRequest(createMockRequest())

    expect(mockLoggerError).toHaveBeenCalledWith(
      '[supabase:server] falha ao obter usuário da requisição',
      expect.objectContaining({ error: errObj })
    )
  })

  it('retorna null quando user é null', async () => {
    const { getUserFromRequest } = await import('@/lib/supabase-server')
    fakeClient.auth.getUser.mockResolvedValue({ data: { user: null }, error: null })

    const result = await getUserFromRequest(createMockRequest())

    expect(result).toBeNull()
  })

  it('retorna null quando getUser lança exceção', async () => {
    const { getUserFromRequest } = await import('@/lib/supabase-server')
    fakeClient.auth.getUser.mockRejectedValue(new Error('Network error'))

    const result = await getUserFromRequest(createMockRequest())

    expect(result).toBeNull()
  })

  it('chama logger.error quando getUser lança exceção', async () => {
    const { getUserFromRequest } = await import('@/lib/supabase-server')
    fakeClient.auth.getUser.mockRejectedValue(new Error('Network error'))

    await getUserFromRequest(createMockRequest())

    expect(mockLoggerError).toHaveBeenCalledWith(
      '[supabase:server] erro inesperado ao obter usuário',
      expect.objectContaining({ error: 'Network error' })
    )
  })

  it('chama logger.error com err quando exceção não é Error', async () => {
    const { getUserFromRequest } = await import('@/lib/supabase-server')
    fakeClient.auth.getUser.mockRejectedValue('erro string')

    await getUserFromRequest(createMockRequest())

    expect(mockLoggerError).toHaveBeenCalledWith(
      '[supabase:server] erro inesperado ao obter usuário',
      expect.objectContaining({ error: 'erro string' })
    )
  })
})

describe('requireAuthenticatedUser', () => {
  const originalEnv = process.env

  const mockCookieSet = vi.fn()

  beforeEach(async () => {
    vi.resetModules()
    vi.clearAllMocks()
    process.env = { ...originalEnv }
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key'
    const { cookies } = await import('next/headers')
    vi.mocked(cookies).mockResolvedValue({
      getAll: vi.fn(() => []),
      set: mockCookieSet,
    } as unknown as Awaited<ReturnType<typeof cookies>>)
    mockCreateServerClient.mockImplementation((_url: string, _key: string, options?: { cookies?: { getAll?: () => unknown; setAll?: (c: { name: string; value: string; options?: unknown }[]) => void } }) => {
      options?.cookies?.getAll?.()
      options?.cookies?.setAll?.([{ name: 'sb-token', value: 'test', options: {} }])
      return fakeClient
    })
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('invoca setAll do cookieStore ao criar client de ação', async () => {
    const { requireAuthenticatedUser } = await import('@/lib/supabase-server')
    fakeClient.auth.getUser.mockResolvedValue({ data: { user: fakeUser }, error: null })

    await requireAuthenticatedUser()

    expect(mockCookieSet).toHaveBeenCalledWith('sb-token', 'test', {})
  })

  it('chama logger.debug ao criar client de ação', async () => {
    const { requireAuthenticatedUser } = await import('@/lib/supabase-server')
    fakeClient.auth.getUser.mockResolvedValue({ data: { user: fakeUser }, error: null })

    await requireAuthenticatedUser()

    expect(mockLoggerDebug).toHaveBeenCalledWith(
      '[supabase:server] criando client de ação (Action API)',
      expect.any(Object)
    )
  })

  it('retorna user quando é admin', async () => {
    const { requireAuthenticatedUser } = await import('@/lib/supabase-server')
    fakeClient.auth.getUser.mockResolvedValue({ data: { user: fakeUser }, error: null })

    const result = await requireAuthenticatedUser()

    expect(result).toEqual(fakeUser)
  })

  it('chama logger.debug quando admin autenticado', async () => {
    const { requireAuthenticatedUser } = await import('@/lib/supabase-server')
    fakeClient.auth.getUser.mockResolvedValue({ data: { user: fakeUser }, error: null })

    await requireAuthenticatedUser()

    expect(mockLoggerDebug).toHaveBeenCalledWith('[supabase:server] usuário admin autenticado', {
      userId: 'user-1',
    })
  })

  it('lança erro quando getUser retorna error', async () => {
    const { requireAuthenticatedUser } = await import('@/lib/supabase-server')
    fakeClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'Erro' },
    })

    await expect(requireAuthenticatedUser()).rejects.toThrow('Não autorizado')
  })

  it('chama logger.error quando getUser retorna error', async () => {
    const { requireAuthenticatedUser } = await import('@/lib/supabase-server')
    fakeClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'Erro' },
    })

    try {
      await requireAuthenticatedUser()
    } catch {
      // esperado
    }

    expect(mockLoggerError).toHaveBeenCalledWith(
      '[supabase:server] erro ao recuperar usuário autenticado',
      expect.any(Object)
    )
  })

  it('chama logger.error com error objeto quando error não tem message', async () => {
    const { requireAuthenticatedUser } = await import('@/lib/supabase-server')
    const errObj = { code: 'auth_failed' }
    fakeClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: errObj,
    })

    try {
      await requireAuthenticatedUser()
    } catch {
      // esperado
    }

    expect(mockLoggerError).toHaveBeenCalledWith(
      '[supabase:server] erro ao recuperar usuário autenticado',
      expect.objectContaining({ error: errObj })
    )
  })

  it('lança erro quando user é null', async () => {
    const { requireAuthenticatedUser } = await import('@/lib/supabase-server')
    fakeClient.auth.getUser.mockResolvedValue({ data: { user: null }, error: null })

    await expect(requireAuthenticatedUser()).rejects.toThrow('Não autorizado')
  })

  it('chama logger.warn quando user não autenticado', async () => {
    const { requireAuthenticatedUser } = await import('@/lib/supabase-server')
    fakeClient.auth.getUser.mockResolvedValue({ data: { user: null }, error: null })

    try {
      await requireAuthenticatedUser()
    } catch {
      // esperado
    }

    expect(mockLoggerWarn).toHaveBeenCalledWith(
      '[supabase:server] usuário não autenticado (requireAuthenticatedUser)',
      undefined
    )
  })

  it('lança erro quando user não é admin', async () => {
    const { requireAuthenticatedUser } = await import('@/lib/supabase-server')
    const userNonAdmin = { id: 'user-2', app_metadata: { role: 'user' } }
    fakeClient.auth.getUser.mockResolvedValue({ data: { user: userNonAdmin }, error: null })

    await expect(requireAuthenticatedUser()).rejects.toThrow(
      'Não autorizado: Acesso administrativo restrito'
    )
  })

  it('lança erro quando user.app_metadata é undefined', async () => {
    const { requireAuthenticatedUser } = await import('@/lib/supabase-server')
    const userSemMetadata = { id: 'user-3' }
    fakeClient.auth.getUser.mockResolvedValue({ data: { user: userSemMetadata }, error: null })

    await expect(requireAuthenticatedUser()).rejects.toThrow(
      'Não autorizado: Acesso administrativo restrito'
    )
  })

  it('chama logger.warn quando user não é admin', async () => {
    const { requireAuthenticatedUser } = await import('@/lib/supabase-server')
    const userNonAdmin = { id: 'user-2', app_metadata: { role: 'user' } }
    fakeClient.auth.getUser.mockResolvedValue({ data: { user: userNonAdmin }, error: null })

    try {
      await requireAuthenticatedUser()
    } catch {
      // esperado
    }

    expect(mockLoggerWarn).toHaveBeenCalledWith(
      '[supabase:server] usuário logado mas não é admin',
      { userId: 'user-2' }
    )
  })

  it('relança erro quando getUser lança exceção', async () => {
    const { requireAuthenticatedUser } = await import('@/lib/supabase-server')
    fakeClient.auth.getUser.mockRejectedValue(new Error('Network error'))

    await expect(requireAuthenticatedUser()).rejects.toThrow('Network error')
  })

  it('chama logger.error quando getUser lança exceção', async () => {
    const { requireAuthenticatedUser } = await import('@/lib/supabase-server')
    fakeClient.auth.getUser.mockRejectedValue(new Error('Network error'))

    try {
      await requireAuthenticatedUser()
    } catch {
      // esperado
    }

    expect(mockLoggerError).toHaveBeenCalledWith(
      '[supabase:server] erro inesperado em requireAuthenticatedUser',
      expect.objectContaining({ error: 'Network error' })
    )
  })

  it('lança Error quando exceção não é instância de Error', async () => {
    const { requireAuthenticatedUser } = await import('@/lib/supabase-server')
    fakeClient.auth.getUser.mockRejectedValue('erro não-Error')

    await expect(requireAuthenticatedUser()).rejects.toThrow('Não autorizado')
  })

  it('chama logger.error com fallback quando exceção não é Error', async () => {
    const { requireAuthenticatedUser } = await import('@/lib/supabase-server')
    fakeClient.auth.getUser.mockRejectedValue('erro desconhecido')

    try {
      await requireAuthenticatedUser()
    } catch {
      // esperado
    }

    expect(mockLoggerError).toHaveBeenCalledWith(
      '[supabase:server] erro inesperado em requireAuthenticatedUser',
      expect.objectContaining({ error: 'erro desconhecido' })
    )
  })
})
