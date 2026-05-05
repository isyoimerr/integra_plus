# 003 — Autenticación

## Decisión: sin Supabase

Se descartó Supabase Auth porque impedía el envío de emails desde Gmail.
Ahora todo pasa por el backend Express.

## Flujo de registro

```
1. RegisterScreen → POST /api/auth/send-otp  (backend genera código 4 dígitos y lo envía por Gmail)
2. VerifyEmailScreen → POST /api/auth/verify-otp  (valida el código, expira en 5 min)
3. VerifyEmailScreen → POST /api/auth/register  (crea usuario + estudiante/docente en MySQL)
4. loginLocal() → guarda usuario y token en localStorage
```

## Flujo de login

```
POST /api/auth/login  →  devuelve { usuario, token }
token se guarda en localStorage como 'integra_token'
usuario se guarda en localStorage como 'integra_user'
```

## JWT payload

```json
{
  "userId": 1,
  "rol": "estudiante",
  "estudianteId": 1
}
```

`estudianteId` es `null` para docentes. El middleware `auth.middleware.js` expone:
- `req.userId`
- `req.userRol`
- `req.estudianteId`

## OTP

- Generado en backend: 4 dígitos aleatorios
- Almacenado en memoria (`otp.store.js`) con TTL de 5 min
- Enviado desde `yoimer938@gmail.com` vía Gmail SMTP
- En `NODE_ENV=development` el endpoint `send-otp` devuelve `devCode` para pruebas

## AuthContext

Solo existe `BackendAuthProvider` (se eliminó `SupabaseAuthProvider`).
Expone: `user`, `token`, `isAuthenticated`, `login`, `register`, `logout`, `loginLocal`, `updateUser`.

## Docente

Para registrarse como docente se requiere el código `DOCENTE2024` (configurado en `.env` como `TEACHER_CODE`).
