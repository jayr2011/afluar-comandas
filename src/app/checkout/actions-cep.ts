'use server'

import { buscarEnderecoPorCep } from '@/lib/cep'

export async function getEnderecoPorCep(cep: string) {
  return buscarEnderecoPorCep(cep)
}
