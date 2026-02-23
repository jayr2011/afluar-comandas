'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { FeatureToggle } from '@/lib/feature-toggles'
import { updateFeatureToggle } from './actions'

interface FeatureTogglesListProps {
  initialToggles: FeatureToggle[]
}

export function FeatureTogglesList({ initialToggles }: FeatureTogglesListProps) {
  const [toggles, setToggles] = useState(initialToggles)
  const [isPending, startTransition] = useTransition()

  function handleToggleChange(key: string, enabled: boolean) {
    const previous = toggles

    setToggles(current => current.map(item => (item.key === key ? { ...item, enabled } : item)))

    startTransition(async () => {
      const result = await updateFeatureToggle({ key, enabled })

      if (!result.ok) {
        setToggles(previous)
        toast.error(result.error)
        return
      }

      toast.success(enabled ? 'Funcionalidade ativada.' : 'Funcionalidade desativada.')
    })
  }

  return (
    <div className="grid gap-4">
      {toggles.map(item => (
        <Card key={item.key} className="border-primary/10">
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </div>
            <Switch
              checked={item.enabled}
              onCheckedChange={checked => handleToggleChange(item.key, checked)}
              aria-label={`Alternar ${item.title}`}
              disabled={isPending}
            />
          </CardHeader>
          <CardContent className="pt-0">
            <Badge variant={item.enabled ? 'default' : 'secondary'}>
              {item.enabled ? 'Ativo' : 'Inativo'}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
