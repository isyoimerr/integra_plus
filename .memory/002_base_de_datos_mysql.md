# 002 — Base de Datos MySQL

## Contexto

El proyecto migró de PostgreSQL + Supabase a **MySQL local (XAMPP)**.
El archivo SQL está en `backend/database/integra_plus.sql` — se importa en phpMyAdmin.

## Las 9 tablas (modelo relacional del PDF)

```
usuarios          → tabla padre (usu_id, usu_correo, usu_contrasena, usu_rol, usu_tema)
  ├── estudiantes → hereda de usuarios (est_id, est_usu_id, est_puntaje, est_racha_dias)
  └── docentes    → hereda de usuarios (doc_id, doc_usu_id, doc_codigo)

doc_estudiante    → relación docente ↔ estudiante (M:N)
niveles           → (niv_id, niv_nombre, niv_modulo, niv_prerequisito, niv_desbloqueado)
ejercicios        → (ej_id, ej_niv_id, ej_formula, ej_opciones JSON, ej_respuesta)
progreso          → estudiante × nivel (pro_est_id, pro_niv_id, pro_porcentaje, pro_completado)
resultados        → respuesta por ejercicio (res_est_id, res_ej_id, res_correcto)
estado_sigma      → estado del asistente IA por estudiante
```

## Prisma schema

Provider: `mysql`. Los modelos usan `@map` para los nombres con prefijos (`usu_`, `est_`, etc.).
Los Prisma model names son en PascalCase: `Usuario`, `Estudiante`, `Docente`, `Nivel`, `Ejercicio`, `Progreso`, `Resultado`, `EstadoSigma`, `DocEstudiante`.

## Normalización de respuestas API

Los servicios del backend mapean los nombres Prisma a nombres limpios para la API:
- `nivId` → `id`, `nivNombre` → `nombre`, etc.
- `ejId` → `id`, `ejEnunciado` → `enunciado`, etc.
- `proEstId` → `estudianteId`, `proPorcentaje` → `porcentaje`, etc.

## Datos demo

| Email | Contraseña | Rol |
|-------|-----------|-----|
| estudiante@demo.com | password | estudiante |
| docente@demo.com   | password | docente    |

- 3 niveles seed: Nivel 0 (bases), Nivel 1 (integral indefinida), Nivel 2 (integral definida)
- 14 ejercicios con fórmulas LaTeX (6 + 4 + 4)

## Cómo resetear la DB

1. Borrar todo en phpMyAdmin → `integra_plus`
2. Reimportar `backend/database/integra_plus.sql`
3. Correr `cd backend && npm run seed` (opcional, el SQL ya tiene seed)
