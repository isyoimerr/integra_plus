# 006 — Estado Actual y TODOs

- Fecha / hora de la nota: 2026-05-04 00:15:40 -05
- Archivos clave modificados recientemente:
  - `frontend/src/screens/OnboardingWizard.jsx` — modificado 2026-05-04 00:12:40 -05
  - `frontend/src/components/layout/PhoneShell.jsx` — modificado 2026-05-04 00:12:32 -05
  - `.memory/004_estado_actual.md` — modificado 2026-05-03 16:48:04 -05

## Estado actual general

1. El onboarding se rediseñó con un panel central oscuro/verde y animaciones de fórmulas matemáticas en el fondo.
2. Se agregó texto motivador de matemáticos en el onboarding, con 10 frases distintas seleccionadas aleatoriamente.
3. Se eliminó el icono/luna superior inútil en `/onboarding` ocultando el `ThemeToggle` en `PhoneShell` para esa ruta.
4. El tema personalizado funciona con selección de color e impacto inmediato.
5. Las pruebas de frontend se realizaron con `npx vite build` y el build de Vite pasó correctamente.

## TODO actual

- [ ] Revisar que el onboarding no muestre ningún toggle de tema o icono residual en ninguna pantalla del wizard.
- [ ] Validar visualmente el fondo de fórmulas en múltiples tamaños de pantalla para asegurarse de que no interfiera con el contenido.
- [ ] Revisar si `ThemeToggle` debe estar oculto también en otras rutas similares de entrada/registro.
- [ ] Actualizar `.memory/004_estado_actual.md` con los cambios recientes de onboarding y diseño.
- [ ] Confirmar si la lista de frases debe rotar en cada carga o solo en cada sesión de onboarding.
- [ ] Definir si el onboarding debe soportar más pasos o evitar datos estáticos adicionales.

## Nota para otras IAs

- Este proyecto no está en un repositorio Git en el workspace actual.
- La carpeta de memorias del proyecto es `.memory/` y ya contiene notas numeradas sobre arquitectura, base de datos, autenticación y estado.
- Cuando se guarden memorias, la preferencia es usar `.memory/` con notas claras y timestamp.
- Esta nota debe ayudar a cualquier IA a entender el estado "TODO" actual del onboarding y el estilo visual del proyecto.
