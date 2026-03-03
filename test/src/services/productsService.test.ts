import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProdutosService } from '@/services/productsService'
import type { Produto } from '@/types/produtos'

type SupabaseResult = { data?: unknown; error?: unknown; count?: number }

let mockSupabaseResult: SupabaseResult = {}

function createChain() {
  const chain: Record<string, unknown> = {}
  const thenable = {
    then: (onFulfilled: (v: SupabaseResult) => unknown, onRejected?: (e: unknown) => unknown) =>
      Promise.resolve(mockSupabaseResult).then(onFulfilled, onRejected),
    catch: (onRejected: (e: unknown) => unknown) =>
      Promise.resolve(mockSupabaseResult).catch(onRejected),
  }
  Object.assign(chain, thenable)

  chain.select = vi.fn(() => chain)
  chain.eq = vi.fn(() => chain)
  chain.order = vi.fn(() => chain)
  chain.limit = vi.fn(() => chain)
  chain.range = vi.fn(() => chain)
  chain.or = vi.fn(() => chain)
  chain.insert = vi.fn(() => chain)
  chain.update = vi.fn(() => chain)
  chain.delete = vi.fn(() => chain)
  chain.single = vi.fn(() => chain)

  return chain
}

const mockFrom = vi.fn((table: string) => {
  void table
  return createChain()
})

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: (t: string) => mockFrom(t),
  },
}))

