import { Skeleton } from '@/components/ui/skeleton'

export default function ProdutoDetalheLoading() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-primary/5">
      <section className="relative py-4 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-top-left" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <Skeleton className="h-10 w-32 mb-6 -ml-2" />
        </div>
      </section>

      <section className="pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-2xl shadow-xl border border-primary/10 bg-card">
            <div className="grid md:grid-cols-2 gap-0">
              <Skeleton className="w-full aspect-square md:aspect-auto md:min-h-100" />
              <div className="p-8 md:p-10 flex flex-col gap-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-10 w-3/4 mb-4" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-2/3 mb-6" />
                <Skeleton className="h-16 w-full" />
                <div className="flex gap-4 mt-auto pt-4">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-12 w-44" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
