# INTEGRA+ | Plataforma de Cálculo Integral

> **Plataforma educativa interactiva para aprender cálculo integral de forma gamificada**

## 🎯 Descripción

INTEGRA+ es una plataforma web de educación en línea diseñada para enseñar cálculo integral de manera interactiva y divertida. Combina ejercicios progresivos, visualización de fórmulas LaTeX, y un sistema de progresión basado en experiencia (XP).

## 🛠️ Stack Tecnológico

- **Backend**: Node.js + Express + Prisma ORM (MySQL)
- **Frontend**: React 18 + Vite + Tailwind CSS v4
- **Autenticación**: JWT + OTP por correo (SMTP)
- **Fórmulas**: KaTeX (LaTeX rendering)
- **Base de datos**: MySQL 8.0+ (XAMPP/MariaDB)

## 📦 Estructura del Proyecto

```
integra_plus/
├── backend/           # API REST
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   └── middleware/
│   ├── prisma/
│   └── database/
├── frontend/          # React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── hooks/
│   │   └── services/
│   └── public/
└── package.json       # Root (concurrently)
```

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+
- MySQL 8.0+
- npm

### Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/yoimer777/integra_plus.git
cd integra_plus

# 2. Instalar dependencias (root, backend y frontend)
npm install

# 3. Configurar base de datos
# - Importar: backend/database/integra_plus.sql en phpMyAdmin
# - Configurar backend/.env con credenciales MySQL

# 4. Iniciar frontend y backend en paralelo
npm run dev
```

**URLs**:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📖 Documentación

- **[CONTRIBUTING.md](CONTRIBUTING.md)** → Guía para colaboradores
- **[SETUP.md](SETUP.md)** → Configuración detallada
- **[AGENTS.md](AGENTS.md)** → Notas técnicas del proyecto

## 🤝 Contribuir

1. Crea una rama: `git checkout -b feature/tu-feature`
2. Haz commit: `git commit -m "feat: descripción clara"`
3. Push: `git push origin feature/tu-feature`
4. Abre un Pull Request en GitHub

Consulta [CONTRIBUTING.md](CONTRIBUTING.md) para más detalles.

## 📝 Scripts Disponibles

```bash
npm run dev              # Ejecutar backend y frontend
cd backend && npm run dev    # Solo backend
cd frontend && npm run dev   # Solo frontend
npm run seed            # Cargar datos iniciales (DB)
npm run studio          # Abrir Prisma Studio
```

## 👥 Equipo

- **Desarrollador Principal**: Yoimer Ospino

## 📄 Licencia

Privado (Propósito Educativo)
