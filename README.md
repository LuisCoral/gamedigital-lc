# GAMEDIGITAL_LC — Tienda de Videojuegos

## Fase 1: Base del proyecto ✅

Stack: React + Vite + TypeScript + Tailwind CSS + Lucide React.

## Fase 3: Supabase (base de datos real) ✅

Se reemplazaron los datos de ejemplo por una consulta real a Supabase.
Sigue estos pasos en orden — son de una sola vez.

### 1. Crear el proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com) y crea una cuenta (gratis).
2. Crea un **New project**. Anota la contraseña de la base de datos que te pida (no la necesitarás en el código, pero guárdala).
3. Espera 1-2 minutos a que el proyecto termine de aprovisionarse.

### 2. Crear la tabla y las reglas de seguridad
1. En el panel de Supabase, ve a **SQL Editor > New query**.
2. Copia todo el contenido de `supabase/schema.sql` (de este proyecto), pégalo y dale **Run**.
3. Repite lo mismo con `supabase/seed.sql` (esto carga los 8 juegos de ejemplo).

### 3. Crear el bucket de imágenes
1. Ve a **Storage > New bucket**.
2. Nombre exacto: `products`. Actívalo como **Public bucket**.
3. Vuelve a **SQL Editor**, pega el contenido de `supabase/storage-policies.sql` y dale **Run**.
   (Las imágenes reales se subirán desde el panel admin en la Fase 5; por ahora solo dejamos todo listo.)

### 4. Conectar el frontend
1. En Supabase ve a **Project Settings > API**.
2. Copia el **Project URL** y la **anon public key**.
3. En tu proyecto, copia el archivo `.env.example` y renómbralo a `.env`.
4. Pega ahí tu URL y tu anon key:
   ```
   VITE_SUPABASE_URL=https://tuproyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-clave-anon
   ```
5. Instala la nueva dependencia:
   ```
   npm install
   ```
6. Corre `npm run dev` de nuevo (si ya lo tenías abierto, detenlo con Ctrl+C y vuelve a correrlo para que tome las variables de entorno nuevas).


## Cómo probarlo en tu máquina

1. Descomprime el archivo `gamedigital-lc.zip`.
2. Abre una terminal dentro de la carpeta `gamedigital-lc`.
3. Instala las dependencias:
   ```
   npm install
   ```
4. Inicia el servidor de desarrollo:
   ```
   npm run dev
   ```
5. Abre en el navegador la URL que aparece en la terminal (normalmente `http://localhost:5173`).

## Qué deberías ver (Fase 3)

Si todo quedó bien conectado:
- El catálogo debe verse **exactamente igual que en la Fase 2** (mismos 8 juegos), pero ahora los datos vienen de tu base de datos en Supabase, no de un archivo del código.
- Por un instante, antes de que carguen los datos, verás el texto "Cargando catálogo...".
- Si algo está mal configurado (`.env` faltante, tabla no creada), verás un aviso magenta debajo del Hero explicando el problema — en vez de que la página se rompa en silencio.

**La prueba clave de esta fase** (esto es lo que confirma que Supabase manda de verdad):
1. Ve a Supabase → **Table Editor** → tabla `products`.
2. Cambia el precio de cualquier juego (ej. "Mario Kart 8 Deluxe") a un valor distinto.
3. Vuelve a tu navegador y refresca la página (F5).
4. El nuevo precio debe aparecer en el catálogo, sin haber tocado una línea de código.

Si eso funciona, la Fase 3 está lista y seguimos con la **Fase 4: login y panel administrativo** (para hacer esos cambios desde una interfaz en vez del Table Editor de Supabase).

## Notas importantes de seguridad

- El archivo `.env` **no se debe subir a GitHub**. Ya está en `.gitignore`.
- La clave que usas (`anon key`) es pública por diseño — la protección real la da RLS (Row Level Security), que ya dejamos configurada: cualquiera puede *leer* productos, pero solo un usuario autenticado (el admin, que crearemos en la Fase 4) puede crear, editar o borrar.

## Fase 4: Login y protección de /admin ✅

Se agregó el login del administrador con Supabase Auth, la ruta
`/admin` protegida (redirige a `/admin/login` si no hay sesión) y un
dashboard con estadísticas básicas del catálogo.

### 1. Crear la cuenta del administrador (una sola vez)
No hay pantalla de registro — el documento del proyecto es explícito:
una sola cuenta, creada manualmente por ti.

1. En Supabase ve a **Authentication > Users > Add user > Create new user**.
2. Escribe el correo y contraseña que usarás para entrar al panel.
3. Marca la casilla **Auto Confirm User** (para no depender de un correo de confirmación).
4. Dale **Create user**.

