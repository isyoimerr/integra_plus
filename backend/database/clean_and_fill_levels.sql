-- =============================================================
-- 1. ELIMINAR duplicados de ejercicios (ej_id 15-42)
-- =============================================================
DELETE FROM resultados WHERE res_ej_id BETWEEN 15 AND 42;
DELETE FROM ejercicios WHERE ej_id BETWEEN 15 AND 42;

-- =============================================================
-- 2. ELIMINAR niveles duplicados (8 y 9)
-- =============================================================
DELETE FROM niveles WHERE niv_id IN (8,9);

-- =============================================================
-- 3. Insertar ejercicios para niv_id=4 (Técnicas de Integración)
-- =============================================================
INSERT INTO ejercicios (ej_niv_id, ej_enunciado, ej_formula, ej_tipo, ej_opciones, ej_respuesta, ej_pista, ej_explicacion, ej_xp_recompensa, ej_dificultad, ej_orden) VALUES
(4, 'Resuelve usando sustitución simple:', '\\int 2x \\cdot \\sqrt{x^2 + 1} \\, dx', 'multiple_choice', '[\"\\\\frac{2}{3}(x^2+1)^{3/2} + C\", \"\\\\frac{1}{3}(x^2+1)^{3/2} + C\", \"(x^2+1)^{3/2} + C\", \"\\\\frac{2}{3}(x^2+1)^{1/2} + C\"]', '\\frac{2}{3}(x^2+1)^{3/2} + C', 'Haz u = x² + 1, entonces du = 2x dx.', '∫2x·√(x²+1) dx = ∫√u du = ∫u^(1/2) du = (2/3)u^(3/2) + C = (2/3)(x²+1)^(3/2) + C.', 15, 1, 1),
(4, 'Resuelve la integral por partes:', '\\int x \\cdot e^x \\, dx', 'multiple_choice', '[\"x e^x + C\", \"e^x(x - 1) + C\", \"x e^x - e^x + C\", \"e^x + C\"]', 'x e^x - e^x + C', 'Usa integración por partes con u = x, dv = e^x dx.', '∫x e^x dx = x e^x - ∫e^x dx = x e^x - e^x + C = e^x(x - 1) + C.', 15, 1, 2),
(4, 'Aplica sustitución trigonométrica:', '\\int \\dfrac{dx}{\\sqrt{1 - x^2}}', 'multiple_choice', '[\"\\\\arcsin(x) + C\", \"\\\\arccos(x) + C\", \"\\\\arctan(x) + C\", \"\\\\sec^{-1}(x) + C\"]', '\\arcsin(x) + C', 'Recuerda que d/dx[arcsin(x)] = 1/√(1-x²).', '∫ dx/√(1-x²) = arcsin(x) + C. Es una integral inmediata.', 15, 1, 3),
(4, 'Resuelve por fracciones parciales:', '\\int \\dfrac{1}{x^2 - 1} \\, dx', 'multiple_choice', '[\"\\\\ln|x^2-1| + C\", \"\\\\frac{1}{2}\\\\ln\\\\left|\\\\frac{x-1}{x+1}\\\\right| + C\", \"\\\\frac{1}{2}\\\\ln(x^2-1) + C\", \"\\\\ln\\\\left|\\\\frac{x+1}{x-1}\\\\right| + C\"]', '\\frac{1}{2}\\ln\\left|\\frac{x-1}{x+1}\\right| + C', 'Factoriza x²-1 = (x-1)(x+1) y descompón en fracciones parciales.', '1/(x²-1) = 1/2·[1/(x-1) - 1/(x+1)]. Integrando: (1/2)ln|x-1| - (1/2)ln|x+1| + C = (1/2)ln|(x-1)/(x+1)| + C.', 15, 2, 4),
(4, 'Integra usando sustitución u = ln(x):', '\\int \\dfrac{1}{x \\ln(x)} \\, dx', 'multiple_choice', '[\"\\\\ln|x| + C\", \"\\\\ln|\\\\ln(x)| + C\", \"\\\\frac{1}{\\\\ln(x)} + C\", \"\\\\ln(\\\\ln|x|) + C\"]', '\\ln|\\ln(x)| + C', 'Haz u = ln(x), entonces du = (1/x) dx.', '∫ 1/(x ln x) dx = ∫ 1/u du = ln|u| + C = ln|ln x| + C.', 15, 1, 5),
(4, 'Aplica integración por partes dos veces:', '\\int e^x \\cdot \\sin(x) \\, dx', 'multiple_choice', '[\"e^x(\\\\sin(x) - \\\\cos(x))/2 + C\", \"e^x(\\\\sin(x) + \\\\cos(x))/2 + C\", \"e^x \\\\sin(x) + C\", \"-e^x \\\\cos(x) + C\"]', 'e^x(\\sin(x) - \\cos(x))/2 + C', 'Integra por partes dos veces y despeja la integral original.', 'Aplicando integración por partes dos veces se obtiene: ∫e^x sin(x) dx = e^x(sin(x) - cos(x))/2 + C.', 15, 2, 6);

