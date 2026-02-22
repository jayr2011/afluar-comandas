'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { SearchIcon, XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const MAX_SEARCH_LENGTH = 100

function buildUrl(pathname: string, params: URLSearchParams): string {
  const query = params.toString()
  return query ? `${pathname}?${query}` : pathname
}

export function BlogSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeSearch = searchParams.get('search') ?? ''
  const [search, setSearch] = useState(activeSearch)

  useEffect(() => {
    setSearch(activeSearch)
  }, [activeSearch])

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextSearch = search.trim().slice(0, MAX_SEARCH_LENGTH)
    const params = new URLSearchParams(searchParams.toString())

    if (nextSearch) {
      params.set('search', nextSearch)
    } else {
      params.delete('search')
    }

    params.delete('page')
    router.push(buildUrl(pathname, params))
  }

  function handleClear() {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('search')
    params.delete('page')
    setSearch('')
    router.push(buildUrl(pathname, params))
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex items-center gap-2" role="search">
      <Input
        type="search"
        value={search}
        onChange={event => setSearch(event.target.value)}
        placeholder="Buscar no blog..."
        aria-label="Buscar posts"
        maxLength={MAX_SEARCH_LENGTH}
        className="h-10"
      />

      <Button type="submit" variant="outline" className="h-10 shrink-0">
        <SearchIcon className="size-4" />
        <span className="hidden sm:inline">Buscar</span>
      </Button>

      {activeSearch && (
        <Button
          type="button"
          variant="ghost"
          className="h-10 shrink-0"
          onClick={handleClear}
          aria-label="Limpar busca"
        >
          <XIcon className="size-4" />
          <span className="hidden sm:inline">Limpar</span>
        </Button>
      )}
    </form>
  )
}