### 2. Bloquear el registro público
1. Ve a **Authentication > Sign In / Providers** (o **Settings**, según la versión del panel).
2. Busca la opción **Allow new users to sign up** y desactívala.
   Así, aunque alguien intente registrarse, no podrá crear cuentas nuevas.

### 3. Probar

Con `npm run dev` corriendo:

1. Entra directamente a `http://localhost:5173/admin` **sin haber iniciado sesión**.
   Debes ser redirigido automáticamente a `/admin/login`.
2. Inicia sesión con el correo y contraseña que creaste en el paso 1.
   Debes llegar al **Dashboard**, con tarjetas mostrando el total de juegos, destacados, agotados y plataformas (los mismos números que ya viste en el catálogo público).
3. Haz clic en **Cerrar sesión** (arriba a la derecha). Debes volver a `/admin/login`.
4. Intenta entrar de nuevo a `/admin` sin sesión — debe volver a redirigirte al login (confirma que la ruta está realmente protegida y no es solo una redirección visual).
5. Prueba con una contraseña incorrecta — debe mostrarte "Correo o contraseña incorrectos." sin dejarte entrar.

Si los 5 puntos funcionan, la Fase 4 está lista y seguimos con la
**Fase 5: CRUD** (crear, editar, eliminar juegos, precios e imágenes desde el panel).

## Fase 5: CRUD desde el panel ✅

Ya puedes crear, editar, eliminar juegos y subir sus imágenes desde
`/admin/productos`, sin tocar el código ni el Table Editor de Supabase.

### Probar

1. Inicia sesión y ve a **Juegos** en el menú lateral del admin (o el botón "Ir a Juegos" del dashboard).
2. Verás la tabla con los 8 juegos de ejemplo.
3. Haz clic en **Nuevo juego**: llena nombre, plataforma, precio; el "slug" se genera solo a partir del nombre. Sube una imagen (cualquier foto de tu computadora) — se guarda en el bucket `products` de Supabase. Dale **Crear juego**.
4. Debe cerrarse el formulario y aparecer el nuevo juego en la tabla al instante.
5. Abre en otra pestaña tu página pública (`http://localhost:5173/`) y refresca — el juego nuevo debe aparecer en el catálogo, con la imagen que subiste.
6. Vuelve al admin, haz clic en el ícono de lápiz de cualquier juego, cambia el precio o márcalo como "Destacado", guarda, y confirma que cambió tanto en la tabla del admin como en la página pública.
7. Haz clic en el botón "Sí/No" de la columna **Disponible** para alternar disponibilidad sin abrir el formulario — confirma que en la página pública ese juego ahora muestra (o deja de mostrar) el badge "Agotado".
8. Haz clic en el ícono de basurero de un juego, confirma el mensaje de "¿Eliminar...?", acepta, y verifica que desaparece de la tabla y del catálogo público.

Si los 8 puntos funcionan, la Fase 5 está lista y seguimos con la
**Fase 6: orden y destacados** (drag & drop para reordenar el catálogo).

## Fase 6: Orden y destacados ✅

Ya puedes reordenar el catálogo arrastrando las filas en `/admin/productos`.
El campo `position` se actualiza en Supabase automáticamente y el
catálogo público (y la sección "Destacados") siempre se ordena por esa
posición — esto ya estaba conectado desde la Fase 3.

### Probar

1. Ve a **Juegos** en el admin.
2. En pantallas grandes: arrastra una fila usando el ícono ⠿ (a la izquierda) y suéltala en otra posición. El orden debe cambiar de inmediato en la tabla.
3. En pantallas angostas (o achicando la ventana): usa las flechitas ▲▼ que aparecen junto a los botones de editar/eliminar para subir o bajar un juego.
4. Abre la página pública en otra pestaña y refresca (F5) — el catálogo debe respetar el nuevo orden.
5. Marca o desmarca "Destacado" en un par de juegos (editando cada uno) y confirma que la sección **Destacados** de la página pública muestra exactamente esos juegos, en el orden de posición que definiste.
6. Refresca la página del admin (F5) — el orden debe mantenerse (confirma que sí se guardó en Supabase y no es solo un cambio visual temporal).

Si los 6 puntos funcionan, la Fase 6 está lista y seguimos con la
**Fase 7: carrito y WhatsApp** (que el botón "+" de cada juego realmente agregue al carrito y genere el mensaje de compra).

## Fase 7: Carrito y WhatsApp ✅