vi.mock('@/lib/logger', () => ({
  default: {
    debug: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}))

const produtoFake: Produto = {
  id: '1',
  nome: 'Produto Teste',
  descricao: 'Desc',
  preco: 10,
  categoria: 'sobremesas',
  destaque: false,
  imagem: '',
  ingredientes: undefined,
}

describe('ProdutosService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabaseResult = {}
  })

  describe('findAll', () => {
    it('chama supabase.from com "produtos" quando busca com sucesso', async () => {
      mockSupabaseResult = { data: [produtoFake], error: null }
      const service = new ProdutosService()

      await service.findAll()

      expect(mockFrom).toHaveBeenCalledWith('produtos')
    })

    it('retorna lista de produtos quando busca com sucesso', async () => {
      mockSupabaseResult = { data: [produtoFake], error: null }
      const service = new ProdutosService()

      const result = await service.findAll()

      expect(result).toEqual([produtoFake])
    })

    it('retorna array vazio quando data é null', async () => {
      mockSupabaseResult = { data: null, error: null }
      const service = new ProdutosService()

      const result = await service.findAll()

      expect(result).toEqual([])
    })

    it('lança erro quando supabase retorna error', async () => {
      const err = new Error('Erro de rede')
      mockSupabaseResult = { data: null, error: err }
      const service = new ProdutosService()

      await expect(service.findAll()).rejects.toThrow('Erro de rede')
    })
  })

  describe('findById', () => {
    it('chama supabase.from com "produtos" ao buscar por id', async () => {
      mockSupabaseResult = { data: [produtoFake], error: null }
      const service = new ProdutosService()

      await service.findById('1')

      expect(mockFrom).toHaveBeenCalledWith('produtos')
    })

    it('retorna produto quando encontrado', async () => {
      mockSupabaseResult = { data: [produtoFake], error: null }
      const service = new ProdutosService()

      const result = await service.findById('1')

      expect(result).toEqual(produtoFake)
    })

    it('retorna null quando produto não existe', async () => {
      mockSupabaseResult = { data: [], error: null }
      const service = new ProdutosService()

      const result = await service.findById('inexistente')

      expect(result).toBeNull()
    })

    it('lança erro quando supabase retorna error', async () => {
      mockSupabaseResult = { data: null, error: new Error('Erro') }
      const service = new ProdutosService()

      await expect(service.findById('1')).rejects.toThrow('Erro')
    })
  })

  describe('findByCategoria', () => {
    it('chama supabase.from com "produtos" ao buscar por categoria', async () => {
      mockSupabaseResult = { data: [produtoFake], error: null }
      const service = new ProdutosService()

      await service.findByCategoria('sobremesas')

      expect(mockFrom).toHaveBeenCalledWith('produtos')
    })

    it('retorna produtos da categoria informada', async () => {
      mockSupabaseResult = { data: [produtoFake], error: null }
      const service = new ProdutosService()

      const result = await service.findByCategoria('sobremesas')

      expect(result).toEqual([produtoFake])
    })

    it('retorna array vazio quando não há produtos na categoria', async () => {
      mockSupabaseResult = { data: [], error: null }
      const service = new ProdutosService()

      const result = await service.findByCategoria('cervejas')

      expect(result).toEqual([])
    })

    it('lança erro quando supabase retorna error', async () => {
      mockSupabaseResult = { data: null, error: new Error('Erro') }
      const service = new ProdutosService()

      await expect(service.findByCategoria('sobremesas')).rejects.toThrow('Erro')
    })
  })

  describe('findDestaques', () => {
    it('chama supabase.from com "produtos" ao buscar destaques', async () => {
      mockSupabaseResult = { data: [{ ...produtoFake, destaque: true }], error: null }
      const service = new ProdutosService()

      await service.findDestaques()

      expect(mockFrom).toHaveBeenCalledWith('produtos')
    })

    it('retorna lista com um produto em destaque', async () => {
      mockSupabaseResult = { data: [{ ...produtoFake, destaque: true }], error: null }
      const service = new ProdutosService()

      const result = await service.findDestaques()

      expect(result).toHaveLength(1)
    })

    it('retorna produto com destaque true', async () => {
      mockSupabaseResult = { data: [{ ...produtoFake, destaque: true }], error: null }
      const service = new ProdutosService()

      const result = await service.findDestaques()

      expect(result[0].destaque).toBe(true)
    })

    it('retorna array vazio quando não há destaques', async () => {
      mockSupabaseResult = { data: [], error: null }
      const service = new ProdutosService()

      const result = await service.findDestaques()

      expect(result).toEqual([])
    })

    it('lança erro quando supabase retorna error', async () => {
      mockSupabaseResult = { data: null, error: new Error('Erro') }
      const service = new ProdutosService()

      await expect(service.findDestaques()).rejects.toThrow('Erro')
    })
  })

  describe('findAllPaginatedByCursor', () => {
    it('retorna data com limite de itens quando há mais itens', async () => {
      const p1 = { ...produtoFake, id: '1', nome: 'A' }
      const p2 = { ...produtoFake, id: '2', nome: 'B' }
      const p3 = { ...produtoFake, id: '3', nome: 'C' }
      mockSupabaseResult = { data: [p1, p2, p3], error: null }
      const service = new ProdutosService()

      const result = await service.findAllPaginatedByCursor(null, 2)

      expect(result.data).toHaveLength(2)
    })

    it('retorna apenas os primeiros itens do limite quando há mais itens', async () => {
      const p1 = { ...produtoFake, id: '1', nome: 'A' }
      const p2 = { ...produtoFake, id: '2', nome: 'B' }
      const p3 = { ...produtoFake, id: '3', nome: 'C' }
      mockSupabaseResult = { data: [p1, p2, p3], error: null }
      const service = new ProdutosService()

      const result = await service.findAllPaginatedByCursor(null, 2)

      expect(result.data).toEqual([p1, p2])
    })

    it('retorna nextCursor preenchido quando há mais itens', async () => {
      const p1 = { ...produtoFake, id: '1', nome: 'A' }
      const p2 = { ...produtoFake, id: '2', nome: 'B' }
      const p3 = { ...produtoFake, id: '3', nome: 'C' }
      mockSupabaseResult = { data: [p1, p2, p3], error: null }
      const service = new ProdutosService()

      const result = await service.findAllPaginatedByCursor(null, 2)

      expect(result.nextCursor).toBeTruthy()
    })

    it('retorna data com produtos quando não há mais itens', async () => {
      mockSupabaseResult = { data: [produtoFake], error: null }
      const service = new ProdutosService()

      const result = await service.findAllPaginatedByCursor(null, 10)

      expect(result.data).toEqual([produtoFake])
    })

    it('retorna nextCursor null quando não há mais itens', async () => {
      mockSupabaseResult = { data: [produtoFake], error: null }
      const service = new ProdutosService()

      const result = await service.findAllPaginatedByCursor(null, 10)

      expect(result.nextCursor).toBeNull()
    })

    it('lança erro quando supabase retorna error', async () => {
      mockSupabaseResult = { data: null, error: new Error('Erro cursor') }
      const service = new ProdutosService()

      await expect(service.findAllPaginatedByCursor(null, 10)).rejects.toThrow('Erro cursor')
    })
  })

  describe('findByCategoriaPaginatedByCursor', () => {
    it('chama supabase.from com "produtos" ao buscar por categoria paginado', async () => {
      mockSupabaseResult = { data: [produtoFake], error: null }
      const service = new ProdutosService()

      await service.findByCategoriaPaginatedByCursor('sobremesas', null, 10)

      expect(mockFrom).toHaveBeenCalledWith('produtos')
    })

    it('retorna produtos da categoria paginados por cursor', async () => {
      mockSupabaseResult = { data: [produtoFake], error: null }
      const service = new ProdutosService()

      const result = await service.findByCategoriaPaginatedByCursor('sobremesas', null, 10)

      expect(result.data).toEqual([produtoFake])
    })

    it('retorna nextCursor null quando não há mais itens na categoria', async () => {
      mockSupabaseResult = { data: [produtoFake], error: null }
      const service = new ProdutosService()

      const result = await service.findByCategoriaPaginatedByCursor('sobremesas', null, 10)

      expect(result.nextCursor).toBeNull()
    })

    it('lança erro quando supabase retorna error', async () => {
      mockSupabaseResult = { data: null, error: new Error('Erro') }
      const service = new ProdutosService()

      await expect(
        service.findByCategoriaPaginatedByCursor('sobremesas', null, 10)
      ).rejects.toThrow('Erro')
    })
  })

  describe('findAllPaginated', () => {
    it('chama supabase.from com "produtos" ao buscar paginado', async () => {
      mockSupabaseResult = { data: [produtoFake], error: null }
      const service = new ProdutosService()

      await service.findAllPaginated(0, 10)

      expect(mockFrom).toHaveBeenCalledWith('produtos')
    })

    it('retorna produtos com offset e limit', async () => {
      mockSupabaseResult = { data: [produtoFake], error: null }
      const service = new ProdutosService()

      const result = await service.findAllPaginated(0, 10)

      expect(result).toEqual([produtoFake])
    })

    it('lança erro quando supabase retorna error', async () => {
      mockSupabaseResult = { data: null, error: new Error('Erro') }
      const service = new ProdutosService()

      await expect(service.findAllPaginated(0, 10)).rejects.toThrow('Erro')
    })
  })

  describe('countAll', () => {
    it('retorna contagem total de produtos', async () => {
      mockSupabaseResult = { count: 42, error: null }
      const service = new ProdutosService()

      const result = await service.countAll()

      expect(result).toBe(42)
    })

    it('retorna 0 quando count é undefined', async () => {
      mockSupabaseResult = { error: null }
      const service = new ProdutosService()

      const result = await service.countAll()

      expect(result).toBe(0)
    })

    it('lança erro quando supabase retorna error', async () => {
      mockSupabaseResult = { count: 0, error: new Error('Erro') }
      const service = new ProdutosService()

      await expect(service.countAll()).rejects.toThrow('Erro')
    })
  })

  describe('findByCategoriaPaginated', () => {
    it('chama supabase.from com "produtos" ao buscar por categoria paginado', async () => {
      mockSupabaseResult = { data: [produtoFake], error: null }
      const service = new ProdutosService()

      await service.findByCategoriaPaginated('sobremesas', 0, 10)

      expect(mockFrom).toHaveBeenCalledWith('produtos')
    })

    it('retorna produtos da categoria com offset e limit', async () => {
      mockSupabaseResult = { data: [produtoFake], error: null }
      const service = new ProdutosService()

      const result = await service.findByCategoriaPaginated('sobremesas', 0, 10)

      expect(result).toEqual([produtoFake])
    })

    it('lança erro quando supabase retorna error', async () => {
      mockSupabaseResult = { data: null, error: new Error('Erro') }
      const service = new ProdutosService()

      await expect(service.findByCategoriaPaginated('sobremesas', 0, 10)).rejects.toThrow('Erro')
    })
  })

  describe('countByCategoria', () => {
    it('retorna contagem de produtos da categoria', async () => {
      mockSupabaseResult = { count: 5, error: null }
      const service = new ProdutosService()

      const result = await service.countByCategoria('sobremesas')

      expect(result).toBe(5)
    })

    it('retorna 0 quando count é undefined', async () => {
      mockSupabaseResult = { error: null }
      const service = new ProdutosService()

      const result = await service.countByCategoria('cervejas')

      expect(result).toBe(0)
    })

    it('lança erro quando supabase retorna error', async () => {
      mockSupabaseResult = { count: 0, error: new Error('Erro') }
      const service = new ProdutosService()

      await expect(service.countByCategoria('sobremesas')).rejects.toThrow('Erro')
    })
  })

  describe('create', () => {
    it('chama supabase.from com "produtos" ao criar', async () => {
      const novo = { ...produtoFake, id: undefined } as Omit<Produto, 'id'>
      const criado = { ...produtoFake, id: 'novo-id' }
      mockSupabaseResult = { data: criado, error: null }
      const service = new ProdutosService()

      await service.create(novo)

      expect(mockFrom).toHaveBeenCalledWith('produtos')
    })

    it('cria e retorna produto', async () => {
      const novo = { ...produtoFake, id: undefined } as Omit<Produto, 'id'>
      const criado = { ...produtoFake, id: 'novo-id' }
      mockSupabaseResult = { data: criado, error: null }
      const service = new ProdutosService()

      const result = await service.create(novo)

      expect(result).toEqual(criado)
    })

    it('lança erro quando supabase retorna error', async () => {
      const novo = { ...produtoFake, id: undefined } as Omit<Produto, 'id'>
      mockSupabaseResult = { data: null, error: new Error('Erro ao inserir') }
      const service = new ProdutosService()

      await expect(service.create(novo)).rejects.toThrow('Erro ao inserir')
    })
  })

  describe('update', () => {
    it('chama supabase.from com "produtos" ao atualizar', async () => {
      const atualizado = { ...produtoFake, nome: 'Nome Atualizado' }
      mockSupabaseResult = { data: atualizado, error: null }
      const service = new ProdutosService()

      await service.update('1', { nome: 'Nome Atualizado' })

      expect(mockFrom).toHaveBeenCalledWith('produtos')
    })

    it('atualiza e retorna produto', async () => {
      const atualizado = { ...produtoFake, nome: 'Nome Atualizado' }
      mockSupabaseResult = { data: atualizado, error: null }
      const service = new ProdutosService()

      const result = await service.update('1', { nome: 'Nome Atualizado' })

      expect(result).toEqual(atualizado)
    })

    it('retorna null quando data é undefined', async () => {
      mockSupabaseResult = { data: undefined, error: null }
      const service = new ProdutosService()

      const result = await service.update('1', { nome: 'x' })

      expect(result).toBeNull()
    })

    it('lança erro quando supabase retorna error', async () => {
      mockSupabaseResult = { data: null, error: new Error('Erro ao atualizar') }
      const service = new ProdutosService()

      await expect(service.update('1', { nome: 'x' })).rejects.toThrow('Erro ao atualizar')
    })
  })

  describe('delete', () => {
    it('chama supabase.from com "produtos" ao deletar', async () => {
      mockSupabaseResult = { error: null }
      const service = new ProdutosService()

      await service.delete('1')

      expect(mockFrom).toHaveBeenCalledWith('produtos')
    })

    it('deleta produto e retorna true', async () => {
      mockSupabaseResult = { error: null }
      const service = new ProdutosService()

      const result = await service.delete('1')

      expect(result).toBe(true)
    })

    it('lança erro quando supabase retorna error', async () => {
      mockSupabaseResult = { error: new Error('Erro ao deletar') }
      const service = new ProdutosService()

      await expect(service.delete('1')).rejects.toThrow('Erro ao deletar')
    })
  })
})
