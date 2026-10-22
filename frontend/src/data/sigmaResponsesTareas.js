export const SIGMA_RESPONSES = {
  nivel_1_aciertos: [
    {
      id: 'L1_CORRECTO_1',
      level: 1,
      keyword: ['regla de potencia', 'integral indefinida', 'x⁴', 'x⁵', 'C'],
      question: 'aplicaste regla de potencia',
      response: '¡Eso es! Aplicaste la regla de potencia perfecto: subes el exponente y divides por el nuevo valor. Eso es integrar.',
      type: 'correct',
      contextRelevance: ['power_rule', 'integration'],
    },
    {
      id: 'L1_CORRECTO_2',
      level: 1,
      keyword: ['e^x', 'exponencial', 'integral de e^x', 'e^x + C'],
      question: 'integral de e^x',
      response: '¡Fuego! Sin pista, sin ayuda. Dominaste este ejercicio desde el primer intento. Recuerda que la integral de e^x es e^x + C.',
      type: 'correct',
      contextRelevance: ['exp_integral', 'integration'],
    },
    {
      id: 'L1_CORRECTO_3',
      level: 1,
      keyword: ['sin(x)', 'cos(x)', 'trigonométrica', 'integral trigonométrica'],
      question: 'integral de sin',
      response: 'Bien hecho. Reconociste el patrón trigonométrico y lo ejecutaste limpio. Recuerda que ∫ sin(x) dx = -cos(x) + C.',
      type: 'correct',
      contextRelevance: ['trigonometric', 'integration'],
    },
    {
      id: 'L1_CORRECTO_4',
      level: 1,
      keyword: ['término a término', 'linealidad', 'sumar integrales', '∫(f+g)'],
      question: 'integral término a término',
      response: 'Perfecto. Ya entiendes que integrar es deshacer la derivada paso a paso. Aplica la integral a cada término y suma los resultados.',
      type: 'correct',
      contextRelevance: ['linearity', 'termwise'],
    },
    {
      id: 'L1_CORRECTO_5',
      level: 1,
      keyword: ['u sustitución', 'u-substitución', '2x(x²+1)', 'sustitución'],
      question: 'u sustitución',
      response: '¡Ese es el salto importante! Si identificas u correctamente y sustituyes du, la integral se vuelve mucho más clara.',
      type: 'correct',
      contextRelevance: ['u_substitution', 'integration'],
    },
  ],

  nivel_1_falla1: [
    {
      id: 'L1_FALLA1_1',
      level: 1,
      keyword: ['regla de potencia', 'expoente', 'sube el exponente', 'divide'],
      question: 'falta regla de potencia',
      response: 'Casi. Recuerda: en la regla de potencia, el exponente sube en 1 y luego divides entre ese nuevo exponente. ¿Lo ves?',
      type: 'hint',
      contextRelevance: ['power_rule'],
    },
    {
      id: 'L1_FALLA1_2',
      level: 1,
      keyword: ['derivada', 'antiderivada', 'función original', '¿qué función'],
      question: 'busca antiderivada',
      response: 'Casi. Piensa: ¿cuál función, al derivarla, te daría lo que tienes dentro de la integral?',
      type: 'hint',
      contextRelevance: ['antiderivative'],
    },
    {
      id: 'L1_FALLA1_3',
      level: 1,
      keyword: ['término a término', 'sumar', 'distributiva', '∫(f+g)'],
      question: 'integral sumada',
      response: 'No del todo. Fíjate en cada término por separado. La integral se distribuye término a término.',
      type: 'hint',
      contextRelevance: ['linearity'],
    },
    {
      id: 'L1_FALLA1_4',
      level: 1,
      keyword: ['u sustitución', 'cambio de variable', 'du', 'u ='],
      question: 'posible sustitución',
      response: 'Mmm, revisa. Cuando hay una composición adentro, puede que necesites cambio de variable. ¿Ves algo que se repite?',
      type: 'hint',
      contextRelevance: ['u_substitution'],
    },
    {
      id: 'L1_FALLA1_5',
      level: 1,
      keyword: ['e^x', 'integral de e^x', 'especial'],
      question: 'especial e^x',
      response: 'Casi. Recuerda que ∫ e^x dx es uno de los casos especiales: la función es su propia integral.',
      type: 'hint',
      contextRelevance: ['exp_integral'],
    },
  ],

  nivel_1_falla2: [
    {
      id: 'L1_FALLA2_1',
      level: 1,
      keyword: ['x^n', 'xⁿ', 'divide entre', 'n+1'],
      question: 'divide entre n+1',
      response: 'Mira: ∫ xⁿ dx = x^(n+1) / (n+1) + C. Aplica esa fórmula directo con el exponente que tienes.',
      type: 'hint',
      contextRelevance: ['power_rule'],
    },
    {
      id: 'L1_FALLA2_2',
      level: 1,
      keyword: ['derivada', 'comparar opciones', 'compara', 'opciones'],
      question: 'compara derivadas',
      response: 'La clave está en identificar qué función, al derivarla, da el integrando. Escribe la derivada de tus opciones y compara.',
      type: 'hint',
      contextRelevance: ['antiderivative'],
    },
    {
      id: 'L1_FALLA2_3',
      level: 1,
      keyword: ['∫(f + g)', 'linealidad', 'término por término'],
      question: 'integral lineal',
      response: 'Aplica la integral término a término: ∫(f + g) dx = ∫f dx + ∫g dx. Resuelve cada parte por separado y súmalas.',
      type: 'hint',
      contextRelevance: ['linearity'],
    },
    {
      id: 'L1_FALLA2_4',
      level: 1,
      keyword: ['u sustitución', 'u =', 'du', 'cambio de variable'],
      question: 'u sustitución avanzada',
      response: 'Prueba con u-sustitución: llama u a la expresión interior, calcula du, y reescribe la integral solo en términos de u.',
      type: 'hint',
      contextRelevance: ['u_substitution'],
    },
    {
      id: 'L1_FALLA2_5',
      level: 1,
      keyword: ['sin(x)', 'cos(x)', 'tabla integrales', 'e^x'],
      question: 'tabla de integrales',
      response: 'Recuerda la tabla: ∫ e^x dx = e^x + C, ∫ sin(x) dx = -cos(x) + C, ∫ cos(x) dx = sin(x) + C. ¿Cuál aplica aquí?',
      type: 'hint',
      contextRelevance: ['trigonometric', 'exp_integral'],
    },
  ],

  nivel_2_aciertos: [
    {
      id: 'L2_CORRECTO_1',
      level: 2,
      keyword: ['teorema fundamental', 'TFC', 'F(b)', 'F(a)', 'integral definida'],
      question: 'aplicaste teorema fundamental',
      response: '¡Exacto! Aplicaste el TFC perfecto: antiderivada, evalúas en b, restas en a. Eso es integral definida.',
      type: 'correct',
      contextRelevance: ['ftc'],
    },
    {
      id: 'L2_CORRECTO_2',
      level: 2,
      keyword: ['número', 'resultado numérico', 'sin C', 'integral definida'],
      question: 'resultado número',
      response: '¡Eso! Ni una pista necesitaste. Esto ya lo tienes dominado. La integral definida da un número concreto, no una función.',
      type: 'correct',
      contextRelevance: ['definite_integral'],
    },
    {
      id: 'L2_CORRECTO_3',
      level: 2,
      keyword: ['límites', 'límite inferior', 'límite superior', 'b a'],
      question: 'evaluación de límites',
      response: 'Bien hecho. Reconociste la propiedad correcta y la usaste sin dudar. F(b) - F(a) es el paso que hace la diferencia.',
      type: 'correct',
      contextRelevance: ['limits'],
    },
    {
      id: 'L2_CORRECTO_4',
      level: 2,
      keyword: ['área bajo la curva', 'integral definida', 'valor numérico'],
      question: 'resultado área',
      response: 'Perfecto. Ya entiendes que la integral definida da un número, no una función. Ese es el salto clave del nivel.',
      type: 'correct',
      contextRelevance: ['interpretation'],
    },
    {
      id: 'L2_CORRECTO_5',
      level: 2,
      keyword: ['velocidad', 'distancia', 'aplicación real', 'integral definida'],
      question: 'interpretación física',
      response: '¡Crack! Aplicaste el cálculo y lo interpretaste bien. Eso es lo que diferencia entender de solo memorizar.',
      type: 'correct',
      contextRelevance: ['application'],
    },
  ],

  nivel_2_falla1: [
    {
      id: 'L2_FALLA1_1',
      level: 2,
      keyword: ['TFC', 'F(b)-F(a)', 'antiderivada', 'límite'],
      question: 'recuerda TFC',
      response: 'Casi. Recuerda: el Teorema Fundamental dice F(b) - F(a). Primero encuentra la antiderivada, luego evalúa en los dos límites.',
      type: 'hint',
      contextRelevance: ['ftc'],
    },
    {
      id: 'L2_FALLA1_2',
      level: 2,
      keyword: ['constante C', '+C', 'definida', 'indefinida'],
      question: 'no es indefinida',
      response: 'Mmm, revisa. La integral definida da un número. Asegúrate de no dejar la constante C, eso es solo para indefinidas.',
      type: 'hint',
      contextRelevance: ['constant_of_integration'],
    },
    {
      id: 'L2_FALLA1_3',
      level: 2,
      keyword: ['límite invertido', 'signo', 'a mayor que b', 'inversión'],
      question: 'límite invertido',
      response: 'Casi. Fíjate en los límites de integración: si el límite inferior es mayor que el superior, la integral cambia de signo.',
      type: 'hint',
      contextRelevance: ['limits'],
    },
    {
      id: 'L2_FALLA1_4',
      level: 2,
      keyword: ['partir integral', 'sumar intervalos', 'aditividad'],
      question: 'divide la integral',
      response: 'Revisa. Puedes partir la integral en dos si el integrando tiene varios términos. Cada uno se evalúa por separado.',
      type: 'hint',
      contextRelevance: ['linearity', 'ftc'],
    },
    {
      id: 'L2_FALLA1_5',
      level: 2,
      keyword: ['velocidad', 'distancia', 'aplicación', 'interpretación'],
      question: 'interpretación física',
      response: 'Casi. Piensa en qué representa físicamente este problema. La integral de la velocidad te da la distancia, no la velocidad final.',
      type: 'hint',
      contextRelevance: ['application'],
    },
  ],

  nivel_2_falla2: [
    {
      id: 'L2_FALLA2_1',
      level: 2,
      keyword: ['paso a paso', 'F(b)', 'F(a)', 'resta'],
      question: 'paso a paso TFC',
      response: 'Paso a paso: 1) encuentra ∫f(x)dx = F(x), 2) calcula F(b), 3) calcula F(a), 4) resta: F(b) - F(a). El resultado es un número.',
      type: 'hint',
      contextRelevance: ['ftc'],
    },
    {
      id: 'L2_FALLA2_2',
      level: 2,
      keyword: ['+C', 'constante', 'definida', 'número'],
      question: 'sin constante',
      response: 'En integrales definidas NO se escribe +C. El resultado es siempre un valor numérico concreto. Evalúa F(b) - F(a) y listo.',
      type: 'hint',
      contextRelevance: ['constant_of_integration'],
    },
    {
      id: 'L2_FALLA2_3',
      level: 2,
      keyword: ['∫_b^a', 'inversión de límites', 'signo negativo'],
      question: 'límite invertido signo',
      response: 'Recuerda la propiedad: ∫ₐᵇ f(x)dx = -∫ᵦₐ f(x)dx. Si los límites están invertidos, el resultado cambia de signo.',
      type: 'hint',
      contextRelevance: ['limits'],
    },
    {
      id: 'L2_FALLA2_4',
      level: 2,
      keyword: ['∫ₐᶜ', 'aditividad', 'intervalos', 'suma'],
      question: 'aditividad',
      response: 'Usa la propiedad de aditividad: ∫ₐᶜ = ∫ₐᵇ + ∫ᵦᶜ. Divide el problema en partes más pequeñas y suma los resultados.',
      type: 'hint',
      contextRelevance: ['linearity'],
    },
    {
      id: 'L2_FALLA2_5',
      level: 2,
      keyword: ['velocidad', 'distancia', 'integral definida', 'aplicación'],
      question: 'distancia desde velocidad',
      response: 'Plantea la integral ∫₀⁴ v(t) dt, encuentra la antiderivada de v(t), y evalúa en t=4 y t=0. Eso te da la distancia total.',
      type: 'hint',
      contextRelevance: ['application'],
    },
  ],

  apoyo_fracciones: [
    {
      id: 'SANTI_FRAC_001',
      level: 0,
      keyword: ['fracciones', 'MCM', 'mínimo común múltiplo', 'sumar fracciones', 'dividir fracciones'],
      question: 'fracciones apoyo',
      response: 'Las fracciones representan partes de un todo. Para sumarlas con denominadores diferentes necesitas el menor común múltiplo y luego sumar los numeradores.',
      type: 'support',
      contextRelevance: ['fractions'],
    },
    {
      id: 'SANTI_FRAC_002',
      level: 0,
      keyword: ['simplificar fracción', 'simplificar', 'numerador denominador', 'MCD'],
      question: 'simplificar fracción',
      response: 'Para simplificar una fracción factoriza numerador y denominador y cancela los factores comunes. Por ejemplo, 6/9 = 2/3.',
      type: 'support',
      contextRelevance: ['fractions'],
    },
  ],

  apoyo_potencias: [
    {
      id: 'SANTI_POT_001',
      level: 0,
      keyword: ['potencias', 'exponentes', 'potencia de potencia', 'x²³', 'x^2^3'],
      question: 'potencia de potencia',
      response: 'Las potencias representan multiplicaciones repetidas. Cuando una potencia está elevada a otra potencia, sus exponentes se multiplican.',
      type: 'support',
      contextRelevance: ['powers'],
    },
    {
      id: 'SANTI_POT_002',
      level: 0,
      keyword: ['potencia negativa', 'x^-2', 'exponente negativo', '1/x²'],
      question: 'potencia negativa',
      response: 'Una potencia negativa indica el inverso. Por ejemplo, x⁻² = 1/x².',
      type: 'support',
      contextRelevance: ['powers'],
    },
  ],

  memes: [
    {
      id: 'MEME_001',
      level: 0,
      keyword: ['meme', 'chiste', 'divertido', 'risa', 'broma'],
      question: 'meme de cálculo',
      response: 'Aquí tienes un meme para subir el ánimo mientras repasas integrales.',
      image: '/memes/meme1.svg',
      type: 'meme',
      contextRelevance: ['meme', 'motivation'],
    },
    {
      id: 'MEME_002',
      level: 0,
      keyword: ['motiva', 'inspiración', 'ánimo', 'no entiendo', 'confundido'],
      question: 'necesito motivación',
      response: 'No estás solo. El camino del cálculo tiene sus trolls, pero SIGMA está aquí para hacerte reír y seguir adelante.',
      image: '/memes/meme2.svg',
      type: 'meme',
      contextRelevance: ['motivation', 'support'],
    },
    {
      id: 'MEME_003',
      level: 0,
      keyword: ['santi', 'apoyo', 'fracciones', 'potencias', 'meme'],
      question: 'meme santiago',
      response: 'SANTI aprueba este mensaje: fracciones + potencias = súper poder. Dale con ganas.',
      image: '/memes/meme3.svg',
      type: 'meme',
      contextRelevance: ['meme', 'support'],
    },
    {
      id: 'MEME_004',
      level: 0,
      keyword: ['meme nuevo', 'humor', 'gracioso', 'png', 'memes'],
      question: 'meme png 1',
      response: 'Un meme fresco en PNG para que cambie el ánimo y sigas con energía.',
      image: '/memes/20260506_220050589_iOS.png',
      type: 'meme',
      contextRelevance: ['meme', 'motivation'],
    },
    {
      id: 'MEME_005',
      level: 0,
      keyword: ['otro meme', 'chiste nuevo', 'png', 'risa'],
      question: 'meme png 2',
      response: 'Listo, aquí va otro meme en PNG para que no te quedes con el mismo siempre.',
      image: '/memes/20260506_220150105_iOS.png',
      type: 'meme',
      contextRelevance: ['meme', 'motivation'],
    },
  ],

  fallback: [
    {
      id: 'FB_001',
      level: 0,
      keyword: ['hola', 'buenos días', 'hey', 'qué tal'],
      question: 'saludo',
      response: '¡Hola! Soy SIGMA, tu asistente pedagógico. Pregúntame sobre integrales, derivadas, potencias o fracciones y te doy una pista clara.',
      type: 'fallback',
      contextRelevance: ['greeting'],
    },
    {
      id: 'FB_002',
      level: 0,
      keyword: ['no entiendo', 'ayuda', 'difícil', 'confundido'],
      question: 'ayuda general',
      response: 'Vamos paso a paso. Dime la parte que te confunde y te doy una pista orientada a tu nivel.',
      type: 'fallback',
      contextRelevance: ['help'],
    },
    {
      id: 'FB_003',
      level: 0,
      keyword: ['nivel 1', 'nivel 2', 'qué nivel', 'nivel actual'],
      question: 'info nivel',
      response: 'Nivel 1 es integral indefinida y nivel 2 es integral definida. Pregúntame por cualquier regla o por qué aparece la C.',
      type: 'fallback',
      contextRelevance: ['level_info'],
    },
  ],
};

