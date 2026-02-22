import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Post } from '@/types/blog'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const formattedDate = post.published_at
    ? format(new Date(post.published_at), 'd MMM', { locale: ptBR })
    : null

  return (
    <Card className="gap-0 overflow-hidden py-0 transition-shadow hover:shadow-lg">
      {post.cover_image && (
        <Link href={`/blog/${post.slug}`}>
          <div className="relative w-full h-48 bg-muted">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>
      )}

      <CardHeader className="p-4 pb-0">
        <div className="mb-2 flex gap-2">
          {post.categories?.slice(0, 2).map(cat => (
            <Badge key={cat.id} variant="secondary" className="text-xs">
              {cat.name}
            </Badge>
          ))}
        </div>

        <Link href={`/blog/${post.slug}`}>
          <CardTitle className="mb-2 line-clamp-2 text-xl transition-colors hover:text-primary">
            {post.title}
          </CardTitle>
        </Link>
      </CardHeader>

      <CardContent className="p-4 pt-3">
        {post.excerpt && (
          <CardDescription className="mb-3 line-clamp-3 text-sm">{post.excerpt}</CardDescription>
        )}
      </CardContent>

      <CardFooter className="gap-2 p-4 pt-0 text-xs text-muted-foreground">
        {formattedDate && (
          <>
            <time dateTime={post.published_at ?? undefined}>{formattedDate}</time>
            <Separator orientation="vertical" className="h-3" />
          </>
        )}
        <div className="flex items-center gap-2">
          <span>{post.view_count} visualizações</span>
        </div>
      </CardFooter>
    </Card>
  )
}
