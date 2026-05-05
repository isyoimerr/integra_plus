export const LEVEL_CONFIG = {
  0: {
    title: 'Nivel 0', subtitle: 'Repaso de Bases',
    color: '#2E7D32', colorDark: '#1B5E20', colorLight: '#43A047',
    headerBg: 'linear-gradient(150deg, #1B5E20 0%, #2E7D32 100%)',
    xpPerExercise: 15, xpTotal: 75,
    sigmaEntry:    'Vamos a refrescar las bases. Sin esto, cálculo integral será un dolor. Sin chiismo, metámosle. 💪',
    sigmaCorrect:  '¡Eso! Las bases bien puestas. Sigue así. 🔥',
    sigmaWrong1:   'Casi. ¿Revisaste el MCM o la ley de exponentes? Piénsalo de nuevo. 🟠',
    sigmaComplete: '¡Bases sólidas! Ya puedes pasar a integrales. Vamos. 🚀',
    faseA: {
      headline: 'Fracciones, Potencias y Derivadas',
      desc: 'Estas son las herramientas que vas a usar en todo el cálculo. Si las tienes claras, el resto fluye solo.',
      concepts: [
        { icon: '➗', title: 'Fracciones',    formula: '\\dfrac{a}{b} + \\dfrac{c}{d} = \\dfrac{ad+bc}{bd}',  desc: 'Busca el MCM para sumar. Para dividir: invierte y multiplica.' },
        { icon: '⬆',  title: 'Potencias',     formula: '(x^n)^m = x^{n \\cdot m}',                            desc: 'Potencia de potencia: multiplica los exponentes. Raíz cuadrada es potencia 1/2.' },
        { icon: '∂',  title: 'Derivadas',     formula: '\\dfrac{d}{dx}[x^n] = n \\cdot x^{n-1}',              desc: 'Regla de potencia: el exponente baja como factor, luego se resta 1.' },
      ],
    },
    exercises: [
      { dbId:1,  n:1, total:6, q:'¿Cuánto es 2/3 + 1/4?',           formula:'\\dfrac{2}{3} + \\dfrac{1}{4} = ?',                    opts:['5/7','11/12','6/7'],                            correct:'B', hint:'Busca el MCM de 3 y 4.',                                                  explain:'MCM(3,4)=12 → 8/12 + 3/12 = 11/12' },
      { dbId:2,  n:2, total:6, q:'¿Cuánto es 2/3 ÷ 1/4?',           formula:'\\dfrac{2}{3} \\div \\dfrac{1}{4} = ?',                opts:['2/12','1/6','8/3'],                              correct:'C', hint:'Invertir y multiplicar: 2/3 × 4/1',                                       explain:'2/3 × 4 = 8/3' },
      { dbId:3,  n:3, total:6, q:'¿Cuánto es (x²)³?',                formula:'(x^2)^3 = x^{?}',                                     opts:['x⁵','x⁶','x⁸'],                                 correct:'B', hint:'Potencia de potencia: multiplica los exponentes.',                        explain:'(x²)³ = x^(2×3) = x⁶' },
      { dbId:4,  n:4, total:6, q:'Simplifica 1/√x',                  formula:'\\dfrac{1}{\\sqrt{x}} = ?',                            opts:['x^(1/2)','x^(-2)','x^(-1/2)'],                  correct:'C', hint:'√x = x^(1/2). Pasarlo al denominador cambia el signo.',                explain:'1/x^(1/2) = x^(-1/2)' },
      { dbId:5,  n:5, total:6, q:'¿Cuánto es d/dx[x³]?',            formula:'\\dfrac{d}{dx}[x^3] = ?',                              opts:['x²','3x','3x²'],                                 correct:'C', hint:'Regla de potencia: baja el 3 y resta 1 al exponente.',                   explain:'d/dx[x³] = 3·x² = 3x²' },
      { dbId:6,  n:6, total:6, q:'¿Cuánto es d/dx[x²·sin(x)]?',     formula:'\\dfrac{d}{dx}[x^2 \\cdot \\sin(x)] = ?',             opts:['2x·cos(x)','2x·sin(x)+x²·cos(x)','x²·cos(x)'], correct:'B', hint:'Regla del producto: (uv)\' = u\'v + uv\'',                              explain:'u=x², v=sin(x) → 2x·sin(x) + x²·cos(x)' },
    ],
  },
  1: {
    title: 'Nivel 1', subtitle: 'Integral Indefinida',
    color: '#1565C0', colorDark: '#0D47A1', colorLight: '#1976D2',
    headerBg: 'linear-gradient(150deg, #0D47A1 0%, #1565C0 100%)',
    xpPerExercise: 15, xpTotal: 105,
    sigmaEntry:    'Integración es lo opuesto de derivar. Es como un detective: tienes la tasa de cambio, encuentras la función original. 🔍',
    sigmaCorrect:  '¡Exacto! Vas entendiendo la lógica. ¡Sigue! 🟢',
    sigmaWrong1:   '¿Recuerdas la regla de potencia invertida? El exponente sube uno y divides. 🟠',
    sigmaComplete: '¡Dominas la integral indefinida! El siguiente nivel es con límites reales. 🚀',
    faseA: {
      headline: 'Antiderivadas y Constante C',
      desc: 'Integrar es el proceso inverso de derivar. Siempre aparece una constante C porque la derivada de cualquier constante es 0.',
      concepts: [
        { icon: '∫', title: 'Antiderivada',      formula: '\\int f(x)\\,dx = F(x) + C',             desc: 'Si d/dx[F(x)] = f(x), entonces la integral de f(x) es F(x)+C.' },
        { icon: 'C', title: 'La constante C',    formula: '\\dfrac{d}{dx}[k] = 0 \\Rightarrow +C',  desc: 'Al derivar cualquier constante obtienes 0. Por eso al integrar no sabemos cuál fue — aparece C.' },
        { icon: 'n', title: 'Regla de potencia', formula: '\\int x^n\\,dx = \\dfrac{x^{n+1}}{n+1} + C', desc: 'El exponente sube en 1 y divides entre el nuevo exponente. Funciona para todo n ≠ −1.' },
      ],
    },
    exercises: [
      { dbId:7,  n:1, total:4, q:'Resuelve la integral indefinida', formula:'\\displaystyle\\int x^5 \\, dx = ?',           opts:['x⁶ + C','x⁶/6 + C','5x⁴ + C'],              correct:'B', hint:'El exponente sube de 5 a 6. Luego divides entre 6.', explain:'∫ x⁵ dx = x⁶/6 + C' },
      { dbId:8,  n:2, total:4, q:'Resuelve la integral indefinida', formula:'\\displaystyle\\int e^x \\, dx = ?',           opts:['eˣ⁺¹ + C','eˣ/x + C','eˣ + C'],              correct:'C', hint:'eˣ es la única función cuya integral es ella misma.', explain:'∫ eˣ dx = eˣ + C' },
      { dbId:9,  n:3, total:4, q:'Integra término a término',       formula:'\\displaystyle\\int (2x^3 + 5) \\, dx = ?',   opts:['(1/2)x⁴ + 5x + C','6x² + C','2x⁴ + 5x + C'], correct:'A', hint:'Integra cada término por separado.',              explain:'∫2x³ dx + ∫5 dx = x⁴/2 + 5x + C' },
      { dbId:10, n:4, total:4, q:'Integral trigonométrica',         formula:'\\displaystyle\\int \\cos(x) \\, dx = ?',     opts:['−sin(x) + C','sin(x) + C','tan(x) + C'],      correct:'B', hint:'¿Qué función al derivar da cos(x)?',             explain:'d/dx[sin(x)] = cos(x) → ∫ cos(x) dx = sin(x) + C' },
    ],
  },
  2: {
    title: 'Nivel 2', subtitle: 'Integral Definida',
    color: '#7E57C2', colorDark: '#4527A0', colorLight: '#9575CD',
    headerBg: 'linear-gradient(150deg, #4527A0 0%, #7E57C2 100%)',
    xpPerExercise: 15, xpTotal: 105,
    sigmaEntry:    'Ahora ponemos límites. ∫ₐᵇ f(x) dx te da el área exacta bajo la curva entre a y b. Acumulación real. 📐',
    sigmaCorrect:  '¡TFC dominado! Evalúas bien en los límites. 🟢',
    sigmaWrong1:   'Recuerda: calcula la antiderivada, evalúa en b, evalúa en a, resta. F(b)−F(a). 🟠',
    sigmaComplete: '¡Dominas el Teorema Fundamental! Eso es un hito real en cálculo. 🏆',
    faseA: {
      headline: 'Teorema Fundamental del Cálculo',
      desc: 'La integral definida convierte la antiderivada en un número concreto: el área neta bajo la curva entre dos puntos.',
      concepts: [
        { icon: '∫', title: 'TFC',                formula: '\\int_a^b f(x)\\,dx = F(b) - F(a)',  desc: 'Evalúa la antiderivada en el límite superior b, resta el valor en el límite inferior a.' },
        { icon: '▦', title: 'Área bajo la curva', formula: 'A = \\int_a^b f(x)\\,dx',             desc: 'Si f(x) ≥ 0 en [a,b], la integral definida es el área de la región bajo la curva.' },
        { icon: '±', title: 'Signo del área',     formula: '\\int_a^b f = -\\int_b^a f',          desc: 'Intercambiar límites cambia el signo. Áreas bajo el eje x son negativas.' },
      ],
    },
    exercises: [
      { dbId:11, n:1, total:4, q:'Aplica el Teorema Fundamental',    formula:'\\displaystyle\\int_0^2 x \\, dx = ?',          opts:['1','2','4'],   correct:'B', hint:'Antiderivada de x es x²/2. Evalúa en 2 y en 0, resta.', explain:'F(x)=x²/2 → F(2)−F(0) = 4/2 − 0 = 2' },
      { dbId:12, n:2, total:4, q:'Aplica el Teorema Fundamental',    formula:'\\displaystyle\\int_1^3 2x \\, dx = ?',         opts:['6','8','4'],   correct:'B', hint:'Antiderivada de 2x es x². F(3)−F(1) = 9−1 = 8.',        explain:'F(x)=x² → 9−1 = 8' },
      { dbId:13, n:3, total:4, q:'Integra y evalúa en los límites',  formula:'\\displaystyle\\int_0^1 (x^2 + 1) \\, dx = ?', opts:['4/3','2/3','1'], correct:'A', hint:'F(x)=x³/3 + x. En 1: 1/3 + 1 = 4/3. En 0: 0.',    explain:'F(1)−F(0) = 4/3 − 0 = 4/3' },
      { dbId:14, n:4, total:4, q:'Calcula la integral definida',     formula:'\\displaystyle\\int_0^{\\pi} \\sin(x) \\, dx = ?', opts:['0','1','2'], correct:'C', hint:'F(x)=−cos(x). −cos(π)+cos(0) = 1+1.',            explain:'F(π)−F(0) = 1+1 = 2' },
    ],
  },
};

