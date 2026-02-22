import {
  Pagination as UIPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  queryParams?: Record<string, string | undefined>
}

function buildHref(
  baseUrl: string,
  page: number,
  queryParams?: Record<string, string | undefined>
): string {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(queryParams ?? {})) {
    if (value) {
      params.set(key, value)
    }
  }

  params.set('page', String(page))
  return `${baseUrl}?${params.toString()}`
}

function getPageWindow(currentPage: number, totalPages: number): number[] {
  const visible = 5
  const half = Math.floor(visible / 2)
  let start = Math.max(1, currentPage - half)
  let end = Math.min(totalPages, start + visible - 1)

  if (end - start + 1 < visible) {
    start = Math.max(1, end - visible + 1)
  }

  end = Math.min(totalPages, start + visible - 1)

  const pages: number[] = []
  for (let page = start; page <= end; page += 1) {
    pages.push(page)
  }

  return pages
}

export function Pagination({ currentPage, totalPages, baseUrl, queryParams }: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const safeCurrentPage = Math.min(Math.max(currentPage || 1, 1), totalPages)
  const pages = getPageWindow(safeCurrentPage, totalPages)
  const hasPrevious = safeCurrentPage > 1
  const hasNext = safeCurrentPage < totalPages
  const showStartEllipsis = pages[0] > 2
  const showEndEllipsis = pages[pages.length - 1] < totalPages - 1

  return (
    <UIPagination className="mt-10">
      <PaginationContent>
        <PaginationItem>
          {hasPrevious ? (
            <PaginationPrevious href={buildHref(baseUrl, safeCurrentPage - 1, queryParams)} />
          ) : (
            <PaginationPrevious
              href={buildHref(baseUrl, 1, queryParams)}
              aria-disabled
              tabIndex={-1}
              className="pointer-events-none opacity-50"
            />
          )}
        </PaginationItem>

        {pages[0] > 1 && (
          <PaginationItem>
            <PaginationLink
              href={buildHref(baseUrl, 1, queryParams)}
              isActive={safeCurrentPage === 1}
            >
              1
            </PaginationLink>
          </PaginationItem>
        )}

        {showStartEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {pages.map(page => (
          <PaginationItem key={page}>
            <PaginationLink
              href={buildHref(baseUrl, page, queryParams)}
              isActive={safeCurrentPage === page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {showEndEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {pages[pages.length - 1] < totalPages && (
          <PaginationItem>
            <PaginationLink
              href={buildHref(baseUrl, totalPages, queryParams)}
              isActive={safeCurrentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          {hasNext ? (
            <PaginationNext href={buildHref(baseUrl, safeCurrentPage + 1, queryParams)} />
          ) : (
            <PaginationNext
              href={buildHref(baseUrl, totalPages, queryParams)}
              aria-disabled
              tabIndex={-1}
              className="pointer-events-none opacity-50"
            />
          )}
        </PaginationItem>
      </PaginationContent>
    </UIPagination>
  )
}
