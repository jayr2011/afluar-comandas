const isServer = typeof window === 'undefined'

type LogMethod = (...args: unknown[]) => void

interface LoggerLike {
  debug: LogMethod
  info: LogMethod
  warn: LogMethod
  error: LogMethod
}

const shouldSample = (sampleRate: number = 0.1): boolean => {
  if (typeof window !== 'undefined') return false
  if (process.env.NODE_ENV !== 'production') return true
  return Math.random() < sampleRate
}

const clientLogger: LoggerLike = {
  debug: (...args) => {
    if (shouldSample(0.05)) console.debug('[afluar][debug]', ...args)
  },
  info: (...args) => console.info('[afluar][info]', ...args),
  warn: (...args) => console.warn('[afluar][warn]', ...args),
  error: (...args) => console.error('[afluar][error]', ...args),
}

let logger: LoggerLike = clientLogger

if (isServer) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const winston = require('winston') as typeof import('winston')
    const { combine, timestamp, json, colorize, simple } = winston.format
    const isProduction = process.env.NODE_ENV === 'production'

    const level = isProduction ? 'warn' : 'debug'

    logger = winston.createLogger({
      level,
      format: isProduction
        ? combine(timestamp(), json())
        : combine(colorize(), timestamp(), simple()),
      defaultMeta: { service: 'afluar' },
      transports: [new winston.transports.Console({ stderrLevels: ['error', 'warn'] })],
    })
  } catch (err) {
    logger = clientLogger
    console.warn('[afluar][logger] fallback para console — winston não pôde ser carregado', err)
  }
}

export default logger
