# ESPECIFICACIÓN FUNCIONAL Y TÉCNICA
## Juego web de acertijos, búsqueda de códigos QR y revelación de un mensaje

**Documento para OpenCode — fuente principal de implementación**

Versión: 1.0  
Idioma de la aplicación: español  
Estado: especificación funcional aprobada; contenido narrativo sujeto a transcripción fiel del diagrama original.  
Objetivo de despliegue: Vercel o Netlify.  
Stack recomendado: Next.js App Router + TypeScript + Supabase + Tailwind CSS.

---

# 0. INSTRUCCIÓN PRINCIPAL PARA OPENCODE

Actúa como ingeniero senior full-stack. Debes construir el proyecto descrito en este documento, archivo por archivo, con código funcional, seguro, mantenible y listo para desplegar.

## Reglas obligatorias

1. Lee este documento completo antes de escribir código.
2. No inventes acertijos, respuestas, poemas, pistas físicas, ubicaciones, textos de premio ni identificadores QR.
3. El PDF original del diagrama es la fuente de verdad para el contenido narrativo. Debe estar disponible en el repositorio como `docs/Diagrama-de-flujo-original.pdf`. Si no está presente, solicita que se agregue; no reconstruyas por intuición el texto que no puedas leer.
4. Los cambios aprobados en este documento prevalecen sobre contradicciones del PDF:
   - El acertijo 3 se reemplaza por el acertijo de los polos opuestos y su respuesta es `DIFERENTES`.
   - Los fragmentos de poema/texto se revelan únicamente después de validar el QR de la etapa.
   - El progreso se guarda en la cuenta y se puede continuar desde otro dispositivo.
   - No existe recuperación de contraseña.
   - No se implementa un segundo perfil de jugador ni colaboración multiusuario. Una cuenta/perfil representa la partida del jugador que resuelve; la persona que ayuda no necesita otra cuenta.
   - La fase final presenta las instrucciones del diagrama para relacionar códigos QR con los textos guardados. No se implementa campo para escribir el poema, reordenador de palabras, verificador de frase ni validación automática de la solución final.
   - Se conservan exactamente los identificadores QR del diagrama: `TXT-1-53`, `TXT-2-60`, `TXT-3-45`, `TXT-4-45`.
5. No cambies la secuencia funcional para hacerla más vistosa.
6. No añadas funciones no solicitadas como puntos, cronómetros, rankings, pistas automáticas, chat, perfiles adicionales, pagos, notificaciones o panel de administración público.
7. No publiques secretos en el navegador. Nunca expongas `SUPABASE_SERVICE_ROLE_KEY`.
8. Implementa validaciones en servidor. No confíes en que ocultar botones o rutas en el cliente proteja una etapa.
9. Escribe pruebas para las reglas críticas y ejecuta lint, typecheck, tests y build. Corrige todos los errores antes de declarar terminado el trabajo.
10. No declares que el despliegue está realizado. Deja el repositorio preparado y explica qué variables y pasos debe configurar el propietario.

## Forma de trabajo solicitada

- Primero inspecciona el repositorio existente. No sobrescribas trabajo previo sin revisarlo.
- Si está vacío, crea el proyecto con la estructura indicada.
- Antes de implementar, presenta un breve plan de ejecución y señala si falta el PDF.
- Implementa por fases, pero no dejes archivos ficticios, botones sin acción ni rutas vacías.
- Al terminar, entrega un inventario de archivos creados, variables necesarias, comandos ejecutados, resultados de pruebas y pasos de despliegue.
- Si una decisión no está especificada, aplica únicamente los valores predeterminados indicados en este documento y deja constancia. Si no hay valor predeterminado, detente y pregunta; no inventes.

---

# 1. RESUMEN DEL PRODUCTO

Es una experiencia web interactiva de misterio. La persona:

1. Accede a la web e inicia sesión en su perfil.
2. Ve un video introductorio que explica cómo navegar y jugar.
3. Resuelve un acertijo escribiendo una respuesta.
4. Si la respuesta es correcta, el sitio muestra la instrucción/pista para encontrar un código QR físico. **Todavía no revela el fragmento de texto/poema.**
5. La persona encuentra el QR y lo escanea desde la web.
6. El servidor valida que el contenido del QR corresponde a la etapa actual.
7. Solo después de validar el QR, el sistema registra el QR como encontrado, revela y guarda el fragmento de texto correspondiente, y habilita el siguiente acertijo.
8. El ciclo se repite hasta completar las cuatro etapas.
9. Al completar la última etapa, se muestra la página final con el mensaje e instrucciones originales del diagrama.
10. La persona puede consultar/guardar en la web los textos revelados y los códigos QR encontrados para relacionarlos por su cuenta y descubrir el mensaje oculto.

La web no resuelve el mensaje final por la persona. La sorpresa consiste en que el jugador relacione los identificadores de los QR con las posiciones de palabra de los textos que ha desbloqueado.

---

# 2. ALCANCE Y EXCLUSIONES

## Incluido

- Inicio de sesión.
- Una cuenta/perfil para la partida.
- Video introductorio.
- Cuatro acertijos secuenciales.
- Validación de respuestas.
- Pantalla de instrucciones para localizar el QR.
- Escáner QR desde cámara del dispositivo.
- Validación de QR en servidor.
- Desbloqueo posterior del fragmento correspondiente.
- Historial/archivo de fragmentos revelados.
- Historial/archivo de QR encontrados.
- Guardado persistente en Supabase.
- Continuidad de la partida al cerrar sesión e iniciar en otro dispositivo.
- Página final con las instrucciones del diagrama.
- Cierre de sesión.
- Estados de error, carga y recuperación de conexión.

## Excluido expresamente

- Recuperación o restablecimiento de contraseña desde la aplicación.
- Más de un perfil para una misma partida.
- Sistema de equipo, invitaciones o sincronización de varios jugadores.
- Validación automática del poema/frase final.
- Formulario para introducir el poema final.
- Mecánica de arrastrar y ordenar palabras.
- Revelar automáticamente las palabras extraídas de los códigos.
- Diseño visual definitivo, animaciones complejas, efectos cinematográficos y sonido. La primera versión debe ser funcional y tener una interfaz provisional, clara y adaptable.
- Panel de administración público.
- Funcionalidades de geolocalización.
- Generación de códigos QR desde la aplicación.

---

# 3. REGLAS FUNCIONALES NO NEGOCIABLES

## 3.1 Secuencia de una etapa

Cada etapa tiene estos estados:

- `locked`: etapa bloqueada.
- `answer_pending`: acertijo disponible; espera respuesta.
- `answer_correct_qr_pending`: respuesta correcta; QR pendiente.
- `completed`: QR validado; fragmento revelado y etapa completada.

