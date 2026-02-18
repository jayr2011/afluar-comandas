import { AlertCircle, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ErrorStateProps {
  icon?: LucideIcon
  title?: string
  message?: string
  action?: React.ReactNode
  fullScreen?: boolean
  className?: string
}

export function ErrorState({
  icon: Icon = AlertCircle,
  title = 'Ops!',
  message = 'Algo deu errado. Tente novamente mais tarde.',
  action,
  fullScreen = false,
  className,
}: ErrorStateProps) {
  const baseId = crypto.randomUUID()
  const titleId = `error-title-${baseId}`
  const messageId = `error-message-${baseId}`

  const content = (
    <section
      role="alert"
      aria-labelledby={titleId}
      aria-describedby={messageId}
      className={cn('text-center max-w-md px-4', className)}
    >
      <div className="flex justify-center mb-4" aria-hidden="true">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <Icon className="h-8 w-8" strokeWidth={1.5} aria-hidden="true" />
        </div>
      </div>
      <h2 id={titleId} className="text-2xl font-bold text-foreground mb-2">
        {title}
      </h2>
      <p id={messageId} className="text-muted-foreground mb-6">
        {message}
      </p>
      {action && <div className="flex justify-center">{action}</div>}
    </section>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-background to-primary/5">
        {content}
      </div>
    )
  }

  return <div className="flex items-center justify-center py-16">{content}</div>
}
