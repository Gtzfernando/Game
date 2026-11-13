# Informe final — Juego de acertijos Mystery Game

## 1. Resumen de lo construido

Se implementó una aplicación web completa con Next.js 15 App Router, TypeScript, Tailwind CSS, Supabase Auth + PostgreSQL y lector de QR con @zxing/browser.

La aplicación incluye:

- Autenticación con correo y contraseña mediante Supabase Auth SSR.
- Tutorial introductorio (video en `public/media/tutorial.mp4`).
- Cuatro etapas secuenciales con acertijo, respuesta, pista QR, escáner y fragmento.
- Validación de respuestas y QR en el servidor.
- Persistencia del progreso en Supabase con continuidad entre dispositivos.
- Archivo con textos encontrados y códigos QR encontrados.
- Página final con instrucciones del diagrama, sin resolver el mensaje por el jugador.
- Pruebas unitarias y estructura para pruebas E2E.

## 2. Árbol real de archivos

```text
C:\Users\Admin\Desktop\Blg
├── docs/
│   ├── SPECIFICATION.md
│   ├── Diagrama-de-flujo-original.pdf
│   ├── CONTENT-TRANSCRIPTION.md
│   ├── DEPLOYMENT.md
│   ├── TEST-PLAN.md
│   └── FINAL-REPORT.md
├── public/
│   └── media/
│       └── tutorial.mp4          # Pendiente: aportar el video real
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── middleware.ts
│   │   ├── (auth)/login/page.tsx
│   │   ├── (protected)/
│   │   │   ├── layout.tsx
│   │   │   ├── archive/page.tsx
│   │   │   ├── final/page.tsx
│   │   │   └── game/
│   │   │       ├── page.tsx
│   │   │       ├── actions.ts
│   │   │       ├── intro/page.tsx
│   │   │       └── stage/[stageNumber]/
│   │   │           ├── page.tsx
│   │   │           ├── qr/page.tsx
│   │   │           └── fragment/page.tsx
│   │   └── api/
│   │       ├── progress/route.ts
│   │       ├── archive/route.ts
│   │       └── stages/[stageNumber]/
│   │           ├── answer/route.ts
│   │           └── qr/route.ts
│   ├── components/
│   │   ├── app/
│   │   ├── auth/
│   │   ├── archive/
│   │   ├── game/
│   │   └── ui/
│   ├── content/
│   │   ├── game-content.ts          # Re-export server-only
│   │   ├── game-content-data.ts     # Datos canónicos
│   │   └── content-validation.ts
│   ├── hooks/
│   │   └── use-qr-scanner.ts
│   ├── lib/
│   │   ├── constants.ts
│   │   ├── env.ts
│   │   ├── errors.ts
│   │   ├── validations/
│   │   ├── game/                    # Servicios y lógica de negocio
│   │   └── supabase/                # Clientes SSR y service role
│   ├── middleware.ts
│   └── types/
├── supabase/
│   ├── config.toml
│   ├── migrations/
│   │   ├── 0001_create_game_tables.sql
│   │   ├── 0002_enable_rls_policies.sql
│   │   ├── 0003_create_game_rpc_functions.sql
│   │   └── 0004_seed_game_stages.sql
│   └── tests/
│       └── rls-and-game-functions.test.sql
├── scripts/
│   ├── create-admin-player.ts
│   ├── seed-game-content.ts
│   └── validate-content.ts
├── tests/
│   ├── setup.ts
│   ├── unit/
│   │   ├── normalize-answer.test.ts
│   │   ├── stage-state.test.ts
│   │   └── content-validation.test.ts
│   └── e2e/
│       ├── authentication.spec.ts
│       ├── complete-stage.spec.ts
│       ├── wrong-qr.spec.ts
│       ├── persistence.spec.ts
│       └── final-page.spec.ts
├── .env.example
├── .eslintrc.json
├── next.config.ts
├── package.json
├── package-lock.json
├── playwright.config.ts
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── README.md
└── open-code-instructions.md
```

