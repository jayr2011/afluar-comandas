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
      script-src 'self' 'unsafe-eval' 'unsafe-inline' 'wasm-unsafe-eval' 'inline-speculation-rules' https://va.vercel-scripts.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https://${supabaseHost} https://picsum.photos;
      font-src 'self' data:;
      object-src 'none';
      base-uri 'self';
      form-action 'self' mailto:;
      navigate-to 'self' mailto: https:;
      connect-src 'self' https://${supabaseHost} wss://${supabaseHost} https://*.supabase.co wss://*.supabase.co https://viacep.com.br https://vitals.vercel-insights.com;
      frame-src 'self';
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
      {
        protocol: 'https',
        hostname: '*seusite.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
