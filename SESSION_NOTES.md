# Mystery Game - Notas de sesión

## Fecha
2026-11-11

## Estado actual
✅ **FUNCIONALIDAD BASE COMPLETA Y DESPLEGADA**

La aplicación está desplegada y funcionando correctamente en:

```
https://elegant-marzipan-792639.netlify.app
```

## Qué se logró hoy

1. **Corregido error crítico client-side**: el problema original era que las variables de entorno no llegaban al bundle del cliente, causando `Invalid public environment variables`.
2. **Separación de variables de entorno**:
   - `src/lib/env/client.ts` → variables públicas (`NEXT_PUBLIC_*`)
   - `src/lib/env/server.ts` → variables del servidor (con `import "server-only"`)
3. **Eliminado el middleware** (`src/middleware.ts` y `src/lib/supabase/middleware.ts`) para evitar conflictos con Edge Functions de Netlify durante el deploy desde CLI.
4. **Configurado deploy vía Netlify CLI**:
   - Sitio vinculado: `elegant-marzipan-792639`
   - Comando de deploy: `netlify deploy --prod`
   - Archivo `.env` creado con las variables necesarias para builds locales/deploys por CLI.
5. **Verificado funcionamiento**:
   - Login
   - Navegación entre etapas
   - Escáner QR con cámara
   - Validación de respuestas
   - Visualización de fragmentos y archivo

## Estructura clave del proyecto

```
src/
├── app/
│   ├── (auth)/login/page.tsx        # Página de login
│   ├── (protected)/                 # Rutas protegidas
│   │   ├── archive/page.tsx
│   │   ├── final/page.tsx
│   │   ├── game/page.tsx
│   │   ├── game/intro/page.tsx
│   │   ├── game/stage/[stageNumber]/page.tsx
│   │   ├── game/stage/[stageNumber]/qr/page.tsx
│   │   ├── game/stage/[stageNumber]/fragment/page.tsx
│   │   └── layout.tsx               # Layout protegido (verifica auth)
│   └── api/                         # API routes
├── components/
│   ├── auth/login-form.tsx
│   ├── app/app-header.tsx
│   ├── app/app-navigation.tsx
│   ├── app/logout-button.tsx
│   ├── game/*                       # Componentes del juego
│   ├── archive/*                    # Componentes del archivo
│   └── ui/*                         # Componentes base
├── hooks/use-qr-scanner.ts          # Hook del escáner QR
├── lib/
│   ├── env/client.ts                # Variables públicas
│   ├── env/server.ts                # Variables del servidor
│   ├── game/progress-service.ts     # Lógica de progreso
│   ├── game/answer-hash.ts          # Hash de respuestas
│   └── supabase/                    # Clientes de Supabase
└── types/game.ts                    # Tipos del juego
```

## Variables de entorno configuradas

Archivo `.env` (y `.env.local`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://zdtflfpsydmpuagxywvm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=https://elegant-marzipan-792639.netlify.app
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
GAME_CONTENT_HASH_SECRET=c38a76bf0a21fd3883b08cd766f03fb559215cbb2a3b2b0618bad4d760f1c698
```

⚠️ **No compartir `.env` ni `.env.local`**. Contienen claves privadas.

## Cómo deployar mañana

Si se hacen cambios y se quiere actualizar el sitio:

```bash
netlify deploy --prod
```

El comando asume que ya estás logueado y el directorio está vinculado al sitio `elegant-marzipan-792639`.

## Pendientes para la próxima sesión

1. **Apariencia visual**:
   - Revisar estilos generales (Tailwind)
   - Mejorar la experiencia visual del login
   - Diseño de tarjetas de acertijo, pistas y fragmentos
   - Estilos del indicador de progreso
   - Mejorar la pantalla del escáner QR

2. **Comportamiento y pequeños ajustes**:
   - Revisar flujos de redirección después de acciones
   - Mejorar mensajes de error/éxito
   - Ajustar estados de carga
   - Revisar comportamiento del video del tutorial
   - Posibles mejoras en la navegación del header

3. **Opcional / futuro**:
   - Restaurar middleware de Supabase si se desea manejo avanzado de sesión (requiere resolver Edge Functions con variables de entorno)
   - Agregar tests e2e con Playwright (requiere instalar navegadores)

## Notas técnicas importantes

- **No hay middleware**: la autenticación se maneja en cada Server Component y en el layout protegido.
- **El escáner QR usa `@zxing/browser`**: funciona correctamente en el cliente.
- **Las variables públicas se inyectan en build time**: por eso `src/lib/env/client.ts` accede a cada `process.env.NEXT_PUBLIC_*` directamente, no a `process.env` completo.
- **No es un repositorio git**: los cambios se guardan directamente en archivos.
