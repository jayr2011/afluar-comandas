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
  const content = (
    <div
      className={cn(
        'text-center max-w-md px-4',
        className
      )}
    >
      <div className="flex justify-center mb-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <Icon className="h-8 w-8" strokeWidth={1.5} />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6">{message}</p>
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-background to-primary/5">
        {content}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-16">
      {content}
    </div>
  )
}
