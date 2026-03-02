import { Separator } from '@/components/ui/separator'

export type HomePageToggles = {
  eventos_enabled: boolean
}

export default async function Home() {
  return (
    <div className="w-full -mt-px">
      <div className="container mx-auto max-w-6xl px-4 pt-4">
        <Separator className="bg-border/70" />
      </div>
    </div>
  )
}
