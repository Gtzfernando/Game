# Mystery Game

Juego web interactivo de acertijos, búsqueda de códigos QR y revelación de un mensaje final.

## Documentación

- `docs/SPECIFICATION.md` — Especificación técnica completa.
- `docs/CONTENT-TRANSCRIPTION.md` — Transcripción literal del diagrama original.
- `docs/DEPLOYMENT.md` — Pasos de despliegue en Vercel/Netlify.
- `docs/TEST-PLAN.md` — Plan de pruebas.

## Configuración rápida

1. Copiar `.env.example` a `.env.local` y completar las variables.
2. Ejecutar migraciones en Supabase.
3. Sembrar contenido: `npm run seed-content`.
4. Crear jugador: `npm run create-player`.
5. Ejecutar localmente: `npm run dev`.

## Scripts

- `npm run dev` — Inicia servidor de desarrollo.
- `npm run lint` — Ejecuta ESLint.
- `npm run typecheck` — Verifica tipos de TypeScript.
- `npm run test` — Ejecuta pruebas unitarias.
- `npm run test:e2e` — Ejecuta pruebas E2E con Playwright.
- `npm run build` — Construye la aplicación.
- `npm run seed-content` — Actualiza contenido del juego en Supabase.
- `npm run create-player` — Crea la cuenta del jugador.
- `npm run validate-content` — Valida que el contenido esté completo.
