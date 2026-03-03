import { describe, it, expect } from 'vitest'
import type { ComandaItem, PedidoComanda } from '@/types/comanda'
import {
  isComandaAberta,
  isComandaConfirmada,
  temItensCarrinho,
  calcularTotalCarrinho,
  calcularTotalPedidos,
  getBadgeVariant,
  formatarLabelItens,
  clampQuantidade,
  isMensagemSucesso,
} from '@/components/comanda/utils'

function createComandaItem(subtotal: number): ComandaItem {
  return {
    id: '',
    comanda_id: '',
    produto_id: '',
    quantidade: 1,
    preco_unitario: subtotal,
    subtotal,
    observacoes: null,
    status: '',
  }
}

describe('utils comanda', () => {
  describe('isComandaAberta', () => {
    it('retorna true quando status é "aberta"', () => {
      expect(isComandaAberta('aberta')).toBe(true)
    })

    it('retorna false para status confirmada', () => {
      expect(isComandaAberta('confirmada')).toBe(false)
    })

    it('retorna false para status fechada', () => {
      expect(isComandaAberta('fechada')).toBe(false)
    })

    it('retorna false para status cancelada', () => {
      expect(isComandaAberta('cancelada')).toBe(false)
    })

    it('retorna false para string vazia', () => {
      expect(isComandaAberta('')).toBe(false)
    })
  })

  describe('isComandaConfirmada', () => {
    it('retorna true quando status é "confirmada"', () => {
      expect(isComandaConfirmada('confirmada')).toBe(true)
    })

    it('retorna false para status aberta', () => {
      expect(isComandaConfirmada('aberta')).toBe(false)
    })

    it('retorna false para status fechada', () => {
      expect(isComandaConfirmada('fechada')).toBe(false)
    })

    it('retorna false para status cancelada', () => {
      expect(isComandaConfirmada('cancelada')).toBe(false)
    })
  })

  describe('temItensCarrinho', () => {
    it('retorna true quando há itens', () => {
      const itens: ComandaItem[] = [
        {
          id: '1',
          comanda_id: '',
          produto_id: '',
          quantidade: 1,
          preco_unitario: 10,
          subtotal: 10,
          observacoes: null,
          status: '',
        },
      ]
      expect(temItensCarrinho(itens)).toBe(true)
    })

    it('retorna false quando array está vazio', () => {
      expect(temItensCarrinho([])).toBe(false)
    })

    it('retorna false quando itens é null', () => {
      expect(temItensCarrinho(null)).toBe(false)
    })

    it('retorna false quando itens é undefined', () => {
      expect(temItensCarrinho(undefined)).toBe(false)
    })
  })

  describe('calcularTotalCarrinho', () => {
    it('soma os subtotais dos itens', () => {
      const itens: ComandaItem[] = [
        createComandaItem(15),
        createComandaItem(25.5),
        createComandaItem(10),
      ]
      expect(calcularTotalCarrinho(itens)).toBe(50.5)
    })

    it('retorna 0 para array vazio', () => {
      expect(calcularTotalCarrinho([])).toBe(0)
    })

    it('trata subtotal null/undefined como 0', () => {
      const itens = [
        createComandaItem(10),
        { ...createComandaItem(0), subtotal: null },
      ] as ComandaItem[]
      expect(calcularTotalCarrinho(itens)).toBe(10)
    })
  })

  describe('calcularTotalPedidos', () => {
    it('soma os valor_total dos pedidos', () => {
      const pedidos: PedidoComanda[] = [
        { id: '1', comanda_id: '', numero: 1, confirmado_em: '', itens: [], valor_total: 50 },
        { id: '2', comanda_id: '', numero: 2, confirmado_em: '', itens: [], valor_total: 30.5 },
      ]
      expect(calcularTotalPedidos(pedidos)).toBe(80.5)
    })

    it('retorna 0 para array vazio', () => {
      expect(calcularTotalPedidos([])).toBe(0)
    })
  })

  describe('getBadgeVariant', () => {
    it('retorna "default" para status aberta', () => {
      expect(getBadgeVariant('aberta')).toBe('default')
    })

    it('retorna "secondary" para status fechada', () => {
      expect(getBadgeVariant('fechada')).toBe('secondary')
    })

    it('retorna "destructive" para status confirmada', () => {
      expect(getBadgeVariant('confirmada')).toBe('destructive')
    })

    it('retorna "destructive" para status cancelada', () => {
      expect(getBadgeVariant('cancelada')).toBe('destructive')
    })
  })

  describe('formatarLabelItens', () => {
    it('retorna "item" para quantidade 1', () => {
      expect(formatarLabelItens(1)).toBe('item')
    })

    it('retorna "itens" para quantidade 2', () => {
      expect(formatarLabelItens(2)).toBe('itens')
    })

    it('retorna "itens" para quantidade 0', () => {
      expect(formatarLabelItens(0)).toBe('itens')
    })
  })

  describe('clampQuantidade', () => {
    it('mantém valor dentro do intervalo', () => {
      expect(clampQuantidade(5, 1, 99)).toBe(5)
    })

    it('retorna min quando valor é 0', () => {
      expect(clampQuantidade(0, 1, 99)).toBe(1)
    })

    it('retorna min quando valor é negativo', () => {
      expect(clampQuantidade(-10, 1, 99)).toBe(1)
    })

    it('retorna max quando valor excede o limite', () => {
      expect(clampQuantidade(100, 1, 99)).toBe(99)
    })

    it('retorna max quando valor é muito maior que o limite', () => {
      expect(clampQuantidade(150, 1, 99)).toBe(99)
    })

    it('mantém valor dentro de limites customizados', () => {
      expect(clampQuantidade(5, 1, 10)).toBe(5)
    })

    it('retorna max com limites customizados', () => {
      expect(clampQuantidade(15, 1, 10)).toBe(10)
    })
  })

  describe('isMensagemSucesso', () => {
    it('retorna true quando mensagem contém "adicionado"', () => {
      expect(isMensagemSucesso('Item adicionado à comanda')).toBe(true)
    })

    it('retorna true quando mensagem contém "Item"', () => {
      expect(isMensagemSucesso('Item adicionado')).toBe(true)
    })

    it('retorna false para mensagem de erro', () => {
      expect(isMensagemSucesso('Comanda não encontrada')).toBe(false)
    })

    it('retorna false para mensagem de produto indisponível', () => {
      expect(isMensagemSucesso('Produto indisponível')).toBe(false)
    })

    it('retorna false para null', () => {
      expect(isMensagemSucesso(null)).toBe(false)
    })

    it('retorna false para string vazia', () => {
      expect(isMensagemSucesso('')).toBe(false)
    })
  })
})
