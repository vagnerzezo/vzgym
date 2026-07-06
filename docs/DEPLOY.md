# Deploy — vzgym

| Componente | Onde roda |
|------------|-----------|
| PostgreSQL | **Neon** |
| API (Express) | **Railway** |
| Frontend (Next.js) | **Vercel** |

---

## Parte 1 — API no Railway

### 1. Conectar repositório

1. Acesse [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. Selecione `vagnerzezo/vzgym`

### 2. Variáveis de ambiente

No painel **Variables**, adicione:

```env
DATABASE_URL=postgresql://...          # Neon (pooler)
DIRECT_DATABASE_URL=postgresql://...   # Neon (direct) — obrigatório no build
ADMIN_SECRET=vagnerzezo                 # opcional
```

**Importante:**

- **Não defina `PORT`** — o Railway injeta automaticamente
- Remova `&channel_binding=require` das URLs do Neon se a conexão falhar
- Use a URL **direct** (sem `-pooler`) em `DIRECT_DATABASE_URL`

### 3. Comandos de deploy

O arquivo `railway.toml` já configura:

| Etapa | Comando |
|-------|---------|
| Build | `npm ci --ignore-scripts && npx prisma generate` |
| Pre-deploy | `npx prisma migrate deploy` |
| Start | `node src/serve.js` |
| Healthcheck | `/health` |

Se preferir configurar manualmente em **Settings → Deploy**, use os mesmos valores.

### 4. Domínio público

1. **Settings → Networking → Generate Domain**
2. Copie a URL, ex: `https://vzgym-production-xxxx.up.railway.app`

### 5. Testar

```bash
curl https://SUA-URL-RAILWAY/health
curl https://SUA-URL-RAILWAY/treinos
```

### 6. Seed (primeira vez)

Rode localmente apontando para o Neon de produção:

```bash
npm run db:seed
```

Ou rode uma vez no Railway via **Shell** (se disponível no plano).

---

## Parte 2 — Frontend na Vercel

1. [vercel.com](https://vercel.com) → **Add New** → **Project**
2. Importe `vagnerzezo/vzgym`
3. **Root Directory:** clique **Edit** → selecione **`frontend`** → **Continue**

> **Obrigatório.** Sem isso a Vercel builda a raiz do repo e tenta rodar `prisma generate` (erro).

4. Variáveis:

```env
API_BASE_URL=https://SUA-URL-RAILWAY
ADMIN_SECRET=vagnerzezo
```

> `API_BASE_URL` é lida no servidor (proxy Next.js). Também funciona `NEXT_PUBLIC_API_BASE_URL`, mas `API_BASE_URL` é preferível.

5. Deploy → teste em `/` e `/config`

---

## Checklist

- [ ] `curl .../health` retorna `{"ok":true}`
- [ ] `curl .../treinos` retorna JSON com os grupos A–E
- [ ] `NEXT_PUBLIC_API_BASE_URL` na Vercel aponta para a API Railway
- [ ] PWA instalável no celular

---

## Troubleshooting

### 502 / API não sobe

1. Confirme `DATABASE_URL` e `DIRECT_DATABASE_URL` nas Variables
2. Remova `PORT` das Variables
3. Remova `channel_binding=require` das URLs
4. Veja os logs: migration ou `prisma generate` falhou

### Frontend sem dados

1. Teste a API com `curl`
2. Confirme `NEXT_PUBLIC_API_BASE_URL` na Vercel (sem barra no final)

### Erro no build (prisma generate)

`DIRECT_DATABASE_URL` precisa existir **antes** do deploy — o `prisma.config.ts` usa essa variável.
