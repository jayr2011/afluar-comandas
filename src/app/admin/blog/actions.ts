'use server'

import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { BlogService } from '@/services/blogService'
import { getSupabaseAdmin } from '@/lib/supabase'
import { requireAuthenticatedUser } from '@/lib/supabase-server'
import type { Category, Post, Tag } from '@/types/blog'
import logger from '@/lib/logger'

const LOG_PREFIX = '[admin:blog]'
const blogService = new BlogService()

const postSchema = z.object({
  title: z.string().trim().min(3, 'Título deve ter pelo menos 3 caracteres').max(255),
  slug: z.string().trim().max(255).optional(),
  content: z.string().trim().min(20, 'Conteúdo deve ter pelo menos 20 caracteres'),
  excerpt: z.string().trim().max(500).optional(),
  cover_image: z.string().trim().url('URL da capa inválida').optional().or(z.literal('')),
  status: z.enum(['draft', 'scheduled', 'published']),
  scheduled_at: z.string().trim().optional(),
  category_ids: z.array(z.string().uuid()).optional(),
  tag_ids: z.array(z.string().uuid()).optional(),
})

const categorySchema = z.object({
  name: z.string().trim().min(2, 'Nome da categoria deve ter ao menos 2 caracteres').max(100),
  description: z.string().trim().max(300).optional(),
  color: z
    .string()
    .trim()
    .regex(/^#([A-Fa-f0-9]{6})$/, 'Cor deve estar no formato #RRGGBB')
    .optional()
    .or(z.literal('')),
})

const moderateCommentSchema = z.object({
  commentId: z.string().uuid(),
  status: z.enum(['approved', 'spam', 'deleted']),
})

type AdminCommentRow = {
  id: string
  post_id: string
  author_name: string
  author_email: string
  content: string
  status: 'pending' | 'approved' | 'spam' | 'deleted'
  created_at: string
  posts: { title: string; slug: string } | { title: string; slug: string }[] | null
}

function toFriendlyErrorMessage(error: unknown, fallback: string) {
  if (error instanceof z.ZodError) {
    return error.issues.map(issue => issue.message).join('. ')
  }

  if (error instanceof Error) {
    return error.message || fallback
  }

  if (error && typeof error === 'object') {
    const raw = error as { message?: string; details?: string; code?: string }

    if (raw.code === '23505') {
      return 'Já existe um registro com esses dados. Verifique slug, nome ou identificadores únicos.'
    }

    const composed = [raw.message, raw.details].filter(Boolean).join(' - ')
    if (composed) return composed
  }

  return fallback
}

function parsePostForm(formData: FormData) {
  const scheduledRaw = formData.get('scheduled_at')?.toString().trim() || undefined

  return postSchema.parse({
    title: formData.get('title')?.toString(),
    slug: formData.get('slug')?.toString() || undefined,
    content: formData.get('content')?.toString(),
    excerpt: formData.get('excerpt')?.toString() || undefined,
    cover_image: formData.get('cover_image')?.toString() || undefined,
    status: formData.get('status')?.toString(),
    scheduled_at: scheduledRaw,
    category_ids: formData
      .getAll('category_ids')
      .map(value => value.toString())
      .filter(Boolean),
    tag_ids: formData
      .getAll('tag_ids')
      .map(value => value.toString())
      .filter(Boolean),
  })
}

function normalizeScheduledAt(input?: string) {
  if (!input) return undefined
  const asDate = new Date(input)
  return Number.isNaN(asDate.getTime()) ? undefined : asDate.toISOString()
}

export async function getAdminBlogFormData(): Promise<{
  categories: Category[]
  tags: Tag[]
}> {
  await requireAuthenticatedUser()
  const [categories, tags] = await Promise.all([
    blogService.getAllCategories(),
    blogService.getAllTags(),
  ])
  return { categories, tags }
}

export async function getAdminPosts(): Promise<Post[]> {
  await requireAuthenticatedUser()

  const { data, error } = await getSupabaseAdmin()
    .from('posts')
    .select(
      'id, title, slug, content, excerpt, cover_image, author_id, status, published_at, scheduled_at, view_count, created_at, updated_at'
    )
    .order('created_at', { ascending: false })

  if (error) {
    logger.error(`${LOG_PREFIX} erro ao listar posts`, { error: error.message })
    throw new Error('Não foi possível carregar os posts.')
  }

  return (data ?? []) as Post[]
}

export async function getAdminPostById(id: string): Promise<Post | null> {
  await requireAuthenticatedUser()
  return blogService.getPostById(id)
}

export async function createPostAction(formData: FormData) {
  const user = await requireAuthenticatedUser()

  try {
    const parsed = parsePostForm(formData)

    await blogService.createPost(
      {
        title: parsed.title,
        slug: parsed.slug,
        content: parsed.content,
        excerpt: parsed.excerpt,
        cover_image: parsed.cover_image || undefined,
        status: parsed.status,
        scheduled_at: normalizeScheduledAt(parsed.scheduled_at),
        category_ids: parsed.category_ids,
        tag_ids: parsed.tag_ids,
      },
      user.id
    )

    revalidateTag('blog-posts', {})
    revalidateTag('blog-categories', {})
    revalidateTag('blog-tags', {})
  } catch (error) {
    logger.error(`${LOG_PREFIX} erro ao criar post`, {
      userId: user.id,
      error: error instanceof Error ? error.message : String(error),
    })
    throw new Error(toFriendlyErrorMessage(error, 'Não foi possível criar o post.'))
  }

  redirect('/admin/blog')
}

export async function updatePostAction(postId: string, formData: FormData) {
  const user = await requireAuthenticatedUser()

  try {
    const parsed = parsePostForm(formData)

    await blogService.updatePost({
      id: postId,
      title: parsed.title,
      slug: parsed.slug,
      content: parsed.content,
      excerpt: parsed.excerpt,
      cover_image: parsed.cover_image || undefined,
      status: parsed.status,
      scheduled_at: normalizeScheduledAt(parsed.scheduled_at),
      category_ids: parsed.category_ids,
      tag_ids: parsed.tag_ids,
    })

    revalidateTag('blog-posts', {})
    revalidateTag('blog-categories', {})
    revalidateTag('blog-tags', {})
  } catch (error) {
    logger.error(`${LOG_PREFIX} erro ao atualizar post`, {
      userId: user.id,
      postId,
      error: error instanceof Error ? error.message : String(error),
    })
    throw new Error(toFriendlyErrorMessage(error, 'Não foi possível atualizar o post.'))
  }

  redirect('/admin/blog')
}

export async function deletePostAction(postId: string) {
  const user = await requireAuthenticatedUser()

  try {
    await blogService.deletePost(postId)
    revalidateTag('blog-posts', {})
  } catch (error) {
    logger.error(`${LOG_PREFIX} erro ao deletar post`, {
      userId: user.id,
      postId,
      error: error instanceof Error ? error.message : String(error),
    })
    throw new Error(toFriendlyErrorMessage(error, 'Não foi possível excluir o post.'))
  }

  redirect('/admin/blog')
}

export async function getAdminCategories(): Promise<Category[]> {
  await requireAuthenticatedUser()
  return blogService.getAllCategories()
}

export async function createCategoryAction(formData: FormData) {
  const user = await requireAuthenticatedUser()

  try {
    const parsed = categorySchema.parse({
      name: formData.get('name')?.toString(),
      description: formData.get('description')?.toString() || undefined,
      color: formData.get('color')?.toString() || undefined,
    })

    await blogService.createCategory({
      name: parsed.name,
      description: parsed.description,
      color: parsed.color || undefined,
    })

    revalidateTag('blog-categories', {})
  } catch (error) {
    logger.error(`${LOG_PREFIX} erro ao criar categoria`, {
      userId: user.id,
      error: error instanceof Error ? error.message : String(error),
    })
    throw new Error(toFriendlyErrorMessage(error, 'Não foi possível criar a categoria.'))
  }

  redirect('/admin/blog/categorias')
}

export async function deleteCategoryAction(categoryId: string) {
  const user = await requireAuthenticatedUser()

  try {
    await blogService.deleteCategory(categoryId)
    revalidateTag('blog-categories', {})
    revalidateTag('blog-posts', {})
  } catch (error) {
    logger.error(`${LOG_PREFIX} erro ao deletar categoria`, {
      userId: user.id,
      categoryId,
      error: error instanceof Error ? error.message : String(error),
    })
    throw new Error(toFriendlyErrorMessage(error, 'Não foi possível excluir a categoria.'))
  }

  redirect('/admin/blog/categorias')
}

export async function getAdminComments(): Promise<AdminCommentRow[]> {
  await requireAuthenticatedUser()

  const { data, error } = await getSupabaseAdmin()
    .from('comments')
    .select(
      'id, post_id, author_name, author_email, content, status, created_at, posts(title, slug)'
    )
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) {
    logger.error(`${LOG_PREFIX} erro ao listar comentários`, { error: error.message })
    throw new Error('Não foi possível carregar os comentários.')
  }

  return (data ?? []) as AdminCommentRow[]
}

export async function moderateCommentAction(
  commentId: string,
  status: 'approved' | 'spam' | 'deleted'
) {
  const user = await requireAuthenticatedUser()

  try {
    const parsed = moderateCommentSchema.parse({ commentId, status })
    await blogService.moderateComment(parsed.commentId, parsed.status)
    revalidateTag('blog-posts', {})
  } catch (error) {
    logger.error(`${LOG_PREFIX} erro ao moderar comentário`, {
      userId: user.id,
      commentId,
      status,
      error: error instanceof Error ? error.message : String(error),
    })
    throw new Error(toFriendlyErrorMessage(error, 'Não foi possível moderar o comentário.'))
  }

  redirect('/admin/blog/comentarios')
}
