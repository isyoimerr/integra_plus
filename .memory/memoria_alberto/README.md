# Memoria Alberto

> Contexto personal de trabajo para Alberto en el proyecto INTEGRA+.
> Leer este archivo antes de continuar tareas relacionadas con Git, GitHub,
> ejecucion local, ramas o scripts de arranque.

## Estado general

- Usuario trabajando en Windows, ruta local: `C:\Users\USUARIO\integra_plus`.
- Rama actual de Alberto: `feature/alberto`.
- Repositorio remoto: `https://github.com/yoimer777/integra_plus.git`.
- Yoimer es el propietario principal del repositorio.
- Alberto ya fue agregado como colaborador y pudo hacer `push` al repo.
- Git local quedo configurado con:
  - `user.name`: `M Salcedo Buitrago`
  - `user.email`: `msalcedobuitrago@gmail.com`

## Git y GitHub

Se verifico que:

- El repo local esta conectado a GitHub por `origin`.
- Se pudo subir un commit de prueba a `main`.
- Despues se crearon dos ramas de trabajo:
  - `feature/alberto`
  - `feature/yoimer`
- Ambas ramas fueron subidas a GitHub.
- El workspace local quedo en `feature/alberto`.

Flujo recomendado para Alberto:

```bash
git checkout feature/alberto
git pull origin feature/alberto
npm run dev
git status
git add .
git commit -m "feat: descripcion del cambio"
git push origin feature/alberto
```

Cuando el cambio este listo, crear Pull Request en GitHub:

```text
base: main
compare: feature/alberto
```

## Prueba de Git realizada

Se hizo un cambio pequeno en `.github/pull_request_template.md`:

- Se agrego una linea al checklist:
  `Verifique el estado de Git antes de subir cambios`

Ese cambio fue commiteado y subido correctamente a `main` una vez Alberto tuvo permisos de colaborador.

Commit:

```text
9bc8552 docs: actualizar checklist de pull request
```

## Configuracion local del proyecto

Se verifico que el proyecto puede correr localmente:

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:5000/health`
- Base de datos: MySQL/MariaDB via XAMPP en `localhost:3306`

Se creo `backend/.env` local con:

```env
DATABASE_URL="mysql://root:@localhost:3306/integra_plus"
JWT_SECRET="dev_secret_change_me"
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
TEACHER_CODE=DOCENTE2024
```

Nota: `backend/.env` no debe subirse a GitHub.

## Dependencias y base de datos

- Se instalo `concurrently` en la raiz para que `npm run dev` funcione.
- Prisma pudo conectarse a la base de datos.
- La prueba de conteo devolvio `usuarios=2`, lo que confirma que la BD existe y tiene datos.
- El frontend hizo build correctamente con `npm run build`.

## Scripts de arranque

Se modifico/creo:

- `start.sh`: script portable para Git Bash/Linux.
- `start.ps1`: script para Windows PowerShell.

Objetivo:

- Intentar iniciar XAMPP/MySQL.
- Esperar unos segundos.
- Ejecutar `npm run dev` para levantar backend y frontend.

Comandos para Alberto en Windows:

```powershell
cd C:\Users\USUARIO\integra_plus
powershell -ExecutionPolicy Bypass -File .\start.ps1
```

Comando para Yoimer o Git Bash:

```bash
./start.sh
```

Estos scripts aun estan pendientes de commit/push en `feature/alberto`.

## Pendiente inmediato

1. Probar `start.ps1` en Windows.
2. Si funciona, guardar los cambios:

```bash
git add start.sh start.ps1 .memory/memoria_alberto/README.md .memory/INDEX.md
git commit -m "chore: agregar memoria y scripts de inicio"
git push origin feature/alberto
```

3. Crear Pull Request:

```text
feature/alberto -> main
```

## Reglas para futuras IAs

- No trabajar directo en `main` salvo que Alberto lo pida explicitamente.
- Usar `feature/alberto` para cambios de Alberto.
- Antes de tocar Git, revisar `git status --short --branch`.
- No subir `.env`, `node_modules`, ni datos sensibles.
- Si se modifica algo de arranque local, probar backend y frontend.
