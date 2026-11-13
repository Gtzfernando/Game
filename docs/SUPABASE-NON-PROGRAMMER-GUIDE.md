# Guía para conectar el juego a Supabase sin saber programar

Esta guía explica paso a paso, con lenguaje sencillo, cómo poner en marcha el juego usando Supabase como base de datos y autenticación.

## ¿Qué es Supabase?

Supabase es un servicio gratuito (con opciones de pago) que funciona como la "base de datos" y el "sistema de login" del juego. Es donde se guardan:

- Las cuentas de los jugadores.
- El progreso de cada jugador.
- Los acertijos, respuestas, códigos QR y fragmentos de texto.

## Requisitos previos

Antes de empezar necesitas:

1. Una cuenta de correo electrónico.
2. Una cuenta en GitHub (para subir el código).
3. Una cuenta en Supabase (es gratis).
4. El código del proyecto en tu computadora.

---

## Paso 1: Crear una cuenta en Supabase

1. Entra a [https://supabase.com](https://supabase.com).
2. Haz clic en **Sign In** o **Start your project**.
3. Puedes registrarte con tu cuenta de GitHub o con correo y contraseña.
4. Una vez dentro, haz clic en **New project**.
5. Elige una organización (puede ser la personal).
6. Completa los datos:
   - **Name**: escribe un nombre, por ejemplo `mystery-game`.
   - **Database Password**: escribe una contraseña segura. Guárdala en un lugar seguro.
   - **Region**: elige la región más cercana a tu país.
7. Haz clic en **Create new project**.
8. Espera unos minutos a que Supabase termine de preparar todo.

---

## Paso 2: Obtener las credenciales de Supabase

Cuando el proyecto esté listo, verás una pantalla con varios datos. Necesitas copiar dos valores:

1. **Project URL**
2. **anon public** key

### Cómo obtenerlos:

1. En el menú lateral izquierdo, haz clic en el icono de engranaje ⚙️ que dice **Project Settings**.
2. En el menú que se abre, haz clic en **Data API**.
3. Busca la sección **Project URL**.
4. Copia el valor que aparece en **URL**. Se ve algo así:
   ```
   https://abcdefghijklmnopqrs.supabase.co
   ```
5. Más abajo verás **Project API keys**.
6. Busca la fila que dice **anon public**.
7. Copia la larga cadena de texto que aparece a su lado.

> **Consejo**: guarda estos dos valores en un archivo de texto temporal. Los usarás en el siguiente paso.

---

## Paso 3: Crear el archivo de variables de entorno

El proyecto necesita saber dónde está tu base de datos de Supabase. Para eso se usa un archivo llamado `.env.local`.

1. Abre la carpeta del proyecto en tu computadora.
2. Busca un archivo llamado `.env.example`.
3. Haz una copia de ese archivo y renómbrala como `.env.local`.
4. Abre el archivo `.env.local` con el Bloc de notas o cualquier editor de texto.
5. Verás algo así:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   GAME_CONTENT_HASH_SECRET=
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
6. Pega los valores que copiaste de Supabase:
   - Después de `NEXT_PUBLIC_SUPABASE_URL=` pega la URL del proyecto.
   - Después de `NEXT_PUBLIC_SUPABASE_ANON_KEY=` pega la clave anon public.
7. Para `GAME_CONTENT_HASH_SECRET=` escribe una contraseña larga y aleatoria. Puedes escribir una frase larga que nadie pueda adivinar, por ejemplo:
   ```
   Mi-Frase-Secreta-Muy-Larga-12345-!!!-No-Compartir
   ```
8. Deja `SUPABASE_SERVICE_ROLE_KEY=` vacío por ahora. Lo completaremos en el siguiente paso.
9. Guarda el archivo.

---

## Paso 4: Obtener la Service Role Key

Esta clave es muy poderosa y debe mantenerse en secreto. Permite al juego crear usuarios y gestionar el contenido.

1. En Supabase, ve de nuevo a **Project Settings** ⚙️ → **Data API**.
2. En la tabla **Project API keys**, busca la fila que dice **service_role secret**.
3. Haz clic en el botón para revelar la clave (parece un ojo 👁️).
4. Copia la clave.
5. Pégala en tu archivo `.env.local` después de `SUPABASE_SERVICE_ROLE_KEY=`.

> **Muy importante**: nunca compartas esta clave. No la subas a internet ni la envíes por correo.

---

## Paso 5: Ejecutar las migraciones SQL

Las migraciones son instrucciones que le dicen a Supabase qué tablas y reglas de seguridad crear.

1. En Supabase, en el menú lateral izquierdo, busca **SQL Editor** y haz clic.
2. Haz clic en **New query**.
3. Se abrirá un espacio para escribir código.
4. Abre la carpeta del proyecto en tu computadora.
5. Entra a `supabase/migrations/`.
6. Verás 4 archivos:
   - `0001_create_game_tables.sql`
   - `0002_enable_rls_policies.sql`
   - `0003_create_game_rpc_functions.sql`
   - `0004_seed_game_stages.sql`
7. Abre el primero (`0001_create_game_tables.sql`) con el Bloc de notas.
8. Copia TODO el contenido.
9. Pégalo en el SQL Editor de Supabase.
10. Haz clic en **Run**.
11. Espera a que termine.
12. Repite el mismo proceso con los otros 3 archivos, en orden.

> Si aparece algún mensaje verde o dice "Success", todo salió bien.

---

## Paso 6: Sembrar el contenido del juego (generar hashes)

Después de las migraciones, debes ejecutar un comando especial para que las respuestas de los acertijos se guarden de forma segura.

### En Windows:

1. Abre la carpeta del proyecto.
2. En la barra de direcciones de la carpeta, escribe `cmd` y presiona Enter. Se abrirá una ventana negra.
3. Escribe el siguiente comando y presiona Enter:
   ```bash
   npm run seed-content
   ```
4. Si todo sale bien, verás un mensaje como:
   ```
   Etapa 1 actualizada. Hash: ...
   Etapa 2 actualizada. Hash: ...
   Contenido del juego sembrado correctamente.
   ```

### Si hay errores:

- Asegúrate de que el archivo `.env.local` tenga todos los valores correctos.
- Asegúrate de haber ejecutado las 4 migraciones en Supabase.

---

## Paso 7: Validar el contenido

Ejecuta este comando para comprobar que todo el contenido está completo:

```bash
npm run validate-content
```

Si ves el mensaje `El contenido del juego es válido`, todo está bien.

---

## Paso 8: Crear la cuenta del jugador

El juego está pensado para una persona. Puedes crear la cuenta de dos formas:

### Opción A: Desde Supabase (más fácil)

1. En Supabase, ve al menú lateral y haz clic en **Authentication**.
2. Haz clic en **Users**.
3. Haz clic en **Add user**.
4. Selecciona **Create new user**.
5. Escribe un correo electrónico.
6. Escribe una contraseña (mínimo 6 caracteres).
7. Haz clic en **Create user**.

### Opción B: Con el script del proyecto

1. Abre la carpeta del proyecto.
2. En la barra de direcciones escribe `cmd` y presiona Enter.
3. Escribe estos comandos, reemplazando el correo y la contraseña:
   ```bash
   set PLAYER_EMAIL=tucorreo@ejemplo.com
   set PLAYER_PASSWORD=tu-contraseña-segura
   npm run create-player
   ```

---

## Paso 9: Configurar las URLs de redirección

Esto le dice a Supabase desde qué direcciones de internet puede iniciar sesión la gente.

1. En Supabase, ve a **Authentication** → **URL Configuration**.
2. En **Site URL**, escribe tu dominio final. Por ejemplo:
   ```
   https://mijuego.netlify.app
   ```
3. En **Redirect URLs**, añade estas dos direcciones (una por línea):
   ```
   http://localhost:3000/auth/callback
   https://mijuego.netlify.app/auth/callback
   ```
4. Haz clic en **Save**.

> Si aún no tienes dominio final, puedes poner `http://localhost:3000` temporalmente y cambiarlo después.

---

## Paso 10: Probar el juego en tu computadora

1. Abre la carpeta del proyecto.
2. En la barra de direcciones escribe `cmd` y presiona Enter.
3. Escribe:
   ```bash
   npm run dev
   ```
4. Abre tu navegador y entra a:
   ```
   http://localhost:3000
   ```
5. Deberías ver la pantalla de login.
6. Inicia sesión con el correo y contraseña que creaste.
7. Prueba resolver el primer acertijo con la respuesta: **OJOS**.

---

## Paso 11: Subir el juego a Netlify

### Preparar el repositorio en GitHub

1. Ve a [https://github.com](https://github.com).
2. Inicia sesión.
3. Haz clic en el botón verde **New** para crear un nuevo repositorio.
4. Escribe un nombre, por ejemplo `mystery-game`.
5. Haz clic en **Create repository**.
6. Sigue las instrucciones que aparecen para subir el código desde tu computadora.

> Si no sabes usar Git, puedes arrastrar la carpeta del proyecto a la página de GitHub en modo "Upload files".

### Conectar con Netlify

1. Ve a [https://netlify.com](https://netlify.com).
2. Crea una cuenta o inicia sesión.
3. Haz clic en **Add new site** → **Import an existing project**.
4. Selecciona **GitHub**.
5. Busca y selecciona tu repositorio `mystery-game`.
6. En la configuración del sitio:
   - **Build command**: escribe `npm run build`.
   - **Publish directory**: escribe `.next`.
7. Haz clic en **Show advanced** y luego en **New variable** para añadir las variables de entorno (las mismas del archivo `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GAME_CONTENT_HASH_SECRET`
   - `NEXT_PUBLIC_APP_URL` (con tu dominio de Netlify)
8. Haz clic en **Deploy site**.
9. Espera a que termine el despliegue.
10. Netlify te dará una dirección como `https://mystery-game-123.netlify.app`.

### Últimos pasos en Netlify

1. Copia tu dominio de Netlify.
2. Ve a Supabase → **Authentication** → **URL Configuration**.
3. Actualiza **Site URL** con tu dominio de Netlify.
4. Añade tu dominio en **Redirect URLs**:
   ```
   https://mijuego.netlify.app/auth/callback
   ```
5. Guarda los cambios.

---

## Paso 12: Probar en tu teléfono

1. Abre tu dominio de Netlify en el teléfono.
2. Inicia sesión.
3. El escáner de QR funcionará solo si usas **HTTPS** (Netlify ya lo hace).
4. Prueba escanear el primer código QR con el texto `TXT-1-53`.

---

## ¿Qué hacer si algo falla?

### Error "Invalid environment variables"
Significa que falta algún valor en `.env.local` o en las variables de Netlify. Revisa que todos estén completos.

### Error al ejecutar migraciones
Asegúrate de ejecutar los 4 archivos en orden. No copies los 4 juntos en una sola consulta.

### El login no funciona
Revisa en Supabase → Authentication → Users que el usuario exista.

### La cámara no funciona
La cámara solo funciona en HTTPS o en `localhost`. No funciona si abres el sitio usando una dirección IP como `192.168.1.10`.

---

## Recordatorio de seguridad

- Nunca compartas `SUPABASE_SERVICE_ROLE_KEY`.
- Nunca subas el archivo `.env.local` a GitHub (ya está en `.gitignore`).
- Usa contraseñas largas y difíciles de adivinar.
