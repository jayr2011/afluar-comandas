import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { deletePostAction, getAdminPosts } from './actions'

const statusLabel: Record<string, string> = {
  draft: 'Rascunho',
  scheduled: 'Agendado',
  published: 'Publicado',
  archived: 'Arquivado',
}

export default async function AdminBlogPage() {
  const posts = await getAdminPosts()

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Posts do Blog</CardTitle>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/admin/blog/categorias">Categorias</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/blog/comentarios">Comentários</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/blog/novo">
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo post
              </Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {posts.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum post criado ainda.</p>
          ) : (
            posts.map(post => {
              const deleteAction = deletePostAction.bind(null, post.id)

              return (
                <div
                  key={post.id}
                  className="rounded-lg border p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold">{post.title}</p>
                    <p className="text-xs text-muted-foreground">/{post.slug}</p>
                    <div className="mt-2">
                      <Badge variant="secondary">{statusLabel[post.status] ?? post.status}</Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/blog/${post.slug}`} target="_blank">
                        Ver
                      </Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href={`/admin/blog/${post.id}/edit`}>Editar</Link>
                    </Button>
                    <form action={deleteAction}>
                      <Button type="submit" size="sm" variant="destructive">
                        Excluir
                      </Button>
                    </form>
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}
