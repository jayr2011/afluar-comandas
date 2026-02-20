import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/checkout', '/carrinho', '/pedido'],
      },
    ],
    sitemap: 'https://afluar.com.br/sitemap.xml',
  }
}
