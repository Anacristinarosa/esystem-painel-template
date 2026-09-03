-- ============================================================
-- Schema da plataforma eSystem Painel
-- Cola no SQL Editor do Supabase e corre uma vez.
-- Cria as tabelas de todas as 4 peças + perfis + RLS.
-- ============================================================

-- ─────────────── PERFIS (founder | cliente) ───────────────
-- Cada utilizador auth.users tem 1 perfil. A role decide o
-- que se vê. Founder = admin da plataforma. Cliente = portal.

create table if not exists public.perfis (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  role text not null default 'cliente' check (role in ('founder', 'cliente')),
  criado_em timestamptz not null default now()
);

alter table public.perfis enable row level security;

create policy "Cada um lê o próprio perfil"
  on public.perfis for select
  using (auth.uid() = id);

create policy "Founder lê todos os perfis"
  on public.perfis for select
  using (exists (select 1 from public.perfis p where p.id = auth.uid() and p.role = 'founder'));

-- ─────────────── PEÇA 1: DOSSIERS ───────────────

create table if not exists public.dossiers (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references auth.users(id) on delete cascade,
  titulo text not null,
  descricao text,
  estado text not null,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index if not exists idx_dossiers_cliente on public.dossiers(cliente_id);
create index if not exists idx_dossiers_estado on public.dossiers(estado);

alter table public.dossiers enable row level security;

create policy "Cliente vê os seus dossiers"
  on public.dossiers for select
  using (auth.uid() = cliente_id);

create policy "Founder vê todos os dossiers"
  on public.dossiers for select
  using (exists (select 1 from public.perfis p where p.id = auth.uid() and p.role = 'founder'));

create policy "Founder cria dossiers"
  on public.dossiers for insert
  with check (exists (select 1 from public.perfis p where p.id = auth.uid() and p.role = 'founder'));

create policy "Founder atualiza dossiers"
  on public.dossiers for update
  using (exists (select 1 from public.perfis p where p.id = auth.uid() and p.role = 'founder'));

create policy "Founder apaga dossiers"
  on public.dossiers for delete
  using (exists (select 1 from public.perfis p where p.id = auth.uid() and p.role = 'founder'));

-- ─────────────── PEÇA 2: NÚMEROS COM LEITURA ───────────────

create table if not exists public.numeros_leitura (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references auth.users(id) on delete cascade,
  titulo text not null,
  valor text not null,
  unidade text,
  leitura text,
  destaque boolean not null default false,
  ordem integer not null default 0,
  atualizado_em timestamptz not null default now()
);

create index if not exists idx_numeros_cliente on public.numeros_leitura(cliente_id);

alter table public.numeros_leitura enable row level security;

create policy "Cliente vê os seus números"
  on public.numeros_leitura for select
  using (auth.uid() = cliente_id);

create policy "Founder vê todos os números"
  on public.numeros_leitura for select
  using (exists (select 1 from public.perfis p where p.id = auth.uid() and p.role = 'founder'));

create policy "Founder cria números"
  on public.numeros_leitura for insert
  with check (exists (select 1 from public.perfis p where p.id = auth.uid() and p.role = 'founder'));

create policy "Founder atualiza números"
  on public.numeros_leitura for update
  using (exists (select 1 from public.perfis p where p.id = auth.uid() and p.role = 'founder'));

create policy "Founder apaga números"
  on public.numeros_leitura for delete
  using (exists (select 1 from public.perfis p where p.id = auth.uid() and p.role = 'founder'));

-- ─────────────── PEÇA 3: DOCUMENTOS ───────────────

create table if not exists public.documentos_cliente (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references auth.users(id) on delete cascade,
  dossier_id uuid references public.dossiers(id) on delete set null,
  nome text not null,
  descricao text,
  ficheiro_url text not null,
  enviado_por text not null check (enviado_por in ('founder', 'cliente')),
  criado_em timestamptz not null default now()
);

create index if not exists idx_documentos_cliente on public.documentos_cliente(cliente_id);
create index if not exists idx_documentos_dossier on public.documentos_cliente(dossier_id);

alter table public.documentos_cliente enable row level security;

create policy "Cliente vê os seus documentos"
  on public.documentos_cliente for select
  using (auth.uid() = cliente_id);

create policy "Cliente envia os seus documentos"
  on public.documentos_cliente for insert
  with check (auth.uid() = cliente_id and enviado_por = 'cliente');

create policy "Cliente apaga os documentos que enviou"
  on public.documentos_cliente for delete
  using (auth.uid() = cliente_id and enviado_por = 'cliente');

create policy "Founder vê todos os documentos"
  on public.documentos_cliente for select
  using (exists (select 1 from public.perfis p where p.id = auth.uid() and p.role = 'founder'));

create policy "Founder envia documentos"
  on public.documentos_cliente for insert
  with check (exists (select 1 from public.perfis p where p.id = auth.uid() and p.role = 'founder') and enviado_por = 'founder');

create policy "Founder atualiza documentos"
  on public.documentos_cliente for update
  using (exists (select 1 from public.perfis p where p.id = auth.uid() and p.role = 'founder'));

create policy "Founder apaga documentos"
  on public.documentos_cliente for delete
  using (exists (select 1 from public.perfis p where p.id = auth.uid() and p.role = 'founder'));

-- ─────────────── PEÇA 4: NOTAS DO PROCESSO ───────────────

create table if not exists public.notas_processo (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references auth.users(id) on delete cascade,
  dossier_id uuid references public.dossiers(id) on delete cascade,
  autor text not null check (autor in ('founder', 'cliente')),
  mensagem text not null,
  criada_em timestamptz not null default now()
);

create index if not exists idx_notas_cliente on public.notas_processo(cliente_id);
create index if not exists idx_notas_dossier on public.notas_processo(dossier_id);

alter table public.notas_processo enable row level security;

create policy "Cliente vê as suas notas"
  on public.notas_processo for select
  using (auth.uid() = cliente_id);

create policy "Cliente escreve as suas notas"
  on public.notas_processo for insert
  with check (auth.uid() = cliente_id and autor = 'cliente');

create policy "Founder vê todas as notas"
  on public.notas_processo for select
  using (exists (select 1 from public.perfis p where p.id = auth.uid() and p.role = 'founder'));

create policy "Founder escreve notas"
  on public.notas_processo for insert
  with check (exists (select 1 from public.perfis p where p.id = auth.uid() and p.role = 'founder') and autor = 'founder');

create policy "Founder apaga notas"
  on public.notas_processo for delete
  using (exists (select 1 from public.perfis p where p.id = auth.uid() and p.role = 'founder'));

-- ─────────────── VIEW: CLIENTES (para o admin) ───────────────

create or replace view public.clientes_view as
select
  u.id,
  u.email,
  p.nome,
  u.created_at as criada_em,
  u.last_sign_in_at as ultima_entrada,
  (select count(*) from public.dossiers d where d.cliente_id = u.id) as num_dossiers
from auth.users u
join public.perfis p on p.id = u.id
where p.role = 'cliente'
order by u.created_at desc;
