import { cookies } from 'next/headers'

export const COMANDA_COOKIE_NAME = 'comanda_id'
const COMANDA_COOKIE_MAX_AGE = 60 * 60 * 24 * 7

export async function setComandaCookie(comandaId: string): Promise<void> {
  const store = await cookies()
  store.set(COMANDA_COOKIE_NAME, comandaId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COMANDA_COOKIE_MAX_AGE,
    path: '/',
  })
}

export async function getComandaCookie(): Promise<string | undefined> {
  const store = await cookies()
  const cookie = store.get(COMANDA_COOKIE_NAME)
  return cookie?.value
}

export async function clearComandaCookie(): Promise<void> {
  const store = await cookies()
  store.delete(COMANDA_COOKIE_NAME)
}
