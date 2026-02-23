import { notFound } from 'next/navigation'
import { isFeatureEnabled } from '@/lib/feature-toggles'

interface CheckoutLayoutProps {
  children: React.ReactNode
}

export default async function CheckoutLayout({ children }: CheckoutLayoutProps) {
  const enabled = await isFeatureEnabled('checkout_enabled')

  if (!enabled) {
    notFound()
  }

  return <>{children}</>
}
