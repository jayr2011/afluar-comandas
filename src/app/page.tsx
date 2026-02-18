import { RandomBanner } from '@/components/random-banner'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Bem-vindo ao Afluar</h1>
      <RandomBanner />
      <p className="text-lg text-muted-foreground mt-8">
        Sistema de pedidos online.
      </p>
    </div>
  )
}
