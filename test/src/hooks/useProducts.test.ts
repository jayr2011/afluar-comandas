import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useProdutos, useProduct } from '@/hooks/useProducts'
import { useProductsStore } from '@/store/comandaStore'
import type { Produto } from '@/types/produtos'

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

describe('useProdutos', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: [produto1, produto2] }),
        } as Response)
      )
    )
    useProductsStore.setState({ products: new Map() })
  })

  it('retorna loading true inicialmente', () => {
    const { result } = renderHook(() => useProdutos())

    expect(result.current.loading).toBe(true)
  })

  it('retorna produtos vazios inicialmente', () => {
    const { result } = renderHook(() => useProdutos())

    expect(result.current.produtos).toEqual([])
  })

  it('retorna error null inicialmente', () => {
    const { result } = renderHook(() => useProdutos())

    expect(result.current.error).toBeNull()
  })

  it('chama fetch com /api/produtos quando sem opções', async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      } as Response)
    )
    vi.stubGlobal('fetch', mockFetch)

    renderHook(() => useProdutos())

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/produtos')
    })
  })

  it('chama fetch com categoria na query quando informada', async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      } as Response)
    )
    vi.stubGlobal('fetch', mockFetch)

    renderHook(() => useProdutos({ categoria: 'sobremesas' }))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/produtos?categoria=sobremesas')
    })
  })

  it('chama fetch com destaque na query quando true', async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      } as Response)
    )
    vi.stubGlobal('fetch', mockFetch)

    renderHook(() => useProdutos({ destaque: true }))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/produtos?destaque=true')
    })
  })

  it('retorna produtos quando fetch tem sucesso', async () => {
    const { result } = renderHook(() => useProdutos())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.produtos).toEqual([produto1, produto2])
  })

  it('retorna array vazio quando result.data não é array', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: null }),
        } as Response)
      )
    )

    const { result } = renderHook(() => useProdutos())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.produtos).toEqual([])
  })

  it('retorna loading false após fetch com sucesso', async () => {
    const { result } = renderHook(() => useProdutos())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.loading).toBe(false)
  })

  it('atualiza store com produtos quando fetch tem sucesso', async () => {
    renderHook(() => useProdutos())

    await waitFor(() => {
      const products = useProductsStore.getState().products
      expect(products.size).toBe(2)
    })

    expect(useProductsStore.getState().products.get('1')).toEqual(produto1)
  })

  it('retorna error quando fetch falha', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new Error('Network error')))
    )

    const { result } = renderHook(() => useProdutos())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Não foi possível carregar o cardápio. Tente novamente.')
  })

  it('retorna error quando response não ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
        } as Response)
      )
    )

    const { result } = renderHook(() => useProdutos())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Não foi possível carregar o cardápio. Tente novamente.')
  })

  it('refetch chama fetch novamente', async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: [produto1] }),
      } as Response)
    )
    vi.stubGlobal('fetch', mockFetch)

    const { result } = renderHook(() => useProdutos())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    mockFetch.mockClear()

    await act(async () => {
      result.current.refetch()
    })

    expect(mockFetch).toHaveBeenCalledTimes(1)
  })
})

describe('useProduct', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(produto1),
        } as Response)
      )
    )
    useProductsStore.setState({ products: new Map() })
  })

  it('retorna produto null quando id é null', async () => {
    const { result } = renderHook(() => useProduct(null))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.produto).toBeNull()
  })

  it('retorna loading false quando id é null', async () => {
    const { result } = renderHook(() => useProduct(null))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.loading).toBe(false)
  })

  it('refetch com id null retorna sem buscar', async () => {
    const mockFetch = vi.fn()
    vi.stubGlobal('fetch', mockFetch)

    const { result } = renderHook(() => useProduct(null))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      result.current.refetch()
    })

    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('refetch usa cache quando produto já está no store', async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(produto1),
      } as Response)
    )
    vi.stubGlobal('fetch', mockFetch)

    const { result } = renderHook(() => useProduct('1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    mockFetch.mockClear()

    await act(async () => {
      result.current.refetch()
    })

    expect(mockFetch).not.toHaveBeenCalled()
    expect(result.current.produto).toEqual(produto1)
  })

  it('retorna produto do cache quando existe', async () => {
    useProductsStore.getState().setProduct(produto2)

    const { result } = renderHook(() => useProduct('2'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.produto).toEqual(produto2)
  })

  it('não chama fetch quando produto está no cache', async () => {
    useProductsStore.getState().setProduct(produto2)
    const mockFetch = vi.fn()

    vi.stubGlobal('fetch', mockFetch)

    renderHook(() => useProduct('2'))

    await waitFor(() => {
      expect(mockFetch).not.toHaveBeenCalled()
    })
  })

  it('chama fetch com /api/produtos/:id quando id informado e sem cache', async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(produto1),
      } as Response)
    )
    vi.stubGlobal('fetch', mockFetch)

    renderHook(() => useProduct('1'))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/produtos/1', expect.any(Object))
    })
  })

  it('retorna produto quando fetch tem sucesso', async () => {
    const { result } = renderHook(() => useProduct('1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.produto).toEqual(produto1)
  })

  it('atualiza store quando fetch tem sucesso', async () => {
    renderHook(() => useProduct('1'))

    await waitFor(() => {
      expect(useProductsStore.getState().products.get('1')).toEqual(produto1)
    })
  })

  it('retorna error quando fetch retorna 404', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
        } as Response)
      )
    )

    const { result } = renderHook(() => useProduct('inexistente'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Produto não encontrado')
  })

  it('retorna produto null quando fetch falha', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
        } as Response)
      )
    )

    const { result } = renderHook(() => useProduct('1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.produto).toBeNull()
  })

  it('retorna error genérico quando fetch falha sem 404', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
        } as Response)
      )
    )

    const { result } = renderHook(() => useProduct('1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Erro ao carregar produto')
  })

  it('não seta error quando fetch é abortado', async () => {
    const abortErr = new Error('aborted')
    abortErr.name = 'AbortError'
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(abortErr)))

    const { result } = renderHook(() => useProduct('1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBeNull()
  })

  it('retorna error com mensagem fallback quando catch recebe não-Error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject('erro desconhecido'))
    )

    const { result } = renderHook(() => useProduct('1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Não foi possível carregar o produto.')
  })

  it('refetch chama fetch quando produto não está no cache', async () => {
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(produto1),
      } as Response)
    )
    vi.stubGlobal('fetch', mockFetch)

    const { result } = renderHook(() => useProduct('1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    useProductsStore.setState({ products: new Map() })
    mockFetch.mockClear()

    await act(async () => {
      result.current.refetch()
    })

    expect(mockFetch).toHaveBeenCalled()
  })
})
