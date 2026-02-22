import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-primary/5">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-top-left" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <Skeleton className="h-6 w-32 mx-auto mb-6 rounded-full" />
            <Skeleton className="h-12 md:h-16 lg:h-20 w-full max-w-md mx-auto mb-6" />
            <Skeleton className="h-8 w-80 mx-auto" />
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[1, 2].map(i => (
              <Card key={i} className="p-8 border border-primary/10">
                <div className="space-y-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <Skeleton className="h-8 w-40" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <Card key={i} className="p-6 border border-primary/10">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-primary/5">
        <div className="container mx-auto max-w-3xl text-center">
          <Skeleton className="h-10 w-80 mx-auto mb-4" />
          <Skeleton className="h-6 w-full max-w-lg mx-auto mb-8" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Skeleton className="h-12 w-40 rounded-lg" />
            <Skeleton className="h-12 w-48 rounded-lg" />
          </div>
        </div>
      </section>
    </div>
  )
}
