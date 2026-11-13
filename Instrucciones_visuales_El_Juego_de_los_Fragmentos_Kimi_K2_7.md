# Instrucciones de implementación visual --- El Juego de los Fragmentos

**Destino:** Kimi K2.7 / OpenCode\
**Tipo de trabajo:** Rediseño exclusivamente visual y sonoro sobre un
sitio ya funcional y desplegado.\
**Prioridad absoluta:** preservar la funcionalidad actual.\
**Referencia visual obligatoria:** imagen adjunta
`El Juego de los Fragmentos(1).png` (1536 × 1024 px).

------------------------------------------------------------------------

# 1. REGLA DE ORO: NO MODIFICAR LA FUNCIONALIDAD EXISTENTE

El sitio ya está desarrollado, desplegado y sus flujos funcionales están
terminados. Este trabajo NO es una reconstrucción del proyecto ni una
refactorización funcional.

**Solo se deben agregar o ajustar capas de presentación, estilos,
recursos visuales, animaciones y audio.**

Se permite intervenir archivos existentes si es necesario para conectar
los estilos o componentes visuales, incluso agregar líneas de código,
componentes presentacionales, clases CSS, variables, recursos y hojas de
estilo. Sin embargo, cualquier intervención debe cumplir estas
condiciones:

1.  No cambiar la lógica de negocio.
2.  No cambiar el flujo de navegación ni el orden de las etapas.
3.  No cambiar autenticación, sesiones, permisos ni persistencia.
4.  No modificar las respuestas de los acertijos, validaciones, códigos
    QR, contenido de pistas, fragmentos, mensajes ni condiciones de
    desbloqueo.
5.  No modificar esquemas, tablas, datos, migraciones ni consultas de
    base de datos.
6.  No modificar endpoints, API routes, server actions ni contratos de
    datos.
7.  No cambiar nombres, formatos o estructuras de los datos guardados.
8.  No reemplazar componentes funcionales por versiones nuevas que no
    conserven exactamente su comportamiento.
9.  No eliminar controles existentes. Se pueden estilizar, pero deben
    seguir realizando la misma acción.
10. No alterar la lógica de progreso ni la posibilidad de continuar la
    partida desde otro dispositivo.

**Regla práctica:** si un cambio visual requiere modificar lógica
funcional, buscar primero una alternativa de presentación. Si no existe
una alternativa segura, no implementar ese cambio sin explicar el riesgo
y solicitar autorización.

## 1.1 Antes de tocar el código

Primero inspecciona el repositorio completo y comprende su estructura.

-   Identifica framework, versión, sistema de estilos, componentes,
    rutas y estructura de assets.
-   Localiza la pantalla de inicio actual y los componentes que muestran
    acertijos, pistas, QR, fragmentos y mensaje final.
-   Identifica cómo se gestionan los estados actuales y qué eventos
    indican que una respuesta, QR o etapa fueron validados.
-   Identifica el mecanismo actual de autenticación y persistencia, pero
    no lo modifiques.
-   Identifica si ya existe un sistema de sonidos o preferencias.
-   Revisa `package.json` y las dependencias existentes antes de
    instalar algo.
-   No actualices Next.js, React, paquetes ni versiones por iniciativa
    propia.
-   No reemplaces librerías existentes sin justificación y autorización.

Antes de editar, registra el estado inicial del repositorio. Si existe
Git, revisa `git status` y conserva los cambios que ya existan. No
sobrescribas trabajo previo del usuario.

## 1.2 Método de trabajo obligatorio

Implementa por capas y en pequeñas fases:

1.  Inspección y diagnóstico.
2.  Inventario de componentes y estilos actuales.
3.  Implementación de identidad visual global.
4.  Implementación de la pantalla inicial.
5.  Implementación de animaciones de revelación.
6.  Implementación de microinteracciones.
7.  Implementación del audio ambiental y efectos.
8.  Adaptación responsive y accesibilidad.
9.  Pruebas de regresión funcional.
10. Informe final de archivos modificados y comprobaciones.

