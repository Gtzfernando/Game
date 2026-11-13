# Transcripción funcional del diagrama del juego
## Documento de apoyo para Kimi K2.7 / OpenCode

**Fuente:** `Diagrama-de-flujo-original.pdf` actualizado, proporcionado por el usuario.  
**Objetivo:** describir en texto el contenido del diagrama para que OpenCode pueda implementarlo sin depender de la imagen.

## Reglas de fidelidad

- No inventar contenido que no aparezca en el PDF.
- Las cuatro secciones `Pista para encontrar el QR:` están vacías. No crear pistas físicas.
- Los códigos dibujados están marcados como `QR de ejemplo`; no asumir que son los QR reales.
- Conservar los identificadores: `TXT-1-53`, `TXT-2-60`, `TXT-3-45` y `TXT-4-45`.
- No extraer automáticamente palabras de los fragmentos ni construir o verificar la frase final.
- No corregir silenciosamente palabras ambiguas o errores del original. Los pendientes se enumeran al final.
- Regla funcional aprobada: el fragmento se revela únicamente después de escanear y validar el QR correcto, aunque el diagrama rotule algunos bloques como resultado de ingresar la respuesta.

---

# 1. Flujo general

El juego tiene cuatro acertijos consecutivos. En cada etapa:

1. Se muestra el acertijo.
2. El jugador escribe la respuesta.
3. Si es incorrecta, permanece en la etapa y puede volver a intentarlo.
4. Si es correcta, se muestra el apartado para escanear el QR de esa etapa y la pista física configurada.
5. El fragmento asociado todavía no se muestra.
6. Al escanear el QR correcto, se guarda el QR, se revela y guarda el texto/fragmento y se habilita el siguiente acertijo.

Después del QR de la etapa 4 se muestra el mensaje final y, posteriormente, la página de sorpresa con las instrucciones para relacionar manualmente los códigos QR con los textos encontrados.

# 2. Inicio

Primer bloque del diagrama:

`Inicio del juego`

A continuación comienza el acertijo de la etapa 1.

# 3. Etapa 1 — Acertijo inicial

## Pregunta

> Los gustos de las personas son relativos pero necesarios para poder ver el alma desde la ventana del otro:

## Respuesta

`OJOS`

El diagrama indica: `RESPUESTA : OJOS`.

## Apartado QR

Título: `Apartado de QR`

Texto:

> Este QR contendrá el contenido de: TXT-1-53

Instrucciones visibles:

