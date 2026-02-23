import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

interface CardSkeletonProps extends React.ComponentProps<typeof Card> {
  children?: React.ReactNode
  className?: string
}

export function CardSkeleton({ children, className = '', ...props }: CardSkeletonProps) {
  return (
    <Card
      className={`rounded-2xl shadow-xl overflow-hidden border border-primary/10 ${className}`}
      {...props}
    >
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  )
}

interface SkeletonSectionProps {
  children?: React.ReactNode
  className?: string
}

export function SkeletonSection({ children, className = '' }: SkeletonSectionProps) {
  return <div className={`space-y-4 ${className}`}>{children}</div>
}

export function ImageSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-full h-64 bg-primary/10 ${className}`}>
      <Skeleton className="absolute inset-0 w-full h-full" />
    </div>
  )
}

export function TitleSkeleton({ className = '' }: { className?: string }) {
  return <Skeleton className={`h-8 w-3/4 ${className}`} />
}

export function TextSkeleton({
  lines = 2,
  className = '',
}: {
  lines?: number
  className?: string
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <Skeleton key={i} className={`h-4 ${i === 0 ? 'w-full' : 'w-5/6'}`} />
      ))}
    </div>
  )
}

export function PriceSkeleton({ className = '' }: { className?: string }) {
  return <Skeleton className={`h-9 w-24 ${className}`} />
}

export function ButtonSkeleton({ className = '' }: { className?: string }) {
  return <Skeleton className={`h-10 w-28 rounded-lg ${className}`} />
}

export function CategorySkeleton({ className = '' }: { className?: string }) {
  return <Skeleton className={`h-4 w-20 ${className}`} />
}
