import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCart } from '@/hooks/useCart'
import { useCartStore } from '@/store/cartStore'

const mockCartItem = (id: string, preco: number, quantidade: number) => ({
    id,
    nome: 'Produto',
    descricao: '',
    preco,
    categoria: 'Teste',
    destaque: false,
    imagem: '',
    quantidade,
  })

describe('useCart', () => {
    beforeEach(() => {
        useCartStore.setState({ items: [] })
      })

    it('retorna carrinho vazio inicialmente', () => {
        const { result } = renderHook(() => useCart())
    
        expect(result.current.items).toEqual([])
        expect(result.current.totalPrice).toBe(0)
        expect(result.current.isEmpty).toBe(true)
    })

    it('retorna items do store quando há itens no carrinho', () => {
        const items = [
          mockCartItem('1', 10, 2),
          mockCartItem('2', 5, 1),
        ]
        useCartStore.setState({ items })
    
        const { result } = renderHook(() => useCart())
    
        expect(result.current.items).toEqual(items)
        expect(result.current.totalPrice).toBe(25)
        expect(result.current.isEmpty).toBe(false)
    })

    it('removeItem chama a ação do store', () => {
        const items = [mockCartItem('1', 10, 1)]
        useCartStore.setState({ items })
    
        const { result } = renderHook(() => useCart())
    
        act(() => {
          result.current.removeItem('1')
        })
    
        expect(useCartStore.getState().items).toEqual([])
    })

    it('updateQuantity atualiza a quantidade no store', () => {
        const items = [mockCartItem('1', 10, 1)]
        useCartStore.setState({ items })
    
        const { result } = renderHook(() => useCart())
    
        act(() => {
          result.current.updateQuantity('1', 3)
        })
    
        expect(useCartStore.getState().items[0].quantidade).toBe(3)
    })

    it('clearCart limpa todos os itens', () => {
        const items = [mockCartItem('1', 10, 1), mockCartItem('2', 5, 2)]
        useCartStore.setState({ items })
    
        const { result } = renderHook(() => useCart())
    
        act(() => {
          result.current.clearCart()
        })
    
        expect(useCartStore.getState().items).toEqual([])
        expect(result.current.isEmpty).toBe(true)
    })

    it('handleIncreaseQty aumenta a quantidade em 1', () => {
        const items = [mockCartItem('1', 10, 2)]
        useCartStore.setState({ items })
    
        const { result } = renderHook(() => useCart())
    
        act(() => {
          result.current.handleIncreaseQty('1', 2)
        })
    
        expect(useCartStore.getState().items[0].quantidade).toBe(3)
    })

    it('handleDecreaseQty diminui a quantidade em 1', () => {
        const items = [mockCartItem('1', 10, 3)]
        useCartStore.setState({ items })
    
        const { result } = renderHook(() => useCart())
    
        act(() => {
          result.current.handleDecreaseQty('1', 3)
        })
    
        expect(useCartStore.getState().items[0].quantidade).toBe(2)
    })

    it('handleDecreaseQty com quantidade 1 remove o item (store remove quando qty <= 0)', () => {
        const items = [mockCartItem('1', 10, 1)]
        useCartStore.setState({ items })
    
        const { result } = renderHook(() => useCart())
    
        act(() => {
          result.current.handleDecreaseQty('1', 1)
        })

        expect(useCartStore.getState().items).toEqual([])
      })
});