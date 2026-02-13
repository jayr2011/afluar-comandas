// src/components/navbar.tsx
"use client"

import Link from "next/link"
import { Menu, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/experiencia", label: "Experiência" },
  { href: "/cardapio", label: "Cardápio" },
  { href: "/eventos", label: "Eventos" },
  { href: "/contato", label: "Contato" },
]

export function Navbar() {
  // Descomente quando integrar com Zustand
  // const { items } = useCartStore()
  // const totalItems = items.reduce((acc, item) => acc + item.quantidade, 0)
  const totalItems = 0 // Temporário

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl">Afluar</span>
        </Link>

        {/* Navigation Menu - Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Botão Carrinho e Menu Mobile */}
        <div className="flex items-center gap-2">
          {/* Carrinho */}
          <Button variant="outline" size="icon" className="relative" asChild>
            <Link href="/carrinho">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {totalItems}
                </Badge>
              )}
            </Link>
          </Button>

          {/* Menu Mobile */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
