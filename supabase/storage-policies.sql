-- ============================================================
-- GAMEDIGITAL_LC · Políticas de Storage
-- Antes de ejecutar esto: crea el bucket manualmente en
-- Dashboard > Storage > New bucket > nombre: "products" > Public bucket: ON
-- Luego ejecuta este script en el SQL Editor.
-- ============================================================

-- Cualquiera puede VER las imágenes (necesario para el catálogo público).
drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'products');

-- Solo el administrador autenticado puede subir imágenes.
drop policy if exists "Authenticated can upload product images" on storage.objects;
create policy "Authenticated can upload product images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'products');

-- Solo el administrador autenticado puede reemplazar imágenes.
drop policy if exists "Authenticated can update product images" on storage.objects;
create policy "Authenticated can update product images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'products');

-- Solo el administrador autenticado puede borrar imágenes.
drop policy if exists "Authenticated can delete product images" on storage.objects;
create policy "Authenticated can delete product images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'products');
