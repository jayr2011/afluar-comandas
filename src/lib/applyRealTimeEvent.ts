import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

export function applyRealtimeEvent<T extends { id: string }>(
  current: T[],
  payload: RealtimePostgresChangesPayload<Record<string, unknown>>
): T[] {
  if (payload.eventType === 'DELETE') {
    const deletedId = String((payload.old as Partial<T>)?.id ?? '')
    if (!deletedId) return current
    return current.filter(item => item.id !== deletedId)
  }

  const row = payload.new as T
  if (!row?.id) return current

  if (payload.eventType === 'INSERT') {
    const exists = current.some(item => item.id === row.id)
    if (exists) return current.map(item => (item.id === row.id ? row : item))
    return [row, ...current]
  }

  if (payload.eventType === 'UPDATE') {
    const exists = current.some(item => item.id === row.id)
    if (!exists) return [row, ...current]
    return current.map(item => (item.id === row.id ? row : item))
  }

  return current
}
