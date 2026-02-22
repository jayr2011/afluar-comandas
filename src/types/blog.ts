export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  cover_image?: string
  author_id: string
  status: 'draft' | 'scheduled' | 'published' | 'archived'
  published_at?: string
  scheduled_at?: string
  view_count: number
  created_at: string
  updated_at: string
  categories?: Category[]
  tags?: Tag[]
  author?: {
    id: string
    nome: string
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  created_at: string
  post_count?: number
}

export interface Tag {
  id: string
  name: string
  slug: string
  created_at: string
  post_count?: number
}

export interface Comment {
  id: string
  post_id: string
  parent_id?: string
  author_name: string
  author_email: string
  content: string
  status: 'pending' | 'approved' | 'spam' | 'deleted'
  created_at: string
  replies?: Comment[]
}

export interface CreatePostInput {
  title: string
  slug?: string
  content: string
  excerpt?: string
  cover_image?: string
  category_ids?: string[]
  tag_ids?: string[]
  status?: 'draft' | 'scheduled' | 'published'
  scheduled_at?: string
}

export interface UpdatePostInput extends Partial<CreatePostInput> {
  id: string
}

export interface BlogSearchParams {
  page?: number
  limit?: number
  category?: string
  tag?: string
  search?: string
}

export interface PaginatedPosts {
  posts: Post[]
  total: number
  page: number
  limit: number
  totalPages: number
}
