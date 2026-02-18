import { 
  CardSkeleton, 
  ImageSkeleton, 
  CategorySkeleton, 
  TitleSkeleton, 
  TextSkeleton, 
  PriceSkeleton, 
  ButtonSkeleton 
} from '@/components/ui/card-skeleton'

interface ProductCardSkeletonProps {
  showButton?: boolean
  className?: string
}

export function ProductCardSkeleton({ 
  showButton = true, 
  className = '' 
}: ProductCardSkeletonProps) {
  return (
    <CardSkeleton className={className}>
      <ImageSkeleton />
      
      <div className="space-y-4">
        <CategorySkeleton />
        <TitleSkeleton />
        <TextSkeleton lines={2} />
        
        <div className="flex items-center justify-between">
          <PriceSkeleton />
          {showButton && <ButtonSkeleton />}
        </div>
      </div>
    </CardSkeleton>
  )
}