/**
 * SIGMA - Base de respuestas predeterminadas
 * Categorizadas por contexto (nivel, tipo de pregunta, dificultad)
 * Guardadas localmente en IndexedDB
 */

export const SIGMA_RESPONSES = {
  // ════════════════════════════════════════════════════════════════════════
  // NIVEL 1: REPASO DE BASES (Fracciones, Potencias, Derivadas)
  // ════════════════════════════════════════════════════════════════════════
  
  nivel_1_potencias: [
    {
      id: 'L1_POT_001',
      level: 1,
      keyword: ['potencia', 'exponente', 'x²', 'x³', 'elevado'],
      question: 'cómo sumo potencias',
      response: '¿Recuerdas que para sumar potencias, los exponentes deben ser iguales? Por ejemplo, x² + 3x² = 4x². ¿Esto aplica a tu ejercicio?',
      alternatives: [
        'La regla es: solo puedes sumar términos con el mismo exponente.',
        '¿Tienes términos semejantes? Verifica que la variable y el exponente sean idénticos.',
      ],
      type: 'guiding', // socratic
      contextRelevance: ['fraction_review', 'power_rules']
    },
    {
      id: 'L1_POT_002',
      level: 1,
      keyword: ['multiplicar potencias', 'x² × x³'],
      question: 'multiplicar potencias exponentes',
      response: '¿Recuerdas qué hacer cuando multiplicas potencias con la misma base? Piensa en x² × x³... ¿Sumarías los exponentes?',
      alternatives: [
        'Pista: cuando multiplicas potencias con misma base, SUMAS los exponentes.',
        'x² × x³ = x^(2+3) = x⁵. ¿Lo ves?'
      ],
      type: 'guiding',
      contextRelevance: ['power_rules', 'prerequisites']
    },
    {
      id: 'L1_POT_003',
      level: 1,
      keyword: ['división potencias', 'x⁵ ÷ x²', 'dividir exponentes'],
      question: 'dividir potencias misma base',
      response: '¿Y para dividir potencias? Si tienes x⁵ ÷ x²... ¿Qué haces con los exponentes?',
      alternatives: [
        'División de potencias: RESTAS los exponentes. x⁵ ÷ x² = x³',
        'Recuerda: multiplicación suma, división resta.'
      ],
      type: 'guiding',
      contextRelevance: ['power_rules']
    },
    {
      id: 'L1_POT_004',
      level: 1,
      keyword: ['potencia negativa', 'x⁻²', 'exponente negativo'],
      question: 'potencia negativa qué significa',
      response: '¿Qué significa un exponente negativo? ¿Cómo se relaciona con fracciones?',
      alternatives: [
        'x⁻² = 1/x². El exponente negativo indica un inverso.',
        'Piensa en ello como: potencia negativa = 1 sobre potencia positiva'
      ],
      type: 'guiding',
      contextRelevance: ['negative_exponents']
    }
  ],

  nivel_1_derivadas: [
    {
      id: 'L1_DER_001',
      level: 1,
      keyword: ['derivada', 'regla potencia', "d/dx", 'derivar x²'],
      question: 'cómo derivar x al cuadrado',
      response: '¿Recuerdas la regla de la potencia para derivadas? Si tienes f(x) = x², ¿cuál es f\'(x)?',
      alternatives: [
        'Pista: Regla de potencia: d/dx(xⁿ) = n·x^(n-1)',
        'Para x², aplicarías: 2·x^(2-1) = 2x'
      ],
      type: 'guiding',
      contextRelevance: ['power_rule_derivatives', 'basics']
    },
    {
      id: 'L1_DER_002',
      level: 1,
      keyword: ['derivada constante', 'derivar 5', 'número'],
      question: 'derivada número constante',
      response: '¿Qué pasa cuando derivas una constante? ¿Recuerdas?',
      alternatives: [
        'La derivada de cualquier constante es 0. d/dx(5) = 0',
        'Esto tiene sentido: una constante no cambia, así que su tasa de cambio es cero.'
      ],
      type: 'guiding',
      contextRelevance: ['constant_rule']
    },
    {
      id: 'L1_DER_003',
      level: 1,
      keyword: ['derivada suma', 'derivar suma términos', 'linealidad'],
      question: 'derivar suma términos separados',
      response: '¿Puedes derivar cada término por separado o debes hacerlo todo junto?',
      alternatives: [
        'Pista: La derivada es lineal. Puedes derivar término por término.',
        'd/dx(x² + 3x) = d/dx(x²) + d/dx(3x) = 2x + 3'
      ],
      type: 'guiding',
      contextRelevance: ['linearity_rule']
    }
  ],

  nivel_1_fracciones: [
    {
      id: 'L1_FRAC_001',
      level: 1,
      keyword: ['fracción', 'simplificar', 'mínimo común denominador'],
      question: 'cómo simplificar fracción',
      response: '¿Buscas el máximo común divisor entre numerador y denominador?',
      alternatives: [
        'Factoriza numerador y denominador, luego cancela los factores comunes.',
        'Ejemplo: 6/9 = (2·3)/(3·3) = 2/3'
      ],
      type: 'guiding',
      contextRelevance: ['fraction_arithmetic']
    }
  ],

  // ════════════════════════════════════════════════════════════════════════
  // NIVEL 2: INTEGRAL INDEFINIDA
  // ════════════════════════════════════════════════════════════════════════

  nivel_2_integral_indefinida: [
    {
      id: 'L2_INT_001',
      level: 2,
      keyword: ['integral indefinida', '∫', 'antiderivada'],
      question: 'qué es integral indefinida',
      response: '¿Recuerdas que una integral indefinida es lo opuesto a una derivada? Es encontrar una función cuya derivada es la que tienes.',
      alternatives: [
        'La integral ∫f(x)dx = F(x) + C, donde F\'(x) = f(x)',
        'La C es la constante de integración, ¡no la olvides!'
      ],
      type: 'guiding',
      contextRelevance: ['antiderivative', 'indefinite_integral']
    },
    {
      id: 'L2_INT_002',
      level: 2,
      keyword: ['regla potencia integral', '∫xⁿ', 'antiderivada potencia'],
      question: 'integral de potencia',
      response: '¿Cuál es la antiderivada de xⁿ? Piensa en lo opuesto a la derivada.',
      alternatives: [
        'Regla de potencia: ∫xⁿ dx = x^(n+1)/(n+1) + C',
        'Ejemplo: ∫x² dx = x³/3 + C. ¿Lo ves? Subes el exponente y divides.'
      ],
      type: 'guiding',
      contextRelevance: ['power_rule_integration']
    },
    {
      id: 'L2_INT_003',
      level: 2,
      keyword: ['integral suma', 'linealidad integral', '∫(f+g)'],
      question: 'integral suma términos',
      response: '¿Puedes integrar término por término?',
      alternatives: [
        'Sí, la integral es lineal: ∫(f + g)dx = ∫f dx + ∫g dx',
        '∫(x² + 3x) dx = ∫x² dx + ∫3x dx = x³/3 + 3x²/2 + C'
      ],
      type: 'guiding',
      contextRelevance: ['linearity']
    },
    {
      id: 'L2_INT_004',
      level: 2,
      keyword: ['constante integración', 'C', 'por qué C'],
      question: 'por qué constante integración C',
      response: '¿Por qué agregamos una C al final? ¿Qué sucede si derivas x²/2 + C?',
      alternatives: [
        'Porque muchas funciones tienen la misma derivada. La C representa toda familia soluciones.',
        'd/dx(x²/2 + C) = x, sin importar el valor de C.'
      ],
      type: 'guiding',
      contextRelevance: ['constant_of_integration']
    }
  ],

  // ════════════════════════════════════════════════════════════════════════
  // NIVEL 3: INTEGRAL DEFINIDA (Teorema Fundamental)
  // ════════════════════════════════════════════════════════════════════════

  nivel_3_integral_definida: [
    {
      id: 'L3_DEF_001',
      level: 3,
      keyword: ['integral definida', '∫ₐᵇ', 'límites integración'],
      question: 'integral definida vs indefinida',
      response: '¿Cuál es la diferencia principal entre una integral definida ∫ₐᵇ y una indefinida ∫?',
      alternatives: [
        'La definida tiene límites (a y b) y da un número. La indefinida da una función + C.',
        'Integral definida = área bajo la curva entre x=a y x=b'
      ],
      type: 'guiding',
      contextRelevance: ['definite_integral']
    },
    {
      id: 'L3_DEF_002',
      level: 3,
      keyword: ['teorema fundamental cálculo', 'TFC'],
      question: 'teorema fundamental cálculo',
      response: '¿Recuerdas el Teorema Fundamental del Cálculo? Conecta derivadas e integrales.',
      alternatives: [
        '∫ₐᵇ f(x)dx = F(b) - F(a), donde F es antiderivada de f',
        'Significa: primero integras sin límites, luego evalúas en los extremos.'
      ],
      type: 'guiding',
      contextRelevance: ['ftc', 'fundamental_theorem']
    },
    {
      id: 'L3_DEF_003',
      level: 3,
      keyword: ['evaluar integral definida', 'F(b) F(a)'],
      question: 'cómo evaluar integral definida',
      response: '¿Cómo pasas de la antiderivada a un número?',
      alternatives: [
        'Pasos: 1. Integral indefinida ∫f dx = F(x) + C. 2. Ignora C en definida. 3. Calcula F(b) - F(a)',
        'Ejemplo: ∫₀² x dx = [x²/2]₀² = 2²/2 - 0²/2 = 2'
      ],
      type: 'guiding',
      contextRelevance: ['evaluation']
    }
  ],

  // ════════════════════════════════════════════════════════════════════════
  // RESPUESTAS GENERALES (Ánimo, Ayuda)
  // ════════════════════════════════════════════════════════════════════════

  motivational: [
    {
      id: 'MOT_001',
      level: 0,
      keyword: ['ayuda', 'no entiendo', 'difícil', 'confundido'],
      question: 'no entiendo',
      response: '¡Vamos, tú puedes! Cada experto en cálculo comenzó donde estás ahora. Cuéntame específicamente qué parte te confunde.',
      alternatives: [
        '¿Es un concepto específico o un paso del ejercicio? Te ayudaré paso a paso.',
        'La confusión es parte del aprendizaje. Estás en el camino correcto.'
      ],
      type: 'motivational',
      contextRelevance: ['encouragement']
    },
    {
      id: 'MOT_002',
      level: 0,
      keyword: ['bien', 'correcto', 'excelente', '¡sí!'],
      question: 'acerté',
      response: '¡Felicitaciones! Estás en el camino correcto. Sigue así.',
      alternatives: [
        '¡Ese es el espíritu! Acabas de dominar un concepto importante.',
        '¡Excelente trabajo! Ahora intenta el siguiente desafío.'
      ],
      type: 'motivational',
      contextRelevance: ['celebration']
    },
    {
      id: 'MOT_003',
      level: 0,
      keyword: ['intentar de nuevo', 'error', 'intento fallido'],
      question: 'me equivoqué',
      response: 'Los errores son oportunidades de aprendizaje. ¿Quieres que analicemos qué salió mal?',
      alternatives: [
        'Revisa tu trabajo paso a paso. ¿En qué parte dudas?',
        'Los mejores matemáticos cometen errores. ¡Lo importante es aprender!'
      ],
      type: 'motivational',
      contextRelevance: ['error_recovery']
    }
  ],

  // ════════════════════════════════════════════════════════════════════════
  // RESPUESTAS POR DEFECTO (Fallback)
  // ════════════════════════════════════════════════════════════════════════

  fallback: [
    {
      id: 'FB_001',
      level: 0,
      keyword: ['hola', 'hey', 'qué tal'],
      question: 'saludo',
      response: '¡Hola! Soy Sigma, tu asistente pedagógico. ¿Tienes alguna pregunta sobre cálculo integral o necesitas ayuda con un ejercicio?',
      alternatives: [],
      type: 'fallback',
      contextRelevance: ['greeting']
    },
    {
      id: 'FB_002',
      level: 0,
      keyword: ['nivel 1', 'aprender bases'],
      question: 'cuál es nivel 1',
      response: 'El Nivel 1 es "Repaso de Bases": aquí recuerdas fracciones, potencias y derivadas. Fundamentos sólidos para lo que viene.',
      alternatives: [],
      type: 'fallback',
      contextRelevance: ['level_info']
    },
    {
      id: 'FB_003',
      level: 0,
      keyword: ['no sé', 'cuéntame'],
      question: 'ayuda general',
      response: 'Estoy aquí para guiarte. Pregúntame sobre integrales, derivadas, potencias, fracciones... o cuéntame qué ejercicio estás resolviendo.',
      alternatives: [],
      type: 'fallback',
      contextRelevance: ['help']
    }
  ]
};

/**
 * Flatten responses para búsqueda rápida
 */
export function flattenResponses() {
  const flattened = [];
  Object.values(SIGMA_RESPONSES).forEach(category => {
    if (Array.isArray(category)) {
      flattened.push(...category);
    }
  });
  return flattened;
}

/**
 * Buscar respuesta por keywords
 */
export function findBestResponse(query, currentLevel = 1) {
  const allResponses = flattenResponses();
  const queryLower = query.toLowerCase();

  // Score cada respuesta
  let bestMatch = null;
  let bestScore = 0;

  allResponses.forEach(response => {
    let score = 0;

    // Bonus si el nivel coincide
    if (response.level === 0 || response.level === currentLevel) {
      score += 10;
    }

    // Score por keywords
    response.keyword.forEach(keyword => {
      if (queryLower.includes(keyword)) {
        score += 5;
      }
    });

    // Si score es mejor, actualiza
    if (score > bestScore) {
      bestScore = score;
      bestMatch = response;
    }
  });

  // Si no encuentra coincidencia, retorna fallback aleatorio
  return bestMatch || SIGMA_RESPONSES.fallback[0];
}
