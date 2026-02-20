import { revalidateTag } from 'next/cache'
import { type NextRequest } from 'next/server'
import { getUserFromRequest } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  if (!(await getUserFromRequest(request))) {
    return Response.json({ error: 'Não autorizado' }, { status: 401 })
  }

  revalidateTag('produtos', {})
  return Response.json({ revalidated: true })
}
