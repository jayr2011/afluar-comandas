import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import type { Category, Post, Tag } from '@/types/blog'
import { HtmlEditor } from './HtmlEditor'

interface BlogPostFormProps {
  title: string
  submitLabel: string
  submitAction: (formData: FormData) => Promise<void>
  post?: Post | null
  categories: Category[]
  tags: Tag[]
}

function toDateTimeLocal(value?: string) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

export function BlogPostForm({
  title,
  submitLabel,
  submitAction,
  post,
  categories,
  tags,
}: BlogPostFormProps) {
  const selectedCategoryIds = new Set(post?.categories?.map(item => item.id) ?? [])
  const selectedTagIds = new Set(post?.tags?.map(item => item.id) ?? [])

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={submitAction} className="space-y-5">
            <Field>
              <FieldContent>
                <FieldLabel htmlFor="title">Título</FieldLabel>
                <Input id="title" name="title" defaultValue={post?.title ?? ''} required />
              </FieldContent>
            </Field>

            <Field>
              <FieldContent>
                <FieldLabel htmlFor="slug">Slug (opcional)</FieldLabel>
                <Input id="slug" name="slug" defaultValue={post?.slug ?? ''} />
              </FieldContent>
            </Field>

            <Field>
              <FieldContent>
                <FieldLabel htmlFor="excerpt">Resumo</FieldLabel>
                <Textarea id="excerpt" name="excerpt" defaultValue={post?.excerpt ?? ''} />
              </FieldContent>
            </Field>

            <Field>
              <FieldContent>
                <FieldLabel htmlFor="content">Conteúdo</FieldLabel>
                <HtmlEditor
                  name="content"
                  initialValue={post?.content ?? ''}
                  coverImageName="cover_image"
                  initialCoverImage={post?.cover_image ?? ''}
                />
                <FieldDescription>Upload de imagem é tratado como capa do post.</FieldDescription>
              </FieldContent>
            </Field>

            <Field>
              <FieldContent>
                <FieldLabel htmlFor="status">Status</FieldLabel>
                <select
                  id="status"
                  name="status"
                  defaultValue={post?.status ?? 'draft'}
                  className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-[3px]"
                >
                  <option value="draft">Rascunho</option>
                  <option value="scheduled">Agendado</option>
                  <option value="published">Publicado</option>
                </select>
              </FieldContent>
            </Field>

            <Field>
              <FieldContent>
                <FieldLabel htmlFor="scheduled_at">Agendar para</FieldLabel>
                <Input
                  id="scheduled_at"
                  name="scheduled_at"
                  type="datetime-local"
                  defaultValue={toDateTimeLocal(post?.scheduled_at)}
                />
                <FieldDescription>Preencha apenas se o status for agendado.</FieldDescription>
              </FieldContent>
            </Field>

            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-base">Categorias</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 md:grid-cols-2">
                {categories.map(item => (
                  <label key={item.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="category_ids"
                      value={item.id}
                      defaultChecked={selectedCategoryIds.has(item.id)}
                    />
                    {item.name}
                  </label>
                ))}
                {categories.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhuma categoria cadastrada.</p>
                ) : null}
              </CardContent>
            </Card>

            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-base">Tags</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 md:grid-cols-2">
                {tags.map(item => (
                  <label key={item.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="tag_ids"
                      value={item.id}
                      defaultChecked={selectedTagIds.has(item.id)}
                    />
                    {item.name}
                  </label>
                ))}
                {tags.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhuma tag cadastrada.</p>
                ) : null}
              </CardContent>
            </Card>

            <Button type="submit">{submitLabel}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
