import { describe, it, expect } from 'vitest'
import {
  CATEGORIAS_CARDAPIO,
  normalizarCategoria,
  produtoNaCategoria,
} from '@/app/cardapio/categorias'

describe('CATEGORIAS_CARDAPIO', () => {
  it('contém os slugs e labels esperados', () => {
    expect(CATEGORIAS_CARDAPIO).toEqual([
      { slug: 'sobremesas', label: 'Sobremesas' },
      { slug: 'pratos principais', label: 'Pratos principais' },
      { slug: 'cervejas', label: 'Cervejas' },
      { slug: 'refrigerantes', label: 'Refrigerantes' },
      { slug: 'água', label: 'Água' },
    ])
  })
})

describe('normalizarCategoria', () => {
  it('converte string para minúsculas', () => {
    expect(normalizarCategoria('SOBREMESAS')).toBe('sobremesas')
  })

  it('remove espaços em branco do início e fim', () => {
    expect(normalizarCategoria('  sobremesas  ')).toBe('sobremesas')
  })
})

describe('produtoNaCategoria', () => {
  it('retorna true quando categoriaProduto e slugFiltro coincidem após normalização', () => {
    expect(produtoNaCategoria('Sobremesas', 'sobremesas')).toBe(true)
  })

  it('retorna true quando categoria é "água" e slug é "agua"', () => {
    expect(produtoNaCategoria('água', 'agua')).toBe(true)
  })

  it('retorna true quando categoria é "agua" e slug é "água"', () => {
    expect(produtoNaCategoria('agua', 'água')).toBe(true)
  })

  it('retorna false quando categoria não coincide com slug', () => {
    expect(produtoNaCategoria('sobremesas', 'cervejas')).toBe(false)
  })

  it('é case insensitive', () => {
    expect(produtoNaCategoria('PRATOS PRINCIPAIS', 'pratos principais')).toBe(true)
  })
})
