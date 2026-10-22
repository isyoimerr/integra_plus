# Informe de Mejoras y Pruebas — Backend INTEGRA+

## 1. Cambios Realizados

### Infraestructura de Testing
- **Archivos creados:**
  - `tests/helpers/db.js` — Helpers de base de datos: conexión, limpieza, seed de datos de prueba
  - `tests/level.service.test.js` — Suite completa de tests para `levelService`
  - `.env.test` — Configuración para base de datos de pruebas (`integra_plus_test`)
- **`package.json`:** Se agregó script `"test": "node --test tests/level.service.test.js"`
- **Base de datos:** Se creó `integra_plus_test` con el mismo schema que la DB principal

### Tests Implementados (13 tests, todos pasan)

| Suite | Test | Descripción |
|-------|------|-------------|
| **getAll** | niveles ordenados | Verifica orden por módulo e ID ascendente |
| | deduplicación por módulo | Solo retorna el primer nivel de cada módulo |
| | mapeo de campos | Valores no nulos y tipos correctos |
| **getProgress** | null/undefined | Retorna `[]` sin errores |
| | sin progreso | Retorna `[]` para estudiante sin progreso |
| | con progreso | Retorna progreso con datos del nivel anidado |
| **complete** | estudianteId nulo | Lanza error `'Sin identificador de estudiante'` |
| | nivel inexistente | Lanza error `'Nivel no encontrado'` |
| | prerequisito bloqueado | Lanza error si el nivel anterior no está completado |
| | flujo completo | Crea progreso, otorga XP, retorna stars correctas |
| | 3 estrellas (0 errores) | Star rating correcto para perfecto |
| | 1 estrella (3+ errores) | Star rating correcto para muchos errores |
| | upsert sin duplicados | Actualiza progreso existente en lugar de crear duplicado |

## 2. Problemas Encontrados y Corregidos

### 2.1 Aislamiento de Tests (corregido)
- **Problema:** Los tests compartían el mismo registro de estudiante, y `complete()` acumulaba `estPuntaje` sin reiniciarlo entre tests, causando aserciones incorrectas.
- **Solución:** Se agregó `beforeEach` que resetea `estPuntaje` a 0 y limpia `progreso` antes de cada test en la suite `complete`.

### 2.2 Valores Esperados Incorrectos (corregido)
- **Problema:** Los valores esperados de XP no coincidían con el cálculo real. Nivel 1 tiene 2 ejercicios × 10 XP = 20 XP total (no 40). Nivel 2 tiene 1 ejercicio × 15 XP = 15 XP total.
- **Solución:** Se corrigieron las aserciones para reflejar los valores reales.

### 2.3 Dependencia de Import Dinámico
- **Problema:** Los servicios crean `new PrismaClient()` directamente sin DI, dificultando el testeo.
- **Solución:** Se usó `process.env.DATABASE_URL` + import dinámico para apuntar a la BD de test. No se modificó el código fuente.

## 3. Mejoras Sugeridas para Escalabilidad y Mantenimiento

### 3.1 Inyección de Dependencias (Prioridad: Media)
**Problema:** Cada servicio crea su propio `new PrismaClient()`. Esto impide mockear la BD en tests y dificulta el control de conexiones.

**Sugerencia:** Migrar a un patrón donde PrismaClient se inyecte:
```js
// prisma.js (singleton centralizado)
export const prisma = new PrismaClient();

// level.service.js
import { prisma } from '../utils/prisma.js';
```

### 3.2 Centralización del Test DB
**Problema:** Cada test suite requiere su propio setup de BD (`cleanDatabase`, `seedBaseData`).
**Sugerencia:** Crear un archivo `tests/setup.js` global con hooks `before`/`after` compartidos entre todas las suites de tests.

### 3.3 Factory de Datos de Prueba (Prioridad: Baja)
**Sugerencia:** Implementar factories reutilizables para crear estudiantes, niveles, ejercicios con valores por defecto sensibles, reduciendo código boilerplate en los tests.

### 3.4 Separación Test/Prod DB Automática
**Problema:** Actualmente se usa `.env.test` manual. Un error podría lanzar tests contra producción.
**Sugerencia:** En `test` script, forzar `NODE_ENV=test` y validar que `process.env.DATABASE_URL` contenga `_test` o no sea la misma URL de producción.

## 4. Tests Adicionales Recomendados

### Backend
| Servicio | Tests sugeridos |
|----------|----------------|
| **exerciseService** | `getById` (existente, inexistente), `getByNivel` (vacio, con datos), `verify` (correcto, incorrecto, XP en estudiante), `create`/`update`/`delete` (CRUD completo, validaciones) |
| **authService** | Registro (éxito, email duplicado), login (credenciales válidas, inválidas, cuenta bloqueada), OTP (generar, verificar, expirar) |
| **userService** | Perfil (obtener, actualizar), cambio de contraseña, actualización de tema |
| **teacherService** | Listar estudiantes, asignar nivel, obtener progreso grupal, estadísticas |

### Frontend
- Tests unitarios para helpers (`smartConvert`, mapeo JSON a nivel)
- Tests de componentes críticos (ExerciseEditor, ProgressModule, Scoreboard)
- Tests de integración del flujo de ejercicios (seleccionar opción → verificar → ver resultado)

## 5. Riesgos Técnicos y Deuda Técnica Detectada

| Riesgo | Impacto | Prioridad |
|--------|---------|-----------|
| **Sin DI para PrismaClient** | Testabilidad limitada, acoplamiento fuerte a BD real | Alta |
| **Sin transacciones en `complete()`** | Si falla entre upsert y update, el XP del estudiante puede quedar inconsistente | Alta |
| **`ejOpciones` como JSON string** | Riesgo de corrupción de datos si no se parsea correctamente; `JSON.parse('[]')` no valida | Media |
| **Sin índice en `ejNivId`** | Consultas `getByNivel` pueden volverse lentas con muchos ejercicios | Media |
| **Sin validación de permisos en services** | Un estudiante podría llamar `complete()` de otro si el ID se filtra (no hay guards) | Alta |
| **Hardcodeo de columnas en `mapNivel`/`mapProgreso`** | Si el schema cambia, hay que actualizar mappers manualmente | Baja |
| **`errores` no se persiste correctamente** | El parámetro `errores` en `complete()` se pasa desde el frontend; un frontend malicioso podría reportar 0 errores siempre | Media |

## 6. Resumen de Archivos Creados/Modificados

| Archivo | Acción |
|---------|--------|
| `backend/.env.test` | Creado |
| `backend/tests/helpers/db.js` | Creado |
| `backend/tests/level.service.test.js` | Creado |
| `backend/tests/REPORTE.md` | Creado |
| `backend/package.json` | Modificado (script `test` añadido) |
| Base de datos `integra_plus_test` | Creada |

### Ejecución de Tests
```bash
cd backend && npm test
```
Resultado: 13/13 tests pasan en ~765ms.
