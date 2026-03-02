import { beforeEach } from 'vitest'
import { useProductsStore } from '@/store/comandaStore'

beforeEach(() => {
  useProductsStore.setState({ products: new Map() })
})