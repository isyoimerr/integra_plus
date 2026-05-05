# 004 — Estado Actual del Proyecto

_Última actualización: 2026-05-03_

## ✅ Funciona y está testeado

- Login y registro con OTP por email (Gmail SMTP)
- JWT con `userId`, `rol`, `estudianteId`
- CRUD de niveles (`GET /api/level`)
- Ejercicios por nivel (`GET /api/exercise/nivel/:id`)
- Verificar respuesta (`POST /api/exercise/verify`) — guarda en `resultados`, suma XP al estudiante
- Completar nivel (`POST /api/level/complete`) — guarda en `progreso`, suma puntos
- Progreso del estudiante (`GET /api/level/progress`)
- Stats del usuario (`GET /api/user/stats`) — puntos y racha desde tabla `estudiantes`
- Endpoints docente (`/api/teacher/stats`, `/api/teacher/students-at-risk`)
- Cambio de tema (`PATCH /api/user/tema`)
- Frontend build sin errores
- Fórmulas LaTeX con KaTeX en pantallas de ejercicios
- Tema light/dark en todas las pantallas

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

## ⚠️ Pendiente / Por hacer

- [ ] Perfil del usuario (cambiar nombre, foto)
- [ ] Pantalla de docente (ver estudiantes, crear ejercicios)
- [ ] Racha de días (`est_racha_dias`) — lógica de actualización diaria no implementada
- [ ] Desbloqueo real de niveles basado en progreso (ahora el mapa es estático)
- [ ] Modo oscuro persiste en `usu_tema` en DB (el endpoint existe pero no se llama automáticamente al cambiar)
- [ ] Estado SIGMA dinámico (la tabla `estado_sigma` existe pero no hay lógica de actualización)
- [ ] Registro de docente en pantalla (la pantalla existe pero no hay flujo completo para crear ejercicios)

## 🔑 Decisiones de diseño importantes

- **Sin Supabase**: todo el auth es backend propio
- **Schema con prefijos**: las columnas MySQL tienen prefijos (`usu_`, `est_`, etc.) por el modelo relacional del PDF académico. Los servicios backend mapean a nombres limpios para la API.
- **Ejercicios estáticos**: la pantalla `LevelFaseBScreen` usa `LEVEL_CONFIG` (archivo local), no llama al API para cargar ejercicios. Solo llama al API para verificar y guardar resultados.
- **`estudianteId` en JWT**: los docentes tienen `estudianteId: null` en el token.
