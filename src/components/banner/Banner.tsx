'use client'

import Image from 'next/image'
import { useRef } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface BannerSlide {
  src: string
  alt: string
  key?: string
}

interface BannerProps {
  slides: BannerSlide[]
  className?: string
}

export function Banner({ slides, className }: BannerProps) {
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }))

  if (slides.length === 0) return null

  return (
    <Carousel
      opts={{ loop: true, align: 'start' }}
      plugins={[plugin.current]}
      className="relative w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="ml-0">
        {slides.map(slide => (
          <CarouselItem key={slide.key ?? slide.src} className="pl-0">
            <Card className="overflow-hidden border-0 rounded-none shadow-none">
              <CardContent
                className={cn(
                  'relative flex items-center justify-center p-0 w-full min-h-[40vh] md:min-h-[50vh] bg-muted',
                  className
                )}
              >
                <Image src={slide.src} alt={slide.alt} fill className="object-cover" />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 sm:left-4 border-white/20 bg-black/20 hover:bg-black/40 hover:border-white/40" />
      <CarouselNext className="right-2 sm:right-4 border-white/20 bg-black/20 hover:bg-black/40 hover:border-white/40" />
    </Carousel>
  )
}
