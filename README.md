# Afluar - Sistema de Pedidos Online

Sistema de pedidos e cardápio online desenvolvido com Next.js, permitindo que clientes façam pedidos com entrega, visualizem produtos e finalizem compras de forma prática.

## 🚀 Tecnologias

- **[Next.js 16.1.6](https://nextjs.org)** - Framework React com App Router
- **[React 19.2.4](https://react.dev)** - Biblioteca de interface do usuário
- **[TypeScript 5.9.3](https://www.typescriptlang.org)** - Tipagem estática
- **[Tailwind CSS 4.1.18](https://tailwindcss.com)** - Framework de estilização
- **[Supabase 2.95.3](https://supabase.com)** - Banco de dados PostgreSQL e autenticação
- **[Zustand 5.0.11](https://zustand-demo.pmnd.rs)** - Gerenciamento de estado
- **[shadcn/ui](https://ui.shadcn.com)** - Componentes de interface acessíveis
- **[Lucide Icons 0.564.0](https://lucide.dev)** - Biblioteca de ícones
- **[React Icons 5.5.0](https://react-icons.github.io/react-icons/)** - Ícones adicionais
- **[date-fns 4.1.0](https://date-fns.org)** - Manipulação de datas
- **[Radix UI 1.4.3](https://www.radix-ui.com)** - Componentes primitivos acessíveis

## 📋 Funcionalidades

### Implementadas ✅
- ✅ Cardápio de produtos com imagens, descrições e preços
- ✅ Carrinho de compras com gerenciamento de estado (Zustand)
- ✅ Sistema de checkout com coleta de dados do cliente
- ✅ Registro de pedidos no banco de dados Supabase
- ✅ Informações de entrega (endereço completo)
- ✅ Status de pagamento (pendente, pago, cancelado, etc.)
- ✅ Página de contato para comunicação com clientes
- ✅ Página de eventos para divulgação
- ✅ Seção de experiência do usuário
- ✅ Sistema de navegação com navbar responsiva
- ✅ API para gerenciamento de produtos
- ✅ Controllers e services organizados
- ✅ Hooks customizados para lógica reutilizável

### Em Desenvolvimento 🔄
- 🔄 Integração com Mercado Pago para pagamentos
- 🔄 Integração com WhatsApp para notificações
- 🔄 Painel administrativo completo
- 🔄 Sistema de autenticação de usuários

## 🗂️ Estrutura do Projeto

```
afluar/
├── src/
│   ├── app/                        # Rotas e páginas (App Router)
│   │   ├── api/                   # API Routes
│   │   │   └── produtos/          # Endpoints de produtos
│   │   ├── cardapio/              # Página do cardápio
│   │   ├── carrinho/              # Página do carrinho de compras
│   │   ├── contato/               # Página de contato
│   │   ├── controller/            # Controllers da aplicação
│   │   ├── eventos/               # Página de eventos
│   │   ├── experiencia/           # Página de experiência
│   │   ├── globals.css            # Estilos globais
│   │   ├── layout.tsx             # Layout principal
│   │   └── page.tsx               # Página inicial
│   ├── components/
│   │   ├── cardapio/              # Componentes do cardápio
│   │   │   └── produto-card.tsx   # Card de produto
│   │   ├── navbar/                # Componentes de navegação
│   │   └── ui/                    # Componentes de interface (shadcn/ui)
│   ├── hooks/                     # Custom React Hooks
│   ├── lib/
│   │   ├── supabase.ts            # Cliente Supabase
│   │   ├── mercadopago.ts         # Integração Mercado Pago (planejada)
│   │   ├── whatsapp.ts            # Integração WhatsApp (planejada)
│   │   └── utils.ts               # Funções utilitárias
│   ├── services/                  # Camada de serviços
│   └── types/
│       ├── database.ts            # Tipos do banco de dados
│       └── carrinho.ts            # Tipos do carrinho
├── public/                        # Arquivos estáticos e imagens
├── components.json                # Configuração shadcn/ui
├── eslint.config.mjs              # Configuração ESLint
├── next.config.ts                 # Configuração Next.js
├── package.json                   # Dependências do projeto
├── postcss.config.mjs             # Configuração PostCSS
└── tsconfig.json                  # Configuração TypeScript
```

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ instalado
- Conta no [Supabase](https://supabase.com)
- (Opcional) Conta no [Mercado Pago](https://www.mercadopago.com.br/developers)

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

Crie um arquivo `.env.local` na raiz do projeto:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
MERCADO_PAGO_ACCESS_TOKEN=seu_token_do_mercado_pago
```

4. Configure o banco de dados no Supabase:

Execute o SQL abaixo no SQL Editor do Supabase:

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

-- Tabela de produtos (opcional)
CREATE TABLE produtos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  nome TEXT NOT NULL,
  descricao TEXT,
  preco DECIMAL(10, 2) NOT NULL,
  imagem_url TEXT,
  categoria TEXT,
  disponivel BOOLEAN DEFAULT true
);

-- Índices para melhor performance
CREATE INDEX idx_pedidos_status ON pedidos(status_pagamento);
CREATE INDEX idx_pedidos_created_at ON pedidos(created_at DESC);
CREATE INDEX idx_produtos_categoria ON produtos(categoria);
CREATE INDEX idx_produtos_disponivel ON produtos(disponivel);
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
npm run lint     # Executa o linter ESLint
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

### Produto
```typescript
interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  imagem_url?: string;
  categoria?: string;
  disponivel: boolean;
}
```

## 🚀 Deploy

### Vercel (Recomendado)
O deploy mais fácil é usando a [Vercel Platform](https://vercel.com):

1. Faça push do código para o GitHub
2. Importe o projeto na Vercel
3. Configure as variáveis de ambiente
4. Deploy automático!

### Variáveis de Ambiente Necessárias
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `MERCADO_PAGO_ACCESS_TOKEN` (quando implementado)

Veja a [documentação de deploy do Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para mais detalhes.

## 🎨 Personalização

### Temas e Cores
O projeto utiliza Tailwind CSS com configuração customizada. Edite `src/app/globals.css` para personalizar o tema:

```css
:root {
  --background: ...
  --foreground: ...
  /* Adicione suas variáveis customizadas */
}
```

### Componentes UI
Os componentes shadcn/ui estão em `src/components/ui/` e podem ser personalizados conforme necessário.

## 🧪 Próximos Passos

- [ ] Implementar testes com Jest e React Testing Library
- [ ] Configurar CI/CD com GitHub Actions
- [ ] Adicionar Sistema de autenticação de usuários
- [ ] Implementar painel administrativo completo
- [ ] Integrar pagamentos com Mercado Pago
- [ ] Adicionar notificações via WhatsApp
- [ ] Implementar sistema de avaliações
- [ ] Adicionar rastreamento de pedidos em tempo real

## 📄 Licença

Este projeto é privado e está em desenvolvimento.

## 👨‍💻 Desenvolvedor

**Jair Costa** - [GitHub](https://github.com/jayr2011)

---

⭐ Se você gostou deste projeto, considere dar uma estrela no repositório!
