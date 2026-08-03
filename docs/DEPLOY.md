# Deploy — vzgym

| Componente | Onde roda |
|------------|-----------|
| PostgreSQL | **Neon** |
| App (Next.js + API) | **Vercel** |

A API Express no Railway foi substituída por Route Handlers do Next.js (`/api/backend` e `/api/admin`). Um único deploy via GitHub → Vercel.

---

## Parte 1 — Banco no Neon

1. Crie/use um projeto em [neon.tech](https://neon.tech)
2. Copie as connection strings:
   - **Pooled** → `DATABASE_URL`
   - **Direct** (sem `-pooler`) → `DIRECT_DATABASE_URL`
3. Remova `&channel_binding=require` das URLs se a conexão falhar

Seed (primeira vez), localmente:

```bash
# na raiz do repo, com as envs apontando para o Neon
npm run db:seed
```

---

## Parte 2 — App na Vercel

1. [vercel.com](https://vercel.com) → **Add New** → **Project**
2. Importe `vagnerzezo/vzgym`
3. **Root Directory:** clique **Edit** → selecione **`frontend`** → **Continue**

> **Obrigatório.** Sem isso a Vercel builda a raiz do repo.

4. Variáveis de ambiente:

```env
DATABASE_URL=postgresql://...          # Neon pooler
DIRECT_DATABASE_URL=postgresql://...   # Neon direct — obrigatório no build/migrate
ADMIN_SECRET=vagnerzezo                 # opcional (legado / uso futuro)
```

> Remova `API_BASE_URL` e `NEXT_PUBLIC_API_BASE_URL` se ainda apontarem para o Railway.

5. Deploy → o build roda `prisma generate`, `prisma migrate deploy` e `next build`.

6. Teste:

```bash
curl https://SEU-APP.vercel.app/api/health
curl https://SEU-APP.vercel.app/api/backend/treinos
```

---

## Checklist

- [ ] `DATABASE_URL` e `DIRECT_DATABASE_URL` configuradas na Vercel
- [ ] `/api/health` retorna `{"ok":true,"api":"vercel"}`
- [ ] `/api/backend/treinos` retorna JSON com os grupos
- [ ] Página `/` e `/config` funcionam
- [ ] Serviço Railway desligado/removido

---

## Dev local

Com as mesmas envs no `.env` da raiz ou em `frontend/.env`:

```bash
cd frontend && npm run dev
```

A API sobe junto no Next.js (porta 3050). O Express em `src/serve.js` é opcional (legado).

---

## Troubleshooting

### Build falha no prisma generate / migrate

`DIRECT_DATABASE_URL` precisa existir **antes** do deploy — o `frontend/prisma.config.ts` usa essa variável.

### API sem dados / erro de conexão

1. Confirme `DATABASE_URL` (pooler) na Vercel
2. Remova `channel_binding=require` das URLs
3. Veja os logs da function na Vercel

### Ainda aponta para Railway

Remova `API_BASE_URL` / `NEXT_PUBLIC_API_BASE_URL` das envs da Vercel e faça redeploy.
