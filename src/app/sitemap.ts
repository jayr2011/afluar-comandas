import { MetadataRoute } from 'next'
import { ProdutosService } from '@/services/productsService'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://afluar.com.br'
  const productsService = new ProdutosService()

  const produtos = await productsService.findAll()

  const productUrls = produtos.map(produto => ({
    url: `${baseUrl}/cardapio/${produto.id}`,
    lastModified: produto.created_at ? new Date(produto.created_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const routes = ['', '/cardapio', '/contato', '/eventos', '/experiencia'].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return [...routes, ...productUrls]
}
