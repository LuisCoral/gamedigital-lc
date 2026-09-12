-- ============================================================
-- GAMEDIGITAL_LC · Migración: agregar Nintendo Switch 2
-- Ejecutar en Supabase: SQL Editor > New query > Run
-- ============================================================

alter table public.products drop constraint if exists products_platform_check;

alter table public.products
  add constraint products_platform_check
  check (platform in ('PS4', 'PS5', 'Nintendo', 'Switch2'));