export const SIGMA_STATES = {
  neutral:    { bg: '#7E57C2', eyes: [{cx:56,cy:36,r:4.5},{cx:70,cy:36,r:4.5}], mouthD: 'M54 60 Q63 69 72 60',  brows: null, eyeLines: null },
  celebracion:{ bg: '#2E7D32', eyes: [{cx:56,cy:33,r:6},  {cx:70,cy:33,r:6}],   mouthD: 'M50 56 Q63 75 76 56',  brows: null, eyeLines: null },
  apoyo:      { bg: '#F57F17', eyes: [{cx:56,cy:38,r:4.5},{cx:70,cy:38,r:4.5}], mouthD: 'M55 66 Q63 59 71 66',  brows: ['M51 28 Q55 24 59 28','M67 24 Q71 28 75 28'], eyeLines: null },
  alerta:     { bg: '#E53935', eyes: [{cx:56,cy:38,r:4.5},{cx:70,cy:38,r:4.5}], mouthD: 'M55 65 L71 65',         brows: ['M51 29 Q55 25 59 28','M67 25 Q71 29 75 28'], eyeLines: null },
  inactivo:   { bg: '#546E7A', eyes: null,                                        mouthD: 'M55 62 L71 62',         brows: null, eyeLines: ['M52 36 L60 36','M66 36 L74 36'] },
};
