# 004 — Estado Actual del Proyecto

_Última actualización: 2026-05-17_

## ✅ Funciona y está testeado

- Login y registro con OTP por email (Gmail SMTP)
- JWT con `userId`, `rol`, `estudianteId`
- CRUD de niveles (`GET /api/level`)
- Ejercicios por nivel (`GET /api/exercise/nivel/:id`)
- Verificar respuesta (`POST /api/exercise/verify`) — guarda en `resultados`, suma XP al estudiante, actualiza errores consecutivos de SIGMA
- Completar nivel (`POST /api/level/complete`) — guarda en `progreso`, suma puntos
- Progreso del estudiante (`GET /api/level/progress`)
- Stats del usuario (`GET /api/user/stats`) — puntos y racha desde tabla `estudiantes`
- Endpoints docente: `/api/teacher/stats`, `/api/teacher/students`, `/api/teacher/students-at-risk`
- Cambio de tema (`PATCH /api/user/tema`) — persiste en DB automáticamente desde el frontend
- Perfil de usuario editable: nombre y foto (`PUT /api/user/profile`)
- Estado SIGMA dinámico: `GET /api/user/sigma`, `PUT /api/user/sigma`
- Frontend build sin errores
- Fórmulas LaTeX con KaTeX en pantallas de ejercicios
- Tema light/dark/custom en todas las pantallas
- Login redirige según rol (estudiante → dashboard, docente → teacher panel)

## 🎮 Frontend — pantallas implementadas

| Ruta | Pantalla |
|------|---------|
| `/login` | LoginScreen |
| `/select-role` | SelectRoleScreen |
| `/register` | RegisterScreen |
| `/verify-email` | VerifyEmailScreen |
| `/onboarding` | OnboardingScreen |
| `/dashboard` | DashboardScreen |
| `/levels` | LevelMapScreen |
| `/level/fase-a` | LevelFaseAScreen (teoría) |
| `/level/fase-b` | LevelFaseBScreen (ejercicios) |
| `/level/result-correct` | ResultCorrectScreen |
| `/level/result-wrong` | ResultWrongScreen |
| `/level/complete` | LevelCompleteScreen |

## 📋 Datos estáticos vs API

Los ejercicios en el frontend usan **datos estáticos** de `levelConfig.js` (no llaman al API para obtenerlos).
Cada ejercicio tiene `dbId` (1–14) para poder llamar a `/api/exercise/verify` y guardar en MySQL.
Los niveles y progreso sí se consultan al API.

## ✅ Completado (2026-05-17)

- [x] Perfil del usuario — editar nombre y foto (base64) via `PUT /api/user/profile`
- [x] Pantalla de docente — students desde API real, botón "Crear ejercicio", navegación completa
- [x] Racha de días — lógica de actualización diaria en login y GET /stats
- [x] Desbloqueo real de niveles basado en progreso (prerequisito en DB + `isUnlocked` dinámico)
- [x] Modo oscuro persiste en `usu_tema` en DB automáticamente al cambiar tema
- [x] Estado SIGMA dinámico — endpoints API + actualización automática en verify
- [x] Registro de docente — flujo completo con código docente (`TEACHER_CODE` env var)

## 🔑 Decisiones de diseño importantes

- **Sin Supabase**: todo el auth es backend propio
- **Schema con prefijos**: las columnas MySQL tienen prefijos (`usu_`, `est_`, etc.) por el modelo relacional del PDF académico. Los servicios backend mapean a nombres limpios para la API.
- **Ejercicios estáticos**: la pantalla `LevelFaseBScreen` usa `LEVEL_CONFIG` (archivo local), no llama al API para cargar ejercicios. Solo llama al API para verificar y guardar resultados.
- **`estudianteId` en JWT**: los docentes tienen `estudianteId: null` en el token.
- **Desbloqueo por prerequisito**: se usa `nivPrerequisito` en DB en lugar de `nivDesbloqueado` manual; el frontend calcula `isUnlocked` basado en progreso real.
- **Racha en login y stats**: la función `updateEstudianteStreak` está duplicada en `auth.service.js` y `user.service.js` para cubrir ambos puntos de entrada.
- **SIGMA errores consecutivos**: se actualiza automáticamente en `exercise.service.js` al verificar respuestas (resetea a 0 en acierto, incrementa en fallo).
- **Tema persistente**: `ThemeContext.changeTheme` llama a `PATCH /api/user/tema` automáticamente; al cargar el usuario se restaura su tema desde `user.tema`.
