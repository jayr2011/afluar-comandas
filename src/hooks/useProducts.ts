'use client'

import { useState, useEffect, useCallback } from 'react'
import { Produto } from '@/types/produtos'
import { useProductsStore } from '@/store/comandaStore'

interface UseProdutosOptions {
  categoria?: string
  destaque?: boolean
}

interface UseProdutosReturn {
  produtos: Produto[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useProdutos(options: UseProdutosOptions = {}): UseProdutosReturn {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProdutos = useCallback(async () => {
    const params = new URLSearchParams()
    if (options.categoria) params.append('categoria', options.categoria)
    if (options.destaque) params.append('destaque', 'true')
    const url = `/api/produtos${params.toString() ? `?${params.toString()}` : ''}`

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(url)

      if (!response.ok) throw new Error('Erro ao carregar produtos')

      const result = await response.json()
      const products = Array.isArray(result?.data) ? result?.data : []
      setProdutos(products)
      useProductsStore.getState().setProducts(products)
    } catch {
      setError('Não foi possível carregar o cardápio. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [options.categoria, options.destaque])

  useEffect(() => {
    fetchProdutos()
  }, [fetchProdutos])

  return {
    produtos,
    loading,
    error,
    refetch: fetchProdutos,
  }
}

export function useProduct(id: string | null | undefined): {
  produto: Produto | null
  loading: boolean
  error: string | null
  refetch: () => void
} {
  const cached = useProductsStore(state => (id ? state.products.get(id) : undefined))
  const setProduct = useProductsStore(state => state.setProduct)
  const [produto, setProduto] = useState<Produto | null>(cached ?? null)
  const [loading, setLoading] = useState(!!id && !cached)
  const [error, setError] = useState<string | null>(null)

  const fetchProduto = useCallback(
    async (signal?: AbortSignal) => {
      if (!id) {
        setProduto(null)
        setLoading(false)
        return
      }
      const fromCache = useProductsStore.getState().getProductById(id)
      if (fromCache) {
        setProduto(fromCache)
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/produtos/${id}`, { signal })
        if (!response.ok) {
          if (response.status === 404) throw new Error('Produto não encontrado')
          throw new Error('Erro ao carregar produto')
        }
        const data = await response.json()
        setProduto(data)
        setProduct(data)
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
        setError(err instanceof Error ? err.message : 'Não foi possível carregar o produto.')
        setProduto(null)
      } finally {
        if (!signal?.aborted) setLoading(false)
      }
    },
    [id, setProduct]
  )

  useEffect(() => {
    if (!id) {
      setProduto(null)
      setLoading(false)
      return
    }
    if (cached) {
      setProduto(cached)
      setLoading(false)
      return
    }
    const controller = new AbortController()
    setProduto(null)
    fetchProduto(controller.signal)
    return () => controller.abort()
  }, [id, cached?.id, fetchProduto])

  return {
    produto,
    loading,
    error,
    refetch: () => fetchProduto(),
  }
}
