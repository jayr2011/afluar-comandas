'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import { ErrorState } from '@/components/feedback/error-state/ErrorState'
import { Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin() {
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    setLoading(false)
    router.push('/admin/painel')
  }

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
