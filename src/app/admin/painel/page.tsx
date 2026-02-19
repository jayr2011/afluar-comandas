'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PlusIcon, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase'

export default function Painel() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/admin')
      setChecking(false)
    })
  }, [router, supabase.auth])

  async function handleLogout() {
    setChecking(true)
    await supabaseBrowser.auth.signOut()
    router.push('/admin')
  }

  if (checking) return null

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-4">
        <h1>Painel do admin</h1>
        <Button variant="ghost" aria-label="Sair" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>
      <div className="flex flex-col gap-4 p-4">
        <h2>Produtos</h2>
        <Button aria-label="Adicionar produto">
          <PlusIcon className="w-4 h-4 mr-2" />
          Adicionar produto
        </Button>
      </div>
    </div>
  )
}
