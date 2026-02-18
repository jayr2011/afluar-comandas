import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  const whatsappLink = 'https://wa.me/5591999999999'
  const instagramLink = 'https://instagram.com/afluar.entregas'
  const sectionId = `footer-social`

  return (
    <footer
      role="contentinfo"
      className="bg-muted/30 border-t border-border/40 pt-12 pb-6"
      aria-label="Rodapé do site"
    >
      <div className="container mx-auto px-4">
        <section
          aria-labelledby={sectionId}
          className="mb-8 flex flex-col items-center text-center gap-4"
        >
          <h3 id={sectionId} className="font-semibold text-foreground">
            Acompanhe & Peça
          </h3>

          <nav aria-label="Redes sociais">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                asChild
                className="border-input transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <a
                  href={instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Acessar perfil no Instagram (abre em nova janela)"
                >
                  <FaInstagram className="h-5 w-5" aria-hidden="true" />
                </a>
              </Button>

              <Button
                variant="outline"
                size="icon"
                asChild
                className="border-input transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Falar conosco pelo WhatsApp (abre em nova janela)"
                >
                  <FaWhatsapp className="h-5 w-5" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </nav>

          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Atendimento todos os dias das 18h às 23h
          </p>
        </section>

        <Separator className="bg-border/40 my-6" aria-hidden="true" />

        <div className="text-center text-xs text-muted-foreground">
          <p>© 2026 Afluar Entregas. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
