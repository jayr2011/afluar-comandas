import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

export interface QuickAccessItem {
  href: string
  title: string
  description?: string
  icon: LucideIcon
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
}

interface QuickAccessProps {
  items: QuickAccessItem[]
  className?: string
}

export function QuickAccess({ items, className }: QuickAccessProps) {
  return (
    <section className={cn('w-full px-4 py-4', className)}>
      <div className="-mx-4 flex w-auto snap-x snap-mandatory gap-3 overflow-x-auto px-2 pb-2 scroll-px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden justify-start md:justify-center">
        {items.map((item, index) => {
          const Icon = item.icon
          const variant = item.variant ?? 'default'

          return (
            <Link
              key={index}
              href={item.href}
              className={cn(
                buttonVariants({ variant, size: 'sm' }),
                'gap-2 min-w-28 max-w-36 justify-center shrink-0 snap-start'
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="truncate">{item.title}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
