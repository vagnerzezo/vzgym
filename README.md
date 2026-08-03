# vzgym

Aplicação web para gerenciar fichas de treino de academia.

## Stack

- **App:** Next.js (UI + API Routes), React, TypeScript, Tailwind CSS
- **ORM:** Prisma
- **Banco:** PostgreSQL (Neon)
- **Host:** Vercel

## Estrutura

```
vzgym/
├── prisma/          # Schema e migrations
├── src/             # API Express (legado / opcional local)
└── frontend/        # App Next.js + Route Handlers
```

## Configuração

1. Copie `.env.example` para `.env` na raiz (e/ou `frontend/.env.local`) e configure as URLs do Neon:

```bash
cp .env.example .env
```

2. Instale dependências e aplique migrations:

```bash
npm install
cd frontend && npm install
cd ..
npx prisma migrate deploy
npm run db:seed
```

3. Inicie o app (UI + API no mesmo processo):

```bash
cd frontend && npm run dev
```

- App: http://localhost:3050
- Health: http://localhost:3050/api/health

> Opcional: `npm run dev` na raiz sobe o Express legado na porta 3002.

## Funcionalidades

### Tela principal
- Tabela estilo planilha por grupos de treino (A, B, C…)
- Pesquisa e filtro por grupo
- Check-in semanal e estatísticas
- Modal de técnica e exemplo (vídeo/GIF, músculos, passo a passo)

### Configurações (`/config`)
- CRUD de exercícios, técnicas e grupos de treino
- Dados 100% dinâmicos via banco

## Deploy

Veja o guia completo em [docs/DEPLOY.md](docs/DEPLOY.md).

Na Vercel (Root Directory = `frontend`), configure:

```env
DATABASE_URL=...
DIRECT_DATABASE_URL=...
```
