'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function RandomBanner() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [images] = useState(() =>
    Array.from({ length: 3 }, (_, i) => {
      const seed = Math.floor(Math.random() * 10000) + i * 1000
      return {
        src: `https://picsum.photos/seed/${seed}/800/400`,
        alt: `Banner ${i + 1}`,
        key: seed,
      }
    })
  )

  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  useEffect(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
    api.on('select', () => setCurrent(api.selectedScrollSnap()))
  }, [api])

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
        {images.map((img, index) => (
          <CarouselItem key={img.key} className="pl-0">
            <Card className="overflow-hidden border-0 rounded-none shadow-none">
              <CardContent className="relative flex items-center justify-center p-0 w-full min-h-[40vh] md:min-h-[50vh] bg-muted">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index === 0}
                />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center gap-1.5 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => api?.scrollTo(index)}
            className={cn(
              'h-2 rounded-full transition-all shadow-sm',
              current === index
                ? 'w-6 bg-primary'
                : 'w-2 bg-white/60 hover:bg-white/80'
            )}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </Carousel>
  )
}
