import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="container mx-auto max-w-6xl px-4 pt-4">
      <Card className="overflow-hidden border-0 rounded-none shadow-none">
        <CardContent className="relative flex items-center justify-center p-0 w-full min-h-[40vh] md:min-h-[50vh] bg-muted">
          <Skeleton className="w-full h-full absolute inset-0" />
        </CardContent>
      </Card>

      <div className="flex justify-center mt-4 gap-2">
        <Skeleton className="h-2 w-2 rounded-full" />
        <Skeleton className="h-2 w-2 rounded-full" />
        <Skeleton className="h-2 w-2 rounded-full" />
      </div>
    </div>
  )
}