Después de cada fase, comprueba que el sitio sigue funcionando. No hagas
un cambio masivo que impida identificar qué modificación causó un
problema.

------------------------------------------------------------------------

# 2. OBJETIVO VISUAL GENERAL

La identidad visual debe sentirse como un cuento ilustrado de
naturaleza: cálido, orgánico, tranquilo, artesanal y ligeramente mágico.

La inspiración estética es la ilustración de paisajes naturales pintados
a mano, con acuarela y gouache. La referencia de estilo es Kazuo Oga,
sin intentar copiar una obra específica.

La experiencia debe transmitir:

-   Calma y curiosidad.
-   Sensación de explorar un bosque ilustrado.
-   Descubrimiento de pequeños secretos.
-   Calidez y cercanía.
-   Elegancia y sencillez.
-   Movimiento pausado, nunca excesivo.

Evitar una apariencia de videojuego genérico, interfaz futurista, neón,
paneles rígidos, sombras grises fuertes o animaciones llamativas.

## 2.1 Paleta de colores

Usar estos valores como tokens globales. Si el proyecto ya tiene
variables CSS o un sistema de temas, integrarlos allí sin eliminar
variables funcionales.

  Uso                             Color                 Código
  ------------------------------- --------------------- -----------
  Fondo principal, papel cálido   Crema suave           `#F5F1E3`
  Alternativa de fondo            Marfil                `#FAF7EE`
  Texto principal                 Verde bosque oscuro   `#2C352D`
  Texto alternativo               Carbón cálido         `#3A3532`
  Verde primario                  Verde musgo           `#4A7C59`
  Verde secundario                Verde salvia          `#7DA37E`
  Azul secundario                 Azul cielo            `#6B9AC4`
  Azul suave                      Azul horizonte        `#A3C6E0`
  Acento luminoso                 Amarillo solar        `#E8B84B`
  Acento cálido                   Terracota             `#D96B52`

Reglas:

-   No usar blanco puro `#FFFFFF` como fondo dominante.
-   No usar negro absoluto `#000000` como texto o fondo dominante.
-   Mantener contraste suficiente para que todo el contenido sea
    legible.
-   Los acentos amarillos y terracota deben aparecer en pequeñas
    cantidades.
-   Los verdes deben dominar la interfaz y los azules deben acompañar
    paisajes y detalles.

## 2.2 Tipografía

Usar una combinación editorial:

**Títulos:** una serif de carácter literario. Preferencia: 1. `Lora` 2.
`Fraunces` 3. `Playfair Display`

**Texto, controles y descripciones:** una sans-serif amable y legible.
Preferencia: 1. `Nunito` 2. `Quicksand` 3. `Plus Jakarta Sans`

Antes de añadir fuentes, comprobar si el proyecto ya carga Google Fonts
o usa `next/font`. Reutilizar el mecanismo existente. No introducir una
dependencia innecesaria ni bloquear la carga de la página si falla una
fuente externa.

Jerarquía:

-   Títulos grandes y expresivos, sin exagerar.
-   Texto de lectura cómodo y con altura de línea generosa.
-   Botones claros, legibles y con peso tipográfico coherente.
-   No usar demasiados estilos tipográficos simultáneamente.

## 2.3 Espacio, texturas y formas

Aplicar el concepto de espacio vacío japonés (*Ma*):

-   Márgenes amplios.
-   Separación suficiente entre bloques.
-   No saturar las pantallas con adornos.
-   Mantener una lectura clara en escritorio y móvil.

Detalles:

-   Textura sutil de papel de acuarela en fondos o paneles.
-   Se puede usar un patrón SVG de ruido/grano con `feTurbulence`, o un
    asset de textura ligero.
-   Opacidad orientativa: `0.04` a `0.06`.
-   La textura no debe dificultar la lectura ni aumentar demasiado el
    peso de la página.
-   Usar bordes orgánicos y radios ligeramente asimétricos cuando sea
    apropiado.
