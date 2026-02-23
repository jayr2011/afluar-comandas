import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { getUserFromRequest } from '@/lib/supabase-server'
import logger from '@/lib/logger'

const LOG_PREFIX = '[admin:blog:upload-image]'
const BLOG_BUCKET = 'afluar-imagens'
const BLOG_FOLDER = 'blog/imagens'
const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 365

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request)

  if (!user) {
    logger.warn(`${LOG_PREFIX} tentativa sem autenticação`)
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Arquivo inválido.' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: 'Tipo de arquivo não permitido. Use JPG, PNG ou WEBP.' },
      { status: 400 }
    )
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'Arquivo excede 5MB.' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'webp'
  const safeName = file.name
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .slice(0, 40)
  const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const filePath = `${BLOG_FOLDER}/${datePrefix}-${randomUUID()}-${safeName}.${ext}`

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const supabaseAdmin = getSupabaseAdmin()
  const { error } = await supabaseAdmin.storage
    .from(BLOG_BUCKET)
    .upload(filePath, buffer, { contentType: file.type, upsert: false })

  if (error) {
    logger.error(`${LOG_PREFIX} erro no upload`, {
      userId: user.id,
      filePath,
      error: error.message,
    })
    return NextResponse.json({ error: 'Falha ao enviar imagem.' }, { status: 500 })
  }

  const { data: signedData, error: signedError } = await supabaseAdmin.storage
    .from(BLOG_BUCKET)
    .createSignedUrl(filePath, SIGNED_URL_TTL_SECONDS)

  if (signedError) {
    logger.warn(`${LOG_PREFIX} falha ao criar signed URL, usando public URL`, {
      userId: user.id,
      filePath,
      error: signedError.message,
    })
  }

  const { data: publicData } = supabaseAdmin.storage.from(BLOG_BUCKET).getPublicUrl(filePath)
  const finalUrl = signedData?.signedUrl || publicData.publicUrl

  logger.info(`${LOG_PREFIX} upload concluído`, { userId: user.id, filePath })
  return NextResponse.json({ url: finalUrl, path: filePath })
}
