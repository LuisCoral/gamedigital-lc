-- ============================================================
-- GAMEDIGITAL_LC · Datos de ejemplo
-- Ejecutar DESPUÉS de schema.sql, en el mismo SQL Editor.
-- Puedes borrar estas filas luego desde el panel admin (Fase 4-5).
-- ============================================================

insert into public.products
  (name, slug, platform, category, description, image_url, price, old_price, discount, position, featured, available)
values
  ('Horizon Forbidden West', 'horizon-forbidden-west', 'PS5', 'Aventura', 'Explora un mundo abierto post-apocalíptico lleno de máquinas.', null, 180000, 220000, 18, 1, true, true),
  ('Mario Kart 8 Deluxe', 'mario-kart-8-deluxe', 'Nintendo', 'Carreras', 'El clásico de carreras con nuevos circuitos y personajes.', null, 165000, null, null, 2, true, true),
  ('God of War Ragnarök', 'god-of-war-ragnarok', 'PS5', 'Acción', 'Kratos y Atreus enfrentan el destino del Ragnarök.', null, 195000, null, null, 3, true, true),
  ('The Legend of Zelda: TOTK', 'zelda-totk', 'Nintendo', 'Aventura', 'Una aventura épica en los cielos y tierras de Hyrule.', null, 210000, null, null, 4, false, true),
  ('Gran Turismo 7', 'gran-turismo-7', 'PS4', 'Carreras', 'Simulador de carreras con cientos de autos y pistas.', null, 140000, 170000, 17, 5, false, true),
  ('Spider-Man 2', 'spiderman-2', 'PS5', 'Acción', 'Peter Parker y Miles Morales unen fuerzas en Nueva York.', null, 200000, null, null, 6, false, true),
  ('Animal Crossing: New Horizons', 'animal-crossing-new-horizons', 'Nintendo', 'Simulación', 'Crea tu isla ideal en este relajante simulador de vida.', null, 155000, null, null, 7, false, true),
  ('The Last of Us Part II', 'the-last-of-us-2', 'PS4', 'Acción', 'La secuela del aclamado drama post-apocalíptico.', null, 120000, null, null, 8, false, false)
on conflict (slug) do nothing;
