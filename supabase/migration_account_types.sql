-- ============================================================
-- GAMEDIGITAL_LC · Migración: cuentas principal / secundaria
-- Ejecutar en Supabase: SQL Editor > New query > Run
-- ============================================================

alter table public.products
  add column if not exists price_secondary numeric(12, 2);

comment on column public.products.price_secondary is
  'Precio de la cuenta secundaria (compartida). Si es NULL, el juego solo se vende como cuenta principal.';
