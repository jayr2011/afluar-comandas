import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockCreateClient = vi.fn()
const mockLoggerDebug = vi.fn()
const mockLoggerInfo = vi.fn()
const mockLoggerError = vi.fn()

vi.mock('@supabase/supabase-js', () => ({
  createClient: (url: string, key: string, options?: unknown) => mockCreateClient(url, key, options),
}))

vi.mock('@/lib/logger', () => ({
  default: {
    debug: (...args: unknown[]) => mockLoggerDebug(...args),
    info: (...args: unknown[]) => mockLoggerInfo(...args),
    error: (...args: unknown[]) => mockLoggerError(...args),
  },
}))

const fakeClient = { from: vi.fn(), auth: {} }

describe('supabase (cliente público)', () => {
  const originalEnv = process.env

  beforeEach(async () => {
    vi.resetModules()
    vi.clearAllMocks()
    process.env = { ...originalEnv }
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key'
    mockCreateClient.mockReturnValue(fakeClient)
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('chama logger.debug ao obter URL do Supabase', async () => {
    const { supabase } = await import('@/lib/supabase')
    void supabase.from

    expect(mockLoggerDebug).toHaveBeenCalledWith('[supabase] obtendo URL do Supabase (variável de ambiente)', {
      envVar: 'NEXT_PUBLIC_SUPABASE_URL',
    })
  })

  it('chama logger.debug ao obter Anon Key do Supabase', async () => {
    const { supabase } = await import('@/lib/supabase')
    void supabase.from

    expect(mockLoggerDebug).toHaveBeenCalledWith(
      '[supabase] obtendo Anon Key do Supabase (variável de ambiente)',
      { envVar: 'NEXT_PUBLIC_SUPABASE_ANON_KEY' }
    )
  })

  it('chama createClient com URL e Anon Key', async () => {
    const { supabase } = await import('@/lib/supabase')
    void supabase.from

    expect(mockCreateClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'anon-key',
      expect.any(Object)
    )
  })

  it('chama logger.info ao inicializar cliente público', async () => {
    const { supabase } = await import('@/lib/supabase')
    void supabase.from

    expect(mockLoggerInfo).toHaveBeenCalledWith('[supabase] inicializando cliente público', {
      urlPresent: true,
      anonKeyPresent: true,
      runtime: expect.any(String),
    })
  })

  it('retorna cliente com propriedade from', async () => {
    const { supabase } = await import('@/lib/supabase')

    expect(supabase.from).toBeDefined()
  })

  it('chama logger.info ao criar cliente com sucesso', async () => {
    const { supabase } = await import('@/lib/supabase')
    void supabase.from

    expect(mockLoggerInfo).toHaveBeenCalledWith('[supabase] cliente público criado com sucesso')
  })

  it('reutiliza cliente em acessos subsequentes', async () => {
    const { supabase } = await import('@/lib/supabase')
    void supabase.from
    void supabase.from

    expect(mockCreateClient).toHaveBeenCalledTimes(1)
  })
})

describe('supabase (cliente público) - erros de env', () => {
  const originalEnv = process.env

  beforeEach(async () => {
    vi.resetModules()
    vi.clearAllMocks()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('chama logger.error quando NEXT_PUBLIC_SUPABASE_URL está ausente', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key'

    const { supabase } = await import('@/lib/supabase')

    try {
      void supabase.from
    } catch {
      // esperado
    }

    expect(mockLoggerError).toHaveBeenCalledWith('[supabase] variável de ambiente ausente', {
      envVar: 'NEXT_PUBLIC_SUPABASE_URL',
    })
  })

  it('lança erro quando NEXT_PUBLIC_SUPABASE_URL está ausente', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key'

    const { supabase } = await import('@/lib/supabase')

    expect(() => {
      void supabase.from
    }).toThrow('Variável de ambiente NEXT_PUBLIC_SUPABASE_URL não está definida')
  })

  it('lança erro quando NEXT_PUBLIC_SUPABASE_URL está vazia', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = '   '
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key'

    const { supabase } = await import('@/lib/supabase')

    expect(() => {
      void supabase.from
    }).toThrow('Variável de ambiente NEXT_PUBLIC_SUPABASE_URL não está definida')
  })

  it('lança erro quando NEXT_PUBLIC_SUPABASE_ANON_KEY está ausente', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    const { supabase } = await import('@/lib/supabase')

    expect(() => {
      void supabase.from
    }).toThrow('Variável de ambiente NEXT_PUBLIC_SUPABASE_ANON_KEY não está definida')
  })

  it('chama logger.error quando createClient falha', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key'
    mockCreateClient.mockImplementationOnce(() => {
      throw new Error('Falha ao conectar')
    })

    const { supabase } = await import('@/lib/supabase')

    expect(() => {
      void supabase.from
    }).toThrow('Falha ao conectar')

    expect(mockLoggerError).toHaveBeenCalledWith('[supabase] falha ao criar cliente público', {
      error: 'Falha ao conectar',
    })
  })
})

