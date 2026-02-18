'use client'

import Image from 'next/image'
import { useRef, useEffect, useState, useCallback } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import type { CarouselApi } from '@/components/ui/carousel'
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
  const [api, setApi] = useState<CarouselApi | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(prefer-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const handler = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (!api) return
    setCurrentIndex(api.selectedScrollSnap())
    const onSelect = () => setCurrentIndex(api.selectedScrollSnap())
    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  const handleMouseEnter = useCallback(() => {
    if (!reduceMotion) plugin.current.stop()
  }, [reduceMotion])

  const handleMouseLeave = useCallback(() => {
    if (!reduceMotion) plugin.current.reset()
  }, [reduceMotion])

  if (slides.length === 0) return null

  const currentSlide = slides[currentIndex]
  const totalSlides = slides.length

  return (
    <Carousel
      opts={{ loop: true, align: 'start' }}
      plugins={reduceMotion ? [] : [plugin.current]}
      setApi={setApi}
      className="relative w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Carrossel de banners promocionais"
    >
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {currentSlide && `Slide ${currentIndex + 1} de ${totalSlides}: ${currentSlide.alt}`}
      </div>
      <CarouselContent className="ml-0">
        {slides.map((slide, index) => (
          <CarouselItem
            key={slide.key ?? slide.src}
            className="pl-0"
            aria-label={`Slide ${index + 1} de ${totalSlides}: ${slide.alt}`}
            aria-current={index === currentIndex ? 'true' : undefined}
          >
            <Card className="overflow-hidden border-0 rounded-none shadow-none">
              <CardContent
                className={cn(
                  'relative flex items-center justify-center p-0 w-full min-h-[40vh] md:min-h-[50vh] bg-muted',
                  className
                )}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                  className="object-cover"
                  priority={index === 0}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious
        className="left-2 sm:left-4 border-white/20 bg-black/20 hover:bg-black/40 hover:border-white/40"
        aria-label="Ver slide anterior"
      />
      <CarouselNext
        className="right-2 sm:right-4 border-white/20 bg-black/20 hover:bg-black/40 hover:border-white/40"
        aria-label="Ver próximo slide"
      />
    </Carousel>
  )
}
