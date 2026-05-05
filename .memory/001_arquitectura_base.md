# 001 — Arquitectura Base

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite, Tailwind CSS v4, React Router v6 |
| Backend | Node.js + Express (ESModules `type: "module"`) |
| Base de datos | MySQL vía XAMPP (MariaDB 10.4) + Prisma ORM |
| Auth | JWT (jsonwebtoken) + bcryptjs — **sin Supabase** |
| Email | Nodemailer → Gmail SMTP (yoimer938@gmail.com) |
| Fórmulas matemáticas | KaTeX (react-katex) |

## Puertos

- Frontend: http://localhost:5173
- Backend:  http://localhost:5000
- phpMyAdmin: http://localhost/phpmyadmin/

El frontend tiene proxy `/api` → `http://localhost:5000` en `vite.config.js`.

## Estructura de carpetas

```
integra_plus/
├── .memory/               ← este directorio
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma  ← MySQL, 9 modelos
│   │   └── seed.js
│   ├── src/
│   │   ├── app.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── database/
│   │   └── integra_plus.sql  ← importar en phpMyAdmin
│   ├── .env                  ← DATABASE_URL, JWT_SECRET, SMTP
│   └── server.js
└── frontend/
    ├── src/
    │   ├── contexts/      ← AuthContext, ThemeContext, ProgressContext
    │   ├── screens/       ← pantallas por ruta
    │   ├── services/      ← llamadas a la API
    │   ├── data/
    │   │   └── levelConfig.js  ← contenido estático de niveles y ejercicios
    │   └── components/
    └── .env.local         ← Supabase comentado (desactivado)
```

## Comandos

```bash
# Backend
cd backend && npm run dev       # node --watch server.js

# Frontend
cd frontend && npm run dev      # vite dev server

# Seed (solo si se borra la DB)
cd backend && npm run seed
```

## Variables de entorno importantes (backend/.env)

```
DATABASE_URL="mysql://root:@localhost:3306/integra_plus"
JWT_SECRET=dev_secret_key_12345_change_in_production
SMTP_USER=yoimer938@gmail.com
SMTP_PASS=cxojljsgdzwqvzmm        ← App Password de Gmail
TEACHER_CODE=DOCENTE2024
```
