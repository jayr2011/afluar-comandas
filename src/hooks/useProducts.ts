'use client'

import { useState, useEffect, useCallback } from 'react'
import { Produto } from '@/types/produtos'
import { useProductsStore } from '@/store/productsStore'

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

  const fetchProdutos = async () => {
    const params = new URLSearchParams()
    if (options.categoria) params.append('categoria', options.categoria)
    if (options.destaque) params.append('destaque', 'true')
    const url = `/api/produtos${params.toString() ? `?${params.toString()}` : ''}`

    console.debug('[useProdutos] iniciando fetch', {
      categoria: options.categoria,
      destaque: options.destaque,
      url,
    })

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(url)

      if (!response.ok) {
        console.error('[useProdutos] resposta inválida', {
          status: response.status,
          statusText: response.statusText,
          url,
        })
        throw new Error('Erro ao carregar produtos')
      }

      const result = await response.json()
      const products = Array.isArray(result?.data) ? result?.data : []
      setProdutos(products)
      useProductsStore.getState().setProducts(products)
      console.info('[useProdutos] produtos carregados', { count: products.length, url })
    } catch (err) {
      console.error('[useProdutos] erro inesperado', {
        error: err instanceof Error ? err.message : err,
        url,
      })
      setError('Não foi possível carregar o cardápio. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProdutos()
  }, [options.categoria, options.destaque])

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
  const cached = useProductsStore(state => (id ? state.getProductById(id) : undefined))
  const setProduct = useProductsStore(state => state.setProduct)
  const [produto, setProduto] = useState<Produto | null>(cached ?? null)
  const [loading, setLoading] = useState(!!id && !cached)
  const [error, setError] = useState<string | null>(null)

  const fetchProduto = useCallback(async () => {
    if (!id) {
      setProduto(null)
      setLoading(false)
      console.warn('[useProduct] chamado sem ID')
      return
    }
    const fromCache = useProductsStore.getState().getProductById(id)
    if (fromCache) {
      setProduto(fromCache)
      setLoading(false)
      console.debug('[useProduct] servido do cache', { produtoId: id, nome: fromCache.nome })
      return
    }
    console.debug('[useProduct] iniciando fetch', { produtoId: id })
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/produtos/${id}`)
      if (!response.ok) {
        console.error('[useProduct] resposta inválida', {
          produtoId: id,
          status: response.status,
          statusText: response.statusText,
        })
        if (response.status === 404) throw new Error('Produto não encontrado')
        throw new Error('Erro ao carregar produto')
      }
      const data = await response.json()
      setProduto(data)
      setProduct(data)
      console.info('[useProduct] produto carregado', { produtoId: id, nome: data.nome })
    } catch (err) {
      console.error('[useProduct] erro inesperado', {
        produtoId: id,
        error: err instanceof Error ? err.message : err,
      })
      setError(err instanceof Error ? err.message : 'Não foi possível carregar o produto.')
      setProduto(null)
    } finally {
      setLoading(false)
    }
  }, [id, setProduct])

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
    setProduto(null)
    fetchProduto()
  }, [id, cached?.id, fetchProduto])

  return {
    produto,
    loading,
    error,
    refetch: fetchProduto,
  }
}
