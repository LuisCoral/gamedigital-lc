-- ============================================================
-- GAMEDIGITAL_LC · Migración: tabla de categorías
-- Ejecutar en Supabase: SQL Editor > New query > Run
-- ============================================================

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

-- Cualquiera puede leer las categorías (se usan en el catálogo público y en el admin)
drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories"
  on public.categories
  for select
  to anon, authenticated
  using (true);

-- Solo el administrador autenticado puede crear o eliminar categorías
drop policy if exists "Authenticated can insert categories" on public.categories;
create policy "Authenticated can insert categories"
  on public.categories
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can delete categories" on public.categories;
create policy "Authenticated can delete categories"
  on public.categories
  for delete
  to authenticated
  using (true);

-- Categorías típicas precargadas (puedes agregar más desde el panel admin)
insert into public.categories (name) values
  ('Acción'),
  ('Aventura'),
  ('RPG'),
  ('Deportes'),
  ('Carreras'),
  ('Estrategia'),
  ('Simulación'),
  ('Terror'),
  ('Lucha'),
  ('Plataformas'),
  ('Disparos (Shooter)'),
  ('Mundo abierto'),
  ('Battle Royale'),
  ('Multijugador / Dos jugadores'),
  ('Música y ritmo')
on conflict (name) do nothing;