-- =============================================================
-- 4. Insertar ejercicios para niv_id=5 (Aplicaciones de la Integral)
-- =============================================================
INSERT INTO ejercicios (ej_niv_id, ej_enunciado, ej_formula, ej_tipo, ej_opciones, ej_respuesta, ej_pista, ej_explicacion, ej_xp_recompensa, ej_dificultad, ej_orden) VALUES
(5, 'Calcula el área entre las curvas:', 'y = x^2 \\text{ y } y = x \\text{ en } [0,1]', 'multiple_choice', '[\"1/2\", \"1/6\", \"1/3\", \"1/4\"]', '1/6', 'El área entre curvas es ∫(superior - inferior) dx.', 'Área = ∫₀¹ (x - x²) dx = [x²/2 - x³/3]₀¹ = 1/2 - 1/3 = 1/6.', 15, 1, 1),
(5, 'Calcula el volumen de un sólido de revolución alrededor del eje x:', 'y = \\sqrt{x}, \\, x \\in [0, 4]', 'multiple_choice', '[\"4\\\\pi\", \"8\\\\pi\", \"16\\\\pi\", \"2\\\\pi\"]', '8\\pi', 'Usa el método de discos: V = π∫[f(x)]² dx.', 'V = π∫₀⁴ (√x)² dx = π∫₀⁴ x dx = π[x²/2]₀⁴ = π(16/2 - 0) = 8π.', 15, 1, 2),
(5, 'Calcula el trabajo realizado por una fuerza variable:', 'F(x) = 2x \\text{ N desde } x=0 \\text{ hasta } x=5 \\text{ m}', 'multiple_choice', '[\"10 J\", \"25 J\", \"50 J\", \"20 J\"]', '25 J', 'Trabajo = ∫F(x) dx en el intervalo.', 'W = ∫₀⁵ 2x dx = [x²]₀⁵ = 25 - 0 = 25 J.', 15, 1, 3),
(5, 'Halla la longitud de arco de la curva:', 'y = \\frac{2}{3}x^{3/2}, \\, x \\in [0, 3]', 'multiple_choice', '[\"6\", \"\\\\frac{14}{3}\", \"8\", \"\\\\frac{2}{3}(10^{3/2} - 1)\"]', '\\frac{14}{3}', 'Longitud = ∫√(1 + (dy/dx)²) dx. dy/dx = x^(1/2).', 'L = ∫₀³ √(1 + x) dx = [(2/3)(1+x)^(3/2)]₀³ = (2/3)(8 - 1) = 14/3.', 15, 2, 4),
(5, 'Calcula el valor promedio de la función:', 'f(x) = x^2 \\text{ en } [0, 3]', 'multiple_choice', '[\"3\", \"4\", \"9\", \"6\"]', '3', 'Valor promedio = (1/(b-a))∫_a^b f(x) dx.', 'V_prom = (1/3)∫₀³ x² dx = (1/3)[x³/3]₀³ = (1/3)(27/3) = 3.', 15, 1, 5);

-- =============================================================
-- 5. Insertar ejercicios para niv_id=6 (Integrales Impropias)
-- =============================================================
INSERT INTO ejercicios (ej_niv_id, ej_enunciado, ej_formula, ej_tipo, ej_opciones, ej_respuesta, ej_pista, ej_explicacion, ej_xp_recompensa, ej_dificultad, ej_orden) VALUES
(6, 'Determina si la integral impropia converge:', '\\int_1^\\infty \\frac{1}{x^2} \\, dx', 'multiple_choice', '[\"Converge a 1\", \"Converge a 2\", \"Diverge\", \"Converge a 0\"]', 'Converge a 1', 'Evalúa el límite cuando b→∞: ∫₁^b 1/x² dx.', '∫₁^∞ 1/x² dx = lim_{b→∞} [-1/x]₁^b = lim_{b→∞} (-1/b + 1) = 1. Converge a 1.', 15, 1, 1),
(6, 'Evalúa la integral impropia con discontinuidad:', '\\int_0^1 \\frac{1}{\\sqrt{x}} \\, dx', 'multiple_choice', '[\"Converge a 2\", \"Converge a 1\", \"Diverge\", \"Converge a 1/2\"]', 'Converge a 2', 'La función tiene una discontinuidad en x=0. Toma límite cuando a→0⁺.', '∫₀¹ 1/√x dx = lim_{a→0⁺} [2√x]_a¹ = lim(2 - 2√a) = 2. Converge.', 15, 1, 2),
(6, 'Determina convergencia de la integral:', '\\int_1^\\infty \\frac{1}{x} \\, dx', 'multiple_choice', '[\"Converge a 1\", \"Converge a e\", \"Diverge\", \"Converge a 0\"]', 'Diverge', 'La integral de 1/x diverge porque ln(x) → ∞ cuando x → ∞.', '∫₁^∞ 1/x dx = lim_{b→∞} [ln|x|]₁^b = lim_{b→∞} ln(b) = ∞. Diverge.', 15, 1, 3),
(6, 'Compara convergencia usando criterio de comparación:', '\\int_1^\\infty \\frac{1}{1 + x^2} \\, dx', 'multiple_choice', '[\"Converge a \\\\pi/4\", \"Converge a \\\\pi/2\", \"Diverge\", \"Converge a 1\"]', 'Converge a \\pi/4', 'Completa a la forma de arctan(x).', '∫₁^∞ 1/(1+x²) dx = lim_{b→∞} [arctan(x)]₁^b = π/2 - π/4 = π/4. Converge.', 15, 2, 4),
(6, 'Evalúa la integral impropia con ambos límites infinitos:', '\\int_{-\\infty}^\\infty \\frac{1}{1 + x^2} \\, dx', 'multiple_choice', '[\"\\\\pi\", \"\\\\pi/2\", \"2\\\\pi\", \"1\"]', '\\pi', 'La integral se evalúa en dos partes: de -∞ a 0 y de 0 a ∞.', '∫_{-∞}^∞ 1/(1+x²) dx = [arctan(x)]_{-∞}^∞ = π/2 - (-π/2) = π.', 15, 1, 5);