-   Ejemplo orientativo: `border-radius: 24px 18px 28px 20px`.
-   Sombras suaves y cálidas, por ejemplo:
    `0 4px 12px rgba(44, 53, 45, 0.12)`.
-   Evitar bordes negros, sombras grises duras y tarjetas excesivamente
    cuadradas.

------------------------------------------------------------------------

# 3. PANTALLA DE INICIO --- PRIORIDAD MÁXIMA

La pantalla de inicio es el elemento visual más importante de este
trabajo.

## 3.1 Referencia que se debe respetar

Utilizar la imagen adjunta `El Juego de los Fragmentos(1).png` como
referencia visual principal y conservar su composición **lo más
fielmente posible**.

La imagen tiene una proporción de 3:2 y contiene:

-   Paisaje campestre pintado en acuarela.
-   Casa rústica de madera en el lado izquierdo.
-   Árbol y ramas con hojas que enmarcan la parte superior.
-   Cielo azul con nubes suaves.
-   Colinas, agua y pequeñas construcciones al fondo, hacia la derecha.
-   Vegetación, flores azules y muro de piedra con musgo en primer
    plano.
-   Personaje azul, redondeado y gordito, con panza clara, sentado cerca
    de la casa.
-   Gato naranja dormido sobre el muro de piedra.
-   Panel central grande de papel cálido con bordes irregulares.
-   Barra superior de papel con navegación.
-   Título, descripción y botón verde central.

**No rediseñar la composición, no cambiar la ubicación de los elementos,
no sustituir los personajes y no convertirla en una interfaz genérica.**
La imagen es la guía visual de referencia para reproducir el inicio del
juego.

El personaje azul debe conservar su apariencia de criatura original:
cuerpo redondeado, color azul, panza clara, expresión amable y ubicación
junto a la casa. El gato naranja debe permanecer dormido sobre el muro.
No añadir personajes adicionales que compitan con ellos.

## 3.2 Uso del archivo de referencia

Localiza la imagen adjunta en los archivos disponibles del proyecto o en
los archivos proporcionados para esta tarea.

Si no está dentro del repositorio:

-   No inventes una ruta ni supongas que ya existe en `public`.
-   Informa que se necesita copiar el asset al proyecto.
-   Propón una ubicación clara, por ejemplo
    `public/images/home/forest-home-reference.png`.
-   No reemplaces la imagen por una búsqueda web ni por una ilustración
    distinta.
-   No comprimas ni recortes agresivamente el archivo original.

La imagen puede utilizarse como fondo completo de la pantalla inicial.
Si se necesita que los botones, textos o navegación sean interactivos,
construir las capas HTML/CSS por encima de la imagen, manteniendo la
composición visual. No convertir toda la pantalla en una imagen plana si
eso elimina accesibilidad, responsive o interactividad.

Si la imagen se usa como fondo:

-   Mantener su proporción original.
-   Usar `background-size: cover` solo si el recorte no elimina
    elementos importantes.
-   Preferir una composición responsive con `object-fit: cover` o capas
    adaptadas por breakpoint.
-   En móvil, ajustar posición y encuadre para conservar visibles el
    personaje azul, la casa, el gato y el panel principal.
-   No estirar ni deformar la ilustración.
-   Si es necesario, crear una variante de encuadre móvil a partir del
    mismo asset, sin cambiar su estilo ni inventar una escena distinta.

## 3.3 Composición y distribución

La pantalla inicial debe mantener esta estructura visual:

**Fondo** - Paisaje de acuarela ocupando toda la pantalla. - Casa y
personaje azul a la izquierda. - Gato naranja en el muro inferior
izquierdo. - Paisaje abierto y cielo hacia la derecha. - Vegetación
enmarcando los bordes.

**Barra superior** - Banda horizontal de papel marfil, con bordes
irregulares. - Ubicada en la zona superior. - Controles existentes de
navegación, conservando exactamente sus acciones y destinos. - En la
referencia aparecen "Mi progreso", "Fragmentos" y "Salir". Mantener los
nombres que realmente use el proyecto si difieren. - Iconos de trazo
orgánico, discretos y de tamaño coherente. - No inventar destinos ni
nuevas acciones.

