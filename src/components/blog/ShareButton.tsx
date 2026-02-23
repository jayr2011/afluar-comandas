'use client'

import { Button } from '@/components/ui/button'
import { Link2, Mail } from 'lucide-react'
import { FacebookIcon } from '../ui/icons/facebook'
import { InstagramIcon } from '../ui/icons/instagram'
import { WhatsappIcon } from '../ui/icons/whatsapp'
import { useState, type MouseEvent } from 'react'

interface ShareButtonsProps {
  title: string
  url: string
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const fullUrl = `https://afluar.com.br${url}`
  const encodedTitle = encodeURIComponent(title)
  const encodedBody = encodeURIComponent(fullUrl)
  const mailtoLink = `mailto:?subject=${encodedTitle}&body=${encodedBody}`

  const emailProviderLinks = {
    gmailWeb: `https://mail.google.com/mail/?view=cm&fs=1&su=${encodedTitle}&body=${encodedBody}`,
    outlookWeb: `https://outlook.office.com/mail/deeplink/compose?subject=${encodedTitle}&body=${encodedBody}`,
    yahooWeb: `https://compose.mail.yahoo.com/?subject=${encodedTitle}&body=${encodedBody}`,
    gmailApp: `googlegmail://co?subject=${encodedTitle}&body=${encodedBody}`,
    outlookApp: `ms-outlook://compose?subject=${encodedTitle}&body=${encodedBody}`,
    yahooApp: `ymail://mail/compose?subject=${encodedTitle}&body=${encodedBody}`,
    sparkApp: `readdle-spark://compose?subject=${encodedTitle}&body=${encodedBody}`,
  }

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    instagram: `https://www.instagram.com/?url=${encodeURIComponent(fullUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title)}%20${encodeURIComponent(fullUrl)}`,
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openEmailWithFallback = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    window.location.href = mailtoLink

    const fallbacks = isIOS
      ? [
          emailProviderLinks.gmailApp,
          emailProviderLinks.outlookApp,
          emailProviderLinks.yahooApp,
          emailProviderLinks.sparkApp,
          emailProviderLinks.gmailWeb,
        ]
      : [emailProviderLinks.gmailWeb, emailProviderLinks.outlookWeb, emailProviderLinks.yahooWeb]

    fallbacks.forEach((providerLink, index) => {
      window.setTimeout(
        () => {
          if (document.visibilityState === 'visible') {
            window.location.href = providerLink
          }
        },
        900 + index * 600
      )
    })
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
        <a href={mailtoLink} onClick={openEmailWithFallback} aria-label="Compartilhar por Email">
          <Mail className="w-4 h-4" />
        </a>
      </Button>

      <Button variant="outline" size="icon" onClick={copyToClipboard} aria-label="Copiar link">
        {copied ? <span className="text-xs">Copiado!</span> : <Link2 className="w-4 h-4" />}
      </Button>
    </div>
  )
}
