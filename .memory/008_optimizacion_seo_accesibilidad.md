# 008 — Optimización SEO, Accesibilidad y Footer

_Sesión: 2026-05-04_

## Qué se hizo

Mejoras puntuales sin tocar arquitectura, flujos ni UI principal.

## Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `frontend/index.html` | meta description, OG tags, Twitter Card, link favicon |
| `frontend/public/favicon.svg` | Creado: SVG "I+" verde (#1B5E20), rect rx=8 |
| `frontend/public/robots.txt` | Creado: permite rutas públicas, bloquea /dashboard /admin /profile |
| `frontend/public/sitemap.xml` | Creado: 4 rutas públicas con prioridad y changefreq |
| `frontend/src/components/ui/BottomNav.jsx` | `<div>` → `<nav aria-label>` + `aria-current="page"` en ítem activo |
| `frontend/src/components/layout/PhoneShell.jsx` | children envueltos en `<main id="main-content" role="main">` |
| `frontend/src/screens/LandingScreen.jsx` | Footer ampliado: 3 columnas (marca, plataforma, módulos) + copyright |

## Pendiente (sugerido, no ejecutado)

- **404 personalizada** — reemplazar `* → <Navigate to="/">` en App.jsx por NotFoundScreen con SIGMA en alerta
- **BottomNav "Práctica"** — apunta a `/levels` igual que "Niveles" — debería renombrarse o apuntar al nivel activo
- **`aria-expanded`** — en acordeones de LevelFaseAScreen.jsx
- **`aria-live="polite"`** — en ToastContainer (el Toast ya tiene `role="alert"`)

## Estado build

Build limpio sin errores (solo warning de chunk size por KaTeX — pre-existente).
