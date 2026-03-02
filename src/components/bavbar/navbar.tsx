'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Home, UtensilsCrossed, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'

const navItems = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/cardapio', label: 'Cardápio', icon: UtensilsCrossed },
  { href: '/comanda', label: 'Minha comanda', icon: FileText },
]

export function Navbar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <header
      role="banner"
      className="sticky top-0 z-50 w-full bg-primary border-b border-primary/20 shadow-lg"
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-primary-foreground focus:text-primary focus:rounded-md focus:outline-none focus:ring-2 focus:ring-primary-foreground/30"
      >
        Pular para o conteúdo principal
      </a>
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center space-x-3 group rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          aria-label="Afluar - Página inicial"
        >
          <div
            aria-hidden="true"
            className="h-12 w-12 bg-primary-foreground rounded-full flex items-center justify-center font-bold text-2xl text-primary transition-transform group-hover:scale-110"
          >
            A
          </div>
          <div aria-hidden="true" className="flex flex-col">
            <span className="font-bold text-2xl text-primary-foreground tracking-tight">
              Afluar
            </span>
          </div>
        </Link>

        <nav aria-label="Menu principal" className="hidden md:flex items-center gap-8">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={`text-sm font-medium transition-colors relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground rounded-sm focus-visible:ring-offset-4 focus-visible:ring-offset-primary ${
                isActive(item.href)
                  ? 'text-primary-foreground'
                  : 'text-primary-foreground/80 hover:text-primary-foreground'
              }`}
            >
              {item.label}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-primary-foreground transition-all ${
                  isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
                aria-hidden="true"
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="secondary"
                size="icon"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-11 w-11 focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:outline-none"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Abrir menu de navegação</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              aria-describedby={undefined}
              className="w-80 bg-linear-to-b from-primary to-primary/95 border-l border-primary-foreground/10 [&_button]:text-primary-foreground [&_button]:hover:bg-primary-foreground/10"
            >
              <SheetHeader className="space-y-4">
                <SheetTitle className="text-2xl font-bold text-primary-foreground text-left">
                  Menu
                </SheetTitle>
                <Separator className="bg-primary-foreground/20" aria-hidden="true" />
              </SheetHeader>

              <nav aria-label="Menu de navegação" className="flex flex-col gap-2 mt-8">
                {navItems.map(item => {
                  const Icon = item.icon
                  return (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={isActive(item.href) ? 'page' : undefined}
                        className={`flex items-center gap-4 px-4 py-4 rounded-lg transition-all group ${
                          isActive(item.href)
                            ? 'text-primary-foreground bg-primary-foreground/15'
                            : 'text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10'
                        }`}
                      >
                        <Icon
                          aria-hidden="true"
                          className={`h-5 w-5 transition-transform ${
                            isActive(item.href) ? 'scale-110' : 'group-hover:scale-110'
                          }`}
                        />
                        <span
                          className={`text-lg ${isActive(item.href) ? 'font-semibold' : 'font-medium'}`}
                        >
                          {item.label}
                        </span>
                      </Link>
                    </SheetClose>
                  )
                })}
              </nav>

              <div className="absolute bottom-8 left-0 right-0 px-6">
                <Separator className="bg-primary-foreground/20 mb-4" aria-hidden="true" />
                <div className="text-center">
                  <p className="text-sm text-primary-foreground/70">
                    Afluar - Restaurante
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
