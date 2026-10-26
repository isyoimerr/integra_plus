---
name: integra-plus-functional-platform
description: Construye la primera versión funcional y completa de Integra+ como una plataforma educativa real, con autenticación segura, base de datos, contenido educativo conectado, ejercicios, progreso y UI responsive. Usa esta skill para definir el trabajo principal y para validar que no se quede en una demo visual sin flujo real.
applyTo: 
  - backend/**
  - frontend/**
  - package.json
  - README.md
  - AGENTS.md
---

# SKILL: Integra+ — Plataforma educativa funcional

## Objetivo

Crear una primera versión utilizable de la plataforma educativa Integra+, centrada en el núcleo real del aprendizaje:

- registro e inicio de sesión
- recuperación o cambio de contraseña
- gestión segura de usuarios
- módulos educativos por nivel o tema
- contenido teórico y explicaciones
- videos relacionados
- ejercicios interactivos y validación
- retroalimentación
- guardado de progreso
- resultados, avances y módulos completados
- recursos complementarios
- fuentes y enlaces reales, verificables
- diseño responsive para móvil, tablet y desktop
- carga, errores y mensajes claros

Esta skill no acepta una maqueta visual ni contenido aislado. Todo debe estar conectado con la lógica real del proyecto y con la base de datos.

## Principios de trabajo

1. Priorizar funcionalidad sobre apariencia.
2. Resolver primero backend, autenticación y datos reales.
3. Conectar cada módulo con contenido, video, ejercicio, recursos y progreso.
4. Evitar contenido estático sin relación entre sí.
5. Usar fuentes reales y verificables; nunca inventar enlaces, libros ni recursos.
6. Mantener una arquitectura preparada para crecer sin reescribirlo todo.
7. Validar cada flujo con evidencia real: login, registro, acceso a módulos, ejercicio, guardado y progreso.
8. Diseñar pensando en móvil primero y luego mejorar desktop.

## Requisito mínimo aceptable

La plataforma debe poder ser usada por una persona real desde el inicio hasta el final:

1. Crear cuenta.
2. Iniciar sesión.
3. Seleccionar un módulo.
4. Leer introducción, objetivos, teoría y ejemplos.
5. Ver video asociado.
6. Resolver ejercicios interactivos.
7. Recibir retroalimentación.
8. Guardar progreso.
9. Ver avances y módulos completados.

Si cualquiera de estos pasos no funciona con datos reales, la entrega no es suficiente.

## Flujo de trabajo recomendado

### 1) Diagnóstico inicial del repositorio

Antes de cambiar código, revisar:

- AGENTS.md para conocer arquitectura y gotchas del proyecto.
- package.json principal y de backend/frontend.
- backend/package.json y estructura de Prisma.
- backend/src para rutas, servicios, controladores y middleware.
- frontend/src para pantallas, contextos, servicios y data.
- configuración de base de datos y variables de entorno.

Objetivo: identificar si la base actual ya está preparada o si necesita reforzarse.

### 2) Reforzar la arquitectura base

- Confirmar que el backend está en ESModules.
- Verificar que MySQL/MariaDB es la base de datos del proyecto.
- Reforzar Prisma y modelos reales para usuarios, módulos, contenidos, videos, ejercicios, progreso y resultados.
- Asegurar que las tablas estén conectadas entre sí con relaciones claras.
- Preparar endpoints REST con validación y manejo de errores.

Si hay data estática o mockeada, reemplazarla por datos persistidos en DB.

### 3) Implementar autenticación segura

- Registro con validación de datos.
- Login con JWT o mecanismo equivalente.
- Recuperación y cambio de contraseña.
- Manejo seguro de errores y permisos.
- Middleware de autenticación para rutas protegidas.
- Control de roles o acceso por usuario cuando aplique.

Si la autenticación es débil o no está conectada a la DB, corregirla antes de seguir con contenido.

### 4) Diseñar la estructura educativa real

Cada módulo debe tener una estructura funcional clara, por ejemplo:

1. Introducción al tema
2. Objetivos de aprendizaje
3. Explicación teórica
4. Video relacionado
5. Ejemplos resueltos
6. Ejercicios interactivos
7. Retroalimentación
8. Actividad o evaluación
9. Recursos complementarios
10. Fuentes consultadas

Cada módulo debe estar conectando:

- usuario
- contenido educativo
- video
- ejercicios
- recursos
- progreso
- resultados

No vale dejar videos o ejercicios como elementos aislados sin relación con un tema.

### 5) Conectar backend con frontend

- Crear servicios para autenticación, módulos, videos, ejercicios y progreso.
- Diseñar pantallas para login, registro, dashboard, módulo, video, ejercicio y progreso.
- Mostrar estados de carga, errores y mensajes claros.
- Asegurar que los datos vengan del backend y no solo de archivos locales.

### 6) Validar ejercicios, feedback y progreso

- Cada ejercicio debe verificar la respuesta real.
- La retroalimentación debe ser clara y específica.
- El progreso debe guardarse por usuario y módulo.
- El sistema debe reflejar avance, completitud y resultados.

Si un ejercicio o un módulo no guarda progreso o no confirma completion, no es funcional.

### 7) Mejorar UX y diseño responsive

- Adaptar pantallas a celulares, tablets y desktop.
- Reducir densidad visual en móvil.
- Mejorar legibilidad, espaciado y jerarquía visual.
- Mantener accesibilidad básica: contraste, tamaño de texto, botones claros, navegación simple.

### 8) Calidad de contenido académico

- Incluir recursos educativos reales y confiables.
- Añadir bibliografía de libros, universidades, documentos académicos, documentación oficial y videos de fuentes verificadas.
- No usar enlaces inventados ni contenido que no pueda justificarse.
- Relacionar cada fuente con el tema abordado.

### 9) Pruebas funcionales reales

Validar al menos:

- registro correcto
- login correcto e incorrecto
- acceso a módulos autenticados
- carga de contenido por módulo
- reproducción de videos
- validación de ejercicios
- guardado de progreso
- visualización de avances
- comportamiento en móvil y desktop

## Árbol de decisiones para este proyecto

### Si el problema es estructural

- Priorizar backend, modelos y relaciones.
- Reorganizar rutinas y servicios antes de forzar cambios en UI.

### Si el problema es de datos

- Mover contenido estático a persistencia real.
- Crear/ajustar seed y datos iniciales mínimos funcionales.

### Si el problema es de autentificación

- Corregir flujo JWT, middleware y manejo de errores antes de continuar con módulos.

### Si el problema es de contenido educativo

- Verificar que cada módulo incluya teoría, video, ejercicios y recursos reales.
- Conectar todos los componentes del mismo tema.

### Si el problema es visual o responsive

- Mejorar mobile-first, compactar UI y mantener claridad.
- No ocultar funcionalidad detrás de diseño bonito.

### Si faltan fuentes o referencias

- Reemplazar por fuentes verificadas de universidades, bibliografía académica u organismos educativos.
- No agregar bibliografía inventada.

## Criterios de calidad

La tarea solo está completa si se cumplen estas condiciones:

- El backend funciona con base de datos real.
- El flujo de registro/login funciona con usuarios reales.
- Los módulos están conectados con contenido, video, ejercicios y recursos.
- El progreso se guarda y se muestra correctamente.
- La plataforma es usable en móvil, tablet y desktop.
- Los mensajes de carga, error y éxito son claros.
- Las referencias son reales y verificables.
- La arquitectura queda lista para crecer sin reescritura masiva.

## Checklist de entrega

- [ ] Backend reforzado y estructurado
- [ ] DB configurada y conectada
- [ ] Autenticación segura funcionando
- [ ] Endpoints verificados
- [ ] Módulos con contenido completo
- [ ] Videos integrados
- [ ] Ejercicios activos y validados
- [ ] Progreso persistente
- [ ] UI responsive funcionando
- [ ] Fuentes verificadas
- [ ] Pruebas funcionales realizadas

## Prompt de trabajo sugerido

Usa esta instrucción para continuar con el proyecto:

> Construye la primera versión funcional y completa de Integra+ como una plataforma educativa real. Revisa la arquitectura actual, reforza backend, base de datos y autenticación, conecta usuarios con módulos, contenidos, videos, ejercicios y progreso, y asegura un frontend responsive con flujos reales desde registro hasta avance estudiantil. No aceptes contenido estático ni referencias inventadas. Prioriza una versión usable sobre una maqueta visual. Verifica cada flujo con evidencia real y deja la estructura preparada para crecer.

## Resultado esperado

Una versión inicial operativa de Integra+ que permita a un usuario real registrarse, autenticarse, estudiar módulos, ver videos, resolver ejercicios, recibir feedback y guardar su progreso de manera consistente.
