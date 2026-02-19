import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'
import logger from '@/lib/logger'

const envVarName = process.env.MERCADOPAGO_ACCESS_TOKEN
  ? 'MERCADOPAGO_ACCESS_TOKEN'
  : process.env.MP_ACCESS_TOKEN
    ? 'MP_ACCESS_TOKEN'
    : null

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN ?? process.env.MP_ACCESS_TOKEN ?? undefined

if (!accessToken) {
  logger.warn(
    '[mercadopago] token ausente — pagamentos desabilitados. Defina MERCADOPAGO_ACCESS_TOKEN ou MP_ACCESS_TOKEN.'
  )
} else {
  logger.info('[mercadopago] token presente (variável usada)', { envVar: envVarName })
}

let client: MercadoPagoConfig | null = null
let _preferenceClient: Preference | null = null
let _paymentClient: Payment | null = null

if (accessToken) {
  try {
    client = new MercadoPagoConfig({
      accessToken,
      options: { timeout: 5000 },
    })

    _preferenceClient = new Preference(client)
    _paymentClient = new Payment(client)

    logger.info('[mercadopago] cliente inicializado com sucesso', {
      preferenceClient: !!_preferenceClient,
      paymentClient: !!_paymentClient,
    })
  } catch (err) {
    logger.error('[mercadopago] falha ao inicializar cliente MercadoPago', {
      error: err instanceof Error ? err.message : err,
    })
    client = null
    _preferenceClient = null
    _paymentClient = null
  }
} else {
  logger.debug('[mercadopago] clientes não instanciados (token ausente)')
}

export const preferenceClient = _preferenceClient
export const paymentClient = _paymentClient
