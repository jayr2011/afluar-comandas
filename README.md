# Afluar - Cardápio Digital

Vitrine digital e cardápio online desenvolvido com Next.js, permitindo que clientes visualizem produtos, preços e informações detalhadas de forma prática e moderna.

## 🚀 Tecnologias

- **[Next.js 16](https://nextjs.org)** - Framework React com App Router
- **[React 19](https://react.dev)** - Biblioteca de interface do usuário
- **[TypeScript](https://www.typescriptlang.org)** - Tipagem estática
- **[Tailwind CSS](https://tailwindcss.com)** - Framework de estilização
- **[Supabase](https://supabase.com)** - Banco de dados PostgreSQL e autenticação
- **[Zustand](https://zustand-demo.pmnd.rs)** - Gerenciamento de estado
- **[shadcn/ui](https://ui.shadcn.com)** - Componentes de interface acessíveis
- **[React Hook Form](https://react-hook-form.com)** + **[Zod](https://zod.dev)** - Formulários e validação
- **[Embla Carousel](https://www.embla-carousel.com)** - Carrossel de banners
- **[Sonner](https://sonner.emilkowal.ski)** - Notificações toast
- **[Winston](https://github.com/winstonjs/winston)** - Logger server-side
- **[Vercel Analytics](https://vercel.com/analytics)** + **[Speed Insights](https://vercel.com/docs/speed-insights)** - Analytics e performance
- **[Vitest](https://vitest.dev)** - Framework de testes

## 📋 Funcionalidades

### Implementadas ✅

- ✅ Cardápio de produtos com imagens, descrições e preços
- ✅ Página de detalhe de produto
- ✅ Página de contato para comunicação com clientes
- ✅ Página de eventos para divulgação
- ✅ Seção de experiência do usuário
- ✅ Sistema de navegação com navbar responsiva
- ✅ API para gerenciamento de produtos (protegida por API Key)
- ✅ Sistema de banners rotativos na homepage
- ✅ Segurança: Headers HTTP (CSP, X-Frame-Options, etc.)
- ✅ Testes unitários com Vitest
- ✅ Painel administrativo (produtos e feature toggles)
- ✅ Sistema de feature toggles para renderização condicional
- ✅ Real-time de produtos via Supabase
- ✅ Upload de imagens de produtos
- ✅ Sitemap e robots.txt gerados automaticamente
- ✅ Logger server-side com Winston

### Em Desenvolvimento 🔄

- 🔄 Sistema de autenticação de usuários

## 🗂️ Estrutura do Projeto

```text
afluar/
├── src/
│   ├── app/                              # Rotas e páginas (App Router)
│   │   ├── api/                         # API Routes
│   │   │   ├── admin/
│   │   │   │   └── produtos/upload-image/ # Upload de imagens de produtos
│   │   │   ├── checkout/
│   │   │   │   ├── actions.ts           # Server Actions do checkout
│   │   │   ├── produtos/                # Endpoints de produtos
│   │   │   └── revalidate/              # Revalidação de cache
│   │   ├── admin/                       # Painel administrativo
│   │   │   ├── painel/                  # Dashboard admin
│   │   │   └── toggles/                 # Gerenciamento de feature toggles
│   │   ├── cardapio/                    # Página do cardápio
│   │   │   └── [id]/                    # Detalhe do produto
│   │   ├── carrinho/                    # Página do carrinho de compras
│   │   ├── checkout/                    # Página de checkout
│   │   │   └── sucesso/                 # Confirmação de pedido
│   │   ├── contato/                     # Página de contato
│   │   ├── eventos/                     # Página de eventos
│   │   ├── experiencia/                 # Página de experiência
│   │   ├── pedido/                      # Acompanhamento de pedido
│   │   ├── globals.css                  # Estilos globais
│   │   ├── layout.tsx                   # Layout principal
│   │   ├── template.tsx                 # Template de página
│   │   ├── robots.ts                    # Geração de robots.txt
│   │   └── sitemap.ts                   # Geração de sitemap
│   ├── components/
│   │   ├── add-to-cart-sonner/          # Notificação de adição ao carrinho
│   │   ├── banner/                      # Componente de banner rotativo
│   │   ├── cart/                        # Componentes do carrinho
│   │   ├── checkout/                    # Componentes de checkout
│   │   ├── feedback/                    # Estados de feedback (empty, error)
│   │   ├── footer/                      # Rodapé
│   │   ├── home-banner/                 # Banner da homepage
│   │   ├── ingredientes-section/        # Seção de ingredientes
│   │   ├── navbar/                      # Barra de navegação
│   │   ├── product-card/                # Card de produto
│   │   ├── quick-access/                # Acesso rápido
│   │   └── ui/                          # Componentes shadcn/ui
│   ├── hooks/                           # Custom React Hooks
│   │   ├── useCart.ts                   # Hook do carrinho
│   │   ├── useHydrated.ts               # Hook de hidratação SSR
│   │   ├── useProducts.ts               # Hook de produtos
│   │   └── useRealtimeProdutos.ts       # Hook de real-time de produtos
│   ├── lib/
│   │   ├── supabase.ts                  # Cliente Supabase (genérico)
│   │   ├── supabase-browser.ts          # Cliente Supabase (client-side)
│   │   ├── supabase-server.ts           # Cliente Supabase (server-side)
│   │   ├── feature-toggles.ts           # Sistema de feature toggles
│   │   ├── logger.ts                    # Logger com Winston
│   │   ├── applyRealTimeEvent.ts        # Aplicação de eventos real-time
│   │   ├── cep.ts                       # Utilitários de CEP
│   │   ├── whatsapp.ts                  # Integração WhatsApp
│   │   ├── resolveCartItems.ts          # Resolução de itens do carrinho
│   │   ├── validations/checkout.ts      # Schemas Zod de checkout
│   │   └── utils.ts                     # Funções utilitárias
│   ├── services/                        # Camada de serviços
│   │   └── productsService.ts           # Serviço de produtos
│   ├── store/                           # Estado global (Zustand)
│   │   ├── cartStore.ts                 # Store do carrinho
│   │   └── productsStore.ts             # Store de produtos
│   └── types/                           # Definições de tipos
│       ├── database.ts                  # Tipos do banco de dados
│       ├── carrinho.ts                  # Tipos do carrinho
│       └── produtos.ts                  # Tipos de produtos
├── public/                              # Arquivos estáticos e imagens
├── test/                                # Testes unitários
├── components.json                      # Configuração shadcn/ui
├── eslint.config.mjs                    # Configuração ESLint
├── next.config.ts                       # Configuração Next.js
├── package.json                         # Dependências do projeto
├── tsconfig.json                        # Configuração TypeScript
└── vitest.config.ts                     # Configuração Vitest
```

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Node.js 18+ instalado
- Conta no [Supabase](https://supabase.com)

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/jayr2011/afluar-entregas.git
cd afluar-entregas
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

Copie o arquivo `.env.example` para `.env` e preencha com suas credenciais:

```env
# Supabase (OBRIGATÓRIO - sem fallback)
NEXT_PUBLIC_SUPABASE_URL=https://seu_projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui

# Chave de serviço (OBRIGATÓRIO para operações admin)
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_aqui

# API Admin - Chave para proteger rotas de escrita (POST, PUT, DELETE)
ADMIN_API_KEY=sua_chave_admin_aqui
```

4. Configure o banco de dados no Supabase:

Execute o SQL abaixo no SQL Editor do Supabase:

```sql
-- Tabela de produtos
CREATE TABLE produtos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  nome TEXT NOT NULL,
  descricao TEXT,
  preco DECIMAL(10, 2) NOT NULL,
  categoria TEXT NOT NULL,
  imagem TEXT,
  destaque BOOLEAN DEFAULT false,
  ingredientes TEXT,
  disponivel BOOLEAN DEFAULT true
);

-- Tabela de pedidos
CREATE TABLE pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cliente_nome TEXT NOT NULL,
  cliente_whatsapp TEXT NOT NULL,
  endereco_rua TEXT NOT NULL,
  endereco_numero TEXT NOT NULL,
  endereco_bairro TEXT NOT NULL,
  endereco_complemento TEXT,
  itens_json JSONB NOT NULL,
  valor_total DECIMAL(10, 2) NOT NULL,
  status_pagamento TEXT DEFAULT 'pendente',
  external_reference TEXT
);

-- Índices para melhor performance
CREATE INDEX idx_produtos_categoria ON produtos(categoria);
CREATE INDEX idx_produtos_destaque ON produtos(destaque);
CREATE INDEX idx_produtos_disponivel ON produtos(disponivel);
CREATE INDEX idx_pedidos_status ON pedidos(status_pagamento);
CREATE INDEX idx_pedidos_created_at ON pedidos(created_at DESC);

-- Configuração de Row Level Security (RLS)
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública de produtos
CREATE POLICY "produtos_public_read" ON produtos
  FOR SELECT USING (disponivel = true);

-- Política para leitura pública de pedidos (apenas o próprio)
CREATE POLICY "pedidos_read own" ON pedidos
  FOR SELECT USING (true);
```

5. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) para ver a aplicação.

## 📦 Scripts Disponíveis

```bash
npm run dev              # Inicia o servidor de desenvolvimento
npm run build            # Cria build de produção
npm run start            # Inicia servidor de produção
npm run lint             # Executa o linter ESLint
npm run test             # Executa testes unitários
npm run test:watch       # Executa testes em modo watch
npm run supabase:start   # Inicia o Supabase local
npm run supabase:stop    # Para o Supabase local
npm run supabase:diff    # Gera diff de migrations
npm run supabase:push    # Aplica migrations no Supabase
```

## 🔒 Segurança

Este projeto implementa várias camadas de segurança:

- **Validação de preços no servidor**: Preços são sempre validados contra o banco de dados, impedindo manipulação pelo cliente
- **Headers HTTP de segurança**: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **API Key para rotas admin**: Rotas de escrita (POST, PUT, DELETE) requerem autenticação via `x-api-key`
- **Variáveis de ambiente obrigatórias**: O aplicativo não inicia sem as credenciais necessárias

## 🎯 Tipos de Dados

### Produto

```typescript
interface Produto {
  id: string
  created_at: string
  nome: string
  descricao?: string
  preco: number
  categoria: string
  imagem?: string
  destaque: boolean
  ingredientes?: string
  disponivel: boolean
}
```

### Pedido

```typescript
interface Pedido {
  id: string
  created_at: string
  cliente_nome: string
  cliente_whatsapp: string
  endereco_rua: string
  endereco_numero: string
  endereco_bairro: string
  endereco_complemento?: string
  itens_json: ItemPedido[]
  valor_total: number
  status_pagamento: 'pendente' | 'pago' | 'cancelado' | 'reembolsado' | 'estornado' | 'em disputa'
  external_reference: string
}
```

### Carrinho

```typescript
interface CartItem {
  id: string
  nome: string
  descricao?: string
  preco: number
  imagem_url?: string
  quantidade: number
}
```

### Variáveis de Ambiente Necessárias

| Variável                             | Descrição                         |
| ------------------------------------ | --------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`           | URL do projeto Supabase           |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`      | Chave anônima pública do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY`          | Chave de serviço (server-side)    |
| `ADMIN_API_KEY`                      | Chave para API de administração   |

## 🎨 Personalização

### Temas e Cores

O projeto utiliza Tailwind CSS com configuração customizada. Edite `src/app/globals.css` para personalizar o tema:

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
}
```

### Componentes UI

Os componentes shadcn/ui estão em `src/components/ui/` e podem ser personalizados conforme necessário.

## 📄 Licença

Este projeto é privado e está em desenvolvimento.