export function flattenResponses() {
  return Object.values(SIGMA_RESPONSES).flat();
}

export function findBestResponse(query, currentLevel = 1, personality = 'coach') {
  const allResponses = flattenResponses();
  const normalizedQuery = String(query || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
  const persona = String(personality).toLowerCase();

  const scoreForMatch = (keyword) => {
    if (!keyword) return 0;
    const normalizedKeyword = String(keyword).toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
    if (normalizedQuery.includes(normalizedKeyword)) {
      return normalizedKeyword.length > 8 ? 14 : 9;
    }
    const words = normalizedKeyword.split(/\s+/).filter(Boolean);
    if (words.every((word) => normalizedQuery.includes(word))) {
      return 8;
    }
    return 0;
  };

  const matchKeywords = (keywords = []) => keywords.reduce((sum, keyword) => sum + scoreForMatch(keyword), 0);
  const includesAny = (terms) => terms.some((term) => normalizedQuery.includes(term));
  const isMemeRequest = includesAny(['meme', 'chiste', 'risa', 'broma', 'humor', 'png']);
  const isMotivationRequest = includesAny(['motiva', 'ánimo', 'inspiración', 'motivación', 'no entiendo', 'difícil', 'confundido']);
  const isHintRequest = includesAny(['casi', 'falla', 'error', 'no sé', 'no se', 'me equivoco', 'ayuda']);
  const isCorrectRequest = includesAny(['bien', 'correcto', 'perfecto', 'genial', 'listo']);

  let bestMatch = null;
  // Umbral: el score base por nivel (13) NO basta. Exigimos que exista un
  // match real (keyword o trigger contextual) para devolver una respuesta.
  let bestScore = 13;
  const hasAnyTrigger = isMemeRequest || isMotivationRequest || isHintRequest || isCorrectRequest;

  allResponses.forEach((response) => {
    let score = 0;
    const isLevelMatch = response.level === 0 || response.level === currentLevel;
    if (!isLevelMatch) return;

    const keywordScore = matchKeywords(response.keyword);
    // Si no hay keyword match ni triggers contextuales, no consideramos esta
    // respuesta como candidata (evita devolver "fracciones" para "cómo estás").
    if (keywordScore === 0 && !hasAnyTrigger) return;

    score += 13;
    score += keywordScore;

    if (normalizedQuery.includes('integral') && response.contextRelevance.includes('integration')) score += 6;
    if (includesAny(['tfc', 'teorema fundamental', 'teorema', 'fundamental']) && response.contextRelevance.includes('ftc')) score += 9;
    if (normalizedQuery.includes('u sustit') && response.contextRelevance.includes('u_substitution')) score += 12;
    if (includesAny(['e^x', 'e x', 'exponencial']) && response.contextRelevance.includes('exp_integral')) score += 10;
    if (includesAny(['sin(x)', 'cos(x)', 'trig', 'trigonométrica', 'seno', 'coseno']) && response.contextRelevance.includes('trigonometric')) score += 10;
    if (isMemeRequest) score += response.type === 'meme' || response.contextRelevance.includes('meme') ? 18 : 0;
    if (isMotivationRequest) score += response.contextRelevance.includes('motivation') || response.type === 'support' ? 12 : 0;
    if (isHintRequest) score += response.type === 'hint' ? 8 : 0;
    if (isCorrectRequest) score += response.type === 'correct' ? 8 : 0;

    if (persona === 'meme') {
      score += response.type === 'meme' ? 18 : 0;
      score += response.contextRelevance.includes('motivation') ? 6 : 0;
    }
    if (persona === 'coach') {
      score += ['hint', 'correct', 'support'].includes(response.type) ? 12 : 0;
      score += response.contextRelevance.includes('motivation') ? 4 : 0;
    }
    if (persona === 'techy') {
      score += ['correct', 'hint'].includes(response.type) ? 10 : 0;
      score += response.contextRelevance.some((tag) => ['integration', 'ftc', 'power_rule', 'antiderivative', 'linearity', 'constant_of_integration', 'limits', 'exp_integral'].includes(tag)) ? 8 : 0;
    }
    if (persona === 'tutor') {
      score += ['hint', 'support'].includes(response.type) ? 14 : 0;
      score += response.contextRelevance.includes('help') ? 6 : 0;
    }
    if (persona === 'zen') {
      score += response.type === 'support' || response.type === 'fallback' ? 14 : 0;
      score += response.contextRelevance.includes('motivation') ? 10 : 0;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = response;
    }
  });

  if (!bestMatch) {
    if (persona === 'meme' || isMemeRequest) {
      const memes = SIGMA_RESPONSES.memes || [];
      if (memes.length > 0) {
        return memes[Math.floor(Math.random() * memes.length)];
      }
    }
    return SIGMA_RESPONSES.fallback[0];
  }

  if (persona === 'meme' && bestMatch.type !== 'meme') {
    const memes = SIGMA_RESPONSES.memes || [];
    if (memes.length > 0) {
      return memes[Math.floor(Math.random() * memes.length)];
    }
  }

  if (isMemeRequest && bestMatch.type !== 'meme') {
    const memes = SIGMA_RESPONSES.memes || [];
    if (memes.length > 0) {
      return memes[Math.floor(Math.random() * memes.length)];
    }
  }

  return bestMatch;
}
