import { describe, it, expect, vi, beforeEach } from 'vitest'
import { revalidateProdutosCache } from '@/app/cardapio/actions'

const mockRevalidateTag = vi.fn()
const mockLoggerInfo = vi.fn()

vi.mock('next/cache', () => ({
  revalidateTag: (...args: unknown[]) => mockRevalidateTag(...args),
}))

vi.mock('@/lib/logger', () => ({
  default: {
    info: (...args: unknown[]) => mockLoggerInfo(...args),
  },
}))

describe('revalidateProdutosCache', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('chama logger.info com mensagem de revalidação', async () => {
    await revalidateProdutosCache()

    expect(mockLoggerInfo).toHaveBeenCalledWith('[realtime:produtos] revalidando cache via server action')
  })

  it('chama revalidateTag com tag "produtos" e objeto vazio', async () => {
    await revalidateProdutosCache()

    expect(mockRevalidateTag).toHaveBeenCalledWith('produtos', {})
  })
})
