import { Settings2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { FeatureTogglesList } from './FeatureTogglesList'
import { listAdminFeatureToggles } from './actions'

export default async function AdminTogglesPage() {
  const toggles = await listAdminFeatureToggles()

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-primary/5 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 rounded-xl border border-primary/10 bg-card p-6 shadow-sm">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Settings2 className="h-3.5 w-3.5" />
            Configurações
          </div>
          <h1 className="text-2xl font-bold text-primary">Feature Toggles</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ligue e desligue funcionalidades sem precisar de deploy.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="secondary">Admin</Badge>
            <span className="text-xs text-muted-foreground">Persistido no Supabase</span>
          </div>
        </div>

        <FeatureTogglesList initialToggles={toggles} />
      </div>
    </div>
  )
}
