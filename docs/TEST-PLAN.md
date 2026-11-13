# Plan de pruebas — Juego de acertijos

## Autenticación

- [ ] Usuario no autenticado es redirigido a `/login`.
- [ ] Usuario autenticado accede a `/game`.
- [ ] Credenciales inválidas muestran mensaje genérico.
- [ ] No existe enlace de recuperación de contraseña.
- [ ] Cerrar sesión conserva el progreso en base de datos.
- [ ] Iniciar sesión en otro dispositivo restaura el progreso.

## Etapas 1 a 4

Para cada etapa:

- [ ] Se muestra solo el acertijo actual.
- [ ] Respuesta incorrecta no avanza ni revela pista de QR.
- [ ] Respuesta correcta muestra la pista física.
- [ ] Respuesta correcta no muestra el fragmento.
- [ ] El escáner solicita permiso de cámara solo tras acción explícita.
- [ ] QR incorrecto no modifica el progreso.
- [ ] QR de etapa futura no modifica el progreso.
- [ ] QR correcto registra el payload.
- [ ] QR correcto revela y guarda el fragmento.
- [ ] El fragmento aparece en `/archive`.
- [ ] La siguiente etapa queda habilitada.
- [ ] Escanear el mismo QR dos veces no duplica registros.

## Persistencia

- [ ] Resolver acertijo y cerrar sesión conserva estado QR pendiente.
- [ ] Escanear QR y cerrar sesión conserva el fragmento.
- [ ] Iniciar sesión desde otro dispositivo restaura etapa, respuestas y QR.
- [ ] Un usuario no puede ver datos de otro usuario.

## Página final

- [ ] No se puede acceder antes de completar las 4 etapas.
- [ ] Tras el cuarto QR se habilita `/final`.
- [ ] Aparecen las instrucciones originales del diagrama.
- [ ] Los cuatro textos están disponibles en `/archive`.
- [ ] Los cuatro QR están disponibles en `/archive`.
- [ ] No existe campo para escribir el poema final.
- [ ] No existe verificación automática del mensaje.

## Calidad técnica

- [ ] `npm run lint` pasa.
- [ ] `npm run typecheck` pasa.
- [ ] `npm run test` pasa.
- [ ] `npm run build` pasa.
- [ ] No hay secretos en el bundle.
- [ ] No hay botones sin funcionalidad.
- [ ] La cámara se detiene al salir del escáner.
