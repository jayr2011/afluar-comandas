import Link from 'next/link'
import { FileText } from 'lucide-react'
import { VincularComandaDialog } from '@/components/comanda/VincularComandaDialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getComandaCookie } from '@/lib/comanda-cookie'
import { getComandaData } from '@/app/comanda/action'

export type HomePageToggles = {
  eventos_enabled: boolean
}

export default async function Home() {
  const comandaId = await getComandaCookie()
  const comanda = comandaId ? await getComandaData(comandaId) : null
  const comandaAberta = comanda?.status === 'aberta' || comanda?.status === 'confirmada'

  return (
    <div className="w-full -mt-px">
      <div className="container mx-auto max-w-6xl px-4 pt-4">
        <Separator className="bg-border/70" />

        <section className="py-8">
          {comandaAberta ? (
            <Card className="border-primary/20 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-6 text-2xl font-heading">
                  <FileText className="h-6 w-6 text-primary" aria-hidden="true" />
                  Sua comanda está aberta
                </CardTitle>
                <CardDescription>Acesse para ver itens e gerenciar.</CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-10">
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-2xl">
                  <Link href="/cardapio">Ir pro cardápio</Link>
                </Button>
                <Button asChild size="lg" className="w-full sm:w-auto text-2xl">
                  <Link href="/comanda">Ir para comanda</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
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
          )}
        </section>
      </div>
    </div>
  )
}