> (En esta página deberá poder verse el apartado de  
> Escanea el QR correcto para poder seguir al siguiente  
> nivel, con la leyenda incluida de te dejamos una pista  
> del lugar que debes ir para encontrarlo

Encabezado:

`Pista para encontrar el QR:`

La pista está vacía en el PDF.

El dibujo QR está etiquetado como `(QR de ejemplo)`.

## Resultado / Fragmento 1

Rótulo: `RESULTADO AL INGRESAR LA RESPUESTA`  
Identificador visible: `Fragmento 1`

> Las crónicas del bosque antiguo dicen que cuando las hojas de los alcanforeros se agitan con fuerza, no es por el clima. Es el gran Totoro que respira profundamente mientras duerme. Si prestas atención en una tarde lluviosa, notarás que el viento emite un eco suave, un susurro que suena exactamente como WYT... un sonido místico que solo los de corazón puro pueden escuchar.

Conservar `WYT...` tal como aparece; no corregir sin confirmación.

## Guardado

El diagrama indica:

> Este texto deberá guardarse en la página en un apartado de respuestas obtenidas y las podrá ver en cualquier momento del menú.

Por tanto, el Fragmento 1 debe guardarse y estar disponible en el apartado de respuestas obtenidas del menú.

## QR correcto

El diagrama indica:

> Al escanear el código correcto te dará acceso al siguiente acertijo.

Transición: `Redirección al interfaz del nuevo acertijo`. Lleva a la etapa 2.

# 4. Etapa 2 — Acertijo 2

## Pregunta

> Dicen que el cuerpo humano tiene cinco sentidos, pero hay sensaciones que van más allá. Un estómago revuelto, un frío en la espalda y el sudor en las manos cuando se está sercas que puede ser ?

En el PDF se lee `sercas`. Mantenerlo como transcripción y confirmar con el usuario si quiso escribir “cerca” u otra palabra.

## Respuesta

`NERVIOS`

El diagrama indica: `RESPUESTA : NERVIOS`.

## Apartado QR

Título: `Apartado Qr`

Texto original:

> Este QR contendrá la información de: TXT 2-60

El identificador del sistema se representa como `TXT-2-60`, normalizando los espacios al patrón de los demás códigos. El PDF muestra esta variante con espacios.

Instrucciones:

> (En esta página deberá poder verse el apartado de  
> Escanea el QR correcto para poder seguir al siguiente  
> nivel, con la leyenda incluida de te dejamos una pista  
> del lugar que debes ir para encontrarlo

Encabezado: `Pista para encontrar el QR:`

La pista está vacía. El dibujo QR está etiquetado como `(QR de ejemplo)`.

## Resultado / texto de etapa 2

Rótulo: `Respuesta al ingresar la respuesta correcta`

> El Gatobús no viaja por las carreteras de los humanos; corre sobre los cables de luz y salta entre las colinas. En los mapas espirituales que Mei y Satsuki encontraron en el desván, se muestra que la ruta nocturna tiene un destino oculto en la cima de la montaña. Una estación secreta y envuelta en niebla llamada la parada AM, donde los espíritus descansan antes del amanecer.

Conservar `la parada AM` como aparece, pendiente de confirmación si no es intencional.

## Guardado y transición

El diagrama repite:

> Este texto deberá guardarse en la página en un apartado de respuestas obtenidas y las podrá ver en cualquier momento del menú.

Guardar el texto en respuestas obtenidas. Al escanear el QR correcto:

> Al escanear el código correcto te dará acceso al siguiente acertijo.

Transición: `Redirección al interfaz del nuevo acertijo`. Lleva a la etapa 3.

# 5. Etapa 3 — Acertijo 3

## Pregunta

> Dicen que los polos opuestos se atraen porque no caminan por la misma línea. ?

## Respuesta

`Diferentes`

El diagrama indica: `RESPUESTA : Diferentes`.

## Apartado QR

Título: `Apartado de QR`

> Este QR contendrá el contenido de: TXT-3-45

Instrucciones:

> (En esta página deberá poder verse el apartado de  
> Escanea el QR correcto para poder seguir al siguiente  
> nivel, con la leyenda incluida de te dejamos una pista  
> del lugar que debes ir para encontrarlo

Encabezado: `Pista para encontrar el QR:`

La pista está vacía. El dibujo QR está etiquetado como `(QR de ejemplo)`.

## Resultado / texto de etapa 3

Rótulo: `RESULTADO AL INGRESAR LA RESPUESTA`

> Mucha gente conoce al gran Totoro gris, pero pocos recuerdan a sus pequeños acompañantes. El más diminuto de todos, ese ser blanco y casi transparente que corre entre los arbustos ocultándose de los humanos, es conocido en las leyendas del pueblo como el espíritu FY. Se dice que encontrarlo trae una vida entera de buena fortuna y compañía.

**Duplicación visible:** este mismo párrafo aparece en la etapa 4 como `Fragmento 4`. El PDF actualizado muestra el mismo texto en ambos lugares. No deduplicar, cambiar ni inventar un fragmento distinto para la etapa 3. Solicitar confirmación al usuario antes de modificarlo.

## Guardado y transición

El diagrama indica:

> Este texto deberá guardarse en la página en un apartado de respuestas obtenidas y las podrá ver en cualquier momento del menú.

Guardar el texto asociado a la etapa 3. Al escanear el QR correcto:

> Al escanear el código correcto te dará acceso al siguiente acertijo.

Transición: `Redirección al interfaz del nuevo acertijo`. Lleva a la etapa 4.

# 6. Etapa 4 — Acertijo 4

## Pregunta

> Apago la luz, enciendo el botón; cierro un candado con precisión. Es un sonido corto, rápido y seco, que en el silencio siempre deja eco. ¿Qué sonido soy?

## Respuesta

`CLICK`

El diagrama indica: `RESPUESTA : CLICK`.

## Apartado QR

Título: `Apartado de QR`

> Este QR contendrá el contenido de: TXT-4-45

Instrucciones:

> (En esta página deberá poder verse el apartado de  
> Escanea el QR correcto para poder seguir al siguiente  
> nivel, con la leyenda incluida de te dejamos una pista  
> del lugar que debes ir para encontrarlo

Encabezado: `Pista para encontrar el QR:`

La pista está vacía. El dibujo QR está etiquetado como `(QR de ejemplo)`.

## Resultado / Fragmento 4

Rótulo: `RESULTADO AL INGRESAR LA RESPUESTA`  
Identificador: `Fragmento 4`

> Mucha gente conoce al gran Totoro gris, pero pocos recuerdan a sus pequeños acompañantes. El más diminuto de todos, ese ser blanco y casi transparente que corre entre los arbustos ocultándose de los humanos, es conocido en las leyendas del pueblo como el espíritu FY. Se dice que encontrarlo trae una vida entera de buena fortuna y compañía.

## Guardado y último QR

El diagrama indica:

> Este texto deberá guardarse en la página en un apartado de respuestas obtenidas y las podrá ver en cualquier momento del menú.

Guardar el Fragmento 4. Después aparece el bloque:

`Escanea el último código`

Al validar el cuarto QR, pasar a la página del mensaje final.

# 7. Mensaje final

Título del bloque: `Se muestra la última página que dará estas instrucciones`

Texto:

> Lograste completar este reto pero el verdadero significado es como descubriste cada una de las pistas los lugares que recorriste y más importante la persona con quien pasaste esta gran aventura así que ese es el verdadero premio.
>
> PASAR BUENOS MOMENTOS CON ESA PERSONA ESPECIAL
>
> ESTO SOLO FUE UN PRETEXTO MÁS PARA TENER UN RATITO JUNTOS DE UNA MANERA DIFERENTE

La transcripción facilita acentos y puntuación, pero conserva las palabras. Si se necesita una reproducción literal carácter por carácter, confirmar el texto final con el usuario.

# 8. Página de sorpresa / instrucciones finales

Título del bloque: `Siguiente página con el premio y desbloqueo`

Recuadro: `Sorpresa si quieres descubrir el último acertijo`

Texto:

> Instrucciones: Cada QR que descubriste tiene un código; ese código deberás relacionarlo con los textos que también están guardados en las respuestas encontradas.
>
> ¿Cómo relacionarlos? Averígualo 😉 porque ni nosotros sabemos qué hay oculto allí. Esa sorpresa es para los dos jugadores de este juego.
>
> Suerte, Bay ¡¡

El cierre se lee como `Suerte, Bay ¡¡`. No modificar sin confirmación.

# 9. Resumen de QR

| Etapa | Acertijo | Respuesta | Identificador |
|---|---|---|---|
| 1 | Acertijo inicial | OJOS | `TXT-1-53` |
| 2 | Acertijo 2 | NERVIOS | `TXT-2-60` |
| 3 | Acertijo 3 | DIFERENTES | `TXT-3-45` |
| 4 | Acertijo 4 | CLICK | `TXT-4-45` |

Interpretación indicada para el juego:
- `TXT` identifica que el código está relacionado con un texto.
- El número central identifica el texto o fragmento.
- El último número identifica una posición/palabra dentro de ese texto.

**No extraer palabras automáticamente.** El jugador debe relacionar manualmente los códigos con los textos guardados.

# 10. Reglas funcionales para OpenCode

## Respuesta incorrecta
- No avanzar de etapa.
- No revelar fragmento.
- No revelar pista del siguiente QR.
- Mostrar error y permitir reintentar.

## Respuesta correcta
- Registrar que la respuesta del acertijo actual fue validada.
- Mostrar el apartado de escaneo del QR correspondiente.
- Mostrar la instrucción de escaneo y la pista física configurada, si existe.
- No revelar el fragmento todavía.
- No permitir abrir la etapa siguiente únicamente por contestar el acertijo.

## QR correcto
- Validar en el servidor el payload exacto.
- Confirmar que corresponde a la etapa pendiente del jugador.
- Guardar el QR encontrado.
- Revelar y guardar el texto/fragmento de esa etapa.
- Habilitar el siguiente acertijo.
- Hacer la operación idempotente: escaneos repetidos no deben duplicar progreso ni registros.

## QR incorrecto o fuera de orden
- No avanzar.
- No revelar fragmentos nuevos.
- Mostrar un mensaje claro y permitir reintentar.

## Menú / respuestas obtenidas
- Permitir consultar los textos ya desbloqueados en cualquier momento.
- Conservar también los identificadores QR encontrados.
- No mostrar fragmentos futuros no desbloqueados.
- El progreso debe persistir al cerrar sesión e iniciar en otro dispositivo, conforme a la especificación técnica principal.

## Finalización
- La página final solo se habilita tras validar el cuarto QR.
- Mostrar el mensaje final y después la página de sorpresa.
- No añadir campo para escribir la frase final.
- No añadir arrastrar y soltar palabras.
- No construir ni verificar automáticamente la frase.
- No añadir contraseña extra para reclamar premio.
- La relación entre códigos QR y textos es manual.

# 11. Pendientes que el PDF no resuelve

1. Las cuatro pistas físicas de ubicación están vacías.
2. Los QR dibujados son ejemplos; no se confirma que sean los payloads reales.
3. El texto FY está duplicado entre el resultado de la etapa 3 y el Fragmento 4 de la etapa 4.
4. En el acertijo 2 aparece `sercas`; confirmar la palabra pretendida.
5. En el Fragmento 1 aparece `WYT...`; confirmar si es intencional.
6. En el texto de etapa 2 aparece `la parada AM`; confirmar si es intencional.
7. El cierre dice `Suerte, Bay ¡¡`; confirmar si es intencional.
8. El video tutorial y la pantalla de acceso no están descritos en este diagrama actualizado. Si se describen en la especificación técnica principal, seguir aquella especificación; no inferir detalles desde este PDF.

# 12. Instrucción directa para Kimi K2.7 / OpenCode

Lee primero la especificación técnica principal del proyecto y después esta transcripción. Implementa las cuatro etapas, preguntas, respuestas, QR, textos y transiciones según este documento. Respeta la regla funcional aprobada: el fragmento solo se revela después de validar el QR correcto.

Si el diagrama visual parece contradecir esa regla, aplica la regla funcional aprobada. No inventes pistas físicas, no completes textos ambiguos y no elimines la duplicación del texto FY sin confirmación. Antes de publicar, presenta al usuario la lista de pendientes de la sección 11.

**Prioridad:** reproducir el juego definido por el usuario; no reinterpretarlo ni añadir mecánicas nuevas.
