# vzgym

Aplicação web para gerenciar fichas de treino de academia.

## Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Express + Prisma
- **Banco:** PostgreSQL (Neon)

## Estrutura

```
vzgym/
├── prisma/          # Schema e migrations
├── src/             # API Express
└── frontend/        # App Next.js
```

## Configuração

1. Copie `.env.example` para `.env` na raiz e configure as URLs do Neon:

```bash
cp .env.example .env
```

2. Copie `frontend/.env.local.example` para `frontend/.env.local`.

3. Instale dependências e aplique migrations:

```bash
npm install
npx prisma migrate deploy
npm run db:seed
```

4. Inicie API e frontend:

```bash
npm run dev:all
```

- Frontend: http://localhost:3050
- API: http://localhost:3002

## Funcionalidades

### Tela principal
- Tabela estilo planilha por grupos de treino (A, B, C…)
- Pesquisa e filtro por grupo
- Modal de técnica (descrição, como fazer, benefícios)
- Modal de exemplo (vídeo/GIF, músculos, passo a passo)

### Configurações (`/config`)
- CRUD de exercícios, técnicas e grupos de treino
- Dados 100% dinâmicos via banco — novos grupos e exercícios sem alterar código

## Deploy

```bash
npm run deploy:migrate   # aplica migrations no Neon
npm run build            # gera Prisma Client
```

Configure `DATABASE_URL`, `DIRECT_DATABASE_URL` e `NEXT_PUBLIC_API_BASE_URL` no ambiente de produção.
