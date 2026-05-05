# 🤝 Guía para Colaboradores

Bienvenido al proyecto INTEGRA+. Esta guía te ayudará a contribuir de forma efectiva.

## 📋 Flujo de Trabajo

### 1️⃣ Antes de Empezar

Asegúrate de tener:
- Git instalado: `git --version`
- Node.js 18+: `node --version`
- MySQL corriendo
- El repo clonado: `git clone https://github.com/yoimer777/integra_plus.git`

### 2️⃣ Crear tu Rama de Trabajo

```bash
# Actualizar main
git checkout main
git pull origin main

# Crear rama para tu feature/fix
git checkout -b feature/nombre-descriptivo
# O para bugfix
git checkout -b bugfix/nombre-problema
```

**Nombres de ramas recomendados:**
- `feature/nueva-pantalla-usuario`
- `bugfix/login-no-valida`
- `refactor/mejorar-api-usuarios`
- `docs/actualizar-readme`

### 3️⃣ Hacer Cambios

```bash
# Trabajar en tu rama (cambios, pruebas, etc.)
npm run dev

# Ver cambios pendientes
git status

# Ver diferencias detalladas
git diff
```

### 4️⃣ Commits Claros

```bash
# Agregar archivos
git add .

# Hacer commit con mensaje descriptivo
git commit -m "feat: agregar validación de email en registro"
```

**Formato de mensajes:**
- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bug
- `refactor:` - Mejora de código
- `docs:` - Cambios en documentación
- `style:` - Formato/estilos (sin lógica)
- `test:` - Tests

❌ Evita: `git commit -m "cambios"`
✅ Usa: `git commit -m "fix: resolver error en reset de contraseña"`

### 5️⃣ Push y Pull Request

```bash
# Subir tu rama a GitHub
git push origin feature/tu-rama

# O si es la primera vez
git push -u origin feature/tu-rama
```

En GitHub:
1. Verás un botón **"Compare & pull request"**
2. Llena la descripción (qué hace, por qué)
3. Espera revisión del equipo
4. Haz cambios si se solicitan
5. ¡Listo para mergear! 🎉

## 📂 Estructura de Carpetas

**Backend** (`backend/src/`):
```
controllers/  → Lógica de rutas
services/     → Lógica de negocio (DB, validaciones)
routes/       → Definición de endpoints
middleware/   → Autenticación, validación, manejo de errores
utils/        → Funciones auxiliares
```

**Frontend** (`frontend/src/`):
```
components/   → Componentes reutilizables
screens/      → Páginas/vistas completas
hooks/        → Hooks personalizados (useAuth, useLevel, etc.)
services/     → Llamadas a API
contexts/     → Estado global (Auth, Progress, Theme)
data/         → Datos estáticos (ejercicios)
```

## 🔍 Verificación Antes de Enviar PR

- [ ] El código funciona localmente: `npm run dev`
- [ ] No hay console.log() innecesarios
- [ ] Cumple con la estructura de carpetas
- [ ] El mensaje de commit es claro
- [ ] No subes archivos sensibles (`.env`, `node_modules`)
- [ ] Tu rama está actualizada con `main`: `git pull origin main`

## 🐛 Encontraste un Bug?

1. Crea un issue en GitHub (si no existe uno)
2. Rama desde `main`: `git checkout -b bugfix/descripcion`
3. Corrige el problema
4. Haz commit: `git commit -m "fix: [descripción]"`
5. Push y abre PR

## ❓ Preguntas?

- Revisa el README.md
- Consulta AGENTS.md (notas técnicas)
- Pregunta en Discord/Email del equipo

¡Gracias por contribuir! 🚀
