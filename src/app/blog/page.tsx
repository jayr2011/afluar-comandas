import { getCachedCategories, getCachedPosts, getCachedTags } from '@/services/blogService'
import { PostCard } from '@/components/blog/PostCard'
import { Pagination } from '@/components/blog/Pagination'
import { BlogSearch } from '@/components/blog/BlogSearch'
import { BlogFilters } from '@/components/blog/BlogFilters'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Blog - Afluar',
  description: 'Artigos sobre culinária amazônica, receitas, eventos e muito mais.',
  openGraph: {
    title: 'Blog - Afluar',
    description: 'Artigos sobre culinária amazônica.',
  },
}

interface PageProps {
  searchParams: Promise<{ page?: string; category?: string; tag?: string; search?: string }>
}

function BlogPageFallback() {
  return (
    <div className="space-y-8">
      <div className="h-10 w-full rounded-md bg-muted" />
      <div className="h-28 w-full rounded-lg bg-muted" />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-80 rounded-xl border bg-muted/40" />
        ))}
      </div>
    </div>
  )
}

async function BlogPageContent({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const category = params.category
  const tag = params.tag
  const search = params.search

  const [{ posts, totalPages }, categories, tags] = await Promise.all([
    getCachedPosts({
      page,
      limit: 6,
      category,
      tag,
      search,
    }),
    getCachedCategories(),
    getCachedTags(),
  ])

  return (
    <>
      <BlogSearch />
      <BlogFilters categories={categories} tags={tags} activeCategory={category} activeTag={tag} />

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum post encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          baseUrl="/blog"
          queryParams={{
            category,
            tag,
            search,
          }}
        />
      )}
    </>
  )
}

export default function BlogPage({ searchParams }: PageProps) {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Blog Afluar</h1>
        <p className="text-muted-foreground text-lg">
          Descubra receitas, eventos e cultura amazônica
        </p>
      </header>

      <Suspense fallback={<BlogPageFallback />}>
        <BlogPageContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
