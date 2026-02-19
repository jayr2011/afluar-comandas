import logger from '@/lib/logger'

export interface EnderecoPorCep {
  logradouro: string
  bairro: string
  localidade: string
  uf: string
  cep: string
}

const VIA_CEP_URL = 'https://viacep.com.br/ws'

export async function buscarEnderecoPorCep(cep: string): Promise<EnderecoPorCep | null> {
  const apenasDigitos = cep.replace(/\D/g, '')
  if (apenasDigitos.length !== 8) {
    logger.warn('[cep] formato de CEP inválido', { cep, apenasDigitos })
    return null
  }

  const url = `${VIA_CEP_URL}/${apenasDigitos}/json/`

  try {
    const res = await fetch(url)

    if (!res.ok) {
      logger.error('[cep] falha na requisição ao serviço externo', {
        cep: apenasDigitos,
        status: res.status,
        statusText: res.statusText,
        url,
      })
      return null
    }

    const data = await res.json()
    if (data.erro === true) {
      logger.info('[cep] CEP não encontrado', { cep: apenasDigitos })
      return null
    }

    logger.debug('[cep] endereço obtido com sucesso', {
      cep: data.cep ?? apenasDigitos,
      localidade: data.localidade,
      uf: data.uf,
    })

    return {
      cep: data.cep ?? '',
      logradouro: data.logradouro ?? '',
      bairro: data.bairro ?? '',
      localidade: data.localidade ?? '',
      uf: data.uf ?? '',
    }
  } catch (err) {
    logger.error('[cep] erro inesperado ao buscar endereço', {
      cep: apenasDigitos,
      error: err instanceof Error ? err.message : err,
    })
    return null
  }
}
