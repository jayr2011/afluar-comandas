export const CATEGORIAS_CARDAPIO = [
  { slug: 'sobremesas', label: 'Sobremesas' },
  { slug: 'pratos principais', label: 'Pratos principais' },
  { slug: 'cervejas', label: 'Cervejas' },
  { slug: 'refrigerantes', label: 'Refrigerantes' },
  { slug: 'água', label: 'Água' },
] as const

export type SlugCategoria = (typeof CATEGORIAS_CARDAPIO)[number]['slug']

export function normalizarCategoria(valor: string): string {
  return valor.toLowerCase().trim()
}

export function produtoNaCategoria(categoriaProduto: string, slugFiltro: string): boolean {
  const normal = normalizarCategoria(categoriaProduto)
  const slugNorm = normalizarCategoria(slugFiltro)
  if (slugNorm === 'água' || slugNorm === 'agua') {
    return normal === 'água' || normal === 'agua'
  }
  return normal === slugNorm
}
