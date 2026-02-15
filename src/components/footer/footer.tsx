'use client'

import { FaInstagram, FaWhatsapp } from "react-icons/fa" // Ícones oficiais
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  const whatsappLink = "https://wa.me/5591999999999" 
  const instagramLink = "https://instagram.com/afluar.entregas"

  return (
    <footer className="bg-muted/30 border-t border-border/40 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col items-center text-center gap-4">
          <h3 className="font-semibold text-foreground">Acompanhe & Peça</h3>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              asChild
              className="border-input transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <a href={instagramLink} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram className="h-5 w-5" />
              </a>
            </Button>

            <Button
              variant="outline"
              size="icon"
              asChild
              className="border-input transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <FaWhatsapp className="h-5 w-5" />
              </a>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Atendimento todos os dias das 18h às 23h
          </p>
        </div>

        <Separator className="bg-border/40 my-6" />

        <div className="text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Afluar Entregas. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}