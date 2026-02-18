import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
  fullScreen?: boolean
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  fullScreen = false,
  className,
}: EmptyStateProps) {
  const baseId = crypto.randomUUID()
  const titleId = `empty-title-${baseId}`
  const descId = `empty-desc-${baseId}`

  const content = (
    <section
      aria-labelledby={titleId}
      aria-describedby={descId}
      className={cn('text-center max-w-md px-4', className)}
    >
      <div className="flex justify-center mb-4" aria-hidden="true">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary/70">
          <Icon className="h-8 w-8" strokeWidth={1.5} aria-hidden="true" />
        </div>
      </div>
      <h2 id={titleId} className="text-2xl font-bold text-foreground mb-2">
        {title}
      </h2>
      <p id={descId} className="text-muted-foreground mb-6">
        {description}
      </p>
      {action && <div className="flex justify-center gap-2">{action}</div>}
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