## 3. Responsabilidad de cada archivo clave

| Archivo | Responsabilidad |
|---|---|
| `src/lib/supabase/server.ts` | Cliente SSR para Server Components y API routes. |
| `src/lib/supabase/service.ts` | Cliente con service role para operaciones críticas. |
| `src/lib/supabase/client.ts` | Cliente anónimo para componentes cliente. |
| `src/lib/game/progress-service.ts` | Inicialización y consulta de progreso. |
| `src/lib/game/answer-service.ts` | Validación de respuestas en servidor. |
| `src/lib/game/qr-service.ts` | Validación de QR y transición de etapa. |
| `src/lib/game/archive-service.ts` | Consulta de fragmentos y QR encontrados. |
| `src/lib/game/stage-state.ts` | Funciones puras de transición de estados. |
| `src/lib/game/answer-hash.ts` | Hash HMAC de respuestas con secreto de servidor. |
| `src/content/game-content-data.ts` | Catálogo canónico de etapas. |
| `src/content/game-content.ts` | Re-export protegido con `server-only`. |
| `supabase/migrations/*.sql` | Esquema, RLS, funciones RPC y seed inicial. |
| `scripts/seed-game-content.ts` | Actualiza hashes y contenido de etapas. |
| `scripts/create-admin-player.ts` | Crea la cuenta del jugador. |

## 4. Tablas y funciones SQL creadas

### Tablas

- `public.game_stages` — catálogo de etapas.
- `public.player_progress` — progreso general por usuario.
- `public.stage_progress` — progreso individual por etapa.
- `public.found_fragments` — fragmentos revelados.
- `public.found_qr_codes` — códigos QR registrados.

### Funciones RPC

- `initialize_player_progress(p_user_id UUID)` — crea progreso y registros de etapa de forma idempotente.
- `complete_stage_qr(p_user_id, p_stage_number, p_qr_payload)` — completa etapa transaccionalmente, guarda QR y fragmento, avanza etapa.

### Políticas RLS

- RLS activo en todas las tablas.
- Usuario autenticado solo lee su propio progreso, etapas, fragmentos y QR.
- `game_stages` no legible directamente desde cliente; acceso vía service role.

## 5. Variables de entorno necesarias

Copiar `.env.example` a `.env.local` y completar:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
GAME_CONTENT_HASH_SECRET=<secreto-largo-aleatorio>
NEXT_PUBLIC_APP_URL=https://<dominio-produccion>
```

**Importante:** `SUPABASE_SERVICE_ROLE_KEY` y `GAME_CONTENT_HASH_SECRET` nunca deben exponerse en el navegador ni en `NEXT_PUBLIC_*`.

## 6. Pasos para crear/configurar Supabase

1. Crear proyecto en Supabase.
2. Copiar URL y anon key en `.env.local`.
3. Ejecutar migraciones en orden:
   - `0001_create_game_tables.sql`
   - `0002_enable_rls_policies.sql`
   - `0003_create_game_rpc_functions.sql`
   - `0004_seed_game_stages.sql`
4. Ejecutar `npm run seed-content` para generar hashes de respuestas.
5. Verificar con `npm run validate-content`.
6. Configurar Authentication → URL Configuration con:
   - `http://localhost:3000/auth/callback`
   - `https://<dominio-produccion>/auth/callback`

## 7. Pasos para crear la cuenta del jugador

Opción A — Dashboard:

1. Ir a Supabase Dashboard → Authentication → Users → Add user.
2. Ingresar correo y contraseña.
3. Al iniciar sesión por primera vez, el progreso se inicializa automáticamente.

Opción B — Script:

```powershell
$env:PLAYER_EMAIL="jugador@ejemplo.com"
$env:PLAYER_PASSWORD="contraseña-segura"
npm run create-player
```

