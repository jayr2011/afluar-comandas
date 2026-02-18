import type { NextConfig } from 'next'

function getSupabaseHostname(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) {
    return 'wstlpvtejgyfkcuucjbt.supabase.co'
  }
  try {
    return new URL(url).hostname
  } catch {
    return 'wstlpvtejgyfkcuucjbt.supabase.co'
  }
}

const nextConfig: NextConfig = {
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
