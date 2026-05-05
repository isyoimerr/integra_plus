# ⚙️ Guía de Configuración Inicial

## 🗄️ Base de Datos

### Paso 1: Crear la BD

1. Abre **phpMyAdmin** (http://localhost/phpmyadmin)
2. Click en **"Nueva"** (o "New")
3. Nombre: `integra_plus`
4. Charset: `utf8mb4_unicode_ci`
5. **Crear**

### Paso 2: Importar Datos Iniciales

1. Ve a la BD `integra_plus`
2. Pestaña **"Importar"** (Import)
3. Click **"Seleccionar archivo"** y elige: `backend/database/integra_plus.sql`
4. **Ejecutar** (Execute)

### Paso 3: Configurar Conexión

Crea `backend/.env`:

```env
DATABASE_URL="mysql://root:@localhost:3306/integra_plus"
JWT_SECRET="tu-clave-secreta-aqui"
SMTP_EMAIL="tu-correo@gmail.com"
SMTP_PASSWORD="tu-contraseña-aplicacion"
PORT=5000
NODE_ENV=development
```

## 🚀 Instalación y Inicio

```bash
# En la raíz del proyecto
npm install

# Ejecutar backend y frontend simultáneamente
npm run dev
```

**Verificar que todo funciona:**
- Frontend: http://localhost:5173 (debe cargar)
- Backend: http://localhost:5000/api/health (o similar)

## 📚 Modelos de Base de Datos

La BD ya tiene estas tablas:

```
usuarios          → Datos de usuarios
estudiantes       → Info adicional estudiantes
ejercicios        → Ejercicios disponibles
niveles           → Niveles del juego
progreso          → Avance del usuario
respuestas        → Respuestas guardadas
```

Los campos usan prefijos (`usu_`, `est_`, etc.) pero los servicios mapean a nombres limpios en la API.

## 🔧 Comandos Útiles

```bash
# Abrir Prisma Studio (GUI de BD)
npm run studio

# Cargar datos iniciales (seed)
npm run seed

# Solo backend (puerto 5000)
cd backend && npm run dev

# Solo frontend (puerto 5173)
cd frontend && npm run dev
```

## ⚠️ Notas Importantes

- **Backend es ESModules**: usa `import/export`, no `require`
- **No usar `prisma migrate`**: importa el SQL directamente
- **.env no se pushea**: está en `.gitignore`
- **node_modules no se pushea**: se regenera con `npm install`

## 🆘 Troubleshooting

**Error: "Cannot connect to database"**
- Verifica que MySQL está corriendo
- Revisa credenciales en `.env`
- Confirma que la BD existe

**Error: "Port 5000 already in use"**
```bash
# Matar proceso en puerto 5000 (Linux/Mac)
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Error: "node_modules corrupto"**
```bash
rm -rf node_modules
npm install
```

¡Listo! Ya puedes empezar a trabajar. 🎉
