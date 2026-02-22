'use server'

import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import logger from '@/lib/logger'
import { BlogService } from '@/services/blogService'
import type { Comment } from '@/types/blog'

const LOG_PREFIX = '[blog:actions]'
const blogService = new BlogService()

const createCommentSchema = z.object({
  post_id: z.string().uuid('Post inválido'),
  parent_id: z.string().uuid('Comentário pai inválido').optional(),
  author_name: z
    .string()
    .trim()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(120, 'Nome muito longo'),
  author_email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254, 'Email muito longo')
    .pipe(z.email('Email inválido')),
  content: z
    .string()
    .trim()
    .min(5, 'Comentário deve ter pelo menos 5 caracteres')
    .max(2000, 'Comentário muito longo'),
})

const incrementPostViewSchema = z.object({
  post_id: z.string().uuid('Post inválido'),
})

export type CreateCommentInput = z.input<typeof createCommentSchema>

export async function createComment(input: CreateCommentInput): Promise<Comment> {
  logger.debug(`${LOG_PREFIX} createComment - início`, {
    postId: input.post_id,
    hasParent: !!input.parent_id,
  })

  const parsed = createCommentSchema.safeParse(input)

  if (!parsed.success) {
    const issues = parsed.error.issues.map(issue => issue.message)
    logger.warn(`${LOG_PREFIX} createComment - validação falhou`, {
      postId: input.post_id,
      issues,
    })
    throw new Error(issues.join('. '))
  }

  try {
    const comment = await blogService.createComment(parsed.data)

    revalidateTag('blog-posts', {})

    logger.info(`${LOG_PREFIX} createComment - comentário criado`, {
      commentId: comment.id,
      postId: parsed.data.post_id,
      parentId: parsed.data.parent_id ?? null,
    })

    return comment
  } catch (error) {
    logger.error(`${LOG_PREFIX} createComment - erro`, {
      postId: parsed.data.post_id,
      error: error instanceof Error ? error.message : String(error),
    })
    throw new Error('Não foi possível enviar o comentário. Tente novamente.')
  }
}

export async function incrementPostView(input: { post_id: string }): Promise<void> {
  logger.debug(`${LOG_PREFIX} incrementPostView - início`, { postId: input.post_id })

  const parsed = incrementPostViewSchema.safeParse(input)

  if (!parsed.success) {
    logger.warn(`${LOG_PREFIX} incrementPostView - validação falhou`, {
      issues: parsed.error.issues.map(issue => issue.message),
    })
    return
  }

  try {
    await blogService.incrementViewCount(parsed.data.post_id)
    logger.debug(`${LOG_PREFIX} incrementPostView - view registrada`, {
      postId: parsed.data.post_id,
    })
  } catch (error) {
    logger.warn(`${LOG_PREFIX} incrementPostView - falha não crítica`, {
      postId: parsed.data.post_id,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
