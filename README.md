# eSystem Painel — Template

Plataforma dupla: portal do cliente (login próprio; vê só o SEU dossier, os SEUS números, os SEUS documentos) + painel da founder (vê todos os clientes, cria/edita tudo).

Base para o eSystem tipo "Painel de gestão com login de cliente" do eFounder.

**Stack:** Next.js 16 · Supabase (auth, DB, storage) · Tailwind CSS · TypeScript

## Arquétipos

Escolhe um em `lib/config.ts` — a skill `/esystem-painel` faz isto por ti:

- **Relação** (tipo Sandra Monteiro, mediação de seguros) — Dossier + Documentos + Notas. Âncora: Dossier.
- **Leitura** (tipo Sandra Silva, consultoria de gestão) — Números com leitura + Dossier + Notas. Âncora: Números.

## As 4 peças (ativáveis por config)

- **Dossier(s) do cliente** com estado editável pela founder (pipeline visual)
- **Números com leitura** — KPIs custom por cliente + interpretação lado a lado
- **Documentos** — bidirecional (founder envia, cliente envia)
- **Notas do processo** — mensagens assíncronas founder ↔ cliente

## Para o cliente

- Login estilo eFounder
- Home com a peça âncora em destaque + atalhos para as outras
- Só vê o que é seu (RLS por `cliente_id`)

## Para a founder (`/admin`)

- Lista de clientes + criar cliente (com password inicial)
- Ficha 360º de cada cliente (dossiers, números, documentos, notas)
- Atalhos condicionais para gerir cada peça ativa

## Quick start (feito pela skill)

A skill `/esystem-painel` faz tudo — clona este template, escolhe arquétipo, patcha textos, cria tabelas, arranca. Se preferires manual:

```bash
npm install
cp .env.example .env.local
# preenche .env.local com Supabase URL + anon + service_role
npm run dev
```

Abre <http://localhost:3000>.

## Setup Supabase manual

1. Cria projeto em [supabase.com](https://supabase.com)
2. **Settings → API Keys** — copia Project URL, `anon` public, `service_role` secret
3. **SQL Editor** → cola `db/schema.sql`
4. **Storage** → cria bucket `documentos` (público)

## Deploy

```bash
vercel deploy --prod
```

E adiciona as env vars no Vercel Dashboard.
