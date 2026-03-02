import { headers } from 'next/headers'
import logger from '@/lib/logger'

const LOG_PREFIX = '[rate-limit]'

type RateLimitResult = {
  success: boolean
  remaining: number
  reset: number
}

type RateLimitConfig = {
  limit: number
  windowMs: number
}

type CacheEntry = {
  count: number
  resetTime: number
  windowStart: number
}

const cache = new Map<string, CacheEntry>()
const CLEANUP_INTERVAL = 5 * 60 * 1000
let lastCleanup = Date.now()

function cleanupCache() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return

  lastCleanup = now
  let removed = 0

  for (const [key, entry] of cache.entries()) {
    if (entry.resetTime < now) {
      cache.delete(key)
      removed++
    }
  }

  if (removed > 0) {
    logger.debug(`${LOG_PREFIX} cache cleanup: ${removed} entries removed`)
  }
}

function getCacheKey(identifier: string, windowMs: number): string {
  const now = Date.now()
  const windowIndex = Math.floor(now / windowMs)
  return `${identifier}:${windowIndex}`
}

export async function getRateLimitIdentifier(): Promise<string> {
  const headersList = await headers()

  const userId = headersList.get('x-user-id')
  if (userId) {
    return `user:${userId}`
  }

  const forwarded = headersList.get('x-forwarded-for')
  const ip = forwarded
    ? forwarded.split(',')[0].trim()
    : (headersList.get('x-real-ip') ?? 'unknown')

  return `ip:${ip}`
}

export function createRateLimiter(config: RateLimitConfig) {
  const { limit, windowMs } = config

  return {
    limit(identifier: string): { success: boolean; remaining: number; reset: number } {
      cleanupCache()

      const key = getCacheKey(identifier, windowMs)
      const now = Date.now()
      const windowStart = Math.floor(now / windowMs) * windowMs
      const resetTime = windowStart + windowMs

      const entry = cache.get(key)

      if (!entry || entry.windowStart !== windowStart) {
        cache.set(key, { count: 1, resetTime, windowStart })
        return { success: true, remaining: limit - 1, reset: resetTime }
      }

      if (entry.count >= limit) {
        logger.debug(`${LOG_PREFIX} rate limit excedido`, { key, count: entry.count, limit })
        return { success: false, remaining: 0, reset: entry.resetTime }
      }

      entry.count++
      cache.set(key, entry)

      return { success: true, remaining: limit - entry.count, reset: entry.resetTime }
    },
  }
}

let _login: ReturnType<typeof createRateLimiter> | null = null
let _upload: ReturnType<typeof createRateLimiter> | null = null
let _api: ReturnType<typeof createRateLimiter> | null = null
let _comments: ReturnType<typeof createRateLimiter> | null = null

function getLoginLimiter() {
  if (!_login) _login = createRateLimiter({ limit: 5, windowMs: 60000 })
  return _login
}

function getUploadLimiter() {
  if (!_upload) _upload = createRateLimiter({ limit: 20, windowMs: 60000 })
  return _upload
}

function getApiLimiter() {
  if (!_api) _api = createRateLimiter({ limit: 100, windowMs: 60000 })
  return _api
}

function getCommentsLimiter() {
  if (!_comments) _comments = createRateLimiter({ limit: 5, windowMs: 60000 })
  return _comments
}

export const rateLimiters = {
  get login() {
    return getLoginLimiter()
  },
  get upload() {
    return getUploadLimiter()
  },
  get api() {
    return getApiLimiter()
  },
  get comments() {
    return getCommentsLimiter()
  },
}

export async function checkRateLimit(
  limiter: ReturnType<typeof createRateLimiter> | null,
  identifier?: string
): Promise<RateLimitResult> {
  if (!limiter) {
    return { success: true, remaining: -1, reset: Date.now() + 60000 }
  }

  const id = identifier ?? (await getRateLimitIdentifier())

  try {
    const result = limiter.limit(id)

    logger.debug(`${LOG_PREFIX} rate limit check`, {
      identifier: id,
      success: result.success,
      remaining: result.remaining,
    })

    return result
  } catch (error) {
    logger.error(`${LOG_PREFIX} erro ao verificar rate limit`, {
      error: error instanceof Error ? error.message : String(error),
      identifier: id,
    })

    return { success: true, remaining: -1, reset: Date.now() + 60000 }
  }
}

export async function withRateLimit(
  limiter: ReturnType<typeof createRateLimiter> | null,
  identifier?: string
): Promise<null | Response> {
  const result = await checkRateLimit(limiter, identifier)

  if (!result.success) {
    const id = identifier ?? (await getRateLimitIdentifier())
    logger.warn(`${LOG_PREFIX} rate limit excedido`, {
      identifier: id,
      remaining: result.remaining,
    })

    return new Response(
      JSON.stringify({
        error: 'Too many requests',
        message: 'Você excedeu o limite de requisições. Tente novamente mais tarde.',
        retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': result.reset.toString(),
        },
      }
    )
  }

  return null
}

export async function throwIfRateLimited(
  limiter: ReturnType<typeof createRateLimiter> | null,
  identifier?: string
): Promise<void> {
  const result = await checkRateLimit(limiter, identifier)

  if (!result.success) {
    const id = identifier ?? (await getRateLimitIdentifier())
    logger.warn(`${LOG_PREFIX} rate limit excedido em Server Action`, {
      identifier: id,
      remaining: result.remaining,
    })
    throw new Error('Too many requests. Please try again later.')
  }
}
