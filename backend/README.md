# INTEGRA+ Backend

API REST para la plataforma INTEGRA+ de cálculo integral.

## Stack
- Node.js + Express
- PostgreSQL
- Prisma ORM
- JWT + bcryptjs

## Setup rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno
cp .env.example .env.local

# 3. Editar .env.local con tus credenciales de PostgreSQL

# 4. Crear la base de datos (si no existe)
createdb integra_plus

# 5. Correr migraciones
npx prisma migrate dev --name init

# 6. Poblar con datos de prueba (opcional)
npm run seed

# 7. Iniciar servidor
npm run dev
```

El servidor corre en `http://localhost:5000`

## Endpoints principales

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | /api/auth/register | No | Registrar usuario |
| POST | /api/auth/login | No | Iniciar sesión |
| GET | /api/user/stats | Sí | Stats del estudiante |
| GET | /api/level | Sí | Listar niveles |
| GET | /api/level/progress | Sí | Progreso del usuario |
| POST | /api/level/complete | Sí | Marcar nivel completado |
| GET | /api/exercise/nivel/:id | Sí | Ejercicios por nivel |
| POST | /api/exercise/verify | Sí | Verificar respuesta |
| POST | /api/exercise | Sí (docente) | Crear ejercicio |
| PUT | /api/exercise/:id | Sí (docente) | Editar ejercicio |
| DELETE | /api/exercise/:id | Sí (docente) | Eliminar ejercicio |
| GET | /api/teacher/stats | Sí (docente) | Stats del panel docente |
| GET | /api/teacher/students-at-risk | Sí (docente) | Estudiantes en riesgo |

## Usuarios demo (después del seed)
- Estudiante: `estudiante@demo.com` / `demo123`
- Docente: `docente@demo.com` / `demo123`