El número de WhatsApp de la tienda ya quedó configurado
(`src/config/store.ts`). El botón "+" de cada juego ahora agrega de
verdad al carrito, con un panel lateral (drawer) para ver, cambiar
cantidades, quitar productos y enviar el pedido por WhatsApp con el
total calculado. El carrito se guarda en el navegador, así que si el
cliente recarga la página no lo pierde.

### Probar

1. En la página pública, haz clic en el botón "+" de un par de juegos distintos. El carrito debe abrirse solo la primera vez y el número en el ícono de carrito del Header debe aumentar.
2. Abre el carrito con el ícono del Header. Debes ver los juegos agregados, con imagen, plataforma, cantidad y precio por línea.
3. Usa los botones **-** y **+** de un juego para cambiar la cantidad. El precio de esa línea y el "Total aproximado" de abajo deben actualizarse al instante.
4. Baja la cantidad de un juego a 0 (o usa el ícono de basurero) — debe desaparecer del carrito.
5. Con al menos un juego en el carrito, haz clic en **Finalizar por WhatsApp**. Debe abrirse WhatsApp (web o app) con un mensaje ya escrito, listando cada juego, cantidad y el total.
6. Cierra el carrito, recarga la página completa (F5) — los juegos que dejaste en el carrito deben seguir ahí (se guardan en el navegador).
7. Prueba también el botón flotante verde de WhatsApp (abajo a la derecha) y el botón "Escríbenos" del Hero — ambos deben abrir WhatsApp con el mensaje general de la tienda, no el del carrito.

Si los 7 puntos funcionan, la Fase 7 está lista y seguimos con la
**Fase 8: optimización y despliegue final** en GitHub Pages (SEO, responsive final, build de producción).

## Cambios adicionales (post-Fase 7) ✅

Antes de pasar a la Fase 8, se hicieron 3 ajustes pedidos:

1. **Logo real**: se reemplazó el ícono genérico por tu logo (extraído de tu documento) en el Header, Footer, login y panel admin. También quedó como favicon de la pestaña del navegador.
2. **Hero oculto**: la sección grande de bienvenida ("Los juegos que buscas...") ya no se muestra en la página pública. El código sigue en `src/components/Hero.tsx` por si quieres reactivarla después — solo hay que agregar `<Hero />` de vuelta en `src/pages/Home.tsx`.
3. **Página de detalle del juego + cuenta principal/secundaria**: al hacer clic en cualquier juego del catálogo (no en el botón "+", sino en la tarjeta), se abre una página con la descripción completa y dos opciones de cuenta:
   - **Cuenta principal**: precio normal (el que ya tenía cada juego).
   - **Cuenta secundaria**: precio más bajo, opcional. Si no le pones un precio de cuenta secundaria a un juego, esa opción simplemente no aparece y solo se vende como cuenta principal.

   *(Asumí que la cuenta secundaria tiene un precio distinto, normalmente más bajo — es como funciona en la mayoría de tiendas de cuentas. Si tu caso es diferente, dime cómo funciona y lo ajusto.)*

### Un paso extra en Supabase antes de probar

Como se agregó un campo nuevo a la tabla, corre esta migración una sola vez:

1. Ve a Supabase → **SQL Editor → New query**.
2. Pega el contenido de `supabase/migration_account_types.sql` y dale **Run**.

### Probar

1. Recarga la página pública — debes ver tu logo (el control con el aro de colores) en la esquina superior izquierda en vez del ícono genérico, y **ya no debe aparecer** la sección grande de bienvenida.
2. Haz clic en cualquier juego del catálogo (en la imagen o el nombre, no en el botón "+"). Debe abrirse una página con: imagen grande, plataforma, descripción, selector de "Cuenta principal" y cantidad, botón "Agregar al carrito" y botón "Comprar por WhatsApp".
3. Entra al admin → edita un juego → en el campo nuevo "Precio cuenta secundaria" ponle un valor (ej. la mitad del precio normal) → guarda.
4. Vuelve a la página de ese juego en el catálogo público y refresca — ahora debe aparecer también la opción "Cuenta secundaria" con su propio precio, y puedes elegir entre las dos.
5. Elige "Cuenta secundaria", cambia la cantidad, y dale "Agregar al carrito" — en el drawer del carrito debe verse "Cuenta secundaria" junto al nombre del juego, con el precio correcto.
6. Prueba "Comprar por WhatsApp" desde la página de detalle — el mensaje debe incluir el nombre del juego, la plataforma, el tipo de cuenta elegido y el precio.

Cuando confirmes esto, seguimos con la **Fase 8: optimización y despliegue final**.

