import Link from 'next/link'
import { unstable_noStore } from 'next/cache'
import logger from '@/lib/logger'
import { Button } from '@/components/ui/button'
import { SaudacaoCliente } from '@/components/SaudacaoCliente'
import { getComandaCookie, setComandaCookie } from '@/lib/comanda-cookie'
import { getComandaData } from '@/app/comanda/action'
import { VincularComandaDialog } from '@/components/comanda/VincularComandaDialog'
import { ComandaDetalhe } from '@/components/comanda/ComandaDetalhe'
import { Separator } from '@/components/ui/separator'

export default async function ComandaPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>
}) {
  unstable_noStore()
  const params = await searchParams
  const comandaIdFromUrl = params.c

  let comandaIdCookie = await getComandaCookie()
  if (comandaIdFromUrl && !comandaIdCookie) {
    await setComandaCookie(comandaIdFromUrl)
    comandaIdCookie = comandaIdFromUrl
  }
  const comandaId = comandaIdFromUrl ?? comandaIdCookie

  logger.info('[comanda] page render', {
    comandaIdFromUrl: comandaIdFromUrl ?? null,
    comandaIdCookie: comandaIdCookie ?? null,
    comandaIdResolvido: comandaId ?? null,
  })

  const comanda = comandaId ? await getComandaData(comandaId) : null

  logger.info('[comanda] page - getComandaData retornou', {
    comandaId,
    comandaExiste: !!comanda,
    itensCount: comanda?.itens?.length ?? 0,
  })

  return (
    <div className="w-full -mt-px">
      <section className="container mx-auto max-w-6xl px-4 pt-6 pb-10 space-y-6">
        <SaudacaoCliente
          clienteNome={comanda?.cliente_nome}
          className="text-lg text-muted-foreground pb-2"
        />
        <Separator className="bg-border/70" aria-hidden="true" />

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Minha comanda</h1>
          <p className="text-muted-foreground">
            Acompanhe os itens do seu pedido e finalize quando desejar.
          </p>
        </div>

        {comanda ? (
          <ComandaDetalhe comanda={comanda} />
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Nenhuma comanda vinculada. Abra uma comanda para começar.
            </p>
            <VincularComandaDialog triggerLabel="Abrir comanda" />
            <Button asChild variant="outline">
              <Link href="/cardapio">Ver cardápio</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}
