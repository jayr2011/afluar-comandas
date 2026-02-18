import { beforeEach } from 'vitest'
import { useProductsStore } from '@/store/productsStore'

beforeEach(() => {
  useProductsStore.setState({ products: new Map() })
})