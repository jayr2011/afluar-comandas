import { describe, it, expect } from 'vitest'
import { applyRealtimeEvent } from '@/lib/applyRealTimeEvent'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

type Item = { id: string; nome: string }

const item1: Item = { id: '1', nome: 'A' }
const item2: Item = { id: '2', nome: 'B' }
const item3: Item = { id: '3', nome: 'C' }

function payload<T extends Record<string, unknown>>(
  eventType: 'INSERT' | 'UPDATE' | 'DELETE',
  old: Partial<T>,
  novo: Partial<T>
): RealtimePostgresChangesPayload<Record<string, unknown>> {
  return {
    schema: 'public',
    table: 'produtos',
    commit_timestamp: '',
    errors: [],
    eventType,
    old,
    new: novo,
  }
}

describe('applyRealtimeEvent', () => {
  describe('DELETE', () => {
    it('remove item do array quando id existe', () => {
      const current: Item[] = [item1, item2, item3]
      const p = payload('DELETE', { id: '2' }, {})

      const result = applyRealtimeEvent(current, p)

      expect(result).toHaveLength(2)
    })

    it('retorna array sem o item deletado', () => {
      const current: Item[] = [item1, item2, item3]
      const p = payload('DELETE', { id: '2' }, {})

      const result = applyRealtimeEvent(current, p)

      expect(result).toEqual([item1, item3])
    })

    it('retorna current quando deletedId é vazio', () => {
      const current: Item[] = [item1]
      const p = payload('DELETE', {}, {})

      const result = applyRealtimeEvent(current, p)

      expect(result).toBe(current)
    })

    it('retorna current quando payload.old não tem id', () => {
      const current: Item[] = [item1]
      const p = payload('DELETE', { nome: 'x' }, {})

      const result = applyRealtimeEvent(current, p)

      expect(result).toBe(current)
    })
  })

  describe('INSERT', () => {
    it('adiciona row no início quando não existe', () => {
      const current: Item[] = [item1, item2]
      const novo = { id: '4', nome: 'D' }
      const p = payload('INSERT', {}, novo)

      const result = applyRealtimeEvent(current, p)

      expect(result[0]).toEqual(novo)
    })

    it('retorna array com novo item no início', () => {
      const current: Item[] = [item1, item2]
      const novo = { id: '4', nome: 'D' }
      const p = payload('INSERT', {}, novo)

      const result = applyRealtimeEvent(current, p)

      expect(result).toEqual([novo, item1, item2])
    })

    it('atualiza item existente quando id já existe', () => {
      const current: Item[] = [item1, item2]
      const atualizado = { id: '1', nome: 'A-atualizado' }
      const p = payload('INSERT', {}, atualizado)

      const result = applyRealtimeEvent(current, p)

      expect(result.find(i => i.id === '1')).toEqual(atualizado)
    })

    it('retorna current quando row não tem id', () => {
      const current: Item[] = [item1]
      const p = payload('INSERT', {}, { nome: 'sem-id' })

      const result = applyRealtimeEvent(current, p)

      expect(result).toBe(current)
    })
  })

  describe('UPDATE', () => {
    it('atualiza item existente quando id existe', () => {
      const current: Item[] = [item1, item2]
      const atualizado = { id: '1', nome: 'A-novo' }
      const p = payload('UPDATE', {}, atualizado)

      const result = applyRealtimeEvent(current, p)

      expect(result.find(i => i.id === '1')).toEqual(atualizado)
    })

    it('retorna array com item atualizado no lugar', () => {
      const current: Item[] = [item1, item2]
      const atualizado = { id: '1', nome: 'A-novo' }
      const p = payload('UPDATE', {}, atualizado)

      const result = applyRealtimeEvent(current, p)

      expect(result).toEqual([atualizado, item2])
    })

    it('adiciona no início quando id não existe', () => {
      const current: Item[] = [item1]
      const novo = { id: '4', nome: 'D' }
      const p = payload('UPDATE', {}, novo)

      const result = applyRealtimeEvent(current, p)

      expect(result[0]).toEqual(novo)
    })

    it('retorna current quando row não tem id', () => {
      const current: Item[] = [item1]
      const p = payload('UPDATE', {}, { nome: 'sem-id' })

      const result = applyRealtimeEvent(current, p)

      expect(result).toBe(current)
    })
  })

  describe('eventType desconhecido', () => {
    it('retorna current quando eventType não é INSERT, UPDATE ou DELETE', () => {
      const current: Item[] = [item1]
      const p = {
        ...payload('INSERT', {}, item1),
        eventType: 'UNKNOWN',
      } as unknown as RealtimePostgresChangesPayload<Record<string, unknown>>

      const result = applyRealtimeEvent(current, p)

      expect(result).toBe(current)
    })
  })
})
