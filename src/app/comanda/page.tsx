import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function ComandaPage() {
  return (
    <div className="w-full -mt-px">
      <section className="container mx-auto max-w-6xl px-4 pt-6 pb-10 space-y-6">
        <Separator className="bg-border/70" aria-hidden="true" />

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Minha comanda</h1>
          <p className="text-muted-foreground">
            Aqui voce acompanha os itens selecionados e finaliza seu pedido.
          </p>
        </div>

        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Comanda vazia</CardTitle>
            <CardDescription>
              Ainda nao ha itens adicionados. Explore o cardapio e monte seu pedido.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              Esta e uma pagina generica inicial da comanda.
            </p>
          </CardContent>

          <CardFooter>
            <Button asChild>
              <Link href="/cardapio">Ir para o cardapio</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  )
}
