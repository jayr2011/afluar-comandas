import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRealtimeProdutos } from '@/hooks/useRealtimeProdutos'
import type { Produto } from '@/types/produtos'

let capturedCallback: ((payload: { eventType: string; table: string; new?: unknown; old?: unknown }) => void) | null =
  null
const mockChannel = {
  on: vi.fn((_event: string, _config: unknown, cb: (p: unknown) => void) => {
    capturedCallback = cb as typeof capturedCallback
    return mockChannel
  }),
  subscribe: vi.fn(() => mockChannel),
}
const mockChannelFn = vi.fn((name?: string) => {
  void name
  return mockChannel
})
const mockRemoveChannel = vi.fn()

vi.mock('@/lib/supabase-browser', () => ({
  supabaseBrowser: {
    channel: (name: string) => mockChannelFn(name),
    removeChannel: (ch: unknown) => mockRemoveChannel(ch),
  },
}))

const mockApplyRealtimeEvent = vi.fn()
vi.mock('@/lib/applyRealTimeEvent', () => ({
  applyRealtimeEvent: (a: unknown, b: unknown) => mockApplyRealtimeEvent(a, b),
}))

const mockRevalidateProdutosCache = vi.fn()
vi.mock('@/app/cardapio/actions', () => ({
  revalidateProdutosCache: () => mockRevalidateProdutosCache(),
}))

const mockLoggerDebug = vi.fn()
const mockLoggerError = vi.fn()
vi.mock('@/lib/logger', () => ({
  default: {
    debug: (msg: unknown, meta?: unknown) => mockLoggerDebug(msg, meta),
    error: (msg: unknown, meta?: unknown) => mockLoggerError(msg, meta),
  },
}))

const produto1: Produto = {
  id: '1',
  nome: 'A',
  descricao: '',
  preco: 10,
  categoria: 'sobremesas',
  destaque: false,
  imagem: '',
}
const produto2: Produto = {
  id: '2',
  nome: 'B',
  descricao: '',
  preco: 20,
  categoria: 'cervejas',
  destaque: false,
  imagem: '',
}

describe('useRealtimeProdutos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    capturedCallback = null
    mockApplyRealtimeEvent.mockImplementation((curr: Produto[]) => curr)
    mockRevalidateProdutosCache.mockResolvedValue(undefined)
  })

  it('retorna initialProdutos inicialmente', () => {
    const initial: Produto[] = [produto1]

    const { result } = renderHook(() => useRealtimeProdutos(initial))

    expect(result.current).toEqual([produto1])
  })

  it('chama supabaseBrowser.channel com "produtos-realtime"', () => {
    renderHook(() => useRealtimeProdutos([]))

    expect(mockChannelFn).toHaveBeenCalledWith('produtos-realtime')
  })

  it('chama .on com "postgres_changes"', () => {
    renderHook(() => useRealtimeProdutos([]))

    expect(mockChannel.on).toHaveBeenCalledWith(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'produtos' },
      expect.any(Function)
    )
  })

  it('chama .subscribe após configurar o canal', () => {
    renderHook(() => useRealtimeProdutos([]))

    expect(mockChannel.subscribe).toHaveBeenCalled()
  })

  it('chama logger.debug quando evento é recebido', async () => {
    renderHook(() => useRealtimeProdutos([]))

    await act(async () => {
      capturedCallback?.({
        eventType: 'INSERT',
        table: 'produtos',
        new: produto2,
        old: {},
      })
    })

    expect(mockLoggerDebug).toHaveBeenCalledWith('[realtime:produtos] evento recebido', {
      eventType: 'INSERT',
      table: 'produtos',
    })
  })

  it('chama applyRealtimeEvent com current e payload quando evento dispara', async () => {
    mockApplyRealtimeEvent.mockReturnValue([produto2, produto1])
    renderHook(() => useRealtimeProdutos([produto1]))

    await act(async () => {
      capturedCallback?.({
        eventType: 'INSERT',
        table: 'produtos',
        new: produto2,
        old: {},
      })
    })

    expect(mockApplyRealtimeEvent).toHaveBeenCalledWith(
      [produto1],
      expect.objectContaining({ eventType: 'INSERT', table: 'produtos' })
    )
  })

  it('atualiza estado com resultado de applyRealtimeEvent', async () => {
    const novos = [produto2, produto1]
    mockApplyRealtimeEvent.mockReturnValue(novos)
    const { result } = renderHook(() => useRealtimeProdutos([produto1]))

    await act(async () => {
      capturedCallback?.({
        eventType: 'INSERT',
        table: 'produtos',
        new: produto2,
        old: {},
      })
    })

    expect(result.current).toEqual(novos)
  })

  it('chama revalidateProdutosCache quando evento dispara', async () => {
    renderHook(() => useRealtimeProdutos([]))

    await act(async () => {
      capturedCallback?.({
        eventType: 'UPDATE',
        table: 'produtos',
        new: produto1,
        old: {},
      })
    })

    expect(mockRevalidateProdutosCache).toHaveBeenCalled()
  })

  it('chama removeChannel no cleanup do useEffect', () => {
    const { unmount } = renderHook(() => useRealtimeProdutos([]))

    unmount()

    expect(mockRemoveChannel).toHaveBeenCalledWith(mockChannel)
  })
})
