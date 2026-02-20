'use server'

import { revalidateTag } from 'next/cache'
import logger from '@/lib/logger'

export async function revalidateProdutosCache() {
  logger.info('[realtime:produtos] revalidando cache via server action')
  revalidateTag('produtos', {})
}
