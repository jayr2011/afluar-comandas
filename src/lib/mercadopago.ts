import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'

const accessToken = process.env.NEXT_PUBLIC_MERCADOPAGO_ACCESS_TOKEN ?? process.env.MP_ACCESS_TOKEN
if (!accessToken) {
  console.warn(
    'NEXT_PUBLIC_MERCADOPAGO_ACCESS_TOKEN ou MP_ACCESS_TOKEN não definida – pagamentos desabilitados'
  )
} else {
  console.log('[mercadopago] Access token configurado (últimos 10 chars):', accessToken.slice(-10))
}

const client = accessToken
  ? new MercadoPagoConfig({
      accessToken,
      options: { timeout: 5000 },
    })
  : null

export const preferenceClient = client ? new Preference(client) : null
export const paymentClient = client ? new Payment(client) : null