## Cambios adicionales (2) ✅

1. **Imagen completa, sin recortar**: las tarjetas del catálogo y la página de detalle ahora usan un recuadro de tamaño fijo donde la imagen se ve **completa** (sin recortar), con el degradado de color de la plataforma rellenando el espacio sobrante a los lados si la imagen no llena todo el recuadro.

2. **Categorías predefinidas + sección para agregar las tuyas**: ya no se escribe la categoría a mano en cada juego. Ahora es una lista desplegable con categorías típicas ya cargadas (Acción, Aventura, RPG, Deportes, Carreras, Estrategia, Simulación, Terror, Lucha, Plataformas, Disparos, Mundo abierto, Battle Royale, Multijugador / Dos jugadores, Música y ritmo). En `/admin/productos` hay una nueva sección **"Categorías"**, arriba de la tabla de juegos, donde puedes escribir el nombre de una categoría nueva y agregarla — al instante queda disponible en el formulario de juegos. También puedes eliminar categorías que no uses (el ícono de basurero junto a cada una).

### Un paso extra en Supabase antes de probar

Corre esta migración una sola vez (crea la tabla de categorías y la llena con las típicas):

1. Ve a Supabase → **SQL Editor → New query**.
2. Pega el contenido de `supabase/migration_categories.sql` y dale **Run**.

### Probar

1. Recarga el catálogo público — las imágenes de los juegos deben verse **completas**, sin que se corte ninguna parte (aunque quede un poco de espacio de color a los lados si la imagen no es exactamente del mismo tamaño que el recuadro).
2. Ve al admin → **Juegos**. Debajo del botón "Nuevo juego" debe aparecer la sección **Categorías**, con la lista ya cargada.
3. Escribe una categoría nueva (ej. "Educativo") y dale **Agregar**. Debe aparecer de inmediato en la lista, sin recargar la página.
4. Abre el formulario de un juego (nuevo o editar) — el campo "Categoría" ahora debe ser una lista desplegable que incluye la que acabas de crear.
5. Vuelve a la sección de categorías y elimina la que creaste de prueba (ícono de basurero) — debe desaparecer también de la lista.

Cuando confirmes esto, seguimos con la **Fase 8: optimización y despliegue final**.

## Cambios adicionales (3) ✅

1. **Colores de marca por consola**: en vez de neón genérico, cada plataforma ahora usa un color inspirado en su marca real:
   - **PS4**: azul PlayStation clásico.
   - **PS5**: azul PlayStation más claro (para distinguir la nueva generación).
   - **Nintendo**: rojo Nintendo.
   - **Nintendo Switch 2**: azul Joy-Con (distingue la consola nueva dentro de la familia Nintendo).

   *No usé los logos reales de Sony/Nintendo (son marca registrada) — en su lugar, cada plataforma tiene un ícono genérico de consola en su color de marca, lo cual se ve limpio y evita problemas de derechos de marca.*

2. **Nueva categoría: Nintendo Switch 2**. Ya aparece junto a PS4, PS5 y Nintendo en "Elige tu plataforma", en el menú del Header, y como opción al crear o editar un juego en el admin.

### Un paso extra en Supabase antes de probar

Corre esta migración una sola vez (habilita "Switch2" como plataforma válida):

1. Ve a Supabase → **SQL Editor → New query**.
2. Pega el contenido de `supabase/migration_switch2.sql` y dale **Run**.

### Probar

1. Recarga el catálogo público — la sección "Elige tu plataforma" debe mostrar **4 tarjetas**: PS4 (azul), PS5 (azul claro), Nintendo (rojo) y Switch 2 (azul Joy-Con), cada una con su ícono de consola a un lado.
2. En el Header, el menú de categorías (PS4 · PS5 · Nintendo · Switch 2) debe reflejar lo mismo.
3. En el admin, crea o edita un juego y selecciona "Nintendo Switch 2" como plataforma. Guarda y confirma que aparece correctamente en el catálogo, con el color e ícono correspondiente.
4. Haz clic en la tarjeta "Switch 2" del catálogo — debe filtrar el catálogo a solo esos juegos (estará vacío hasta que agregues alguno ahí).
5. Revisa que en las tarjetas del catálogo, en la página de detalle y en la tabla del admin, cada plataforma se vea con su color e ícono correspondiente (ya no todo en cyan/magenta/verde neón).

Cuando confirmes esto, seguimos con la **Fase 8: optimización y despliegue final**.

## Fase 8: Optimización y despliegue final ✅

### 1. Imágenes más livianas, sin perder calidad

