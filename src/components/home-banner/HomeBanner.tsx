'use client'

import { Banner } from '../banner/Banner'
import { useRouter } from 'next/navigation'

export function HomeBanner() {
  const router = useRouter()

  return (
    <Banner
      slides={[
        {
          src: '/banner/cardapio-desk.png',
          mobileSrc: '/banner/cardapio-mobile.png',
          alt: 'Banner 1',
          onClick: () => router.push('/cardapio'),
        },
        {
          src: '/banner/beach-tennis.png',
          mobileSrc: '/banner/beach-tennis-mobile.png',
          alt: 'Banner 2',
          onClick: () => router.push('/beach-tennis'),
        },
      ]}
    />
  )
}
