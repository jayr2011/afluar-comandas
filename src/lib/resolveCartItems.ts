import { getSupabaseAdmin } from '@/lib/supabase'

export interface CartItemInput {
  id: string
  quantidade: number
}

export interface ResolvedCartItem {
  id: string
  nome: string
  preco: number
  quantidade: number
}

const MIN_QTY = 1
const MAX_QTY = 50

export async function resolveCartItemsFromDb(
  cart: CartItemInput[]
): Promise<{ items: ResolvedCartItem[]; total: number }> {
  const productIds = cart.map(item => item.id)
  const { data: products, error: productsError } = await getSupabaseAdmin()
    .from('produtos')
    .select('id, nome, preco')
    .in('id', productIds)

  if (productsError || !products || products.length === 0) {
    throw new Error('Produtos não encontrados')
  }

  const productMap = new Map(products.map(p => [p.id, { nome: p.nome, preco: p.preco }]))
  const items: ResolvedCartItem[] = []
  let total = 0

  for (const item of cart) {
    const product = productMap.get(item.id)
    if (!product) {
      throw new Error(`Produto não encontrado: ${item.id}`)
    }
    const quantidade = Math.min(Math.max(MIN_QTY, item.quantidade), MAX_QTY)
    items.push({
      id: item.id,
      nome: product.nome,
      preco: product.preco,
      quantidade,
    })
    total += product.preco * quantidade
  }

  return { items, total }
}