La secuencia exacta es:

`acertijo → respuesta correcta → pista para encontrar QR → escaneo → validación del QR → guardar QR → revelar fragmento → desbloquear siguiente acertijo`

No se debe revelar el fragmento al validar la respuesta del acertijo. Solo se revela tras la validación exitosa del QR.

## 3.2 Respuesta incorrecta

- Mostrar un mensaje neutral de respuesta incorrecta.
- Mantener a la persona en el mismo acertijo.
- No revelar la pista del QR.
- No revelar el fragmento.
- No incrementar ni alterar la etapa.
- No borrar el progreso.
- No bloquear permanentemente al jugador por equivocarse.
- No mostrar la respuesta correcta como ayuda.

La comparación debe normalizar mayúsculas/minúsculas y espacios iniciales/finales. No se deben aceptar respuestas aproximadas o palabras parciales. No eliminar acentos de forma general si ello pudiera cambiar una respuesta. Las respuestas aprobadas actuales no llevan acentos.

## 3.3 Respuesta correcta

- Registrar que el acertijo actual fue resuelto.
- Cambiar el estado de la etapa a `answer_correct_qr_pending`.
- Mostrar la pista para encontrar el QR de esa etapa.
- Permitir abrir el escáner.
- No mostrar aún el fragmento de texto.
- La persona puede cerrar sesión y volver después; al entrar verá la misma etapa esperando el QR.

## 3.4 QR correcto

- Leer el contenido del QR con la cámara.
- Enviar el texto leído al servidor.
- El servidor identifica el QR y comprueba que pertenece a la etapa actual.
- Si es válido:
  - registrar el QR como encontrado;
  - marcar la etapa como `completed`;
  - revelar y guardar el fragmento asociado;
  - actualizar la siguiente etapa como disponible, si existe;
  - si era la última etapa, habilitar la fase final.
- La operación debe ser transaccional o idempotente: escanear dos veces el mismo QR no debe duplicar fragmentos ni crear dos avances.

## 3.5 QR incorrecto

- Mostrar que el QR no corresponde a la etapa actual.
- No cambiar el progreso.
- No revelar fragmentos.
- No desbloquear la etapa siguiente.
- Permitir volver a escanear.

## 3.6 QR de etapa futura

- No aceptar el QR.
- Mostrar un mensaje como: “Este código todavía no corresponde a tu etapa actual”.
- No revelar a qué etapa futura pertenece.
- No modificar datos.

## 3.7 QR repetido

Si la etapa ya fue completada y se escanea el mismo QR:
- no crear un nuevo registro;
- informar que ese QR ya fue registrado;
- conservar el progreso actual.

## 3.8 Navegación directa

No permitir abrir una ruta de etapa futura escribiendo su URL. El servidor debe comprobar autenticación y progreso antes de entregar contenido protegido.

## 3.9 Persistencia

- El progreso vive en la base de datos, vinculado al usuario autenticado.
- No depender de `localStorage` como fuente principal.
- Al iniciar sesión desde otro dispositivo, recuperar la etapa actual, respuestas correctas, QR registrados y fragmentos desbloqueados.
- Cerrar sesión no elimina la partida.
- No hay recuperación de contraseña. Si el jugador pierde sus credenciales, pierde el acceso y el progreso asociado no se recupera por un mecanismo de la aplicación.
- No implementar borrado automático de partidas.

---

# 4. CONTENIDO DEL JUEGO

## 4.1 Fuente de verdad

El diagrama original es la fuente de verdad para:
- texto completo de cada acertijo;
- respuestas originales, salvo el acertijo 3 corregido;
- pistas físicas para encontrar cada QR;
- fragmentos completos;
- instrucciones finales;
- textos de premio/sorpresa.

El PDF original debe copiarse al repositorio como:

`docs/Diagrama-de-flujo-original.pdf`

El PDF es una imagen de diagrama y algunos textos pequeños pueden no extraerse correctamente por OCR. Por ello:
- inspecciona el PDF visualmente;
- no completes palabras cortadas por intuición;
- no reescribas ni “mejores” los poemas;
- transcribe fielmente el texto visible;
- si una línea no puede leerse, deja un marcador `PENDIENTE_TRANSCRIPCION` y reporta exactamente cuál;
- no habilites producción mientras queden marcadores pendientes.

## 4.2 Acertijos y respuestas confirmadas

### Etapa 1

Texto de pregunta según el diagrama:

“Los gustos de las personas son relativos pero necesarios para poder ver el alma desde la ventana del otro:”

Respuesta: `OJOS`

### Etapa 2

El diagrama muestra un acertijo relacionado con los cinco sentidos, sensaciones y el cuerpo humano.

Respuesta: `NERVIOS`

**IMPORTANTE:** transcribir literalmente la pregunta completa desde el PDF original. No inventar ni reconstruir el texto que no se lea.

### Etapa 3

Texto aprobado por el propietario:

“Dicen que los polos opuestos se atraen porque no caminan por la misma línea. ¿”

Respuesta: `DIFERENTES`

No conservar la repetición accidental de `NERVIOS` que aparece en el diagrama original.

### Etapa 4

Texto de pregunta según el diagrama:

“Apago la luz, enciendo el botón; cierro un candado con precisión. Es un sonido corto, rápido y seco, que en el silencio siempre deja eco. ¿Qué sonido soy?”

Respuesta: `CLICK`

Verificar la transcripción exacta contra el PDF antes de cargarla en producción.

## 4.3 Identificadores QR aprobados

Conservar exactamente estos valores:

| Etapa | Payload QR |
|---|---|
| 1 | `TXT-1-53` |
| 2 | `TXT-2-60` |
| 3 | `TXT-3-45` |
| 4 | `TXT-4-45` |

No cambiar guiones, prefijos, números ni orden.

Interpretación funcional de los componentes:
- `TXT`: identifica que el código se relaciona con un texto.
- Primer número: identifica el texto/fragmento de referencia.
- Segundo número: identifica la posición de palabra que se utilizará en la resolución final.

Los identificadores ya contienen los datos que el propietario necesita para la pista final. La web debe conservarlos y mostrarlos en el apartado de QR encontrados. No extraer ni revelar automáticamente la palabra correspondiente.

**Nota de seguridad:** como los payloads QR son identificadores estáticos legibles, la aplicación puede comprobar que el jugador ha presentado el código esperado, pero no puede demostrar criptográficamente que la persona estuvo físicamente frente al QR. No afirmar que el QR impide toda suplantación. Para esta experiencia, el QR funciona como comprobación de avance, no como prueba de presencia de alta seguridad. No reemplazar los identificadores por tokens nuevos sin autorización.

