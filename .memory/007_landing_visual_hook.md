# 007 — Landing Page: Gancho Visual (Visual Hook)

_Sesión: 2026-05-04_

## Qué se hizo

Se agregaron 4 secciones nuevas al final de `LandingScreen.jsx`, debajo del hero existente y antes del footer. Se inspiraron en Duolingo pero adaptadas al estilo INTEGRA+.

## Secciones añadidas

| Sección | Descripción |
|---------|-------------|
| "Simple. Divertido. Efectivo." | 3 tarjetas (01/02/03) con iconos CSS animados y barras de color |
| "De cero a experto en 5 módulos" | Nodos del mapa de aprendizaje real del proyecto con XP |
| "SIGMA nunca te abandona" | SIGMA con 4 símbolos matemáticos orbitando + 4 features con iconos CSS |
| CTA Final | Diamante giratorio CSS, headline shimmer, botón pulsante verde |

## Iconos CSS creados (sin emojis)

Todos los iconos son componentes React con CSS puro (`clip-path`, `border`, `animation`):

| Componente | Tipo | Descripción |
|------------|------|-------------|
| `StepIcon type="radar"` | 3 anillos concéntricos pulsantes con punto central brillante |
| `StepIcon type="bolt"` | Rayo `clip-path` + gradiente + `drop-shadow` |
| `StepIcon type="star"` | Estrella de 10 puntas `clip-path` flotante |
| `FeatIcon type="chat"` | Burbuja de diálogo CSS con cola triangular y líneas interiores |
| `FeatIcon type="adapt"` | Dos anillos girando en sentido contrario con punto central |
| `FeatIcon type="star"` | Estrella CSS con `dotPulse` |
| `FeatIcon type="ring"` | Reloj analógico CSS con manecillas |
| CTA icon | Dos rectángulos redondeados girando en sentido contrario con `∫` al centro |

## Órbitas alrededor de SIGMA

Reemplazaron emojis por símbolos matemáticos: `∫  ∂  dx  ∞`  
Animación CSS `orbit` / `orbitSm` (keyframe: rotate → translateX → counter-rotate).

## Mapa de aprendizaje — línea eliminada

La línea horizontal que conectaba los nodos fue eliminada porque "dañaba" el diseño.  
Se reemplazó por flechas SVG sutiles (`→`) entre cada par de nodos.

## Scroll reveal

Todas las secciones usan `IntersectionObserver` con `threshold: 0.1`.  
Estado: `sectionsVis.how | .path | .sigma | .cta` → controla `opacity` y `transform`.

## Archivos modificados

- `frontend/src/screens/LandingScreen.jsx` — única modificación

## Animaciones nuevas

`ctaDiamondSpin`, `arrowBounce`, `countIn`, `glowPop`, `pathLineGrow` (no usada), `orbit`, `orbitSm`

## Preferencia del usuario

**No usar emojis en secciones nuevas** — reemplazar siempre con CSS animations o símbolos matemáticos. Los emojis que ya existían en el hero original se dejan tal cual.
