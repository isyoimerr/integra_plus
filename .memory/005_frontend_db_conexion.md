# 005 — Frontend conectado a la DB

_Sesión: 2026-05-03_

## Qué se hizo

Se conectó todo el frontend a MySQL. Antes los datos eran hardcodeados o estáticos.

---

## Cambios clave

### ProgressContext (`contexts/ProgressContext.jsx`)
- Agrega `levels` y `progress` cargados desde la API con `fetchAll()`
- `completeLevel(levelKey, errores)` → usa `toDbId(levelKey)` = `levelKey + 1` para el DB nivelId
- Helpers exportados: `getProgreso(key)`, `isUnlocked(key)`, `getStars(key)`
- `currentExercises` / `setCurrentExercises` para pasar ejercicios de fase-b a result screens
- **Exporta `toDbId`** para uso externo

### LevelFaseBScreen (`screens/level/LevelFaseBScreen.jsx`)
- Carga ejercicios desde `GET /api/exercise/nivel/:nivelId` al montar
- Usa `toDbId(selectedLevel)` para el nivelId real de la DB
- **Fix crítico**: manda el string real de la opción al verify (`"11/12"`) NO la letra (`"B"`)
- Guarda en `lastWrong`: `{ hint, explain, formula, opciones, selectedAnswer, respuestaCorrecta }`
- Fallback a `LEVEL_CONFIG` si la API falla

### ResultWrongScreen
- Ya no usa `LEVEL_CONFIG` para los datos del ejercicio
- Lee todo desde `lastWrong` (viene de LevelFaseBScreen)
- Muestra `respuestaCorrecta` como string real (viene del backend)

### ResultCorrectScreen
- Usa `currentExercises.length` para saber si es el último ejercicio
- XP y explicación desde el ejercicio real de la DB

### LevelCompleteScreen
- XP calculado sumando `xpRecompensa` de `currentExercises`
- `completeLevel(selectedLevel, 3 - stars)` — el context hace la conversión a DB nivelId internamente

### LevelMapScreen
- Nodos generados desde `levels` (DB), no hardcodeados
- Estado real: `done` / `active` / `locked` según progreso en DB
- Estrellas reales desde progreso
- Conectores de color dinámicos

### DashboardScreen
- Cursos generados desde `levels` (DB)
- Muestra "🔒 Bloqueado" si el prerequisito no está completado
- Stats (puntos, racha, nivel) desde MySQL vía `userService.getStats()`

---

## Mapeo LEVEL_CONFIG ↔ DB

| LEVEL_CONFIG key | DB nivelId | Nombre |
|-----------------|-----------|--------|
| 0 | 1 | Nivel 0 · Repaso de Bases |
| 1 | 2 | Nivel 1 · Integral Indefinida |
| 2 | 3 | Nivel 2 · Integral Definida |

**Regla:** `DB nivelId = LEVEL_CONFIG key + 1` — implementado en `toDbId(key)` de ProgressContext.

---

## Qué sigue siendo estático (LEVEL_CONFIG)

`LEVEL_CONFIG` sigue siendo la fuente de:
- Colores (`color`, `colorDark`, `headerBg`)
- Mensajes de SIGMA (`sigmaEntry`, `sigmaCorrect`, `sigmaWrong1`, `sigmaComplete`)
- Contenido de teoría — Fase A (`faseA.headline`, `faseA.desc`, `faseA.concepts`)

Los ejercicios para Fase B ahora vienen de la DB.

---

## Bugs corregidos en esta sesión

| Bug | Descripción | Fix |
|-----|-------------|-----|
| verify siempre fallaba | Frontend mandaba letra `'B'` pero backend compara con `'x⁶/6 + C'` | Ahora manda el string real de la opción |
| completeLevel wrong nivelId | `completeLevel(1)` completaba Nivel 0 en DB | `toDbId()` convierte key → DB id |
| Map/Dashboard hardcodeados | No reflejaban progreso real | Usan `levels` y `progress` de la API |