## 4.4 Pistas físicas

Cada etapa tiene una pista para encontrar el QR. Debe mostrarse después de responder correctamente y antes del escaneo. El texto exacto se debe transcribir desde el bloque “Pista para encontrar el QR” de cada etapa del PDF. No inventar ubicaciones.

## 4.5 Fragmentos de texto

Cada etapa tiene un fragmento de texto/poema que solo aparece después de validar el QR correspondiente.

- Fragmento 1 se vincula a etapa 1 / `TXT-1-53`.
- Fragmento 2 se vincula a etapa 2 / `TXT-2-60`.
- Fragmento 3 se vincula a etapa 3 / `TXT-3-45`.
- Fragmento 4 se vincula a etapa 4 / `TXT-4-45`.

Transcribir cada fragmento completo y exactamente desde el PDF. Guardar una copia canónica en el archivo de contenido. No resumir ni corregir el estilo narrativo.

## 4.6 Menú e historial

El diagrama indica que los textos/fragmentos deben guardarse en un apartado del menú y poder consultarse en cualquier momento.

Implementar dos apartados:
- **Textos encontrados:** lista de fragmentos desbloqueados, en orden de etapa.
- **Códigos QR encontrados:** lista de identificadores QR validados, en orden de etapa.

Reglas:
- Mostrar solo elementos desbloqueados/encontrados.
- No mostrar fragmentos futuros.
- No mostrar QR futuros.
- Permitir consultar el texto completo de cada fragmento.
- Permitir copiar el identificador QR si el usuario lo desea.
- El contenido debe estar disponible en otros dispositivos al iniciar sesión.
- No mostrar palabras extraídas ni una solución del poema.

## 4.7 Fase final

Después de validar el QR de la etapa 4, el sitio muestra la página final indicada en el diagrama.

El contenido de instrucciones debe transcribirse fielmente del PDF. El sentido funcional confirmado es:

- felicitar a la persona por completar el recorrido;
- explicar que cada QR contiene un código;
- indicar que debe relacionar cada código con los textos guardados en “respuestas encontradas”;
- invitar a descubrir por sí misma cómo relacionarlos;
- conservar la sorpresa para los jugadores.

La aplicación debe:
- mostrar esa instrucción;
- mantener disponibles los cuatro textos;
- mantener disponibles los cuatro identificadores QR;
- permitir volver al historial;
- marcar el recorrido como finalizado.

La aplicación NO debe:
- interpretar los códigos por el usuario;
- extraer automáticamente palabras;
- ordenar palabras;
- formar el poema;
- validar la frase final;
- solicitar una respuesta final;
- bloquear la página final esperando una respuesta.

El “premio” es la revelación de estas instrucciones y la posibilidad de consultar los textos y QR reunidos. No existe una página de premio adicional con otra contraseña, salvo que el propietario lo solicite posteriormente.

---

# 5. ARQUITECTURA TÉCNICA

## 5.1 Stack

Usar:

- Next.js con App Router.
- TypeScript en modo estricto.
- React.
- Tailwind CSS para estilos base.
- Supabase Auth para autenticación.
- Supabase PostgreSQL para persistencia.
- `@supabase/ssr` para sesiones compatibles con Server Components y cookies.
- `@supabase/supabase-js` para cliente de Supabase.
- `@zxing/browser` o una librería mantenida equivalente para leer QR desde cámara.
- Zod para validar datos y entradas.
- Vitest para pruebas unitarias.
- Playwright para pruebas end-to-end críticas.
- ESLint y TypeScript para calidad estática.

No fijar versiones antiguas por copiar tutoriales. Usar versiones estables compatibles al momento de instalar y guardar el lockfile.

## 5.2 Por qué esta arquitectura

- Next.js permite construir páginas, componentes de servidor y endpoints de servidor en una sola aplicación.
- Supabase proporciona autenticación y PostgreSQL administrado.
- La base de datos mantiene el progreso entre dispositivos.
- Vercel es el destino recomendado más directo para Next.js.
- Netlify también soporta Next.js mediante su integración oficial.
- El escáner de cámara necesita un contexto seguro: HTTPS en producción y localhost durante desarrollo.

## 5.3 Restricción de despliegue

No configurar `output: "export"` ni un despliegue puramente estático. La aplicación requiere:
- autenticación;
- rutas de servidor;
- validación segura de respuestas y QR;
- consultas a base de datos.

Debe desplegarse como aplicación Next.js con funciones de servidor. Vercel es la primera opción recomendada; Netlify es compatible mediante su integración actual de Next.js.

---

# 6. MODELO DE DATOS

Crear migraciones SQL versionadas. No depender de crear tablas manualmente sin registrar el SQL en el repositorio.

## 6.1 Tablas

### `game_stages`

Catálogo de las cuatro etapas.

Campos:
- `id` UUID primary key.
- `stage_number` integer unique, valores 1 a 4.
- `riddle_text` text not null.
- `answer_hash` text not null (hash de la respuesta normalizada; no guardar respuesta en texto plano).
- `qr_payload` text unique not null.
- `location_clue` text not null.
- `fragment_text` text not null.
- `is_active` boolean default true.
- `created_at` timestamptz.

El catálogo es contenido de juego. El cliente no debe tener permiso de escritura.

### `player_progress`

Un registro por cuenta.

Campos:
- `user_id` UUID primary key references `auth.users(id)` on delete cascade.
- `current_stage` integer default 1.
- `game_completed` boolean default false.
- `created_at` timestamptz.
- `updated_at` timestamptz.

### `stage_progress`

Estado individual de cada etapa por usuario.

Campos:
- `id` UUID primary key.
- `user_id` UUID references `auth.users(id)` on delete cascade.
- `stage_id` UUID references `game_stages(id)`.
- `answer_solved` boolean default false.
- `qr_scanned` boolean default false.
- `completed_at` timestamptz nullable.
- `created_at` timestamptz.
- `updated_at` timestamptz.
- unique (`user_id`, `stage_id`).

### `found_fragments`

Historial de fragmentos revelados.

Campos:
- `id` UUID primary key.
- `user_id` UUID references `auth.users(id)` on delete cascade.
- `stage_id` UUID references `game_stages(id)`.
- `fragment_snapshot` text not null.
- `unlocked_at` timestamptz.
- unique (`user_id`, `stage_id`).

El snapshot conserva exactamente el texto revelado aunque posteriormente se edite el catálogo.

### `found_qr_codes`

Historial de códigos encontrados.

Campos:
- `id` UUID primary key.
- `user_id` UUID references `auth.users(id)` on delete cascade.
- `stage_id` UUID references `game_stages(id)`.
- `qr_payload` text not null.
- `scanned_at` timestamptz.
- unique (`user_id`, `stage_id`).
- unique (`user_id`, `qr_payload`).

