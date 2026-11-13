# Guía de despliegue — Juego de acertijos

## 1. Requisitos previos

- Node.js compatible con Next.js (recomendado >= 20).
- npm.
- Cuenta en Supabase.
- Cuenta en GitHub.
- Cuenta en Vercel o Netlify.

## 2. Variables de entorno

Copiar `.env.example` a `.env.local` y completar:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key-pública>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key-secreta>
GAME_CONTENT_HASH_SECRET=<secreto-largo-aleatorio>
NEXT_PUBLIC_APP_URL=https://<dominio-produccion>
```

**Nunca subir `.env.local` ni `SUPABASE_SERVICE_ROLE_KEY` al repositorio.**

## 3. Configuración de Supabase

1. Crear proyecto en Supabase.
2. Obtener URL y anon key.
3. Ejecutar las migraciones SQL en orden:
   - `supabase/migrations/0001_create_game_tables.sql`
   - `supabase/migrations/0002_enable_rls_policies.sql`
   - `supabase/migrations/0003_create_game_rpc_functions.sql`
   - `supabase/migrations/0004_seed_game_stages.sql`
4. Ejecutar `npm run seed-content` para generar los hashes de respuesta con `GAME_CONTENT_HASH_SECRET`.
5. Ejecutar `npm run validate-content` para comprobar que no quedan marcadores pendientes.
6. Crear el usuario jugador. Opciones:
   - Desde Supabase Dashboard → Authentication → Add user.
   - Ejecutar `npx tsx scripts/create-admin-player.ts` localmente con `SUPABASE_SERVICE_ROLE_KEY`.
7. Configurar URL de sitio y redirect URLs en Authentication → URL Configuration:
   - `http://localhost:3000/auth/callback`
   - `https://<dominio-produccion>/auth/callback`
8. Verificar que RLS esté activo en todas las tablas.

## 4. Preparación local

```bash
npm install
npm run lint
npm run typecheck
npm run test
npm run build
npm run dev
```

## 5. Despliegue en Vercel (recomendado)

1. Importar repositorio GitHub en Vercel.
2. Seleccionar framework Next.js.
3. Añadir variables de entorno.
4. Desplegar.
5. Añadir el dominio de producción en Supabase Auth.
6. Probar login, cámara, progreso y QR en HTTPS.

## 6. Despliegue en Netlify (alternativa)

1. Importar repositorio en Netlify.
2. Seleccionar integración oficial de Next.js.
3. Añadir variables de entorno.
4. Configurar redirects de Supabase Auth si es necesario.
5. Desplegar.
6. Probar funciones de servidor y cámara.

**No usar `output: "export"` ni despliegue estático.**

## 7. Notas sobre cámara QR

- `getUserMedia` requiere HTTPS en producción.
- En localhost funciona como contexto seguro de desarrollo.
- No probar mediante IP HTTP en red local; el navegador puede bloquear la cámara.

## 8. Producción lista cuando...

- Migraciones ejecutadas.
- Contenido validado (`npm run validate-content`).
- Cuenta del jugador creada.
- Variables configuradas.
- Build exitoso.
- Pruebas manuales de flujo completo realizadas.
