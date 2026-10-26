# Despliegue: Vercel + Supabase

## 1) Base de datos y autenticación en Supabase

1. Crea un proyecto en Supabase.
2. Abre SQL Editor y crea el esquema de la app o importa el dump actual que tengas del proyecto.
3. Copia estas variables para la API/backend:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend.vercel.app
CORS_ORIGIN=https://your-frontend.vercel.app
JWT_SECRET=your_secure_jwt_secret
SUPABASE_URL=https://[PROJECT_REF].supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

> Importante: el backend Express sigue siendo un servicio Node separado. No se recomienda desplegarlo dentro de la misma app de Vercel si no se configura serverless/rewrites específicos.

## 2) Frontend en Vercel

1. En Vercel, importa la carpeta `frontend` como proyecto.
2. Usa la build command:

```bash
npm install
npm run build
```

3. Define estas variables de entorno en Vercel:

```env
VITE_SUPABASE_URL=https://[PROJECT_REF].supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=https://your-backend-domain.example.com
```

4. El archivo `frontend/vercel.json` deja el routing de React funcionando con rutas internas.

## 3) Backend / API

El backend actual sigue siendo Express + Prisma y necesita un host de Node compatible (Render, Railway, Fly.io, VPS, etc.).

Configura la variable `DATABASE_URL` apuntando a Supabase PostgreSQL y asegúrate de ejecutar:

```bash
cd backend
npx prisma generate
npx prisma db push
```

## 4) Validación rápida

- Verifica que el frontend compila: `npm run build --prefix frontend`
- Verifica que Prisma acepta el esquema: `npx prisma validate --schema backend/prisma/schema.prisma`
- Verifica que el backend puede conectarse con `DATABASE_URL` real de Supabase

## 5) Estado recomendado

- Frontend: Vercel
- Auth + DB: Supabase
- API: Node host externo
- Datos actuales: migrar desde MySQL a PostgreSQL respetando la estructura del esquema
