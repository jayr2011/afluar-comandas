'use client'

import React from 'react'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export type CheckoutStep = 'carrinho' | 'endereco' | 'pagamento'

interface CheckoutBreadcrumbProps {
  currentStep: CheckoutStep
  className?: string
}

const steps: { id: CheckoutStep; label: string; href: string }[] = [
  { id: 'carrinho', label: 'Carrinho', href: '/carrinho' },
  { id: 'endereco', label: 'Endereço', href: '/checkout' },
  { id: 'pagamento', label: 'Pagamento', href: '/checkout' },
]

export function CheckoutBreadcrumb({ currentStep, className }: CheckoutBreadcrumbProps) {
  const currentIndex = steps.findIndex(s => s.id === currentStep)

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {steps.map((step, index) => {
          const isCurrent = step.id === currentStep
          const isPast = index < currentIndex

          return (
            <React.Fragment key={step.id}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isCurrent ? (
                  <BreadcrumbPage>{step.label}</BreadcrumbPage>
                ) : isPast ? (
                  <BreadcrumbLink asChild>
                    <Link href={step.href}>{step.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <span className="text-muted-foreground/70">{step.label}</span>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