## 8. Comandos para ejecutar localmente

```bash
npm install
npm run lint
npm run typecheck
npm run test
npm run build   # requiere variables de entorno configuradas
npm run dev
```

## 9. Resultados de pruebas

| Comando | Resultado |
|---|---|
| `npm run lint` | ✅ Sin advertencias ni errores |
| `npm run typecheck` | ✅ Sin errores |
| `npm run test` | ✅ 18 tests unitarios pasan |
| `npm run build` | ✅ Build exitoso (con variables dummy) |
| `npm run validate-content` | ✅ Contenido válido |

Las pruebas E2E requieren un backend real y un usuario de prueba; no se ejecutaron automáticamente.

## 10. Pruebas manuales que el propietario debe hacer

1. Login con usuario creado.
2. Ver tutorial (o mensaje de video pendiente).
3. Resolver acertijo 1 con "OJOS".
4. Ver pista QR y escanear `TXT-1-53`.
5. Ver fragmento 1 y avanzar.
6. Repetir para etapas 2, 3 y 4.
7. Verificar archivo con textos y QR.
8. Cerrar sesión, abrir en otro navegador y recuperar progreso.
9. Verificar que `/final` solo es accesible tras etapa 4.
10. Verificar que no hay campo de poema final ni validación automática.

## 11. Pasos para publicar en Vercel

1. Subir repositorio a GitHub.
2. Importar en Vercel y seleccionar Next.js.
3. Configurar variables de entorno.
4. Desplegar.
5. Añadir dominio de producción en Supabase Auth.
6. Probar login, cámara, progreso y QR en HTTPS.

## 12. Pasos alternativos para Netlify

1. Importar repositorio en Netlify.
2. Usar integración oficial de Next.js.
3. Configurar variables de entorno.
4. Configurar redirects de Supabase Auth si es necesario.
5. Desplegar.
6. Probar funciones de servidor y cámara.

**No usar `output: "export"`.**

## 13. Textos pendientes de transcripción/confirmación

El contenido se transcribió fielmente del PDF. Los siguientes puntos requieren confirmación del propietario:

1. **Pistas físicas vacías:** las cuatro etapas tienen `location_clue = ""`. Configurar en `src/content/game-content-data.ts` y volver a sembrar.
2. **Texto FY duplicado:** el Fragmento 3 y el Fragmento 4 comparten el mismo texto según el PDF. No se deduplicó.
3. **"sercas" en acertijo 2:** se mantuvo literalmente.
4. **"WYT..." en Fragmento 1:** se mantuvo literalmente.
5. **"la parada AM" en Fragmento 2:** se mantuvo literalmente.
6. **"Suerte, Bay ¡¡" en cierre:** se mantuvo literalmente.

## 14. Limitaciones técnicas detectadas

1. **QR estático:** los payloads QR son identificadores legibles. La app verifica que se presentó el código esperado, pero no garantiza presencia física del jugador.
2. **Cámara requiere HTTPS:** `getUserMedia` necesita HTTPS en producción o localhost en desarrollo.
3. **E2E sin backend real:** las pruebas E2E necesitan un proyecto Supabase activo y credenciales de prueba.
4. **Dependencias con vulnerabilidades:** `npm audit` reporta 16 vulnerabilidades, varias por versiones antiguas de dependencias transitivas. Se recomienda actualizar Next.js a una versión parcheada.
5. **Video tutorial:** el archivo `public/media/tutorial.mp4` no existe; la app muestra un mensaje informativo.

## 15. Recomendaciones antes de producción

1. Actualizar Next.js a una versión sin vulnerabilidades conocidas.
2. Revisar y confirmar los textos pendientes.
3. Añadir el video tutorial en `public/media/tutorial.mp4`.
4. Configurar rate limiting en endpoints de validación.
5. Ejecutar pruebas E2E con backend real.
6. Configurar dominio HTTPS y probar cámara en dispositivos móviles.
