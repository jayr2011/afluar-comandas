import { AdminBackButton } from './AdminBackButton'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <>
      <AdminBackButton />
      {children}
    </>
  )
}
