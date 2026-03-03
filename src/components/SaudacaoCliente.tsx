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
  className?: string
}

export function SaudacaoCliente({ clienteNome, className }: SaudacaoClienteProps) {
  const saudacao = getSaudacao()

  const texto = clienteNome
    ? `${saudacao}, ${getPrimeiroNome(clienteNome)}! Seja bem-vindo ao Afluar.`
    : `${saudacao}! Seja bem-vindo ao Afluar.`

  return <p className={className ?? 'text-lg text-muted-foreground'}>{texto}</p>
}
