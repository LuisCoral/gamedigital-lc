-- ============================================================
-- GAMEDIGITAL_LC · Fase 3 · Esquema de base de datos
-- Ejecutar en Supabase: Dashboard > SQL Editor > New query > Run
-- ============================================================

create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  platform text not null check (platform in ('PS4', 'PS5', 'Nintendo')),
  category text not null default 'General',
  description text not null default '',
  image_url text,
  price numeric(12, 2) not null check (price >= 0),
  old_price numeric(12, 2),
  discount numeric(5, 2),
  position integer not null default 0,
  featured boolean not null default false,
  available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_position_idx on public.products (position asc);
create index if not exists products_platform_idx on public.products (platform);

-- Mantiene updated_at al día automáticamente en cada UPDATE
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.products enable row level security;

-- Cualquier visitante (rol "anon") puede LEER el catálogo.
drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
  on public.products
  for select
  to anon, authenticated
  using (true);

-- Solo un usuario autenticado (el administrador) puede crear,
-- editar o eliminar productos. No hay registro público, así que
-- la única cuenta autenticada que existirá es la del admin.
drop policy if exists "Authenticated can insert products" on public.products;
create policy "Authenticated can insert products"
  on public.products
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can update products" on public.products;
create policy "Authenticated can update products"
  on public.products
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated can delete products" on public.products;
create policy "Authenticated can delete products"
  on public.products
  for delete
  to authenticated
  using (true);
