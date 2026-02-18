export interface EnderecoPorCep {
  logradouro: string
  bairro: string
  localidade: string
  uf: string
  cep: string
}

const VIA_CEP_URL = 'https://viacep.com.br/ws'

/**
 * Busca endereço pelo CEP (apenas dígitos, 8 caracteres).
 * Usa a API pública ViaCEP.
 */
export async function buscarEnderecoPorCep(cep: string): Promise<EnderecoPorCep | null> {
  const apenasDigitos = cep.replace(/\D/g, '')
  if (apenasDigitos.length !== 8) return null

  const res = await fetch(`${VIA_CEP_URL}/${apenasDigitos}/json/`)

  if (!res.ok) return null

  const data = await res.json()
  if (data.erro === true) return null

  return {
    cep: data.cep ?? '',
    logradouro: data.logradouro ?? '',
    bairro: data.bairro ?? '',
    localidade: data.localidade ?? '',
    uf: data.uf ?? '',
  }
}
