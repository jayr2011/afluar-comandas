'use client'

import { useState } from 'react'
import { Banner } from '../shared/Banner'
import type { BannerSlide } from '../shared/Banner'

export function HomeBanner() {
  const [slides] = useState<BannerSlide[]>(() =>
    Array.from({ length: 3 }, (_, i) => {
      const seed = Math.floor(Math.random() * 10000) + i * 1000
      return {
        src: `https://picsum.photos/seed/${seed}/800/400`,
        alt: `Banner ${i + 1}`,
        key: String(seed),
      }
    })
  )
  return <Banner slides={slides} />
}
