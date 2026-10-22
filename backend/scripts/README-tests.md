Test de flujo de niveles (backend)

Este script `test_level_flow.mjs` crea datos temporales en la base de datos para verificar:
- creación de estudiante de prueba
- creación de dos niveles (A sin prerequisito, B con prerequisito = A)
- completar nivel A usando `levelService.complete`
- verificar progreso y relaciones

Requisitos:
- Tener la base de datos configurada y accesible desde `DATABASE_URL` en el root del backend (.env)
- Tener las dependencias instaladas (`npm install` en `backend`)
- Ejecutar desde la carpeta `backend` con Node 18+ (ESModules)

Comandos:

```bash
cd backend
npm install
DATABASE_URL="mysql://root:@localhost:3306/integra_plus" node scripts/test_level_flow.mjs
```

También puedes ejecutar el test automatizado de level service:

```bash
cd backend
npm run test:level
```

Y para detectar/limpiar posibles niveles duplicados en la base de datos:

```bash
cd backend
npm run install # si no has instalado dependencias
DATABASE_URL="mysql://root:@localhost:3306/integra_plus" node scripts/cleanup_duplicate_levels.mjs
```

Si quieres que el script elimine duplicados automáticamente, agrega `--apply`:

```bash
DATABASE_URL="mysql://root:@localhost:3306/integra_plus" node scripts/cleanup_duplicate_levels.mjs --apply
```

Notas:
- El script de limpieza sólo elimina registros sin dependencias directas en `ejercicios`, `progreso`, `estado_sigma` o `niv_prerequisito`.
- Si no desea que borre nada, ejecútalo sin `--apply` para ver primero el reporte.
- Si su BD tiene restricciones o datos con foreign keys que impiden eliminar, haga backup antes de ejecutar.