## 6.2 RLS (Row Level Security)

Activar RLS en todas las tablas.

Reglas:
- Un usuario solo puede leer su propio progreso.
- Un usuario solo puede leer sus propios registros de etapas, fragmentos y QR.
- El usuario no puede modificar directamente `answer_solved`, `qr_scanned`, `current_stage`, `game_completed`, `fragment_snapshot` ni los registros de QR.
- El usuario no puede leer hashes de respuestas ni secretos del catálogo mediante consultas públicas.
- El cliente anónimo no puede consultar contenido de etapas.
- Las operaciones críticas se ejecutan en servidor con sesión autenticada y autorización explícita.
- Si se utiliza `SUPABASE_SERVICE_ROLE_KEY`, solo en código de servidor y nunca en variables `NEXT_PUBLIC_*`.
- Preferir funciones SQL/RPC con permisos mínimos para las operaciones transaccionales. No crear políticas abiertas para simplificar.

## 6.3 Inicialización de partida

Al iniciar sesión por primera vez:
- comprobar si existe `player_progress`;
- si no existe, crear progreso con `current_stage = 1` y `game_completed = false`;
- crear los cuatro registros `stage_progress` en estado inicial;
- no crear fragmentos ni QR encontrados;
- hacerlo de forma idempotente para evitar duplicados por dos solicitudes simultáneas.

La cuenta de juego se crea de forma controlada desde Supabase Dashboard o una invitación administrada por el propietario. No habilitar registro público abierto por defecto, dado que la experiencia está destinada a un jugador concreto. Si el propietario decide que cualquiera pueda registrarse, se debe pedir confirmación antes de cambiar esta regla.

---

# 7. AUTENTICACIÓN Y SESIONES

## 7.1 Pantallas

- `/login`: formulario de correo y contraseña.
- No crear `/forgot-password`.
- No mostrar enlace “¿Olvidaste tu contraseña?”.
- No implementar reset password ni recuperación por correo.
- `/logout`: acción de cierre de sesión (preferentemente acción de servidor o botón seguro).

## 7.2 Reglas

- Usar Supabase Auth con cookies SSR.
- Proteger las páginas del juego.
- Si no hay sesión, redirigir a `/login`.
- Si ya hay sesión, redirigir al juego/estado actual.
- Cerrar sesión no borra datos.
- Iniciar sesión desde otro dispositivo recupera datos del servidor.
- No guardar contraseña en base de datos propia.
- No guardar tokens manualmente en `localStorage`.
- Mostrar errores de credenciales sin revelar si una cuenta específica existe.
- No ofrecer recuperación de contraseña dentro de la app.
- Configurar el proveedor de correo de Supabase de acuerdo con el método de acceso elegido por el propietario. Si se crea una cuenta manualmente, documentar cómo establecer su contraseña inicial.

---

# 8. FLUJOS Y RUTAS DE LA APLICACIÓN

## 8.1 Rutas públicas

### `/login`
- Formulario de inicio de sesión.
- Validación de campos.
- Mensaje de error genérico.
- Si sesión válida: ir a `/game`.

## 8.2 Rutas protegidas

### `/game`
Página de entrada al juego:
- comprobar sesión;
- consultar progreso;
- si primera visita y tutorial no se ha visto, mostrar `/intro`;
- si la etapa actual espera respuesta, dirigir a `/game/stage/[stageNumber]`;
- si espera QR, dirigir a `/game/stage/[stageNumber]/qr`;
- si el juego terminó, dirigir a `/final`.

### `/intro`
- Mostrar video introductorio desde `public/media/tutorial.mp4`.
- El archivo puede no existir inicialmente; mostrar un estado “video pendiente de cargar” solo en desarrollo.
- No simular que el tutorial fue visto si no existe el archivo.
- Botón para continuar.
- Guardar `tutorial_completed_at` en perfil o tabla de progreso si se requiere registrar el tutorial. Si se guarda, añadir migración y tipos.
- El tutorial no altera el estado de los acertijos.
- No permitir que saltar el tutorial desbloquee etapas.

### `/game/stage/[stageNumber]`
- Cargar la etapa actual desde servidor.
- Mostrar el acertijo y el campo de respuesta.
- No incluir fragmento ni payload QR en el HTML enviado antes de validarlo.
- Enviar respuesta al endpoint de validación.
- Si es incorrecta, mostrar mensaje y mantener pantalla.
- Si correcta, actualizar estado y mostrar pista para encontrar QR; ofrecer botón “Escanear QR”.
- Si etapa no es actual o está bloqueada, redirigir a la etapa válida.

### `/game/stage/[stageNumber]/qr`
- Solo accesible si el acertijo de esa etapa fue resuelto y el QR aún no fue validado.
- Mostrar la pista de localización.
- Mostrar escáner de cámara.
- Solicitar permiso de cámara únicamente después de una acción explícita del usuario.
- Al detectar QR, detener temporalmente el escáner y enviar payload al servidor.
- Si error, mostrar mensaje y permitir reintentar.
- Si éxito, redirigir a `/game/stage/[stageNumber]/fragment`.

### `/game/stage/[stageNumber]/fragment`
- Solo mostrar si el QR fue validado.
- Mostrar el fragmento completo de esa etapa.
- Mostrar confirmación de que quedó guardado.
- Botón para continuar a la siguiente etapa.
- En etapa 4, continuar a `/final`.

### `/archive`
- Página protegida.
- Dos secciones:
  1. Textos encontrados.
  2. Códigos QR encontrados.
- Mostrar solo elementos del usuario actual.
- Orden ascendente por etapa.
- No mostrar elementos bloqueados.
- Los textos se muestran completos.
- Los QR se muestran literalmente, sin reinterpretarlos.
- Permitir copiar código con botón funcional.
- Los datos se consultan desde Supabase; no depender de estado local.

### `/final`
- Solo accesible si las cuatro etapas están completadas.
- Mostrar las instrucciones finales fieles al PDF.
- Mostrar enlaces/secciones para consultar textos encontrados y QR encontrados.
- Marcar partida como completada.
- No añadir campo de respuesta.
- No añadir verificación de poema.
- No revelar solución automática.
- El jugador puede volver a `/archive` cuando quiera.

---

# 9. LÓGICA DE NEGOCIO Y OPERACIONES DE SERVIDOR

Implementar lógica en módulos de servidor y/o Route Handlers. El cliente nunca decide por sí solo si una respuesta o QR es correcto.

## 9.1 Validar respuesta

Entrada:
- `stageNumber`.
- `answer`.

