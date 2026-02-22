import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-primary/5">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-top-left" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <Skeleton className="h-6 w-40 mx-auto mb-6 rounded-full" />
            <Skeleton className="h-12 md:h-16 lg:h-20 w-full max-w-2xl mx-auto mb-6" />
            <Skeleton className="h-8 w-full max-w-3xl mx-auto mb-8" />
            <Skeleton className="h-14 w-48 mx-auto rounded-lg" />
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-primary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="p-8 border border-primary/10">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-14 w-14 rounded-full shrink-0" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-7 w-40" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-72 mx-auto mb-4" />
            <Skeleton className="h-6 w-80 mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="p-6 border border-primary/10">
                <div className="text-center">
                  <Skeleton className="h-16 w-16 mx-auto mb-4 rounded-full" />
                  <Skeleton className="h-6 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-linear-to-br from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-8 md:p-12 border border-primary/20">
            <div className="text-center space-y-6">
              <Skeleton className="h-16 w-16 mx-auto rounded-full" />
              <Skeleton className="h-10 w-80 mx-auto" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6 mx-auto" />
              <Skeleton className="h-6 w-96 mx-auto italic" />
            </div>
          </Card>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Skeleton className="h-12 w-12 mx-auto mb-6 rounded-full" />
          <Skeleton className="h-10 w-96 mx-auto mb-4" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto mb-8" />
          <Skeleton className="h-14 w-48 mx-auto rounded-lg" />
        </div>
      </section>
    </div>
  )
}
