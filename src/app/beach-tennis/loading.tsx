import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-primary/5">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-top-left" />

        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-12">
            <Skeleton className="h-7 w-36 mx-auto mb-6 rounded-full" />
            <Skeleton className="h-12 md:h-16 lg:h-20 w-full max-w-3xl mx-auto mb-6" />
            <Skeleton className="h-8 w-3/4 max-w-2xl mx-auto" />
            <div className="mt-8 flex justify-center gap-3">
              <Skeleton className="h-10 w-40 rounded-md" />
              <Skeleton className="h-10 w-40 rounded-md" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <Card key={i} className="p-6 border border-primary/10">
                <Skeleton className="h-14 w-14 mb-4 rounded-full" />
                <Skeleton className="h-7 w-44 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-primary/5">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-8 md:p-10 border border-primary/10">
            <Skeleton className="h-9 w-64 mb-6" />
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-52" />
                  <Skeleton className="h-4 w-64" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
