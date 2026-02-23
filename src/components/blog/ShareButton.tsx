'use client'

import { Button } from '@/components/ui/button'
import { Link2, Mail } from 'lucide-react'
import { FacebookIcon } from '../ui/icons/facebook'
import { InstagramIcon } from '../ui/icons/instagram'
import { WhatsappIcon } from '../ui/icons/whatsapp'
import { useState } from 'react'

interface ShareButtonsProps {
  title: string
  url: string
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const fullUrl = `https://afluar.com.br${url}`

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    instagram: `https://www.instagram.com/?url=${encodeURIComponent(fullUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(fullUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title)}%20${encodeURIComponent(fullUrl)}`,
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="icon" asChild>
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Compartilhar no Facebook"
        >
          <FacebookIcon />
        </a>
      </Button>

      <Button variant="outline" size="icon" asChild>
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Compartilhar no WhatsApp"
        >
          <WhatsappIcon />
        </a>
      </Button>

      <Button variant="outline" size="icon" asChild>
        <a
          href={shareLinks.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Compartilhar no Twitter"
        >
          <InstagramIcon />
        </a>
      </Button>

      <Button variant="outline" size="icon" asChild>
        <a href={shareLinks.email} aria-label="Compartilhar por Email">
          <Mail className="w-4 h-4" />
        </a>
      </Button>

      <Button variant="outline" size="icon" onClick={copyToClipboard} aria-label="Copiar link">
        {copied ? <span className="text-xs">Copiado!</span> : <Link2 className="w-4 h-4" />}
      </Button>
    </div>
  )
}
