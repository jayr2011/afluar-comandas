export function getSaudacao(): string {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return 'Bom dia'
  if (h >= 12 && h < 18) return 'Boa tarde'
  return 'Boa noite'
}

export function getPrimeiroNome(nome: string): string {
  return nome.trim().split(/\s+/)[0] || nome
}

type SaudacaoClienteProps = {
  clienteNome?: string | null
  garcomNome?: string | null
  className?: string
}

export function SaudacaoCliente({ clienteNome, garcomNome, className }: SaudacaoClienteProps) {
  const saudacao = getSaudacao()

  const texto = clienteNome
    ? `${saudacao}, ${getPrimeiroNome(clienteNome)}! Seja bem-vindo ao Afluar.`
    : `${saudacao}! Seja bem-vindo ao Afluar.`

  return (
    <div className="space-y-1">
      <p className={className ?? 'text-lg text-muted-foreground'}>{texto}</p>
      {garcomNome && <p className="text-sm text-muted-foreground/80">Seu garçom: {garcomNome}</p>}
    </div>
  )
}
