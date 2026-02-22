import { ShoppingCart } from 'lucide-react'
import { ProductCardSkeleton } from '@/components/product-card/ProductCradSkeleton'
import { Skeleton } from '@/components/ui/skeleton'

export default function CardapioLoading() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-primary/5">
      <section className="relative py-4 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-top-left" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <ShoppingCart className="h-4 w-4" />
              Cardápio
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
              Sabores da Amazônia
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light">
              Cada prato conta uma história
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 px-4 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <Skeleton className="h-10 w-80 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto mb-8" />
          <Skeleton className="h-12 w-48 mx-auto" />
        </div>
      </section>
    </div>
  )
}