Proceso:
1. Obtener usuario autenticado.
2. Obtener `player_progress`.
3. Comprobar que `stageNumber === current_stage`.
4. Comprobar que la etapa no esté ya completada.
5. Comprobar que la etapa esté disponible.
6. Normalizar respuesta: trim + uppercase.
7. Comparar hash seguro con hash de la respuesta normalizada.
8. Si no coincide, devolver `INCORRECT_ANSWER`.
9. Si coincide, marcar `answer_solved = true`.
10. Mantener `current_stage` sin avanzar.
11. Devolver únicamente la pista física necesaria para esa etapa y el estado `QR_PENDING`.
12. No devolver `fragment_text` ni datos del QR de etapas futuras.

La respuesta no debe estar embebida en componentes cliente, JSON público o bundle JavaScript.

## 9.2 Validar QR

Entrada:
- `stageNumber`.
- `scannedPayload`.

Proceso:
1. Obtener usuario autenticado.
2. Comprobar que la etapa indicada es la actual.
3. Comprobar que `answer_solved = true`.
4. Obtener el payload esperado desde el catálogo privado.
5. Comparar payload exactamente, con trim exterior si se justifica; no cambiar guiones ni números.
6. Si no coincide, devolver `INVALID_QR`.
7. En una operación transaccional:
   - insertar `found_qr_codes`;
   - insertar `found_fragments` con snapshot;
   - actualizar `stage_progress.qr_scanned = true`;
   - actualizar `stage_progress.completed_at`;
   - si hay etapa siguiente, establecer `player_progress.current_stage = stageNumber + 1`;
   - si era etapa 4, establecer `game_completed = true`.
8. Evitar duplicados con constraints únicos.
9. Devolver el resultado y la ruta siguiente.

Si se repite la misma solicitud por doble lectura o mala conexión, devolver estado consistente sin duplicar filas.

## 9.3 Operación transaccional

No ejecutar cinco escrituras independientes desde el navegador. Crear una función SQL/RPC o transacción en servidor que garantice que QR, fragmento y progreso se actualizan juntos. Si falla una parte, no debe quedar una etapa medio completada.

## 9.4 Consulta de progreso

Devolver:
- `current_stage`;
- `game_completed`;
- estado de las cuatro etapas;
- lista de fragmentos desbloqueados;
- lista de QR encontrados.

No devolver respuestas correctas ni hashes al cliente.

---

# 10. ESCÁNER QR

## Requisitos

- Funcionar en navegadores móviles modernos.
- Solicitar cámara tras pulsar “Activar cámara”.
- Permitir cambiar cámara si la librería lo soporta (preferir cámara trasera).
- Detener stream al salir de la pantalla, cerrar el escáner o completar lectura.
- Evitar múltiples llamadas simultáneas cuando el mismo QR permanece frente a la cámara.
- Mostrar estados: esperando permiso, cámara activa, QR leído, QR inválido, error de cámara.
- Si el permiso es denegado, explicar cómo habilitarlo y ofrecer una alternativa solo si el propietario la aprueba. No implementar un campo manual de payload como atajo por defecto.
- No subir ni almacenar imágenes o video de la cámara.
- No grabar al usuario.
- No mantener la cámara activa en segundo plano.

## HTTPS

La API `getUserMedia` requiere contexto seguro. En producción el dominio debe utilizar HTTPS. En desarrollo, usar localhost. La cámara requiere permiso explícito del navegador.

---

# 11. SEGURIDAD

1. Proteger todas las rutas privadas en servidor.
2. Usar RLS en todas las tablas accesibles mediante Supabase.
3. No confiar en validaciones exclusivamente de React.
4. No enviar respuestas correctas al cliente.
5. No enviar contenido de etapas futuras antes de tiempo.
6. No enviar fragmentos bloqueados al cliente.
7. No enviar la clave service role al navegador.
8. Validar y limitar longitud de campos.
9. Usar Zod para validar payloads.
10. Añadir rate limiting razonable a validación de respuestas para evitar abuso automatizado, sin castigar errores normales de escritura.
11. No revelar información sensible en mensajes de error.
12. No registrar contraseñas, tokens ni respuestas en logs.
13. Configurar headers de seguridad adecuados.
14. Escapar/renderizar texto como contenido, nunca como HTML sin sanitizar.
15. Proteger operaciones contra CSRF según el mecanismo de sesión/acciones utilizado.
16. Las funciones administrativas y seeds no deben ser accesibles desde el navegador.

**Límite real del QR:** un QR estático puede fotografiarse o copiarse. La validación del payload asegura que se presentó el código esperado, pero no garantiza presencia física. No describirlo como protección antifraude infalible.

---

# 12. ESTRUCTURA DE ARCHIVOS OBLIGATORIA

Crear esta estructura. Si se decide cambiar algún nombre por una convención técnica de Next.js, documentarlo en el informe final y mantener responsabilidades equivalentes.

