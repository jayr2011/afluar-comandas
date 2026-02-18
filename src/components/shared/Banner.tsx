'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel'
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
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }))

  useEffect(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
    api.on('select', () => setCurrent(api.selectedScrollSnap()))
  }, [api])

  if (slides.length === 0) return null

  return (
    <Carousel
      opts={{ loop: true, align: 'start' }}
      plugins={[plugin.current]}
      setApi={setApi}
      className="relative w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="ml-0">
        {slides.map((slide, index) => (
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
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center gap-1.5 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => api?.scrollTo(index)}
            className={cn(
              'h-2 rounded-full transition-all shadow-sm',
              current === index ? 'w-6 bg-primary' : 'w-2 bg-white/60 hover:bg-white/80'
            )}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </Carousel>
  )
}
