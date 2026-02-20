import type { NextConfig } from 'next'

function getSupabaseHostname(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL não está definida no arquivo .env')
  }
  try {
    return new URL(url).hostname
  } catch {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL inválida no arquivo .env')
  }
}

const nextConfig: NextConfig = {
  serverExternalPackages: ['winston'],
  async headers() {
    const supabaseHost = getSupabaseHostname()
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://sdk.mercadopago.com https://http2.mlstatic.com 'wasm-unsafe-eval' 'inline-speculation-rules';
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https://${supabaseHost} https://picsum.photos https://*.mlstatic.com https://*.mercadolivre.com https://*.mercadolibre.com;
      font-src 'self' data:;
      object-src 'none';
      base-uri 'self';
      connect-src 'self' https://${supabaseHost} wss://${supabaseHost} https://*.supabase.co wss://*.supabase.co https://*.mercadopago.com https://*.mercadolivre.com https://*.mercadolibre.com https://http2.mlstatic.com https://viacep.com.br;
      frame-src 'self' https://*.mercadopago.com https://*.mercadopago.com.br https://*.mercadolivre.com https://*.mercadolibre.com;
    `
      .replace(/\s{2,}/g, ' ')
      .trim()

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },

  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: getSupabaseHostname(),
        pathname: '/storage/v1/object/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