```text
mystery-game/
├── docs/
│   ├── SPECIFICATION.md
│   ├── Diagrama-de-flujo-original.pdf
│   ├── CONTENT-TRANSCRIPTION.md
│   ├── DEPLOYMENT.md
│   └── TEST-PLAN.md
├── public/
│   ├── media/
│   │   └── tutorial.mp4                 # Lo aporta el propietario; no inventar video
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   ├── (protected)/
│   │   │   ├── layout.tsx
│   │   │   ├── game/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── intro/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── stage/
│   │   │   │       └── [stageNumber]/
│   │   │   │           ├── page.tsx
│   │   │   │           ├── qr/
│   │   │   │           │   └── page.tsx
│   │   │   │           └── fragment/
│   │   │   │               └── page.tsx
│   │   │   ├── archive/
│   │   │   │   └── page.tsx
│   │   │   └── final/
│   │   │       └── page.tsx
│   │   └── api/
│   │       ├── progress/
│   │       │   └── route.ts
│   │       ├── stages/
│   │       │   └── [stageNumber]/
│   │       │       ├── answer/
│   │       │       │   └── route.ts
│   │       │       └── qr/
│   │       │           └── route.ts
│   │       └── archive/
│   │           └── route.ts
│   ├── components/
│   │   ├── app/
│   │   │   ├── app-header.tsx
│   │   │   ├── app-navigation.tsx
│   │   │   └── logout-button.tsx
│   │   ├── auth/
│   │   │   └── login-form.tsx
│   │   ├── game/
│   │   │   ├── riddle-card.tsx
│   │   │   ├── answer-form.tsx
│   │   │   ├── location-clue.tsx
│   │   │   ├── qr-scanner.tsx
│   │   │   ├── qr-scan-status.tsx
│   │   │   ├── fragment-viewer.tsx
│   │   │   ├── progress-indicator.tsx
│   │   │   └── tutorial-player.tsx
│   │   ├── archive/
│   │   │   ├── fragment-list.tsx
│   │   │   └── qr-code-list.tsx
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── card.tsx
│   │       ├── alert.tsx
│   │       ├── loading.tsx
│   │       └── empty-state.tsx
│   ├── content/
│   │   ├── game-content.ts
│   │   └── content-validation.ts
│   ├── lib/
│   │   ├── constants.ts
│   │   ├── env.ts
│   │   ├── errors.ts
│   │   ├── validations/
│   │   │   ├── auth.schema.ts
│   │   │   ├── answer.schema.ts
│   │   │   └── qr.schema.ts
│   │   ├── game/
│   │   │   ├── stage-state.ts
│   │   │   ├── normalize-answer.ts
│   │   │   ├── answer-hash.ts
│   │   │   ├── progress-service.ts
│   │   │   ├── answer-service.ts
│   │   │   ├── qr-service.ts
│   │   │   └── archive-service.ts
│   │   └── supabase/
│   │       ├── client.ts
│   │       ├── server.ts
│   │       ├── middleware.ts
│   │       └── database.types.ts
│   ├── hooks/
│   │   └── use-qr-scanner.ts
│   ├── types/
│   │   ├── game.ts
│   │   ├── progress.ts
│   │   └── api.ts
│   └── middleware.ts                    # O proxy.ts si lo exige la versión de Next.js
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
│   ├── unit/
│   │   ├── normalize-answer.test.ts
│   │   ├── stage-state.test.ts
│   │   ├── answer-service.test.ts
│   │   └── qr-service.test.ts
│   └── e2e/
│       ├── authentication.spec.ts
│       ├── complete-stage.spec.ts
│       ├── wrong-qr.spec.ts
│       ├── persistence.spec.ts
│       └── final-page.spec.ts
├── .env.example
├── .gitignore
├── .nvmrc
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tailwind.config.ts                 # Solo si la versión instalada lo requiere
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
├── README.md
└── open-code-instructions.md           # Copia de las instrucciones operativas para el agente
```

No crear archivos vacíos solo para cumplir el árbol. Cada archivo debe tener una responsabilidad real. Si una versión reciente de Next.js cambia `middleware.ts` por `proxy.ts`, usa la convención oficial vigente y actualiza el árbol/documentación.

---

# 13. RESPONSABILIDAD EXACTA DE CADA ARCHIVO

## Documentación

### `docs/SPECIFICATION.md`
Copia de esta especificación completa. Debe ser la referencia técnica central del proyecto.

### `docs/Diagrama-de-flujo-original.pdf`
PDF original aportado por el propietario. No modificarlo.

### `docs/CONTENT-TRANSCRIPTION.md`
Transcripción literal del diagrama:
- cuatro acertijos;
- cuatro respuestas;
- cuatro pistas físicas;
- cuatro fragmentos;
- texto final;
- identificadores QR.
Marcar cualquier texto ilegible. No inventar.

### `docs/DEPLOYMENT.md`
Pasos de configuración de Supabase, variables, GitHub, Vercel y Netlify.

### `docs/TEST-PLAN.md`
Casos de prueba funcionales y criterios de aceptación.

## Aplicación Next.js

### `src/app/layout.tsx`
Layout raíz, metadata, fuentes y estructura global. No implementar aquí reglas de juego.

### `src/app/page.tsx`
Redirigir según sesión:
- autenticado: `/game`;
- no autenticado: `/login`.

### `src/app/globals.css`
Estilos globales mínimos y variables de tema. Interfaz provisional funcional; no diseñar aún la estética final.

### `src/app/(auth)/login/page.tsx`
Página de inicio de sesión. No incluir recuperación de contraseña ni registro público por defecto.

### `src/app/(protected)/layout.tsx`
Verificar sesión en servidor, mostrar navegación protegida y botón de cerrar sesión.

### `src/app/(protected)/game/page.tsx`
Resolver el estado actual del jugador y redirigir a tutorial, acertijo, escáner o fase final según corresponda.

### `src/app/(protected)/game/intro/page.tsx`
Reproductor del video tutorial y acción para continuar.

### `src/app/(protected)/game/stage/[stageNumber]/page.tsx`
Mostrar acertijo actual, respuesta y, cuando corresponda, pista física. Nunca entregar el fragmento antes del QR.

### `src/app/(protected)/game/stage/[stageNumber]/qr/page.tsx`
Mostrar pista física y escáner QR. Validar estado antes de renderizar.

### `src/app/(protected)/game/stage/[stageNumber]/fragment/page.tsx`
Mostrar fragmento solo si el QR fue validado.

### `src/app/(protected)/archive/page.tsx`
Consultar textos y QR encontrados por el usuario autenticado.

### `src/app/(protected)/final/page.tsx`
Mostrar las instrucciones finales originales cuando las cuatro etapas estén completadas.

### API routes

`api/progress/route.ts`: devolver estado actual autenticado.  
`api/stages/[stageNumber]/answer/route.ts`: validar respuesta y cambiar estado a QR pendiente.  
`api/stages/[stageNumber]/qr/route.ts`: validar payload y completar etapa transaccionalmente.  
`api/archive/route.ts`: devolver historial propio de fragmentos y QR.

Todas deben:
- validar sesión;
- validar parámetros con Zod;
- devolver códigos HTTP correctos;
- no filtrar respuestas ni contenido bloqueado;
- controlar errores;
- no confiar en `user_id` enviado por cliente: obtenerlo de la sesión.

## Componentes

### `app-header.tsx`
Cabecera común y estado de sesión.

### `app-navigation.tsx`
Navegación a juego e historial. No ofrecer enlaces a etapas bloqueadas.

### `logout-button.tsx`
Cerrar sesión sin borrar el progreso.

### `login-form.tsx`
Formulario de acceso con validación y estados de carga/error.

### `riddle-card.tsx`
Presentación del texto del acertijo.

### `answer-form.tsx`
Entrada de respuesta, envío, error y estado de éxito.

### `location-clue.tsx`
Mostrar pista física después de respuesta correcta.

### `qr-scanner.tsx`
Vista de cámara y lector QR.

### `qr-scan-status.tsx`
Mensajes de cámara, lectura, QR incorrecto y éxito.

### `fragment-viewer.tsx`
Mostrar fragmento desbloqueado.

### `progress-indicator.tsx`
Mostrar progreso general sin revelar respuestas ni contenido futuro.

### `tutorial-player.tsx`
Reproducir tutorial desde `public/media/tutorial.mp4`.

### `fragment-list.tsx`
Listar textos desbloqueados.

### `qr-code-list.tsx`
Listar payloads QR encontrados y permitir copiarlos.