Ahora, cada vez que subes una imagen desde el panel admin, el navegador la
redimensiona (máximo 1200px de lado) y la comprime a formato WebP antes de
subirla a Supabase — normalmente pasa de varios MB (foto de celular) a
unos cuantos cientos de KB, sin que se note la diferencia visual. Además,
las imágenes fuera de la pantalla inicial ahora cargan solo cuando el
usuario se acerca a verlas (`lazy loading`), para que la primera carga de
la página sea más rápida.

**Importante**: esto solo aplica a imágenes que subas *después* de este
cambio. Las que ya subiste antes siguen tal cual (no se reprocesan solas),
pero puedes volver a subirlas si quieres que también se optimicen —
edita el juego y sube la imagen de nuevo.

### 2. Publicar en GitHub Pages

Tienes dos formas de hacerlo. Te recomiendo la primera.

#### Opción A: Automático con GitHub Actions (recomendado)

Cada vez que subas cambios a la rama `main`, se publica solo.

1. Crea un repositorio en GitHub. **El nombre debe ser exactamente `gamedigital-lc`** (así está configurado en `vite.config.ts` y `src/main.tsx`). Si prefieres otro nombre, cambia `'/gamedigital-lc/'` por `'/tu-nombre-de-repo/'` en esos dos archivos antes de continuar.
2. Sube tu proyecto a ese repositorio (si nunca has usado Git/GitHub, dímelo y te guío paso a paso con los comandos).
3. En GitHub, ve a **Settings > Pages** y en "Build and deployment" selecciona **Source: GitHub Actions**.
4. Ve a **Settings > Secrets and variables > Actions > New repository secret** y crea dos secretos (cópialos tal cual de tu archivo `.env`):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Sube (`git push`) a la rama `main`. Ve a la pestaña **Actions** de tu repositorio — debe aparecer un flujo llamado "Deploy to GitHub Pages" corriendo. Cuando termine (ícono verde ✔), tu sitio queda publicado en `https://tu-usuario.github.io/gamedigital-lc/`.

#### Opción B: Manual, desde tu computadora

Más simple si no quieres configurar secretos en GitHub, pero tienes que
correrlo tú cada vez que quieras actualizar el sitio en línea.

```
npm run deploy
```

Este comando construye el proyecto y lo publica directo a la rama `gh-pages` de tu repositorio (usa tus credenciales de Git ya configuradas en tu computadora). Luego, en GitHub, ve a **Settings > Pages** y selecciona **Source: Deploy from a branch**, rama `gh-pages`, carpeta `/ (root)`.

### 3. El "truco" para que /admin y /juego/... funcionen en GitHub Pages

GitHub Pages es hosting estático: no entiende por sí solo rutas como
`/admin` o `/juego/mario-kart-8-deluxe` si alguien entra directo a esa
URL o la recarga (F5). Para solucionarlo, cada `npm run build` genera
automáticamente una copia de `index.html` llamada `404.html` — así,
cuando GitHub Pages no encuentra una ruta, sirve tu app igual y React
Router toma el control desde ahí. Ya está configurado, no tienes que
hacer nada manualmente.

### 4. SEO y vista previa al compartir el link

Se agregaron etiquetas para que, al compartir el link de tu tienda por
WhatsApp, se vea una tarjeta con tu logo, el nombre y una descripción
(en vez de solo el link pelado). **Un paso pendiente**: una vez publicado
tu sitio, abre `index.html`, busca las líneas que dicen `<!-- IMPORTANTE...`
y cambia `/logo.png` por la URL completa, por ejemplo:
`https://tu-usuario.github.io/gamedigital-lc/logo.png` — WhatsApp necesita
la URL completa, no una relativa, para poder mostrar la imagen.

### Probar

1. Corre `npm run build` localmente — no debe mostrar errores.
2. Revisa que se haya creado `dist/404.html` además de `dist/index.html` (confirma que el truco de las rutas quedó activo).
3. Sigue la Opción A o B para publicar.
4. Ya publicado, entra a la URL de tu sitio. Prueba navegar al catálogo, entrar a un juego, entrar directo a `/admin` — todo debe funcionar igual que en tu computadora.
5. Comparte el link de tu tienda contigo mismo por WhatsApp (a un chat de prueba) y confirma que se ve la tarjeta con el logo (puede tardar unos minutos en actualizarse la primera vez, WhatsApp guarda una vista previa en caché).

¡Con esto tu tienda queda completa y publicada! Si más adelante quieres agregar algo nuevo o ajustar cualquier detalle, aquí sigo.
