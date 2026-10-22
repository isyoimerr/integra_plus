# INTEGRA+

<div align="center">
  <img src="docs/logo.svg" alt="INTEGRA+ logo" width="680" />
</div>

> Plataforma educativa para aprender cálculo integral con enfoque gamificado, visualización matemática y recorrido progresivo por niveles.

[![Status](https://img.shields.io/badge/status-public%20preview-orange)](https://github.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8%2B-4479A1)](https://www.mysql.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)](https://www.prisma.io/)

## Visión general

INTEGRA+ es una plataforma educativa enfocada en hacer el aprendizaje de cálculo integral más accesible, visual y motivante. La idea es combinar contenido académico con experiencia de juego, progresión por niveles, feedback inmediato y un diseño pensado para estudiantes y docentes.

### Lo que hace la plataforma

- rutas de aprendizaje por módulos y niveles
- ejercicios interactivos con soporte matemático en LaTeX
- XP, progreso y lógica de desbloqueo por competencias
- autenticación y gestión de usuarios
- panel de estudio para estudiantes y seguimiento para docentes
- diseño adaptable para escritorio y móvil

## Estado del proyecto

Este repositorio se encuentra en una etapa de vista previa pública para mostrar la dirección del producto, su estructura y su propuesta de valor.

### Aviso importante

Este proyecto no se presenta como software open source libre para clonar, ramificar, redistribuir o reutilizar sin autorización expresa del propietario.

La intención de esta vista previa es:

- mostrar avance del producto
- facilitar revisión interna y feedback
- apoyar la búsqueda de personas interesadas en colaborar o invertir en el proyecto
- preparar una futura versión pública o desplegada con aprobación previa

Antes de cualquier despliegue, migración a web, apertura pública total o uso externo, se requerirá permiso explícito del propietario del proyecto.

## Stack tecnológico

- Frontend: React 18 + Vite + Tailwind CSS
- Backend: Node.js + Express
- Base de datos: MySQL
- ORM: Prisma
- Renderizado matemático: KaTeX
- Autenticación: JWT + OTP por correo

## Estructura del repositorio

```text
integra_plus/
├── backend/              # API REST y lógica de negocio
│   ├── prisma/           # esquema Prisma y migraciones
│   ├── src/              # controllers, routes, services, middleware
│   ├── tests/            # pruebas de backend
│   ├── database/         # scripts y recursos DB
│   └── .env              # variables locales
├── frontend/             # aplicación React
│   ├── src/              # vistas, componentes, hooks, servicios
│   ├── public/           # recursos públicos
│   └── vite.config.js    # configuración Vite
├── docs/                 # recursos de branding y preview visual
│   ├── logo.svg
│   ├── preview-dashboard.svg
│   └── ...
├── README.md             # documentación principal
├── QUICKSTART.md         # guía rápida
├── SETUP.md              # instalación detallada
├── CONTRIBUTING.md       # guía de colaboración
├── AGENTS.md             # notas internas del proyecto
├── start.sh              # arranque rápido del entorno
├── package.json          # scripts globales
├── .gitignore
└── ...
```

## Vista previa visual

<div align="center">
  <img src="docs/preview-dashboard.svg" alt="Vista previa del dashboard de INTEGRA+" width="980" />
</div>

## Funcionalidades clave

### Para estudiantes

- progresión guiada por niveles
- ejercicios con explicación paso a paso
- recompensas por desempeño y resolución
- cálculo matemático con visualización clara

### Para docentes

- seguimiento del progreso
- gestión de contenido por módulos
- indicadores de avance y rendimiento

### Para el producto

- base escalable para aprendizaje digital
- experiencia visual moderna y enfocada en motivación
- preparación para fase de despliegue y ampliación de comunidad

## Requisitos previos

- Node.js 18+
- npm
- MySQL 8+
- Git

## Instalación rápida

```bash
git clone https://github.com/tu-usuario/integra_plus.git
cd integra_plus
npm install
npm install --prefix backend
npm install --prefix frontend
```

## Configuración local

Crea un archivo `backend/.env` con algo similar a esto:

```env
DATABASE_URL="mysql://root:tu_password@127.0.0.1:3306/integra_plus"
PORT=5000
JWT_SECRET="cambia_esta_clave"
SMTP_HOST="smtp.tu-servidor.com"
SMTP_PORT=587
SMTP_USER="tu_email"
SMTP_PASS="tu_password"
FRONTEND_URL="http://localhost:5173"
```

> En Windows, Prisma puede requerir regeneración del cliente para el runtime correcto antes de ejecutar la aplicación.

## Ejecutar el proyecto

### Opción 1: arranque completo

```bash
cd integra_plus
npm run dev
```

### Opción 2: arranque manual

```bash
cd integra_plus/backend && npm run dev
cd integra_plus/frontend && npm run dev
```

### Opción 3: script de inicio rápido

```bash
cd integra_plus
./start.sh
```

## URLs esperadas

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health check: http://localhost:5000/health

## Scripts útiles

```bash
npm run dev              # backend + frontend simultáneamente
npm run backend          # solo backend
npm run frontend         # solo frontend
npm run studio           # Prisma Studio
npm run seed             # cargar datos iniciales
npm run seed:test        # cargar datos de prueba
```

## Roadmap sugerido

- preparar despliegue de demostración pública
- mejorar onboarding y experiencia móvil
- ampliar catálogo de ejercicios y niveles
- establecer panel de docentes y métricas reales
- preparar estrategia para captación de usuarios/colaboradores

## Proyecto en contexto

La intención de este repositorio es posicionar la idea como una propuesta educativa sólida y atractiva para un público más amplio. Cuando el proyecto esté listo para una fase más visible, se puede preparar una demo pública con aprobación previa y una estrategia de comunicación clara.

## Documentación adicional

- [QUICKSTART.md](QUICKSTART.md)
- [SETUP.md](SETUP.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [AGENTS.md](AGENTS.md)

## Contacto y colaboración

Este proyecto está pensado para una fase de presentación y crecimiento. Si te interesa colaborar, aportar ideas o participar en el siguiente paso, contacta directamente con el propietario del proyecto para formalizar la colaboración.

No se abrirá ni se publicará una versión de producción sin autorización previa.

## Licencia

Este repositorio se mantiene como material de demostración y presentación del proyecto. La reutilización, clonación, distribución, despliegue público o uso comercial requiere autorización previa por escrito del propietario.

---

<div align="center">
  <strong>INTEGRA+</strong><br>
  Educación, cálculo y progreso.
</div>