### Componentes `ui/`
Controles reutilizables accesibles con estados de carga, foco, error y deshabilitado. No deben contener reglas del juego.

## Contenido

### `src/content/game-content.ts`
Catálogo tipado de cuatro etapas. Cada una contiene:
- número;
- pregunta;
- respuesta normalizada o referencia a hash;
- pista física;
- payload QR;
- fragmento completo;
- identificador del fragmento.

Los datos secretos (respuestas, payloads futuros, fragmentos futuros) deben cargarse desde servidor. Si el archivo se importa en un Client Component, se filtra el contenido. Separar contenido público por etapa del contenido privado de servidor, o mantener todo el catálogo exclusivamente en módulos `server-only`.

### `src/content/content-validation.ts`
Comprobar que:
- existen exactamente cuatro etapas;
- numeración 1 a 4 sin huecos;
- respuestas no vacías;
- identificadores QR exactos;
- textos/pistas/fragmentos no vacíos;
- no quedan marcadores `PENDIENTE_TRANSCRIPCION`;
- no se repiten accidentalmente respuestas salvo aprobación explícita.

## Lógica de negocio

### `constants.ts`
Número de etapas, nombres de estados y límites.

### `env.ts`
Validación de variables de entorno al arrancar. Nunca imprimir secretos.

### `errors.ts`
Errores tipados de negocio: no autenticado, etapa bloqueada, respuesta incorrecta, QR incorrecto, etapa completada, contenido incompleto.

### `normalize-answer.ts`
Normalizar trim y mayúsculas. Añadir pruebas.

### `answer-hash.ts`
Generar y verificar hashes seguros en servidor. Usar salt/pepper secreto de servidor o una estrategia de hash adecuada. Nunca incluir respuestas en bundles públicos.

### `stage-state.ts`
Funciones puras que determinan transición válida entre estados.

### `progress-service.ts`
Crear/consultar progreso e inicializar partida idempotentemente.

### `answer-service.ts`
Validar respuesta y marcar acertijo resuelto sin desbloquear fragmento.

### `qr-service.ts`
Validar QR, ejecutar transición atómica y revelar fragmento.

### `archive-service.ts`
Consultar los elementos desbloqueados del usuario actual.

## Supabase

### `client.ts`
Cliente Supabase para componentes cliente, solo con publishable/anon key.

### `server.ts`
Cliente SSR de servidor con cookies.

### `middleware.ts`
Funciones auxiliares de sesión para el mecanismo oficial vigente de Next.js/Supabase.

### `database.types.ts`
Tipos generados desde Supabase. No mantener tipos manuales desactualizados.

### Migraciones SQL
Definir tablas, índices, constraints, RLS, funciones transaccionales y seeds. Todo cambio de esquema debe quedar versionado.

## Scripts

### `create-admin-player.ts`
Script de uso local/administrativo para crear la cuenta única del jugador, si se elige creación manual. Solo servidor; requiere service role; nunca desplegarlo como endpoint público.

### `seed-game-content.ts`
Cargar cuatro etapas de manera idempotente. No duplicar etapas.

### `validate-content.ts`
Verificar que el contenido esté completo y los QR coincidan exactamente con la tabla aprobada.

## Tests

Cubrir:
- normalización de respuestas;
- transiciones de etapa;
- respuesta incorrecta;
- respuesta correcta sin fragmento revelado;
- QR incorrecto;
- QR de etapa futura;
- QR correcto;
- doble escaneo;
- no duplicación;
- aislamiento entre usuarios;
- continuidad entre dispositivos;
- bloqueo de rutas;
- fase final solo tras etapa 4;
- ausencia de campo de solución final.

---

# 14. CONTENIDO DE CONFIGURACIÓN Y VARIABLES

Crear `.env.example` con:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GAME_CONTENT_HASH_SECRET=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Reglas:
- `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: publishable/anon key pública, protegida por RLS.
- `SUPABASE_SERVICE_ROLE_KEY`: solo servidor y scripts locales.
- `GAME_CONTENT_HASH_SECRET`: secreto de servidor para hashes/validación de respuestas.
- `NEXT_PUBLIC_APP_URL`: origen público para redirects.

Si la versión actual de Supabase usa `SUPABASE_PUBLISHABLE_KEY`, preferir el nombre oficial actual y actualizar `.env.example`, código y documentación de forma consistente. No mantener dos variables equivalentes sin motivo.

Nunca subir `.env.local` al repositorio.

---

# 15. DESPLIEGUE

## 15.1 Preparación local

Requisitos:
- Node.js versión compatible con la versión de Next.js instalada.
- npm.
- Git.
- Cuenta Supabase.
- Cuenta GitHub.
- Cuenta Vercel o Netlify.

Comandos esperados:

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
```

Añadir los scripts que falten en `package.json`.

## 15.2 Supabase

1. Crear proyecto Supabase.
2. Copiar URL y publishable key.
3. Configurar variables locales.
4. Ejecutar migraciones.
5. Cargar contenido transcrito y validado.
6. Crear la cuenta del jugador mediante el método administrativo acordado.
7. Configurar URL de sitio y redirects de autenticación.
8. Comprobar RLS.
9. Probar que un usuario no puede leer el progreso de otro.

## 15.3 GitHub

- Inicializar repositorio.
- Añadir `.gitignore`.
- No subir secretos ni `.env.local`.
- Subir código y migraciones.
- Mantener el PDF original dentro de `docs/` si el propietario desea que el agente tenga la referencia.

## 15.4 Vercel

Preferencia inicial:
1. Importar repositorio GitHub en Vercel.
2. Seleccionar Next.js.
3. Añadir variables de entorno.
4. Desplegar.
5. Configurar URL de producción en Supabase Auth.
6. Probar login, cámara, progreso y QR en HTTPS.

## 15.5 Netlify

Alternativa:
1. Importar repositorio.
2. Usar integración oficial de Next.js.
3. Configurar variables.
4. Configurar redirects de Supabase.
5. Probar todas las funciones de servidor y cámara.

No forzar exportación estática.

## 15.6 Dominio y cámara

La cámara debe probarse en el dominio HTTPS final. En localhost funciona como contexto seguro de desarrollo. Si se prueba mediante una dirección IP HTTP en la red local, puede fallar por restricciones del navegador.

---

# 16. PRUEBAS Y CRITERIOS DE ACEPTACIÓN

El proyecto no se considera terminado hasta cumplir todos estos casos.

## Autenticación

- [ ] Usuario no autenticado no entra al juego.
- [ ] Usuario autenticado puede entrar.
- [ ] Cerrar sesión no borra progreso.
- [ ] No hay enlace ni endpoint de recuperación de contraseña.
- [ ] La sesión se puede abrir en otro dispositivo.
- [ ] Se recupera el mismo estado desde la base de datos.

