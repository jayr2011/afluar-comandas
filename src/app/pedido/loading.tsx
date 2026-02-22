import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Skeleton className="h-12 w-64 mb-4" />
      <Skeleton className="h-6 w-80" />
    </div>
  )
}
