import { notFound } from 'next/navigation'
import { BlogPostForm } from '../../BlogPostForm'
import { getAdminBlogFormData, getAdminPostById, updatePostAction } from '../../actions'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditBlogPostPage({ params }: PageProps) {
  const { id } = await params

  const [post, { categories, tags }] = await Promise.all([
    getAdminPostById(id),
    getAdminBlogFormData(),
  ])

  if (!post) {
    notFound()
  }

  const submitAction = updatePostAction.bind(null, post.id)

  return (
    <BlogPostForm
      title="Editar post"
      submitLabel="Salvar alterações"
      submitAction={submitAction}
      post={post}
      categories={categories}
      tags={tags}
    />
  )
}
