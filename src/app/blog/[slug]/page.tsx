import { getCachedPostBySlug, getCachedPosts } from '@/services/blogService'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { CommentSection } from '@/components/blog/CommentSection'
import { ShareButtons } from '@/components/blog/ShareButton'
import { RelatedPosts } from '@/components/blog/RelatedPosts'
import { PostViewTracker } from '@/components/blog/PostViewTracker'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getCachedPostBySlug(slug)

  if (!post) return {}

  return {
    title: `${post.title} - Blog Afluar`,
    description: post.excerpt || post.content.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.slice(0, 160),
      images: post.cover_image ? [{ url: post.cover_image }] : [],
      type: 'article',
      publishedTime: post.published_at,
      authors: [post.author?.nome || 'Afluar'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.content.slice(0, 160),
      images: post.cover_image ? [post.cover_image] : [],
    },
  }
}

function BlogPostPageFallback() {
  return (
    <article className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 h-6 w-36 rounded bg-muted" />
      <div className="mb-6 h-12 w-11/12 rounded bg-muted" />
      <div className="mb-8 h-88 w-full rounded-xl bg-muted" />
      <div className="space-y-3">
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-10/12 rounded bg-muted" />
        <div className="h-4 w-9/12 rounded bg-muted" />
      </div>
    </article>
  )
}

async function BlogPostPageContent({ params }: PageProps) {
  const { slug } = await params
  const post = await getCachedPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const { posts } = await getCachedPosts({ limit: 3, category: post.categories?.[0]?.slug })

  return (
    <article className="container mx-auto max-w-4xl px-4 py-8">
      <PostViewTracker postId={post.id} />

      <header className="mb-8">
        <div className="flex gap-2 mb-4">
          {post.categories?.map(cat => (
            <Link
              key={cat.id}
              href={`/blog/categoria/${cat.slug}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 text-muted-foreground mb-6">
          <time dateTime={post.published_at}>
            {post.published_at &&
              format(new Date(post.published_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </time>
          <span>•</span>
          <span>{post.view_count} visualizações</span>
        </div>

        {post.cover_image && (
          <div className="relative w-full h-100 mb-8 rounded-xl overflow-hidden">
            <Image src={post.cover_image} alt={post.title} fill className="object-cover" priority />
          </div>
        )}
      </header>

      <div className="prose prose-lg max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {post.tags?.map(tag => (
          <Link
            key={tag.id}
            href={`/blog/tag/${tag.slug}`}
            className="px-3 py-1 bg-secondary rounded-full text-sm hover:bg-secondary/80"
          >
            #{tag.name}
          </Link>
        ))}
      </div>

      <ShareButtons title={post.title} url={`/blog/${post.slug}`} />

      <hr className="my-12" />

      <CommentSection postId={post.id} />

      <RelatedPosts
        currentPostId={post.id}
        posts={posts.filter(p => p.id !== post.id).slice(0, 3)}
      />
    </article>
  )
}

export default function BlogPostPage({ params }: PageProps) {
  return (
    <Suspense fallback={<BlogPostPageFallback />}>
      <BlogPostPageContent params={params} />
    </Suspense>
  )
}
