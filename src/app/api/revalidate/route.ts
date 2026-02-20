import { revalidateTag } from 'next/cache'
import { type NextRequest } from 'next/server'
import logger from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tag, secret } = body

    if (secret !== process.env.REVALIDATE_SECRET) {
      logger.error('[revalidate] Tentativa de revalidação com secret inválido')
      return Response.json({ error: 'Não autorizado' }, { status: 401 })
    }

    if (!tag) {
      logger.error('[revalidate] Tag não fornecida na requisição')
      return Response.json({ error: 'Tag é obrigatória' }, { status: 400 })
    }

    logger.info(`[revalidate] Revalidando tag: ${tag}`)
    revalidateTag(tag, {})

    return Response.json({ revalidated: true, now: Date.now() })
  } catch (error) {
    logger.error('[revalidate] Erro ao processar revalidação', {
      error: error instanceof Error ? error.message : error,
    })
    return Response.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
