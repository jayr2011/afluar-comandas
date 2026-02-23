import { MetadataRoute } from 'next'
import logger from '@/lib/logger'
import { getSupabaseAdmin } from '@/lib/supabase'

interface SitemapProduto {
  id: string
  created_at: string | null
}

interface SitemapPost {
  slug: string
  updated_at: string | null
}

function normalizeError(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  if (typeof err === 'object' && err !== null) {
    const errorWithMessage = err as { message?: unknown }
    if (typeof errorWithMessage.message === 'string') return errorWithMessage.message
    try {
      return JSON.stringify(err)
    } catch {
      return String(err)
    }
  }
  return 'erro desconhecido'
}

function isKnownPrerenderFetchError(message: string): boolean {
  return message.includes('During prerendering, fetch() rejects when the prerender is complete')
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://afluar.com.br'
  const db = getSupabaseAdmin()

  const fetchProdutos = async (): Promise<SitemapProduto[]> => {
    try {
      const { data, error } = await db.from('produtos').select('id, created_at')
      if (error) throw error
      return (data ?? []) as SitemapProduto[]
    } catch (error) {
      const message = normalizeError(error)
      if (isKnownPrerenderFetchError(message)) return []
      logger.warn('[sitemap] falha ao buscar produtos para o sitemap', {
        error: message,
      })
      return []
    }
  }

  const fetchPosts = async (): Promise<SitemapPost[]> => {
    try {
      const { data, error } = await db
        .from('posts')
        .select('slug, updated_at')
        .eq('status', 'published')
      if (error) throw error
      return (data ?? []) as SitemapPost[]
    } catch (error) {
      const message = normalizeError(error)
      if (isKnownPrerenderFetchError(message)) return []
      logger.warn('[sitemap] falha ao buscar posts para o sitemap', {
        error: message,
      })
      return []
    }
  }

  const [produtos, posts] = await Promise.all([fetchProdutos(), fetchPosts()])

  const productUrls = produtos.map(produto => ({
    url: `${baseUrl}/cardapio/${produto.id}`,
    lastModified: produto.created_at ? new Date(produto.created_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const postUrls = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  const routes = ['', '/cardapio', '/contato', '/eventos', '/experiencia'].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return [...routes, ...productUrls, ...postUrls]
}