**Panel central** - Papel crema con textura sutil y bordes naturales. -
Ubicado en el centro, como en la imagen. - Título principal: "El Juego
de los Fragmentos" si ese es el texto vigente en el proyecto. -
Descripción breve y centrada, conservando el contenido funcional
actual. - Botón principal verde musgo, con forma orgánica, sombra cálida
y texto legible. - El botón debe seguir ejecutando la acción que ya
tiene actualmente.

No alterar textos funcionales reales solo para que coincidan con la
imagen de ejemplo. La imagen guía la composición y el estilo; los datos
y textos vigentes del sitio siguen siendo la fuente de verdad.

## 3.4 Movimiento ambiental de la pantalla inicial

Añadir movimiento de forma sutil, sin alterar la ilustración base:

-   Hojas pequeñas que se desplazan lentamente.
-   Movimiento muy leve de ramas o follaje, si se implementa mediante
    capas separadas.
-   Nubes con desplazamiento horizontal muy lento, solo si se dispone de
    una capa independiente.
-   Partículas de luz o polvo iluminado, pequeñas y poco numerosas.
-   Parallax suave entre primer plano, plano medio y fondo, si la
    implementación es viable sin deformar la imagen.

Duraciones orientativas:

-   Movimiento de hojas: entre 5 y 8 segundos por ciclo.
-   Desplazamiento de nubes: entre 25 y 45 segundos por ciclo.
-   Parallax: desplazamiento pequeño, casi imperceptible.
-   Partículas: aparición y desaparición gradual, no destellos intensos.

**Importante:** no intentar separar automáticamente la imagen en capas
si eso produce recortes defectuosos o altera a los personajes. Si el
asset es una imagen plana, limitarse a efectos superpuestos discretos.
La imagen debe seguir viéndose como la referencia original.

------------------------------------------------------------------------

# 4. ANIMACIONES DE REVELACIÓN DE PISTAS Y FRAGMENTOS

Este es el segundo bloque visual prioritario.

La revelación debe sentirse como descubrir una página de un cuento
ilustrado. Debe ser elegante, pausada y mágica, sin parecer una
animación de recompensa exagerada.

**Condición funcional:** la animación solo debe activarse cuando el
flujo actual haya validado correctamente el QR y el sitio ya esté
autorizado a revelar el fragmento. No modificar cuándo ni por qué se
revela una pista.

## 4.1 Secuencia aprobada

Duración total orientativa: 5 segundos.

  -----------------------------------------------------------------------
  Tiempo                              Efecto
  ----------------------------------- -----------------------------------
  `0–0.5 s`                           Pequeño destello cálido que genera
                                      expectativa.

  `0.5–1.5 s`                         El papel aparece o se despliega con
                                      una transición orgánica.

  `1.5–3.5 s`                         El texto aparece progresivamente,
                                      como tinta escribiéndose.

  `3.5–5 s`                           Algunas hojas y partículas de luz
                                      acompañan la escena.

  Después                             La animación termina y el contenido
                                      queda completamente estático para
                                      leer.
  -----------------------------------------------------------------------

## 4.2 Detalles técnicos

-   Usar `opacity` y transformaciones suaves para la entrada del papel.
-   La sensación de despliegue puede lograrse con `clip-path`, `scale` o
    una máscara, siempre que sea compatible con los navegadores
    objetivo.
-   Evitar animaciones que cambien bruscamente el tamaño del contenido y
    provoquen saltos de layout.
-   El texto debe permanecer accesible y disponible para lectores de
    pantalla; no ocultarlo permanentemente detrás de una animación.
-   El efecto de escritura puede hacerse por palabras o líneas. Evitar
    un efecto carácter por carácter demasiado lento que dificulte la
    lectura.
-   Si el texto es largo, mostrarlo en un tiempo razonable y permitir
    que el usuario lo lea inmediatamente.
-   Las hojas y partículas deben ser decorativas, con
    `pointer-events: none`.
