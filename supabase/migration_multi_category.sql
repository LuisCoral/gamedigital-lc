-- ============================================================
-- GAMEDIGITAL_LC · Migración: varias categorías por juego
-- Ejecutar en Supabase: SQL Editor > New query > Run
-- ============================================================

-- 1. Agrega la nueva columna: una lista de categorías por juego
alter table public.products
  add column if not exists categories text[] not null default '{}';

-- 2. Copia la categoría que ya tenía cada juego a la nueva lista,
--    para no perder lo que ya habías cargado
update public.products
set categories = array[category]
where category is not null and category <> '' and categories = '{}';

-- 3. Ya no se usa el campo antiguo de una sola categoría
alter table public.products drop column if exists category;