describe('getSupabaseAdmin', () => {
  const originalEnv = process.env
  const originalWindow = globalThis.window

  beforeEach(async () => {
    vi.resetModules()
    vi.clearAllMocks()
    process.env = { ...originalEnv }
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key'
    mockCreateClient.mockReturnValue({ from: vi.fn(), auth: {} })
    Object.defineProperty(globalThis, 'window', {
      value: undefined,
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    process.env = originalEnv
    Object.defineProperty(globalThis, 'window', {
      value: originalWindow,
      writable: true,
      configurable: true,
    })
  })

  it('chama logger.debug ao criar cliente admin', async () => {
    const { getSupabaseAdmin } = await import('@/lib/supabase')

    getSupabaseAdmin()

    expect(mockLoggerDebug).toHaveBeenCalledWith('[supabase] criando cliente admin', {
      envVar: 'SUPABASE_SERVICE_ROLE_KEY',
      keyPresent: true,
    })
  })

  it('chama createClient com URL e service role key', async () => {
    const { getSupabaseAdmin } = await import('@/lib/supabase')

    getSupabaseAdmin()

    expect(mockCreateClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'service-role-key',
      { auth: { persistSession: false } }
    )
  })

  it('chama logger.info ao criar cliente admin com sucesso', async () => {
    const { getSupabaseAdmin } = await import('@/lib/supabase')

    getSupabaseAdmin()

    expect(mockLoggerInfo).toHaveBeenCalledWith('[supabase] cliente admin criado com sucesso')
  })

  it('retorna cliente admin', async () => {
    const { getSupabaseAdmin } = await import('@/lib/supabase')

    const client = getSupabaseAdmin()

    expect(client).toBeDefined()
    expect(client.from).toBeDefined()
  })

  it('reutiliza cliente admin em chamadas subsequentes', async () => {
    const { getSupabaseAdmin } = await import('@/lib/supabase')

    getSupabaseAdmin()
    getSupabaseAdmin()

    expect(mockCreateClient).toHaveBeenCalledTimes(1)
  })
})

describe('getSupabaseAdmin - erros', () => {
  const originalWindow = globalThis.window

  beforeEach(async () => {
    vi.resetModules()
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
  })

  afterEach(() => {
    Object.defineProperty(globalThis, 'window', {
      value: originalWindow,
      writable: true,
      configurable: true,
    })
  })

  it('chama logger.error ao chamar no cliente (window definido)', async () => {
    Object.defineProperty(globalThis, 'window', {
      value: {},
      writable: true,
      configurable: true,
    })

    const { getSupabaseAdmin } = await import('@/lib/supabase')

    try {
      getSupabaseAdmin()
    } catch {
      // esperado
    }

    expect(mockLoggerError).toHaveBeenCalledWith(
      '[supabase] tentativa de chamar getSupabaseAdmin() no cliente (uso somente no servidor)'
    )
  })

  it('lança erro ao chamar no cliente (window definido)', async () => {
    Object.defineProperty(globalThis, 'window', {
      value: {},
      writable: true,
      configurable: true,
    })

    const { getSupabaseAdmin } = await import('@/lib/supabase')

    expect(() => getSupabaseAdmin()).toThrow('getSupabaseAdmin() só pode ser usada no servidor.')
  })

  it('chama logger.error quando SUPABASE_SERVICE_ROLE_KEY está ausente', async () => {
    Object.defineProperty(globalThis, 'window', {
      value: undefined,
      writable: true,
      configurable: true,
    })
    delete process.env.SUPABASE_SERVICE_ROLE_KEY

    const { getSupabaseAdmin } = await import('@/lib/supabase')

    try {
      getSupabaseAdmin()
    } catch {
      // esperado
    }

    expect(mockLoggerError).toHaveBeenCalledWith('[supabase] SUPABASE_SERVICE_ROLE_KEY ausente', {
      envVar: 'SUPABASE_SERVICE_ROLE_KEY',
    })
  })

  it('lança erro quando SUPABASE_SERVICE_ROLE_KEY está ausente', async () => {
    Object.defineProperty(globalThis, 'window', {
      value: undefined,
      writable: true,
      configurable: true,
    })
    delete process.env.SUPABASE_SERVICE_ROLE_KEY

    const { getSupabaseAdmin } = await import('@/lib/supabase')

    expect(() => getSupabaseAdmin()).toThrow('SUPABASE_SERVICE_ROLE_KEY não está definida')
  })

  it('chama logger.error quando createClient falha no admin', async () => {
    Object.defineProperty(globalThis, 'window', {
      value: undefined,
      writable: true,
      configurable: true,
    })
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'key'
    mockCreateClient.mockImplementationOnce(() => {
      throw new Error('Falha admin')
    })

    const { getSupabaseAdmin } = await import('@/lib/supabase')

    expect(() => getSupabaseAdmin()).toThrow('Falha admin')

    expect(mockLoggerError).toHaveBeenCalledWith('[supabase] falha ao criar cliente admin', {
      error: 'Falha admin',
    })
  })
})
