import { supabase, getSupabaseAdmin } from '@/lib/supabase'
import { cacheTag } from 'next/cache'
import type {
  Post,
  Category,
  Tag,
  Comment,
  CreatePostInput,
  UpdatePostInput,
  BlogSearchParams,
  PaginatedPosts,
} from '@/types/blog'
import logger from '@/lib/logger'

const LOG_PREFIX = '[blog]'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

interface RawPost extends Record<string, unknown> {
  post_categories?: Array<{ categories: Partial<Category>[] | Partial<Category> | null }>
  post_tags?: Array<{ tags: Partial<Tag>[] | Partial<Tag> | null }>
}

function toArray<T>(val: T[] | T | null | undefined): T[] {
  if (!val) return []
  return Array.isArray(val) ? val : [val]
}

function mapPost(raw: RawPost): Post {
  const categories = (raw.post_categories ?? []).flatMap(pc => toArray(pc.categories)) as Category[]

  const tags = (raw.post_tags ?? []).flatMap(pt => toArray(pt.tags)) as Tag[]

  return { ...(raw as unknown as Post), categories, tags }
}

const POST_SELECT = `
  *,
  post_categories(categories(id, name, slug, color)),
  post_tags(tags(id, name, slug))
` as const

export async function getCachedPosts(options: BlogSearchParams = {}): Promise<PaginatedPosts> {
  'use cache'
  cacheTag('blog-posts')

  const { page = 1, limit = 10, category, tag, search } = options
  const offset = (page - 1) * limit

  logger.debug(`${LOG_PREFIX} getCachedPosts`, { page, limit, category, tag, search })

  let filteredPostIds: string[] | undefined

  if (category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single()

    if (!cat) {
      logger.debug(`${LOG_PREFIX} getCachedPosts - categoria não encontrada`, { category })
      return { posts: [], total: 0, page, limit, totalPages: 0 }
    }

    const { data: rows } = await supabase
      .from('post_categories')
      .select('post_id')
      .eq('category_id', cat.id)

    filteredPostIds = rows?.map(r => r.post_id) ?? []
  }

  if (tag) {
    const { data: t } = await supabase.from('tags').select('id').eq('slug', tag).single()

    if (!t) {
      logger.debug(`${LOG_PREFIX} getCachedPosts - tag não encontrada`, { tag })
      return { posts: [], total: 0, page, limit, totalPages: 0 }
    }

    const { data: rows } = await supabase.from('post_tags').select('post_id').eq('tag_id', t.id)

    const tagPostIds = rows?.map(r => r.post_id) ?? []
    filteredPostIds =
      filteredPostIds !== undefined
        ? filteredPostIds.filter(id => tagPostIds.includes(id))
        : tagPostIds
  }

  if (filteredPostIds !== undefined && filteredPostIds.length === 0) {
    return { posts: [], total: 0, page, limit, totalPages: 0 }
  }

  let query = supabase
    .from('posts')
    .select(POST_SELECT, { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (filteredPostIds !== undefined) {
    query = query.in('id', filteredPostIds)
  }

  if (search) {
    const term = search.trim().slice(0, 100)
    query = query.or(`title.ilike.%${term}%,excerpt.ilike.%${term}%`)
  }

  const { data, error, count } = await query

  if (error) {
    logger.error(`${LOG_PREFIX} getCachedPosts - erro`, { error: error.message })
    throw error
  }

  const posts = (data ?? []).map(mapPost)
  const total = count ?? 0

  logger.debug(`${LOG_PREFIX} getCachedPosts - finalizado`, { count: posts.length, total })
  return { posts, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function getCachedPostBySlug(slug: string): Promise<Post | null> {
  'use cache'
  cacheTag('blog-posts', slug)

  logger.debug(`${LOG_PREFIX} getCachedPostBySlug`, { slug })

  const { data, error } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      logger.info(`${LOG_PREFIX} getCachedPostBySlug - post não encontrado`, { slug })
      return null
    }
    logger.error(`${LOG_PREFIX} getCachedPostBySlug - erro`, { slug, error: error.message })
    throw error
  }

  logger.debug(`${LOG_PREFIX} getCachedPostBySlug - encontrado`, { slug, id: data.id })
  return mapPost(data)
}

export async function searchPosts(query: string, limit = 10): Promise<Post[]> {
  'use cache'
  cacheTag('blog-posts', `search:${query}`)

  const term = query.trim().slice(0, 100)
  logger.debug(`${LOG_PREFIX} searchPosts`, { term, limit })

  const { data, error } = await supabase
    .from('posts')
    .select(
      `id, title, slug, excerpt, cover_image, published_at, view_count,
       post_categories(categories(id, name, slug, color)),
       post_tags(tags(id, name, slug))`
    )
    .eq('status', 'published')
    .or(`title.ilike.%${term}%,excerpt.ilike.%${term}%`)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    logger.error(`${LOG_PREFIX} searchPosts - erro`, { error: error.message })
    throw error
  }

  const posts = (data ?? []).map(mapPost)
  logger.debug(`${LOG_PREFIX} searchPosts - finalizado`, { count: posts.length })
  return posts
}

export async function getCachedCategories(): Promise<Category[]> {
  'use cache'
  cacheTag('blog-categories')

  logger.debug(`${LOG_PREFIX} getCachedCategories`)

  const { data, error } = await supabase.from('categories').select('*').order('name')

  if (error) {
    logger.error(`${LOG_PREFIX} getCachedCategories - erro`, { error: error.message })
    throw error
  }

  logger.debug(`${LOG_PREFIX} getCachedCategories - finalizado`, { count: data?.length ?? 0 })
  return data ?? []
}

export async function getCachedTags(): Promise<Tag[]> {
  'use cache'
  cacheTag('blog-tags')

  logger.debug(`${LOG_PREFIX} getCachedTags`)

  const { data, error } = await supabase.from('tags').select('*').order('name')

  if (error) {
    logger.error(`${LOG_PREFIX} getCachedTags - erro`, { error: error.message })
    throw error
  }

  logger.debug(`${LOG_PREFIX} getCachedTags - finalizado`, { count: data?.length ?? 0 })
  return data ?? []
}

export class BlogService {
  private get db() {
    return getSupabaseAdmin()
  }

  async getPostById(id: string): Promise<Post | null> {
    logger.debug(`${LOG_PREFIX} getPostById`, { id })

    const { data, error } = await this.db.from('posts').select(POST_SELECT).eq('id', id).single()

    if (error) {
      if (error.code === 'PGRST116') return null
      logger.error(`${LOG_PREFIX} getPostById - erro`, { id, error: error.message })
      throw error
    }

    return mapPost(data)
  }

  async getAllPublishedPosts(): Promise<
    Pick<Post, 'id' | 'title' | 'slug' | 'published_at' | 'updated_at'>[]
  > {
    logger.debug(`${LOG_PREFIX} getAllPublishedPosts`)

    const { data, error } = await supabase
      .from('posts')
      .select('id, title, slug, published_at, updated_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (error) {
      logger.error(`${LOG_PREFIX} getAllPublishedPosts - erro`, { error: error.message })
      throw error
    }

    logger.info(`${LOG_PREFIX} getAllPublishedPosts - finalizado`, { count: data?.length ?? 0 })
    return data ?? []
  }

  async getAllCategories(): Promise<Category[]> {
    logger.debug(`${LOG_PREFIX} getAllCategories`)

    const { data, error } = await supabase.from('categories').select('*').order('name')

    if (error) {
      logger.error(`${LOG_PREFIX} getAllCategories - erro`, { error: error.message })
      throw error
    }

    logger.debug(`${LOG_PREFIX} getAllCategories - finalizado`, { count: data?.length ?? 0 })
    return data ?? []
  }

  async getAllTags(): Promise<Tag[]> {
    logger.debug(`${LOG_PREFIX} getAllTags`)

    const { data, error } = await supabase.from('tags').select('*').order('name')

    if (error) {
      logger.error(`${LOG_PREFIX} getAllTags - erro`, { error: error.message })
      throw error
    }

    logger.debug(`${LOG_PREFIX} getAllTags - finalizado`, { count: data?.length ?? 0 })
    return data ?? []
  }

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    logger.debug(`${LOG_PREFIX} getCommentsByPostId`, { postId })

    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .eq('status', 'approved')
      .order('created_at', { ascending: true })

    if (error) {
      logger.error(`${LOG_PREFIX} getCommentsByPostId - erro`, { postId, error: error.message })
      throw error
    }

    logger.debug(`${LOG_PREFIX} getCommentsByPostId - finalizado`, {
      postId,
      count: data?.length ?? 0,
    })
    return data ?? []
  }

  async createPost(input: CreatePostInput, authorId: string): Promise<Post> {
    const slug = input.slug || generateSlug(input.title)
    logger.debug(`${LOG_PREFIX} createPost`, { title: input.title, slug, authorId })

    const { data, error } = await this.db
      .from('posts')
      .insert({
        title: input.title,
        slug,
        content: input.content,
        excerpt: input.excerpt ?? null,
        cover_image: input.cover_image ?? null,
        author_id: authorId,
        status: input.status ?? 'draft',
        scheduled_at: input.scheduled_at ?? null,
        published_at: input.status === 'published' ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (error) {
      logger.error(`${LOG_PREFIX} createPost - erro`, { slug, error: error.message })
      throw error
    }

    await this.syncRelations(data.id, input.category_ids, input.tag_ids)

    logger.info(`${LOG_PREFIX} createPost - post criado`, { postId: data.id, slug })
    return (await this.getPostById(data.id)) ?? mapPost(data)
  }

  async updatePost(input: UpdatePostInput): Promise<Post> {
    logger.debug(`${LOG_PREFIX} updatePost`, { postId: input.id })

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }

    if (input.title !== undefined) updates.title = input.title
    if (input.slug !== undefined) updates.slug = input.slug
    if (input.content !== undefined) updates.content = input.content
    if (input.excerpt !== undefined) updates.excerpt = input.excerpt
    if (input.cover_image !== undefined) updates.cover_image = input.cover_image
    if (input.status !== undefined) updates.status = input.status
    if (input.scheduled_at !== undefined) updates.scheduled_at = input.scheduled_at

    const { data, error } = await this.db
      .from('posts')
      .update(updates)
      .eq('id', input.id)
      .select()
      .single()

    if (error) {
      logger.error(`${LOG_PREFIX} updatePost - erro`, { postId: input.id, error: error.message })
      throw error
    }

    await this.syncRelations(input.id, input.category_ids, input.tag_ids)

    logger.info(`${LOG_PREFIX} updatePost - post atualizado`, { postId: input.id })
    return (await this.getPostById(input.id)) ?? mapPost(data)
  }

  async publishPost(id: string): Promise<Post> {
    logger.debug(`${LOG_PREFIX} publishPost`, { postId: id })

    const { data, error } = await this.db
      .from('posts')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      logger.error(`${LOG_PREFIX} publishPost - erro`, { postId: id, error: error.message })
      throw error
    }

    logger.info(`${LOG_PREFIX} publishPost - post publicado`, { postId: id })
    return mapPost(data)
  }

  async schedulePost(id: string, scheduledAt: string): Promise<Post> {
    logger.debug(`${LOG_PREFIX} schedulePost`, { postId: id, scheduledAt })

    const { data, error } = await this.db
      .from('posts')
      .update({
        status: 'scheduled',
        scheduled_at: scheduledAt,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      logger.error(`${LOG_PREFIX} schedulePost - erro`, { postId: id, error: error.message })
      throw error
    }

    logger.info(`${LOG_PREFIX} schedulePost - post agendado`, { postId: id, scheduledAt })
    return mapPost(data)
  }

  async deletePost(id: string): Promise<void> {
    logger.debug(`${LOG_PREFIX} deletePost`, { postId: id })

    const { error } = await this.db.from('posts').delete().eq('id', id)

    if (error) {
      logger.error(`${LOG_PREFIX} deletePost - erro`, { postId: id, error: error.message })
      throw error
    }

    logger.info(`${LOG_PREFIX} deletePost - post deletado`, { postId: id })
  }

  async createCategory(input: {
    name: string
    description?: string
    color?: string
  }): Promise<Category> {
    const slug = generateSlug(input.name)
    logger.debug(`${LOG_PREFIX} createCategory`, { name: input.name, slug })

    const { data, error } = await this.db
      .from('categories')
      .insert({ name: input.name, slug, description: input.description, color: input.color })
      .select()
      .single()

    if (error) {
      logger.error(`${LOG_PREFIX} createCategory - erro`, { slug, error: error.message })
      throw error
    }

    logger.info(`${LOG_PREFIX} createCategory - criada`, { categoryId: data.id, slug })
    return data
  }

  async deleteCategory(id: string): Promise<void> {
    logger.debug(`${LOG_PREFIX} deleteCategory`, { categoryId: id })

    const { error } = await this.db.from('categories').delete().eq('id', id)

    if (error) {
      logger.error(`${LOG_PREFIX} deleteCategory - erro`, { categoryId: id, error: error.message })
      throw error
    }

    logger.info(`${LOG_PREFIX} deleteCategory - deletada`, { categoryId: id })
  }

  async createTag(name: string): Promise<Tag> {
    const slug = generateSlug(name)
    logger.debug(`${LOG_PREFIX} createTag`, { name, slug })

    const { data, error } = await this.db.from('tags').insert({ name, slug }).select().single()

    if (error) {
      logger.error(`${LOG_PREFIX} createTag - erro`, { slug, error: error.message })
      throw error
    }

    logger.info(`${LOG_PREFIX} createTag - criada`, { tagId: data.id, slug })
    return data
  }

  async createComment(
    input: Omit<Comment, 'id' | 'created_at' | 'status' | 'replies'>
  ): Promise<Comment> {
    logger.debug(`${LOG_PREFIX} createComment`, { postId: input.post_id })

    const { data, error } = await supabase
      .from('comments')
      .insert({ ...input, status: 'pending' })
      .select()
      .single()

    if (error) {
      logger.error(`${LOG_PREFIX} createComment - erro`, {
        postId: input.post_id,
        error: error.message,
      })
      throw error
    }

    logger.info(`${LOG_PREFIX} createComment - criado`, { commentId: data.id })
    return data
  }

  async moderateComment(id: string, status: 'approved' | 'spam' | 'deleted'): Promise<Comment> {
    logger.debug(`${LOG_PREFIX} moderateComment`, { commentId: id, status })

    const { data, error } = await this.db
      .from('comments')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      logger.error(`${LOG_PREFIX} moderateComment - erro`, { commentId: id, error: error.message })
      throw error
    }

    logger.info(`${LOG_PREFIX} moderateComment - moderado`, { commentId: id, status })
    return data
  }

  async incrementViewCount(postId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_post_views', { post_id: postId })
    if (error) {
      logger.warn(`${LOG_PREFIX} incrementViewCount - falha não crítica`, {
        postId,
        error: error.message,
      })
    }
  }

  private async syncRelations(
    postId: string,
    categoryIds?: string[],
    tagIds?: string[]
  ): Promise<void> {
    if (categoryIds !== undefined) {
      await this.db.from('post_categories').delete().eq('post_id', postId)
      if (categoryIds.length > 0) {
        const { error } = await this.db
          .from('post_categories')
          .insert(categoryIds.map(category_id => ({ post_id: postId, category_id })))
        if (error) {
          logger.error(`${LOG_PREFIX} syncRelations - erro ao inserir categorias`, {
            postId,
            error: error.message,
          })
          throw error
        }
      }
    }

    if (tagIds !== undefined) {
      await this.db.from('post_tags').delete().eq('post_id', postId)
      if (tagIds.length > 0) {
        const { error } = await this.db
          .from('post_tags')
          .insert(tagIds.map(tag_id => ({ post_id: postId, tag_id })))
        if (error) {
          logger.error(`${LOG_PREFIX} syncRelations - erro ao inserir tags`, {
            postId,
            error: error.message,
          })
          throw error
        }
      }
    }
  }
}
