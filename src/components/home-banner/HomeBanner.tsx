import { Banner } from '../banner/Banner'

export function HomeBanner() {
  return (
    <Banner
      slides={[
        {
          src: 'https://picsum.photos/seed/1/800/400',
          alt: 'Banner 1',
        },
        {
          src: 'https://picsum.photos/seed/2/800/400',
          alt: 'Banner 2',
        },
        {
          src: 'https://picsum.photos/seed/3/800/400',
          alt: 'Banner 3',
        },
      ]}
    />
  )
}
