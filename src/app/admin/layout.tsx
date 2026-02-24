import { redirect } from 'next/navigation'
import { requireAuthenticatedUser } from '@/lib/supabase-server'
import { AdminBackButton } from './AdminBackButton'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  try {
    await requireAuthenticatedUser()
  } catch {
    redirect('/admin')
  }

  return (
    <>
      <AdminBackButton />
      {children}
    </>
  )
}
