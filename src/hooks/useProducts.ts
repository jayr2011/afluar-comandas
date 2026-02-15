'use client'

import { useState, useEffect } from 'react'
import { Produto } from '@/types/produtos'

/**
 * Opções para o hook `useProdutos`.
 * - `categoria`: filtra os produtos por categoria.
 * - `destaque`: quando true, busca apenas produtos em destaque.
 */
interface UseProdutosOptions {
  categoria?: string
  destaque?: boolean
}

/**
 * Forma do objeto retornado pelo hook `useProdutos`.
 * - `produtos`: array de produtos carregados.
 * - `loading`: indicador de carregamento.
 * - `error`: mensagem de erro ou `null`.
 * - `refetch`: função para recarregar manualmente os produtos.
 */
interface UseProdutosReturn {
  produtos: Produto[]
  loading: boolean
  error: string | null
  refetch: () => void
}

/**
 * Hook para buscar produtos da API `/api/produtos` com suporte a filtros.
 *
 * Usage:
 * const { produtos, loading, error, refetch } = useProdutos({ categoria: 'Sobremesas' })
 *
 * O hook realiza a requisição automaticamente quando `options.categoria` ou
 * `options.destaque` mudam.
 *
 * @param {UseProdutosOptions} options - Filtros opcionais para a busca.
 * @returns {UseProdutosReturn} Estado e utilitários para consumo em componentes.
 */
export function useProdutos(options: UseProdutosOptions = {}): UseProdutosReturn {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProdutos = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (options.categoria) params.append('categoria', options.categoria)
      if (options.destaque) params.append('destaque', 'true')

      const url = `/api/produtos${params.toString() ? `?${params.toString()}` : ''}`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Erro ao carregar produtos')
      }
      
      const data = await response.json()
      setProdutos(data)
    } catch (err) {
      console.error('Erro ao carregar produtos:', err)
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
    refetch: fetchProdutos
  }
}
