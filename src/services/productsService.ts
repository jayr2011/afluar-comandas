import { Produto } from '@/types/produtos'
import { supabase } from '@/lib/supabase'

export class ProdutosService {
  async findAll(): Promise<Produto[]> {
    const { data, error } = await supabase.from('produtos').select('*')
    if (error) throw error
    return data
  }

  async findById(id: string): Promise<Produto | null> {
    const { data, error } = await supabase.from('produtos').select('*').eq('id', id)
    if (error) throw error
    return data[0] || null
  }

  async findByCategoria(categoria: string): Promise<Produto[]> {
    const { data, error } = await supabase.from('produtos').select('*').eq('categoria', categoria)
    if (error) throw error
    return data
  }

  async findDestaques(): Promise<Produto[]> {
    const { data, error } = await supabase.from('produtos').select('*').eq('destaque', true)
    if (error) throw error
    return data
  }

  async create(produto: Omit<Produto, 'id'>): Promise<Produto> {
    const { data, error } = await supabase.from('produtos').insert(produto).select().single()
    if (error) throw error
    return data
  }

  async update(id: string, produto: Partial<Produto>): Promise<Produto | null> {
    const { data, error } = await supabase.from('produtos').update(produto).eq('id', id).select().single()
    if (error) throw error
    return data || null
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('produtos').delete().eq('id', id)
    if (error) throw error
    return true
  }
}
