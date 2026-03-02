import { FileText } from 'lucide-react'
import { VincularComandaDialog } from '@/components/comanda/VincularComandaDialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export type HomePageToggles = {
  eventos_enabled: boolean
}

export default async function Home() {
  return (
    <div className="w-full -mt-px">
      <div className="container mx-auto max-w-6xl px-4 pt-4">
        <Separator className="bg-border/70" />

        <section className="py-8">
          <Card className="border-primary/20 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-heading">
                <FileText className="h-6 w-6 text-primary" aria-hidden="true" />
                Abrir comanda
              </CardTitle>
              <CardDescription>
                Inicie sua comanda para acompanhar seus pedidos em tempo real.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <VincularComandaDialog />
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