-- =============================================================
-- 6. Insertar ejercicios para niv_id=7 (Ecuaciones Diferenciales)
-- =============================================================
INSERT INTO ejercicios (ej_niv_id, ej_enunciado, ej_formula, ej_tipo, ej_opciones, ej_respuesta, ej_pista, ej_explicacion, ej_xp_recompensa, ej_dificultad, ej_orden) VALUES
(7, 'Resuelve la ecuación diferencial de primer orden:', '\\frac{dy}{dx} = 2x', 'multiple_choice', '[\"y = x^2 + C\", \"y = 2x + C\", \"y = x^2 + 2x + C\", \"y = x + C\"]', 'y = x^2 + C', 'Integra ambos lados con respecto a x.', 'dy/dx = 2x → y = ∫2x dx = x² + C.', 15, 1, 1),
(7, 'Resuelve por separación de variables:', '\\frac{dy}{dx} = \\frac{x}{y}', 'multiple_choice', '[\"y^2 = x^2 + C\", \"y = \\\\sqrt{x^2 + C}\", \"y = x + C\", \"y = \\\\frac{x^2}{2} + C\"]', 'y = \\sqrt{x^2 + C}', 'Separa: y dy = x dx, luego integra ambos lados.', 'y dy = x dx → ∫y dy = ∫x dx → y²/2 = x²/2 + C₁ → y² = x² + C → y = √(x² + C).', 15, 1, 2),
(7, 'Resuelve la ED lineal de primer orden:', '\\frac{dy}{dx} + y = e^x', 'multiple_choice', '[\"y = \\\\frac{1}{2}e^x + Ce^{-x}\", \"y = e^x + Ce^{-x}\", \"y = \\\\frac{1}{2}e^x + C\", \"y = Ce^x + e^{-x}\"]', 'y = \\frac{1}{2}e^x + Ce^{-x}', 'Encuentra el factor integrante μ(x) = e^(∫1 dx) = e^x.', 'Multiplica por e^x: e^x dy/dx + e^x y = e^(2x). Luego d/dx(ye^x) = e^(2x). Integra: ye^x = (1/2)e^(2x) + C. Despeja: y = (1/2)e^x + Ce^(-x).', 15, 2, 3),
(7, 'Aplica condición inicial:', '\\frac{dy}{dx} = 3y, \\, y(0) = 2', 'multiple_choice', '[\"y = 2e^{3x}\", \"y = e^{3x} + 2\", \"y = 3e^{2x}\", \"y = 2e^{x}\"]', 'y = 2e^{3x}', 'Separa variables: dy/y = 3 dx, integra y aplica y(0)=2.', 'dy/y = 3 dx → ln|y| = 3x + C → y = Ce^(3x). Con y(0)=2: 2 = Ce⁰ = C → y = 2e^(3x).', 15, 2, 4),
(7, 'Resuelve la ED de segundo orden simple:', '\\frac{d^2y}{dx^2} = 6x', 'multiple_choice', '[\"y = x^3 + C_1x + C_2\", \"y = 6x + C\", \"y = x^3 + C\", \"y = 3x^2 + C_1x + C_2\"]', 'y = x^3 + C_1x + C_2', 'Integra dos veces consecutivas.', 'dy/dx = ∫6x dx = 3x² + C₁. Luego y = ∫(3x² + C₁) dx = x³ + C₁x + C₂.', 15, 1, 5);