-   No deben tapar el texto, botones ni controles.
-   Al finalizar, detener las partículas y dejar la página estable.
-   No repetir automáticamente la animación cada vez que el componente
    se renderice.
-   Evitar que una actualización de estado o re-render vuelva a
    reproducir la secuencia sin un nuevo evento real de revelación.

## 4.3 Curvas y tiempos generales

Usar transiciones naturales, por ejemplo:

``` css
cubic-bezier(0.22, 1, 0.36, 1)
```

Duraciones recomendadas:

-   Microinteracciones: `180–300ms`.
-   Transiciones entre estados: `300–500ms`.
-   Aparición de paneles: `500–800ms`.
-   Animaciones ambientales: ciclos largos y lentos.

No animar todo al mismo tiempo. La animación debe tener jerarquía:
primero el papel, después el texto y al final los detalles ambientales.

------------------------------------------------------------------------

# 5. MICROANIMACIONES Y MOMENTOS ESPECIALES

Reservar las animaciones especiales para momentos importantes:

1.  Resolver un acertijo.
2.  Validar un QR correctamente.
3.  Revelar un fragmento.
4.  Completar una etapa.
5.  Mostrar el mensaje final.

No añadir efectos especiales a cada clic, cada foco de campo o cada
movimiento del cursor.

## 5.1 Botones

-   Apariencia de etiqueta de papel o piedra de río.
-   Fondo verde musgo para la acción principal.
-   Sombras cálidas, suaves y cortas.
-   Hover: pequeño cambio de luminosidad o elevación.
-   Active: ligera compresión.
-   Focus visible y accesible.
-   Transiciones suaves de `180–300ms`.
-   No usar rebotes exagerados ni escalados grandes.

## 5.2 Respuesta correcta

Cuando el sistema actual confirme una respuesta correcta:

-   Mostrar una transición breve y elegante.
-   Puede aparecer una pequeña campanilla visual o destello cálido.
-   Usar verde salvia y amarillo solar de forma moderada.
-   No modificar la validación ni desbloquear elementos adicionales.

## 5.3 Respuesta incorrecta

Cuando el sistema actual confirme una respuesta incorrecta:

-   Mostrar el estado visual de error de manera amable.
-   Usar terracota tenue.
-   Puede haber un movimiento horizontal mínimo del panel o campo, sin
    vibración agresiva.
-   No castigar visualmente ni borrar el contenido introducido.
-   No modificar intentos, reglas o validaciones actuales.

## 5.4 Completar etapa y mensaje final

-   Completar etapa: transición cálida y campanillas visuales muy
    discretas.
-   Mensaje final: aparición pausada, papel cálido y ambiente emotivo.
-   Dar prioridad al texto y a la lectura.
-   No cambiar el contenido ni la condición actual que muestra el
    mensaje final.

------------------------------------------------------------------------

# 6. DISEÑO SONORO: AMBIENTE DE BOSQUE

El usuario aprobó un ambiente sonoro discreto. El sonido debe acompañar
al juego, nunca saturarlo.

## 6.1 Ambiente general

Ambiente principal del bosque:

-   Brisa suave entre los árboles.
-   Pájaros lejanos.
-   Hojas moviéndose ocasionalmente.

Características:

-   Volumen bajo, orientativamente entre 10 % y 15 %.
-   Sonido natural, cálido y no invasivo.
-   Evitar loops demasiado cortos o fácilmente perceptibles.
-   Evitar sonidos estridentes, chillidos cercanos o viento fuerte.
-   No reproducir varias pistas ambientales superpuestas si no es
    necesario.
-   Si se usa un loop, buscar un punto de unión imperceptible.

## 6.2 Efectos por acción

Los sonidos deben conectarse a eventos que ya existan en el sistema. No
crear nuevas reglas de juego para reproducir audio.

  Evento ya existente         Sonido
  --------------------------- ------------------------------------
  Entrada al juego            Brisa suave
  Respuesta correcta          Campanilla cálida y breve
  Respuesta incorrecta        Golpe apagado de madera, discreto
  QR validado correctamente   Destello cristalino corto
  Revelación de fragmento     Papel desplegándose y brillo sutil
  Etapa completada            Campanillas muy suaves
  Mensaje final               Ambiente cálido y emotivo

