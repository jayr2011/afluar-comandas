import type { Metadata } from 'next'
import Link from 'next/link'
import { Dumbbell, Trophy, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Beach Tennis - Afluar | Aulas e Clínicas',
  description:
    'Aulas e clínicas de beach tennis na Afluar com turmas para todos os níveis e treinos orientados por metodologia progressiva.',
  alternates: {
    canonical: 'https://afluar.com.br/beach-tennis',
  },
  openGraph: {
    title: 'Beach Tennis - Afluar',
    description:
      'Treinos de beach tennis para iniciantes e avançados com estrutura completa e acompanhamento técnico.',
    url: 'https://afluar.com.br/beach-tennis',
    images: [
      {
        url: new URL('/banner/beach-tennis.png', 'https://afluar.com.br').href,
        width: 1200,
        height: 630,
        alt: 'Beach Tennis na Afluar',
      },
    ],
  },
}

const formatos = [
  {
    title: 'Aula para Iniciantes',
    description: 'Fundamentos, deslocamento e leitura de jogo para começar com segurança.',
    icon: Users,
  },
  {
    title: 'Treino Intermediário',
    description: 'Evolução técnica com foco em consistência, saque e transições ofensivas.',
    icon: Dumbbell,
  },
  {
    title: 'Clínica Competitiva',
    description: 'Simulações de partida, estratégia e tomada de decisão sob pressão.',
    icon: Trophy,
  },
]

const horarios = [
  { dia: 'Segunda e Quarta', periodo: '07h às 08h • 18h às 19h' },
  { dia: 'Terça e Quinta', periodo: '06h às 07h • 19h às 20h' },
  { dia: 'Sábado', periodo: '08h às 10h (clínicas especiais)' },
]

export default function BeachTennisPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-primary/5">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-top-left" />

        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-6">
              Beach Tennis
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
              Energia, técnica e evolução na areia
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-3xl mx-auto">
              Treinos para todos os níveis com metodologia progressiva e acompanhamento técnico.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild>
                <Link href="/contato">Agendar aula teste</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/eventos">Ver próximos eventos</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {formatos.map(item => {
              const Icon = item.icon

              return (
                <Card
                  key={item.title}
                  className="bg-card p-6 rounded-xl shadow-lg border border-primary/10 hover:shadow-xl transition-shadow"
                >
                  <CardHeader className="px-0 pt-0">
                    <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-xl text-primary">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-0 pb-0">
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-primary/5">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-8 md:p-10 border border-primary/10 shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
              Horários disponíveis
            </h2>
            <ul className="space-y-4">
              {horarios.map(item => (
                <li
                  key={item.dia}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 border-b border-border pb-4 last:border-b-0 last:pb-0"
                >
                  <span className="font-semibold text-foreground">{item.dia}</span>
                  <span className="text-muted-foreground">{item.periodo}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>
    </div>
  )
}
