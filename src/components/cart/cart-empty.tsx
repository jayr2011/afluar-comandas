"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CartEmptyProps {
  title?: string
  description?: string
  ctaLabel?: string
  ctaHref?: string
}

export function CartEmpty({
  title = "Carrinho",
  description = "Seu carrinho está vazio",
  ctaLabel = "Ver Cardápio",
  ctaHref = "/cardapio",
}: CartEmptyProps) {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <ShoppingCart className="h-6 w-6" />
        </div>
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-lg text-muted-foreground mb-8">{description}</p>
        <Button asChild>
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      </div>
    </div>
  )
}