Reglas de audio:

-   Efectos cortos, con volumen orientativo entre 15 % y 25 %.
-   El volumen real debe poder ajustarse.
-   Evitar que dos efectos se reproduzcan simultáneamente de forma
    molesta.
-   Si ocurre un evento nuevo mientras suena un efecto anterior, aplicar
    una política sencilla de prioridad o limitar la superposición.
-   No reproducir un sonido por cada clic.
-   No usar sonidos de error fuertes.
-   No añadir música constante. La música, si se considera en el futuro,
    debe ser opcional y requerir aprobación.

## 6.3 Autoplay y control del usuario

Los navegadores pueden bloquear la reproducción automática de audio. Por
ello:

-   No asumir que el audio puede comenzar automáticamente al cargar la
    página.
-   Iniciar audio únicamente después de una interacción válida del
    usuario, como pulsar el control de sonido o comenzar la aventura.
-   Añadir un control visible y discreto para activar/desactivar sonido.
-   Si se implementa control de volumen, hacerlo simple y accesible.
-   Recordar la preferencia de sonido mediante el mecanismo de
    preferencias del cliente que el proyecto ya utilice, o una solución
    local aislada. No modificar la base de datos ni el perfil del
    usuario para esto.
-   Si el usuario silencia el sonido, respetar esa preferencia durante
    la navegación.
-   Si el audio falla o no está disponible, el juego debe funcionar
    normalmente.
-   No bloquear ninguna acción del juego esperando a que cargue un
    audio.

## 6.4 Recursos de audio

Antes de añadir archivos:

-   Revisar si el proyecto ya contiene sonidos.
-   Usar únicamente archivos con licencia adecuada para el uso previsto.
-   Mantener formatos ligeros y ampliamente compatibles, como `.mp3` u
    `.ogg`; usar `.wav` solo cuando tenga sentido.
-   No descargar música o efectos de procedencia dudosa.
-   No añadir grandes bibliotecas de audio si bastan unos pocos
    recursos.
-   Centralizar la gestión de audio en un módulo o servicio
    presentacional aislado, sin acoplarlo a la lógica de negocio.

------------------------------------------------------------------------

# 7. RESPONSIVE: ESCRITORIO, TABLET Y MÓVIL

La referencia es una composición horizontal 3:2, pero el sitio debe
funcionar en distintos tamaños.

## Escritorio

-   Mantener la composición de la imagen de referencia.
-   Panel central con anchura controlada.
-   Navegación superior legible.
-   Paisaje completo siempre que el viewport lo permita.

## Tablet

-   Reducir tamaños de panel y tipografía de forma proporcional.
-   Evitar que la barra superior se encime con el título.
-   Mantener visibles los personajes y los elementos más importantes.

## Móvil

-   No reducir toda la pantalla de escritorio hasta hacerla ilegible.
-   Adaptar la composición de forma intencional.
-   Conservar la casa, el personaje azul, el gato y el panel principal
    en el encuadre cuando sea posible.
-   Reorganizar navegación si hace falta, pero mantener las mismas
    opciones y acciones funcionales.
-   Botones suficientemente grandes para interacción táctil.
-   No permitir scroll horizontal accidental.
-   Asegurar que el panel central no tape toda la ilustración ni vuelva
    ilegible el contenido.
-   Si la imagen necesita un encuadre móvil, utilizar una variante del
    mismo asset o ajustes de posición; no sustituir la escena por otra.

------------------------------------------------------------------------

# 8. ACCESIBILIDAD Y RENDIMIENTO

## 8.1 Accesibilidad

-   Respetar `prefers-reduced-motion`.
-   Si el usuario solicita movimiento reducido, desactivar parallax,
    partículas y animaciones no esenciales.
-   Mantener visibles los estados correctos, incorrectos y de progreso
    sin depender exclusivamente del color.
