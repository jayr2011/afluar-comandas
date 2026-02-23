'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import { ErrorState } from '@/components/feedback/error-state/ErrorState'
import { Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase-browser'

export default function AdminPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data: { user } }: { data: { user: unknown } }) => {
      if (user) {
        router.replace('/admin/painel')
        return
      }
      setCheckingSession(false)
    })
  }, [router])

  async function handleLogin() {
    setLoading(true)
    setError('')

    const { error } = await supabaseBrowser.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    setLoading(false)
    router.replace('/admin/painel')
  }

  if (checkingSession) return null

  return (
    <Field className="max-w-md mx-auto p-5">
      <FieldContent>
        <FieldLabel>Email</FieldLabel>
        <Input
          alt="Email"
          placeholder="Email"
          type="email"
          onChange={e => setEmail(e.target.value)}
        />
      </FieldContent>
      <FieldContent>
        <FieldLabel>Senha</FieldLabel>
        <Input
          alt="Senha"
          placeholder="Senha"
          type="password"
          onChange={e => setPassword(e.target.value)}
        />
      </FieldContent>
      <Button onClick={handleLogin} disabled={loading} className="w-full">
        {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Entrar'}
      </Button>
      {error && <ErrorState title={error} />}
    </Field>
  )
}
