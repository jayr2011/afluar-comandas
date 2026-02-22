import { PostCard } from '@/components/blog/PostCard'
import type { Post } from '@/types/blog'

interface RelatedPostsProps {
  currentPostId: string
  posts: Post[]
}

export function RelatedPosts({ currentPostId, posts }: RelatedPostsProps) {
  const relatedPosts = posts.filter(post => post.id !== currentPostId).slice(0, 3)

  if (relatedPosts.length === 0) {
    return null
  }

  return (
    <section className="mt-14 border-t pt-10">
      <h2 className="mb-6 text-2xl font-bold">Posts relacionados</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}
