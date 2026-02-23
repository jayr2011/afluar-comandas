import { BlogPostForm } from '../BlogPostForm'
import { createPostAction, getAdminBlogFormData } from '../actions'

export default async function NovoBlogPostPage() {
  const { categories, tags } = await getAdminBlogFormData()

  return (
    <BlogPostForm
      title="Novo post"
      submitLabel="Criar post"
      submitAction={createPostAction}
      categories={categories}
      tags={tags}
    />
  )
}
