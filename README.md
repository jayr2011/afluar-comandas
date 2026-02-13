# Afluar - Sistema de Pedidos Online

Sistema de pedidos e cardápio online desenvolvido com Next.js, permitindo que clientes façam pedidos com entrega, visualizem produtos e finalizem compras de forma prática.

## 🚀 Tecnologias

- **[Next.js 16.1.6](https://nextjs.org)** - Framework React com App Router
- **[React 19](https://react.dev)** - Biblioteca de interface do usuário
- **[TypeScript](https://www.typescriptlang.org)** - Tipagem estática
- **[Tailwind CSS 4](https://tailwindcss.com)** - Estilização
- **[Supabase](https://supabase.com)** - Banco de dados e autenticação
- **[Zustand](https://zustand-demo.pmnd.rs)** - Gerenciamento de estado
- **[shadcn/ui](https://ui.shadcn.com)** - Componentes de interface
- **[Lucide Icons](https://lucide.dev)** - Ícones
- **[date-fns](https://date-fns.org)** - Manipulação de datas

## 📋 Funcionalidades

### Implementadas
- ✅ Cardápio de produtos com imagens, descrições e preços
- ✅ Carrinho de compras com gerenciamento de estado (Zustand)
- ✅ Sistema de checkout com coleta de dados do cliente
- ✅ Registro de pedidos no banco de dados
- ✅ Informações de entrega (endereço completo)
- ✅ Status de pagamento (pendente, pago, cancelado, etc.)

### Em Desenvolvimento
- 🔄 Integração com Mercado Pago para pagamentos
- 🔄 Integração com WhatsApp para notificações
- 🔄 Painel administrativo
- 🔄 Área pública do cliente

## 🗂️ Estrutura do Projeto

```
afluar/
├── src/
│   ├── app/                    # Rotas e páginas (App Router)
│   │   ├── admin/             # Painel administrativo (em desenvolvimento)
│   │   ├── api/               # API Routes
│   │   │   └── checkout/      # Lógica de checkout e registro de pedidos
│   │   └── public/            # Área pública (em desenvolvimento)
│   ├── components/
│   │   ├── cardapio/          # Componentes do cardápio
│   │   │   └── produto-card.tsx
│   │   └── ui/                # Componentes de interface (shadcn/ui)
│   ├── lib/
│   │   ├── supabase.ts        # Cliente Supabase
│   │   ├── mercadopago.ts     # Integração Mercado Pago (planejada)
│   │   ├── whatsapp.ts        # Integração WhatsApp (planejada)
│   │   └── utils.ts           # Funções utilitárias
│   └── types/
│       ├── database.ts        # Tipos do banco de dados
│       └── carrinho.ts        # Tipos do carrinho
└── public/                    # Arquivos estáticos
```

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ instalado
- Conta no [Supabase](https://supabase.com)
- (Opcional) Conta no [Mercado Pago](https://www.mercadopago.com.br/developers)

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd afluar
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env.local` na raiz do projeto:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
MERCADO_PAGO_ACCESS_TOKEN=seu_token_do_mercado_pago
```

4. Configure o banco de dados no Supabase:
```sql
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
  mercado_pago_id TEXT,
  external_reference TEXT
);
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) para ver a aplicação.

## 📦 Scripts Disponíveis

```bash
npm run dev      # Inicia o servidor de desenvolvimento
npm run build    # Cria build de produção
npm run start    # Inicia servidor de produção
npm run lint     # Executa o linter
```

## 🎯 Tipos de Dados

### Pedido
```typescript
interface Pedido {
  id: string;
  created_at: string;
  cliente_nome: string;
  cliente_whatsapp: string;
  endereco_rua: string;
  endereco_numero: string;
  endereco_bairro: string;
  endereco_complemento?: string;
  itens_json: ItemPedido[];
  valor_total: number;
  status_pagamento: 'pendente' | 'pago' | 'cancelado' | 'reembolsado' | 'estornado' | 'em disputa';
  mercado_pago_id?: string;
  external_reference: string;
}
```

### Carrinho
```typescript
interface CartItem {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  imagem_url?: string;
  quantidade: number;
}
```

## 🚀 Deploy

### Vercel (Recomendado)
O deploy mais fácil é usando a [Vercel Platform](https://vercel.com):

1. Faça push do código para o GitHub
2. Importe o projeto na Vercel
3. Configure as variáveis de ambiente
4. Deploy automático!

Veja a [documentação de deploy do Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para mais detalhes.

## 📝 Licença

Este projeto é privado e está em desenvolvimento.
