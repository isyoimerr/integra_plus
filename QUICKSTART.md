# 🚀 Guía Rápida para el Equipo

## 5 Minutos para Empezar

### 1. Clonar y Configurar

```bash
git clone https://github.com/yoimer777/integra_plus.git
cd integra_plus
npm install
```

### 2. Configurar Base de Datos

- Abre phpMyAdmin
- Importa: `backend/database/integra_plus.sql`
- Crea `backend/.env` con tus credenciales

### 3. Iniciar

```bash
npm run dev
```

✅ Frontend en http://localhost:5173  
✅ Backend en http://localhost:5000

---

## 📌 Flujo de Trabajo Diario

### Antes de Empezar

```bash
git checkout main
git pull origin main
```

### Crear tu Feature

```bash
git checkout -b feature/mi-cambio
# Trabajar...
npm run dev
```

### Subir Cambios

```bash
git add .
git commit -m "feat: descripción clara"
git push origin feature/mi-cambio
```

### En GitHub

1. **Compare & pull request** → Describe qué hiciste
2. Espera revisión
3. Hace cambios si se piden
4. **Merge** cuando esté listo

---

## 🎯 Estructura Rápida

```
Backend (Node.js)
├── controllers/ ← Reciben peticiones HTTP
├── services/   ← Lógica de negocio (DB, validaciones)
└── routes/     ← URLs y métodos

Frontend (React)
├── components/ ← Componentes pequeños reutilizables
├── screens/    ← Páginas/vistas completas
└── hooks/      ← Lógica compartida (useAuth, etc.)
```

---

## 💬 Mensajes de Commit

```bash
✅ git commit -m "feat: agregar login con email"
✅ git commit -m "fix: error en validación de nivel"
✅ git commit -m "refactor: limpiar código de API"

❌ git commit -m "cambios"
❌ git commit -m "arreglado"
❌ git commit -m "wip"
```

---

## 📚 Documentación Completa

- **README.md** → Descripción del proyecto
- **CONTRIBUTING.md** → Guía detallada para colaboradores
- **SETUP.md** → Configuración inicial paso a paso
- **AGENTS.md** → Notas técnicas (arquitectura, gotchas)

---

## ❓ Problemas Comunes

### "Puerto 5000 en uso"
```bash
lsof -ti:5000 | xargs kill -9
```

### "Base de datos no conecta"
- Verifica MySQL está corriendo
- Revisa `backend/.env`
- Confirma BD existe

### "node_modules corrupto"
```bash
rm -rf node_modules
npm install
```

---

## 🆘 ¿Necesitas Ayuda?

1. Revisa la documentación
2. Pregunta en el chat del equipo
3. Abre un issue en GitHub

---

**¡Bienvenido al equipo! 🎉**
