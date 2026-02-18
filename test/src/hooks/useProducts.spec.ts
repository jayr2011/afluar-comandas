import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useProdutos } from '@/hooks/useProducts'

describe('useProdutos', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  it('retorna loading true inicialmente', () => {
    vi.mocked(fetch).mockImplementation(() => new Promise(() => {}))

    const { result } = renderHook(() => useProdutos())

    expect(result.current.loading).toBe(true)
    expect(result.current.produtos).toEqual([])
    expect(result.current.error).toBe(null)
  })

  it('carrega produtos com sucesso', async () => {
    const mockProdutos = [
      {
        id: '1',
        nome: 'Pizza',
        descricao: '...',
        preco: 30,
        categoria: 'Pratos',
        destaque: true,
        imagem: '',
      },
    ]
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          data: mockProdutos,
          pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
        }),
    } as Response)

    const { result } = renderHook(() => useProdutos())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.produtos).toEqual(mockProdutos)
    expect(result.current.error).toBe(null)
    expect(fetch).toHaveBeenCalledWith('/api/produtos')
  })

  it('adiciona query params quando passados', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({ data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } }),
    } as Response)

    renderHook(() => useProdutos({ categoria: 'Pratos', destaque: true }))

    await waitFor(() => {})

    expect(fetch).toHaveBeenCalledWith('/api/produtos?categoria=Pratos&destaque=true')
  })

  it('define error quando fetch falha', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
    } as Response)

    const { result } = renderHook(() => useProdutos())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Não foi possível carregar o cardápio. Tente novamente.')
    expect(result.current.produtos).toEqual([])
  })

  it('refetch chama fetch novamente', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({ data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } }),
    } as Response)

    const { result } = renderHook(() => useProdutos())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(fetch).toHaveBeenCalledTimes(1)

    result.current.refetch()
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(fetch).toHaveBeenCalledTimes(2)
  })
})
