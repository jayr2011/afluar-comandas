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
          alt: 'Acessar cardápio',
          onClick: () => router.push('/cardapio'),
        },
      ]}
    />
  )
}
