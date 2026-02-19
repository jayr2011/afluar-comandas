import { revalidateTag } from 'next/cache'

export async function POST() {
  revalidateTag('produtos', 'layout')
  return Response.json({ revalidated: true })
}
