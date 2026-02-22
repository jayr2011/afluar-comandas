'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { XIcon } from 'lucide-react'

import type { Category, Tag } from '@/types/blog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface BlogFiltersProps {
  categories: Category[]
  tags: Tag[]
  activeCategory?: string
  activeTag?: string
}

function buildUrl(pathname: string, params: URLSearchParams): string {
  const query = params.toString()
  return query ? `${pathname}?${query}` : pathname
}

export function BlogFilters({ categories, tags, activeCategory, activeTag }: BlogFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const categoryValue = activeCategory ?? 'all'
  const tagValue = activeTag ?? 'all'
  const activeCategoryLabel = categories.find(category => category.slug === activeCategory)?.name
  const activeTagLabel = tags.find(tag => tag.slug === activeTag)?.name

  function pushFilters(nextCategory: string, nextTag: string) {
    const params = new URLSearchParams(searchParams.toString())

    if (nextCategory === 'all') {
      params.delete('category')
    } else {
      params.set('category', nextCategory)
    }

    if (nextTag === 'all') {
      params.delete('tag')
    } else {
      params.set('tag', nextTag)
    }

    params.delete('page')
    router.push(buildUrl(pathname, params))
  }

  function handleCategoryChange(value: string) {
    pushFilters(value, tagValue)
  }

  function handleTagChange(value: string) {
    pushFilters(categoryValue, value)
  }

  function handleClear() {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('category')
    params.delete('tag')
    params.delete('page')
    router.push(buildUrl(pathname, params))
  }

  function handleClearCategory() {
    pushFilters('all', tagValue)
  }

  function handleClearTag() {
    pushFilters(categoryValue, 'all')
  }

  const hasActiveFilters = categoryValue !== 'all' || tagValue !== 'all'

  return (
    <div className="mb-8 rounded-lg border bg-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="grid w-full gap-2 sm:max-w-64">
          <Label htmlFor="blog-category-filter">Categoria</Label>
          <Select value={categoryValue} onValueChange={handleCategoryChange}>
            <SelectTrigger id="blog-category-filter" className="w-full">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid w-full gap-2 sm:max-w-64">
          <Label htmlFor="blog-tag-filter">Tag</Label>
          <Select value={tagValue} onValueChange={handleTagChange}>
            <SelectTrigger id="blog-tag-filter" className="w-full">
              <SelectValue placeholder="Todas as tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as tags</SelectItem>
              {tags.map(tag => (
                <SelectItem key={tag.id} value={tag.slug}>
                  #{tag.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          variant="outline"
          className="sm:ml-auto"
          onClick={handleClear}
          disabled={!hasActiveFilters}
        >
          Limpar filtros
        </Button>
      </div>

      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {activeCategoryLabel && (
            <Badge variant="secondary" className="gap-1 pr-1">
              <span>Categoria: {activeCategoryLabel}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="hover:bg-background"
                onClick={handleClearCategory}
                aria-label="Remover filtro de categoria"
              >
                <XIcon className="size-3" />
              </Button>
            </Badge>
          )}

          {activeTagLabel && (
            <Badge variant="secondary" className="gap-1 pr-1">
              <span>Tag: #{activeTagLabel}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="hover:bg-background"
                onClick={handleClearTag}
                aria-label="Remover filtro de tag"
              >
                <XIcon className="size-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
