'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { createComment } from '@/app/blog/actions'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

const commentSchema = z.object({
  author_name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  author_email: z.string().pipe(z.email('Email inválido')),
  content: z.string().min(5, 'Comentário deve ter pelo menos 5 caracteres'),
})

type CommentFormData = z.infer<typeof commentSchema>

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  })

  const onSubmit = async (data: CommentFormData) => {
    setIsSubmitting(true)
    try {
      await createComment({ ...data, post_id: postId })
      toast.success('Comentário enviado! Aguarde moderação.')
      reset()
    } catch {
      toast.error('Erro ao enviar comentário')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Deixe seu comentário</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="author_name" className="sr-only">
              Nome
            </Label>
            <Input
              id="author_name"
              {...register('author_name')}
              placeholder="Seu nome"
              aria-invalid={!!errors.author_name}
              aria-describedby={errors.author_name ? 'name-error' : undefined}
            />
            {errors.author_name && (
              <p id="name-error" className="text-sm text-destructive mt-1" role="alert">
                {errors.author_name.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="author_email" className="sr-only">
              Email
            </Label>
            <Input
              id="author_email"
              {...register('author_email')}
              type="email"
              placeholder="Seu email"
              aria-invalid={!!errors.author_email}
              aria-describedby={errors.author_email ? 'email-error' : undefined}
            />
            {errors.author_email && (
              <p id="email-error" className="text-sm text-destructive mt-1" role="alert">
                {errors.author_email.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="content" className="sr-only">
            Comentário
          </Label>
          <Textarea
            id="content"
            {...register('content')}
            placeholder="Seu comentário..."
            rows={4}
            aria-invalid={!!errors.content}
            aria-describedby={errors.content ? 'content-error' : undefined}
          />
          {errors.content && (
            <p id="content-error" className="text-sm text-destructive mt-1" role="alert">
              {errors.content.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar Comentário'}
        </Button>

        <p className="text-xs text-muted-foreground">
          Seu comentário será moderado antes de ser publicado.
        </p>
      </form>
    </section>
  )
}
