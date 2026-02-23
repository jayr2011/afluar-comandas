import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAdminComments, moderateCommentAction } from '../actions'

const statusLabel: Record<string, string> = {
  pending: 'Pendente',
  approved: 'Aprovado',
  spam: 'Spam',
  deleted: 'Excluído',
}

export default async function BlogComentariosPage() {
  const comments = await getAdminComments()

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Moderação de comentários</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum comentário encontrado.</p>
          ) : (
            comments.map(comment => {
              const post = Array.isArray(comment.posts) ? comment.posts[0] : comment.posts
              const approveAction = moderateCommentAction.bind(null, comment.id, 'approved')
              const spamAction = moderateCommentAction.bind(null, comment.id, 'spam')
              const deleteAction = moderateCommentAction.bind(null, comment.id, 'deleted')

              return (
                <div key={comment.id} className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-medium">{comment.author_name}</p>
                      <p className="text-xs text-muted-foreground">{comment.author_email}</p>
                    </div>
                    <Badge variant="secondary">
                      {statusLabel[comment.status] ?? comment.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-foreground/90">{comment.content}</p>

                  {post ? (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="text-xs text-primary hover:underline"
                    >
                      Ver post: {post.title}
                    </Link>
                  ) : null}

                  <div className="flex flex-wrap gap-2">
                    <form action={approveAction}>
                      <Button size="sm" type="submit">
                        Aprovar
                      </Button>
                    </form>
                    <form action={spamAction}>
                      <Button size="sm" type="submit" variant="outline">
                        Marcar spam
                      </Button>
                    </form>
                    <form action={deleteAction}>
                      <Button size="sm" type="submit" variant="destructive">
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