-   Mantener contraste suficiente.
-   Conservar navegación por teclado.
-   Mantener indicadores de foco.
-   Los controles de audio deben tener etiqueta accesible.
-   Los elementos decorativos deben ignorarse por tecnologías de
    asistencia cuando corresponda.
-   No ocultar contenido importante mientras se ejecuta una animación.

## 8.2 Rendimiento

-   Evitar Canvas si CSS/SVG resuelve el efecto de forma más sencilla.
-   Preferir animar `transform` y `opacity`.
-   Evitar animar `top`, `left`, `width` o `height` continuamente.
-   Limitar cantidad de partículas.
-   No crear cientos de nodos DOM para hojas o polvo.
-   No añadir dependencias grandes para efectos que pueden implementarse
    con CSS.
-   Cargar recursos decorativos de forma eficiente.
-   No bloquear el render inicial por texturas, fuentes o audio.
-   No reproducir animaciones ambientales fuera de la pantalla cuando no
    aporten valor.

------------------------------------------------------------------------

# 9. ARQUITECTURA DE IMPLEMENTACIÓN RECOMENDADA

Adaptar esta propuesta a la arquitectura real del repositorio. No crear
duplicados si ya existen componentes equivalentes.

La presentación debe mantenerse separada de la lógica funcional.
Ejemplos de responsabilidades posibles:

-   `HomeBackground`: presentación del paisaje y sus capas decorativas.
-   `HomeNavigation`: presentación de la navegación existente, sin
    cambiar sus destinos.
-   `HomeHeroPanel`: papel central, título, descripción y botón
    existente.
-   `AmbientEffects`: hojas, partículas y movimiento decorativo.
-   `RevealAnimation`: secuencia de aparición de papel y texto.
-   `SoundControls`: control visual de audio y preferencia del usuario.
-   `AudioManager`: reproducción aislada de ambiente y efectos.

Estos nombres son orientativos. **No es obligatorio crear esos archivos
si el proyecto ya tiene una estructura adecuada.** Integrar en los
componentes existentes cuando sea más seguro.

## 9.1 Separación estricta

La capa visual puede recibir datos y eventos del sistema actual, pero no
debe decidir:

-   Si una respuesta es correcta.
-   Si un QR es válido.
-   Qué fragmento se desbloquea.
-   Cuándo se completa una etapa.
-   Qué usuario está autenticado.
-   Qué progreso debe guardarse.
-   Qué mensaje final corresponde.

Debe limitarse a representar los estados que el sistema ya proporciona.

Ejemplo conceptual:

``` tsx
<RevealAnimation
  isRevealed={existingValidatedRevealState}
  fragment={existingFragmentData}
/>
```

El ejemplo no autoriza a crear un nuevo estado funcional ni a cambiar el
mecanismo actual. Utilizar los estados y datos reales que ya existan en
el proyecto.

## 9.2 CSS y tokens

Centralizar los colores, tipografías, sombras, radios y duraciones en el
sistema de estilos actual. Evitar duplicar valores por toda la
aplicación.

No reemplazar globalmente estilos que puedan afectar componentes
funcionales sin revisar sus efectos. Aplicar clases específicas al área
visual que se esté trabajando.

------------------------------------------------------------------------

# 10. PRUEBAS OBLIGATORIAS DE REGRESIÓN

Antes de considerar terminado el trabajo, probar manualmente y, si
existen, ejecutar las pruebas automatizadas actuales.

Verificar que todo lo siguiente siga funcionando exactamente como antes:

-   Inicio de sesión.
-   Cierre de sesión.
-   Continuidad de la partida.
-   Persistencia del progreso.
-   Navegación entre pantallas.
-   Envío y validación de respuestas.
-   Respuestas correctas e incorrectas.
-   Desbloqueo de la sección QR según las reglas actuales.
-   Escaneo y validación del QR correcto.
-   Revelación del fragmento solo cuando corresponde según el flujo
    actual.
-   Guardado y visualización de fragmentos.
-   Completar etapas.
-   Mensaje final.
-   Acceso desde otro dispositivo, en la medida que pueda comprobarse
    con el entorno disponible.

