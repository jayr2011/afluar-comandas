import { MetadataRoute } from 'next'
import { ProdutosService } from '@/services/productsService'
import { BlogService } from '@/services/blogService'
import logger from '@/lib/logger'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://afluar.com.br'
  const productsService = new ProdutosService()
  const blogService = new BlogService()

  const [produtosResult, postsResult] = await Promise.allSettled([
    productsService.findAll(),
    blogService.getAllPublishedPosts(),
  ])

  const produtos = produtosResult.status === 'fulfilled' ? produtosResult.value : []
  const posts = postsResult.status === 'fulfilled' ? postsResult.value : []

  if (produtosResult.status === 'rejected') {
    logger.warn('[sitemap] falha ao buscar produtos para o sitemap', {
      error:
        produtosResult.reason instanceof Error
          ? produtosResult.reason.message
          : String(produtosResult.reason),
    })
  }

  if (postsResult.status === 'rejected') {
    logger.warn('[sitemap] falha ao buscar posts para o sitemap', {
      error:
        postsResult.reason instanceof Error
          ? postsResult.reason.message
          : String(postsResult.reason),
    })
  }

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
