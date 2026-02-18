# Análise de Otimização para Next.js 16

## Visão Geral do Projeto

- **Next.js**: 16.1.6 (versão mais recente)
- **React**: 19.2.4
- **State Management**: Zustand 5.0.11
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS 4.1.18

---

## 🔴 Problemas Críticos de Performance

### 1. Cardápio Client-Side Completo

**Arquivo**: [`src/app/cardapio/page.tsx`](src/app/cardapio/page.tsx:1)

```tsx
'use client' // ❌ Remove benefícios do Server Components
```

**Problema**: A página do cardápio é 100% client-side, eliminando:

- Server-side rendering inicial
- SEO otimizado
- Reduced JavaScript bundle

**Solução**: Separar dados do componente usando Server Actions ou fetch no servidor:

```tsx
// Otimizado: Server Component + Client Component apenas para interatividade
// app/cardapio/page.tsx (Server Component)
import { getProdutos } from '@/services/productsService'
import { CardapioClient } from './CardapioClient'

export const dynamic = 'force-dynamic'

export default async function CardapioPage() {
  const produtos = await getProdutos()
  return <CardapioClient initialProdutos={produtos} />
}
```

---

### 2. Fetch de Dados no Cliente

**Arquivo**: [`src/hooks/useProducts.ts`](src/hooks/useProducts.ts:24-50)

**Problema**: Dados são fetcheados no cliente via API routes ao invés de diretamente no servidor.

**Solução**: Usar Server Actions para buscar dados no servidor:

```tsx
// services/productsService.ts
'use server'

export async function getProdutos(categoria?: string) {
  'use cache'
  const supabase = createClient()
  let query = supabase.from('produtos').select('*')

  if (categoria) query = query.eq('categoria', categoria)

  const { data } = await query
  return data
}
```

---

### 3. HomeBanner com Random no Client

**Arquivo**: [`src/components/home-banner/HomeBanner.tsx`](src/components/home-banner/HomeBanner.tsx:8-16)

```tsx
const seed = Math.floor(Math.random() * 10000) // ❌ Gera valores diferentes a cada render
```

**Problema**: Gera imagens aleatórias no cliente, causando hydration mismatch.

**Solução**: Usar seed fixo ou buscar do servidor:

```tsx
// Otimizado
const slides: BannerSlide[] = [
  { src: '/hero/banner1.webp', alt: 'Banner 1', key: '1' },
  { src: '/hero/banner2.webp', alt: 'Banner 2', key: '2' },
  { src: '/hero/banner3.webp', alt: 'Banner 3', key: '3' },
]
```

---

## 🟡 Otimizações Recomendadas

### 4. Zustand Store sem useShallow

**Arquivo**: [`src/store/cartStore.ts`](src/store/cartStore.ts:28)

```tsx
// ❌ Atualiza em todas as mudanças
const totalItems = useCartStore(state => state.getTotalItems())
```

**Solução**: Usar `useShallow` do Zustand 5:

```tsx
import { useShallow } from 'zustand/react/shallow'

// ✅ Apenas re-renderiza quando items mudar
const items = useCartStore(useShallow((state) => state.items))
const totalItems = useMemo(() => items.reduce(...), [items])
```

---

### 5. useCart sem useMemo

**Arquivo**: [`src/hooks/useCart.ts`](src/hooks/useCart.ts:10-12)

```tsx
// ❌ Recalcula em toda renderização
const totalPrice = useCartStore(state =>
  state.items.reduce((sum, item) => sum + item.preco * item.quantidade, 0)
)
```

**Solução**: Mover cálculo para o store com getter memoizado:

```tsx
// store/cartStore.ts
getTotalPrice: () => {
  const state = get()
  return state.items.reduce((total, item) => total + item.preco * item.quantidade, 0)
}

// hooks/useCart.ts
const totalPrice = useCartStore(useShallow(state => state.getTotalPrice()))
```

---

### 6. ProductCard sem sizes attribute

**Arquivo**: [`src/components/product-card/ProductCard.tsx`](src/components/product-card/ProductCard.tsx:48-54)

```tsx
// ❌ Sem sizes - Next.js não consegue otimizar carregamento
<Image
  src={product.imagem}
  fill
  // falta sizes
/>
```

**Solução**:

```tsx
<Image
  src={product.imagem}
  alt={product.nome}
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  priority={priority}
/>
```

---

### 7. Navbar com Re-renders Desnecessários

**Arquivo**: [`src/components/Navbar/navbar.tsx`](src/components/Navbar/navbar.tsx:27-34)

```tsx
// ❌ Chama getTotalItems() em toda renderização
const totalItems = useCartStore(state => state.getTotalItems())
```

**Solução**:

```tsx
import { useShallow } from 'zustand/react/shallow'

const items = useCartStore(useShallow(state => state.items))
const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantidade, 0), [items])
```

---

### 8. API Route sem Cache

**Arquivo**: [`src/app/api/produtos/route.ts`](src/app/api/produtos/route.ts:6)

**Problema**: Cada requisição vai ao banco de dados.

**Solução**: Adicionar caching com `unstable_cache`:

```tsx
import { unstable_cache } from 'next/cache'

const getCachedProdutos = unstable_cache(
  async () => productsService.findAll(),
  ['produtos'],
  { revalidate: 60 } // cache por 60 segundos
)

export async function GET() {
  const dados = await getCachedProdutos()
  return NextResponse.json(dados)
}
```

---

### 9. Falta de Error Boundaries

**Solução**: Criar error.tsx em rotas importantes:

```tsx
// app/cardapio/error.tsx
'use client'

export default function Error({ reset }: { reset: () => void }) {
  return (
    <ErrorState
      title="Algo deu errado"
      message="Não foi possível carregar o cardápio."
      action={<Button onClick={reset}>Tentar novamente</Button>}
    />
  )
}
```

---

### 10. Não há Loading States Otimizados

**Solução**: Usar `loading.tsx` ( suspense streaming):

```tsx
// app/cardapio/loading.tsx (já existe, mas pode melhorar)
import { ProductCardSkeleton } from '@/components/product-card/ProductCardSkeleton'

export default function Loading() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
```

---

## 📊 Resumo das Otimizações

| Prioridade | Problema               | Impacto          | Esforço |
| ---------- | ---------------------- | ---------------- | ------- |
| 🔴 Alta    | Cardápio client-only   | SEO, Performance | Médio   |
| 🔴 Alta    | Fetch no cliente       | TTFB, Dados      | Médio   |
| 🔴 Alta    | Random no client       | Hydration        | Baixo   |
| 🟡 Média   | Zustand sem useShallow | Re-renders       | Baixo   |
| 🟡 Média   | Imagens sem sizes      | LCP              | Baixo   |
| 🟡 Média   | API sem cache          | DB calls         | Baixo   |
| 🟢 Baixa   | Error boundaries       | UX               | Baixo   |

---

## Próximos Passos Recomendados

1. **Converter página cardápio para Server Component**
2. **Adicionar Server Actions para fetch de dados**
3. **Adicionar `useShallow` do Zustand em todos os componentes**
4. **Adicionar `sizes` em todas as imagens Next.js**
5. **Configurar cache nas API routes**
6. \*\*Adicionar error.tsx nas rotas principais

---

_Análise gerada em 2026-02-18 para Next.js 16.1.6_