También probar:

-   Escritorio.
-   Tablet.
-   Móvil.
-   Audio silenciado.
-   Audio activado después de interacción.
-   Navegador que bloquee autoplay.
-   `prefers-reduced-motion`.
-   Carga lenta o ausencia de un recurso de audio.

No modificar pruebas existentes para que pasen artificialmente. Si
alguna prueba falla por un cambio visual, corregir el cambio visual.

------------------------------------------------------------------------

# 11. CRITERIOS DE ACEPTACIÓN

El trabajo solo se considera terminado cuando se cumplan todos estos
puntos:

1.  La pantalla inicial conserva fielmente la composición de la imagen
    de referencia.
2.  Se reconoce el paisaje de acuarela, la casa, el personaje azul de
    panza clara, el gato naranja y el panel central de papel.
3.  La paleta y tipografías mantienen la identidad visual definida.
4.  Las texturas son sutiles y no afectan la legibilidad.
5.  Los movimientos ambientales son lentos y discretos.
6.  La revelación de pistas respeta la secuencia temporal aprobada.
7.  Después de la animación, el contenido queda estático y fácil de
    leer.
8.  Los sonidos ambientales y efectos son discretos, tienen control de
    silencio y respetan las restricciones de autoplay.
9.  El sitio se adapta a escritorio, tablet y móvil.
10. Se respeta la preferencia de movimiento reducido.
11. No se ha alterado ninguna regla, dato, flujo o comportamiento
    funcional.
12. La compilación y las pruebas existentes siguen pasando.

------------------------------------------------------------------------

# 12. ENTREGA E INFORME FINAL

Al terminar, entregar un informe claro con:

1.  Archivos creados.
2.  Archivos existentes modificados.
3.  Qué cambios visuales se hicieron en cada archivo.
4.  Qué recursos de imagen, textura, fuente y audio se añadieron.
5.  Qué animaciones se implementaron y sus duraciones.
6.  Cómo se controla el audio.
7.  Qué pruebas se ejecutaron y sus resultados.
8.  Confirmación explícita de que no se modificó la lógica funcional.
9.  Cualquier punto que no se haya podido implementar y la razón.
10. Riesgos o pendientes que requieran autorización.

No afirmar que algo fue probado si no se ejecutó realmente.

Si una implementación amenaza la funcionalidad existente, detener esa
parte, explicar el conflicto y proponer una alternativa exclusivamente
visual.

------------------------------------------------------------------------

# 13. ORDEN DE PRIORIDAD

Si se necesita dividir el trabajo, seguir exactamente este orden:

1.  **Pantalla de inicio:** reproducir fielmente la imagen de
    referencia.
2.  Identidad visual global: paleta, tipografía, papel, texturas y
    formas orgánicas.
3.  Revelación de pistas y fragmentos.
4.  Microanimaciones de respuestas, QR y etapas.
5.  Ambiente sonoro de bosque y efectos por evento.
6.  Responsive, accesibilidad y optimización.
7.  Pruebas de regresión y documentación.

No sacrificar la fidelidad de la pantalla inicial por añadir más
efectos. La composición de referencia es prioritaria.

------------------------------------------------------------------------

# INSTRUCCIÓN FINAL PARA KIMI K2.7

Trabaja como desarrollador frontend senior especializado en interfaces
ilustradas, animación web y experiencias interactivas.

Primero inspecciona el proyecto y explica brevemente qué archivos
planeas intervenir. Después implementa los cambios en fases pequeñas,
verificando el funcionamiento después de cada fase.

**No reconstruyas el sitio. No cambies su lógica. No cambies su base de
datos. No alteres sus reglas. No elimines funcionalidades.**

El objetivo es que el sitio existente adquiera la identidad visual y
sonora descrita en este documento, con especial cuidado en que la
pantalla inicial se vea como la imagen de referencia adjunta.

**La regla de oro es conservar el sitio funcional exactamente como está
y agregar únicamente capas de diseño, animación y sonido.**
