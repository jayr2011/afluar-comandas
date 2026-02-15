interface CartHeaderProps {
  title?: string
}

export function CartHeader({ title = "Carrinho" }: CartHeaderProps) {
  return <h1 className="text-4xl font-bold mb-8">{title}</h1>
}