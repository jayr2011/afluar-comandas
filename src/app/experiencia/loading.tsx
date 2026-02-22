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
            <Skeleton className="h-12 md:h-16 lg:h-20 w-full max-w-lg mx-auto mb-6" />
            <Skeleton className="h-8 w-64 mx-auto" />
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-8 md:p-12 border border-primary/10">
            <div className="space-y-6">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-10 w-96 mx-auto mt-12" />
            </div>
          </Card>
        </div>
      </section>

      <section className="py-16 px-4 bg-primary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <Card key={i} className="p-8 border border-primary/10">
                <div className="text-center">
                  <Skeleton className="h-16 w-16 mx-auto mb-4 rounded-full" />
                  <Skeleton className="h-6 w-32 mx-auto mb-3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
