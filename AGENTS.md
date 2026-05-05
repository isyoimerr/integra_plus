# AGENTS.md — INTEGRA+ (Plataforma de Cálculo Integral)

## Comandos clave
- **Root**: `npm run dev` ejecuta backend (API) y frontend (WEB) en paralelo con `concurrently`.
- Backend: `cd backend && npm run dev` (node --watch, puerto 5000)
- Frontend: `cd frontend && npm run dev` (Vite, puerto 5173, proxy `/api` → `localhost:5000`)
- Backend (auxiliares): `npm run seed` (carga datos iniciales), `npm run studio` (Prisma Studio)

## Gotchas (no obvios)
- **Backend es ESModules**: `package.json` tiene `"type": "module"`, usa `import/export` en lugar de `require`.
- **Base de datos MySQL (XAMPP/MariaDB)**: `backend/.env.example` está desactualizado (menciona PostgreSQL). Usa `DATABASE_URL="mysql://root:@localhost:3306/integra_plus"`.
- **Configuración inicial de DB**: Importar `backend/database/integra_plus.sql` en phpMyAdmin, no usar `prisma migrate` (aunque el script existe).
- **Ejercicios en frontend son estáticos**: Están en `frontend/src/data/levelConfig.js`; solo se consulta la API para verificar respuestas (`/api/exercise/verify`) y progreso.
- **Auth propia**: JWT + OTP por Gmail SMTP, **sin Supabase** (dependencia `@supabase/supabase-js` está presente pero desactivada).
- No hay scripts de test definidos en `package.json` (ni backend ni frontend).

## Arquitectura breve
- **Backend**: Express + Prisma ORM (9 modelos MySQL, columnas con prefijos `usu_`/`est_`/`doc_`; los servicios mapean a nombres limpios para la API).
- **Frontend**: React 18 + Vite + Tailwind CSS v4 + React Router v6 + KaTeX (fórmulas LaTeX).
- Estructura: `backend/` y `frontend/` son carpetas independientes, root coordina con `concurrently`.