## Etapa 1 a 4

Para cada etapa:
- [ ] Se muestra solo el acertijo actual.
- [ ] Respuesta incorrecta no desbloquea QR.
- [ ] Respuesta correcta muestra pista física.
- [ ] Respuesta correcta no muestra fragmento.
- [ ] Escáner solicita permiso solo por acción del usuario.
- [ ] QR incorrecto no cambia estado.
- [ ] QR de etapa futura no cambia estado.
- [ ] QR correcto registra el código.
- [ ] QR correcto revela el fragmento.
- [ ] Fragmento aparece en el archivo.
- [ ] Siguiente etapa queda habilitada.
- [ ] Repetir QR no duplica registros.

## Persistencia

- [ ] Resolver acertijo y cerrar sesión conserva estado QR pendiente.
- [ ] Escanear QR y cerrar sesión conserva fragmento.
- [ ] Iniciar sesión desde otro dispositivo restaura progreso.
- [ ] Un usuario no puede ver datos de otro.

## Final

- [ ] No se puede acceder antes de completar cuatro etapas.
- [ ] Tras el cuarto QR se habilita la página final.
- [ ] Aparecen las instrucciones originales.
- [ ] Los cuatro textos están disponibles.
- [ ] Los cuatro QR están disponibles.
- [ ] No existe campo de poema final.
- [ ] No existe verificación automática del mensaje.
- [ ] El juego permanece marcado como completado.

## Calidad técnica

- [ ] `npm run lint` pasa.
- [ ] `npm run typecheck` pasa.
- [ ] `npm run test` pasa.
- [ ] `npm run build` pasa.
- [ ] No hay secretos en el bundle.
- [ ] No hay errores de consola importantes.
- [ ] No hay botones sin funcionalidad.
- [ ] La cámara se detiene al salir.
- [ ] La aplicación funciona en móvil y escritorio con interfaz provisional.

---

# 17. DECISIONES QUE NO DEBE TOMAR OPENCODE POR SU CUENTA

No decidir:
- nuevo texto para los acertijos;
- nuevas respuestas;
- ubicaciones físicas;
- cambios de QR;
- cambios de fragmentos;
- orden de etapas;
- revelar fragmentos antes del QR;
- mostrar palabras extraídas;
- validar el poema;
- agregar más jugadores;
- recuperación de contraseña;
- efectos visuales definitivos;
- música, sonidos o animaciones no solicitadas.

Si un texto del PDF no se entiende, reportarlo. No inventar.

---

# 18. ORDEN DE IMPLEMENTACIÓN

## Fase 1 — Base técnica
- Crear Next.js y TypeScript.
- Configurar Tailwind, ESLint, Vitest y Playwright.
- Configurar variables.
- Crear estructura de carpetas.

## Fase 2 — Supabase
- Crear tablas y constraints.
- Configurar RLS.
- Crear RPC transaccionales.
- Generar tipos.
- Probar aislamiento.

## Fase 3 — Autenticación
- Crear login.
- Configurar sesión SSR.
- Proteger rutas.
- Crear cuenta única del jugador.
- Probar sesión entre dispositivos.

## Fase 4 — Motor del juego
- Cargar contenido.
- Crear servicio de progreso.
- Validar respuestas.
- Validar QR.
- Guardar fragmentos y códigos.
- Probar todas las transiciones.

## Fase 5 — Interfaz funcional
- Crear tutorial.
- Crear pantalla de acertijo.
- Crear pantalla de pista QR.
- Crear escáner.
- Crear visor de fragmento.
- Crear archivo.
- Crear página final.
- Añadir navegación y estados.

## Fase 6 — Seguridad y pruebas
- Revisar RLS.
- Revisar endpoints.
- Ejecutar tests.
- Probar casos de acceso directo.
- Probar doble escaneo.
- Probar pérdida de conexión.
- Probar móvil y escritorio.

## Fase 7 — Preparación de despliegue
- Documentar variables.
- Documentar Supabase.
- Preparar GitHub.
- Preparar Vercel.
- Documentar alternativa Netlify.
- No declarar producción hasta que el propietario configure servicios y credenciales.

---

# 19. INFORME FINAL QUE OPENCODE DEBE ENTREGAR

Al terminar, responder con:

1. Resumen de lo construido.
2. Árbol real de archivos.
3. Responsabilidad de cada archivo.
4. Tablas y funciones SQL creadas.
5. Variables de entorno que faltan.
6. Pasos para crear/configurar Supabase.
7. Pasos para crear la cuenta del jugador.
8. Comandos para ejecutar localmente.
9. Resultados de lint, typecheck, tests y build.
10. Pruebas manuales que el propietario debe hacer.
11. Pasos para publicar en Vercel.
12. Pasos alternativos para Netlify.
13. Lista de textos pendientes de transcripción, si existen.
14. Cualquier limitación técnica real detectada.

No afirmar que algo funciona si no fue probado.

---

# 20. FUENTES TÉCNICAS OFICIALES

Consultar la documentación vigente, no tutoriales desactualizados:

- Next.js App Router: https://nextjs.org/docs/app
- Next.js deployment: https://nextjs.org/docs/app/getting-started/deploying
- Next.js deployment platforms: https://nextjs.org/docs/app/guides/deploying-to-platforms
- Supabase Next.js quickstart: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
- Supabase Auth SSR: https://supabase.com/docs/guides/auth/server-side
- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Auth: https://supabase.com/docs/guides/auth
- Netlify Next.js: https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/
- MDN getUserMedia: https://developer.mozilla.org/es/docs/Web/API/MediaDevices/getUserMedia

No copiar APIs antiguas sin verificar compatibilidad con las versiones instaladas.

---

# 21. DEFINICIÓN DE TERMINADO

La primera versión funcional está terminada cuando una persona puede:

1. Iniciar sesión.
2. Ver el tutorial.
3. Resolver el acertijo 1.
4. Ver la pista física sin ver todavía el fragmento.
5. Escanear `TXT-1-53`.
6. Desbloquear el fragmento 1.
7. Repetir correctamente el proceso con las etapas 2, 3 y 4.
8. Consultar los fragmentos y QR guardados.
9. Cerrar sesión y regresar desde otro dispositivo sin perder progreso.
10. Llegar a la página final y leer las instrucciones para relacionar los códigos con los textos.

La aplicación no debe resolver el último acertijo por el jugador.

**Prioridad absoluta: fidelidad a la mecánica aprobada, persistencia correcta, seguridad y funcionamiento real. El diseño visual definitivo se realizará en una fase posterior.**
