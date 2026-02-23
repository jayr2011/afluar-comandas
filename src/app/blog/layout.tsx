import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/feature-toggles'

interface BlogLayoutProps {
  children: React.ReactNode
}

export default async function BlogLayout({ children }: BlogLayoutProps) {
  const enabled = await isFeatureEnabled('blog_enabled')

  if (!enabled) {
    notFound()
  }

  return <>{children}</>
}
