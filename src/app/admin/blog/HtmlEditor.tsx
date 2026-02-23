'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

interface HtmlEditorProps {
  name: string
  initialValue?: string
  coverImageName?: string
  initialCoverImage?: string
}

export function HtmlEditor({
  name,
  initialValue = '',
  coverImageName = 'cover_image',
  initialCoverImage = '',
}: HtmlEditorProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [coverImageUrl, setCoverImageUrl] = useState(initialCoverImage)

  const parsedInitialContent = useMemo(() => {
    const trimmed = initialValue.trim()
    if (!trimmed) return '<p></p>'
    if (trimmed.startsWith('<')) return trimmed
    return `<p>${trimmed}</p>`
  }, [initialValue])

  const [content, setContent] = useState(parsedInitialContent)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: parsedInitialContent,
    editorProps: {
      attributes: {
        class:
          'min-h-64 w-full rounded-md border border-input bg-transparent px-3 py-3 text-sm outline-none focus-visible:border-ring [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-semibold [&_p]:my-2 [&_ul]:my-2 [&_ul]:ml-6 [&_ul]:list-disc [&_ol]:my-2 [&_ol]:ml-6 [&_ol]:list-decimal [&_li]:my-1',
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      setContent(currentEditor.getHTML())
    },
  })

  async function handleCoverImageUpload(file?: File | null) {
    if (!file) return

    setUploading(true)

    try {
      const payload = new FormData()
      payload.append('file', file)

      const response = await fetch('/api/admin/blog/upload-image', {
        method: 'POST',
        body: payload,
      })

      const result = (await response.json()) as { url?: string; error?: string }

      if (!response.ok || !result.url) {
        throw new Error(result.error || 'Falha ao fazer upload da imagem.')
      }

      setCoverImageUrl(result.url)
      toast.success('Imagem de capa enviada com sucesso.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Falha ao enviar imagem.')
    } finally {
      setUploading(false)
    }
  }

  async function handleCopyCoverImageUrl() {
    if (!coverImageUrl) {
      toast.error('Nenhuma imagem de capa definida ainda.')
      return
    }

    try {
      await navigator.clipboard.writeText(coverImageUrl)
      toast.success('URL da capa copiada.')
    } catch {
      toast.error('Não foi possível copiar a URL.')
    }
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={content} />
      <input type="hidden" name={coverImageName} value={coverImageUrl} />

      <Card>
        <CardContent className="pt-4 space-y-3">
          <div className="text-sm font-medium">Imagem de capa</div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" asChild disabled={uploading}>
              <label className="cursor-pointer">
                {uploading ? 'Enviando capa...' : 'Enviar capa'}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={event => {
                    const file = event.target.files?.[0] ?? null
                    void handleCoverImageUpload(file)
                    event.currentTarget.value = ''
                  }}
                />
              </label>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => void handleCopyCoverImageUrl()}
              disabled={!coverImageUrl}
            >
              Copiar URL da capa
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setCoverImageUrl('')}
              disabled={!coverImageUrl}
            >
              Remover capa
            </Button>
          </div>
          {coverImageUrl ? (
            <div className="relative h-56 w-full max-w-md overflow-hidden rounded-md border">
              <Image
                src={coverImageUrl}
                alt="Preview da capa"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 448px"
              />
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Nenhuma imagem de capa selecionada.</p>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          disabled={!editor}
        >
          Negrito
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          disabled={!editor}
        >
          Itálico
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={!editor}
        >
          Título H2
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          disabled={!editor}
        >
          Título H3
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor?.chain().focus().setParagraph().run()}
          disabled={!editor}
        >
          Parágrafo
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          disabled={!editor}
        >
          Lista
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          disabled={!editor}
        >
          Lista numerada
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={!editor}
        >
          Desfazer
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={!editor}
        >
          Refazer
        </Button>
        <Button
          type="button"
          size="sm"
          variant={showPreview ? 'default' : 'outline'}
          onClick={() => setShowPreview(prev => !prev)}
        >
          {showPreview ? 'Ocultar preview' : 'Mostrar preview'}
        </Button>
      </div>

      <EditorContent editor={editor} />

      {showPreview ? (
        <Card>
          <CardContent className="pt-6">
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
