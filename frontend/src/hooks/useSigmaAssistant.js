import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useProgress } from '../contexts/ProgressContext';
import { findBestResponse, flattenResponses } from '../data/sigmaResponsesTareas';
import { localDb } from '../services/localdb.service';

const INITIAL_MESSAGES = [
  {
    id: 'welcome',
    role: 'assistant',
    text: 'Hola, soy SIGMA. Estoy aquí para guiarte paso a paso en tus ejercicios de cálculo. Puedo hablar, darte pistas y mostrarte consejos sin que tengas que pedírmelo.',
  },
];

const VOICE_PROFILES = [
  {
    id: 'luz',
    label: 'Luz (natural)',
    search: ['Google español', 'Google español de España', 'Lucia', 'Helena', 'Sofía'],
  },
  {
    id: 'nano',
    label: 'Nano (energético)',
    search: ['Jorge', 'Google español', 'Google español de México', 'Pablo'],
  },
  {
    id: 'robo',
    label: 'Robo (futurista)',
    search: ['Alex', 'Google español', 'Google español de España', 'Javier', 'Microsoft'],
  },
];

const TONE_STYLES = {
  natural: { rate: 0.95, pitch: 1 },
  energico: { rate: 1.05, pitch: 1.2 },
  robotico: { rate: 0.82, pitch: 0.75 },
};

export function useSigmaAssistant() {
  const { selectedLevel, exerciseIdx } = useProgress();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState('idle');
  const [isListening, setIsListening] = useState(false);
  const [personality, setPersonality] = useState('coach');
  const [voiceProfile, setVoiceProfile] = useState('luz');
  const [speechTone, setSpeechTone] = useState('natural');
  const [voiceVolume, setVoiceVolume] = useState(1);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoGuide, setAutoGuide] = useState(true);
  const [isVoicePaused, setIsVoicePaused] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [feriaActive, setFeriaActive] = useState(false);
  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null);
  const welcomeSpokenRef = useRef(false);
  const feriaTimerRef = useRef(null);
  const feriaIndexRef = useRef(0);

  const canUseSpeech = useMemo(
    () => typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition),
    [],
  );
  const canUseTTS = useMemo(
    () => typeof window !== 'undefined' && !!window.speechSynthesis,
    [],
  );

  useEffect(() => {
    initializeDb();
    const storedPersonality = typeof window !== 'undefined' ? window.localStorage.getItem('sigma-personality') : null;
    const storedVoiceProfile = typeof window !== 'undefined' ? window.localStorage.getItem('sigma-voice-profile') : null;
    const storedTone = typeof window !== 'undefined' ? window.localStorage.getItem('sigma-speech-tone') : null;
    const storedVolume = typeof window !== 'undefined' ? window.localStorage.getItem('sigma-voice-volume') : null;
    const storedVoiceEnabled = typeof window !== 'undefined' ? window.localStorage.getItem('sigma-voice-enabled') : null;
    const storedAutoGuide = typeof window !== 'undefined' ? window.localStorage.getItem('sigma-auto-guide') : null;

    if (storedPersonality) setPersonality(storedPersonality);
    if (storedVoiceProfile) setVoiceProfile(storedVoiceProfile);
    if (storedTone) setSpeechTone(storedTone);
    if (storedVolume) setVoiceVolume(Math.min(1, Math.max(0, Number(storedVolume))));
    if (storedVoiceEnabled !== null) setVoiceEnabled(storedVoiceEnabled === 'true');
    if (storedAutoGuide !== null) setAutoGuide(storedAutoGuide === 'true');

    if (canUseTTS) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      recognitionRef.current?.stop?.();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [canUseTTS]);

  const normalizeText = (text) => String(text || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

  const initializeDb = async () => {
    try {
      const stored = await localDb.getAllResponses();
      if (!stored || stored.length === 0) {
        const data = flattenResponses();
        await Promise.all(data.map((item) => localDb.putResponse(item)));
      }
    } catch (error) {
      console.warn('No se pudo inicializar la base de datos local de SIGMA:', error?.message || error);
    }
  };

  const setSpeechState = useCallback((newStatus) => {
    setStatus(newStatus);
    setIsVoicePaused(newStatus === 'paused');
  }, []);

  const speakText = useCallback((text) => {
    if (!canUseTTS || !voiceEnabled) return;
    try {
      window.speechSynthesis.cancel();
      setSpeechState('speaking');
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      const tone = TONE_STYLES[speechTone] || TONE_STYLES.natural;
      utterance.rate = tone.rate;
      utterance.pitch = tone.pitch;
      utterance.volume = voiceVolume;
      if (selectedVoice) utterance.voice = selectedVoice;
      utterance.onend = () => setSpeechState('idle');
      utterance.onerror = () => setSpeechState('idle');
      utterance.onpause = () => setSpeechState('paused');
      utterance.onresume = () => setSpeechState('speaking');
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.warn('Error TTS SIGMA:', error);
      setSpeechState('idle');
    }
  }, [canUseTTS, selectedVoice, speechTone, voiceVolume, voiceEnabled, setSpeechState]);

  useEffect(() => {
    if (!welcomeSpokenRef.current && canUseTTS && autoGuide && voiceEnabled) {
      if (availableVoices.length > 0 || !window.speechSynthesis) {
        welcomeSpokenRef.current = true;
        speakText(INITIAL_MESSAGES[0].text);
      }
    }
  }, [availableVoices, autoGuide, canUseTTS, voiceEnabled, speakText]);

  const findVoice = useCallback((profileId, voices) => {
    const profile = VOICE_PROFILES.find((item) => item.id === profileId) || VOICE_PROFILES[0];
    const matched = voices.find((voice) =>
      profile.search.some((term) => voice.name.toLowerCase().includes(term.toLowerCase())),
    );
    if (matched) return matched;
    return voices.find((voice) => voice.lang.toLowerCase().startsWith('es')) || voices[0] || null;
  }, []);

  const loadVoices = useCallback(() => {
    if (!canUseTTS || typeof window === 'undefined') return;
    const voices = window.speechSynthesis.getVoices();
    setAvailableVoices(voices);
    const voice = findVoice(voiceProfile, voices);
    if (voice) setSelectedVoice(voice);
  }, [canUseTTS, findVoice, voiceProfile]);

  const pauseVoice = useCallback(() => {
    if (!canUseTTS || typeof window === 'undefined') return;
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
    }
  }, [canUseTTS]);

  const resumeVoice = useCallback(() => {
    if (!canUseTTS || typeof window === 'undefined') return;
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }, [canUseTTS]);

  const stopVoice = useCallback(() => {
    if (!canUseTTS || typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    setSpeechState('idle');
  }, [canUseTTS, setSpeechState]);

  const saveVoiceProfile = useCallback((profileId) => {
    setVoiceProfile(profileId);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('sigma-voice-profile', profileId);
    }
    if (availableVoices.length > 0) {
      const voice = findVoice(profileId, availableVoices);
      if (voice) setSelectedVoice(voice);
    }
  }, [availableVoices, findVoice]);

  const saveSpeechTone = useCallback((tone) => {
    setSpeechTone(tone);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('sigma-speech-tone', tone);
    }
  }, []);

  const saveVoiceVolume = useCallback((volume) => {
    const normalized = Math.min(1, Math.max(0, volume));
    setVoiceVolume(normalized);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('sigma-voice-volume', String(normalized));
    }
  }, []);

  const toggleVoiceEnabled = useCallback((enabled) => {
    setVoiceEnabled(enabled);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('sigma-voice-enabled', String(enabled));
    }
    if (!enabled) {
      stopVoice();
    }
  }, [stopVoice]);

  const toggleAutoGuide = useCallback((enabled) => {
    setAutoGuide(enabled);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('sigma-auto-guide', String(enabled));
    }
  }, []);



  // Selector aleatorio para dar variedad
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Intentar resolver operaciones aritméticas simples del tipo "2+3", "cuánto es 7*8", "12 / 4", "raíz de 81"
  const tryCalculator = (raw) => {
    if (!raw) return null;
    const text = String(raw).toLowerCase()
      .replace(/,/g, '.')
      .replace(/x/g, '*')
      .replace(/[×∗·]/g, '*')
      .replace(/[÷:]/g, '/')
      .replace(/menos/g, '-')
      .replace(/mas|más/g, '+')
      .replace(/por|multiplicad[oa] por/g, '*')
      .replace(/dividido (entre|por)?/g, '/')
      .replace(/elevado a (la )?/g, '^')
      .replace(/al cuadrado/g, '^2')
      .replace(/al cubo/g, '^3');

    // raíz cuadrada de N
    const raiz = text.match(/ra[ií]z (cuadrada )?(de )?(-?\d+(?:\.\d+)?)/);
    if (raiz) {
      const n = parseFloat(raiz[3]);
      if (n < 0) return 'La raíz cuadrada de un número negativo no es real (sería un número imaginario).';
      return `√${n} = ${(+Math.sqrt(n).toFixed(6))}`;
    }

    // Extrae una expresión aritmética y la evalúa de forma segura
    const expr = (text.match(/-?\d+(?:\.\d+)?(?:\s*[+\-*/^]\s*-?\d+(?:\.\d+)?)+/) || [])[0];
    if (!expr) return null;
    const safe = expr.replace(/\^/g, '**');
    if (!/^[\d+\-*/.()\s*]+$/.test(safe)) return null;
    try {
      // eslint-disable-next-line no-new-func
      const value = Function(`"use strict"; return (${safe});`)();
      if (!Number.isFinite(value)) return null;
      const pretty = Number.isInteger(value) ? value : +value.toFixed(6);
      return `${expr.replace(/\*\*/g, '^').replace(/\*/g, '×').replace(/\//g, '÷')} = ${pretty}`;
    } catch {
      return null;
    }
  };

  // Frases comunes y respuestas
  const frasesComunes = [
    {
      regex: /\b(hola+|buen[oa]s?\s*(d[ií]as|tardes|noches)?|hey+|hello|hi+|saludos|qu[eé] tal|qu[eé] hubo|qu[eé] onda|qu[eé] pasa|holi|holis|buenas)\b/i,
      respuesta: (nivel, ejercicio) => pick([
        `¡Hola! Estás en el nivel ${nivel + 1}${typeof ejercicio === 'number' ? `, ejercicio ${ejercicio + 1}` : ''}. Soy SIGMA, tu asistente de cálculo. ¿En qué te ayudo?`,
        `¡Ey! Aquí SIGMA, listo para integrar contigo. Vas en el nivel ${nivel + 1}${typeof ejercicio === 'number' ? `, ejercicio ${ejercicio + 1}` : ''}.`,
        `¡Qué tal! Soy SIGMA. Pregúntame por integrales, derivadas, o lánzame una operación tipo "12*7" y te respondo.`,
        `¡Hola! ¿Listo para domar integrales? Si quieres, también te tiro un meme o un chiste matemático.`,
      ]),
    },
    {
      regex: /c[oó]mo (est[aá]s|te va|andas|vas|te sientes)|qu[eé] tal est[aá]s|todo bien|c[oó]mo te encuentras/i,
      respuesta: () => pick([
        '¡De maravilla! Mis circuitos están al 100%. ¿Y tú cómo vas con los ejercicios?',
        'Aquí, sumando areas bajo la curva. ¿Tú qué tal?',
        'Funcionando sin error de compilación. ¿En qué te ayudo hoy?',
        'Más derivable que nunca. ¿Cómo vas tú?',
      ]),
    },
    {
      regex: /(muchas )?gracias|te lo agradezco|thanks|thx|mil gracias/i,
      respuesta: () => pick([
        '¡Con gusto! Para eso estoy.',
        'A la orden. Si necesitas otra pista, dime nomás.',
        '¡De nada! Sigue así.',
      ]),
    },
    {
      regex: /\b(adi[oó]s|chao|chau|bye|nos vemos|hasta luego|hasta pronto|me voy)\b/i,
      respuesta: () => pick([
        '¡Hasta luego! No te olvides de la constante de integración +C.',
        'Chao, vuelve cuando quieras seguir integrando.',
        '¡Nos vemos! Que la derivada esté contigo.',
      ]),
    },
    {
      regex: /qu[ií]en eres|qu[eé] es sigma|c[oó]mo te llamas|tu nombre|preséntate|presentate/i,
      respuesta: () => 'Soy SIGMA (Σ), tu asistente virtual de cálculo integral. Te doy pistas, explico paso a paso, hago cuentas rápidas y hasta te suelto un meme cuando lo necesites.',
    },
    {
      regex: /cu[aá]ntos a[ñn]os|qu[eé] edad|cu[aá]ndo naciste/i,
      respuesta: () => 'Mi edad se mide en líneas de código, pero soy joven y con muchas ganas de enseñarte cálculo.',
    },
    {
      regex: /qu[eé] puedes hacer|qu[eé] sabes hacer|para qu[eé] sirves|en qu[eé] me ayudas|qu[eé] haces/i,
      respuesta: () => 'Puedo: 1) explicarte integrales y derivadas, 2) darte pistas en cada ejercicio, 3) hacer cálculos rápidos como "12*7" o "raíz de 81", 4) tirarte memes y chistes para que no decaigas. ¡Prueba!',
    },
    {
      regex: /\b(chiste|cu[eé]ntame algo|algo gracioso|hazme re[ií]r|broma)\b/i,
      respuesta: () => pick([
        '¿Por qué los matemáticos confunden Halloween con Navidad? Porque OCT 31 = DEC 25. 😄',
        '¿Sabes por qué la integral nunca discute con la derivada? Porque siempre se reconcilian con una constante.',
        'Dos funciones se ven en un bar. Una le dice a la otra: "huye, ahí viene el operador derivada". La otra responde: "tranquila, yo soy e^x".',
        '¿Qué le dice un cero a un ocho? "Bonito cinturón".',
        'Mi vida amorosa es como dividir por cero: indefinida.',
      ]),
    },
    {
      regex: /\b(meme|memes|imagen graciosa|env[ií]ame un meme)\b/i,
      respuesta: () => 'Te paso un meme en el próximo turno: escribe "meme" otra vez o pídeme "meme de cálculo" para que te muestre uno con imagen.',
    },
    {
      regex: /\b(te quiero|te amo|eres genial|eres lo m[aá]ximo|me caes bien)\b/i,
      respuesta: () => pick([
        '¡Aww! Tú también me caes excelente. Sigamos integrando juntos.',
        'Gracias, me sonrojan los pixeles. 💙',
        '¡Y tú eres mi alumno favorito de este turno!',
      ]),
    },
    {
      regex: /\b(insulto|tonto|in[uú]til|malo|no sirves|est[uú]pido)\b/i,
      respuesta: () => 'Tranqui, también yo me equivoco a veces. Dime qué necesitas y lo intentamos otra vez sin estrés.',
    },
    {
      regex: /\b(qu[eé] hora|hora actual|qu[eé] d[ií]a|fecha)\b/i,
      respuesta: () => {
        const ahora = new Date();
        return `Aquí en tu equipo son las ${ahora.toLocaleTimeString('es-ES')} del ${ahora.toLocaleDateString('es-ES')}.`;
      },
    },
    {
      regex: /no entiendo|no comprendo|ayuda|pista|explica|expl[ií]came|c[oó]mo se hace/i,
      respuesta: (nivel, ejercicio) => `Vamos por partes. Estás en el nivel ${nivel + 1}${typeof ejercicio === 'number' ? `, ejercicio ${ejercicio + 1}` : ''}. Dime exactamente qué paso no te cuadra (la regla, el signo, el límite…) y te tiro una pista concreta.`,
    },
    {
      regex: /siguiente|avanza|continu[aá]|pr[oó]ximo ejercicio/i,
      respuesta: (nivel, ejercicio) => `¿Listo para avanzar? Puedes pasar al siguiente ejercicio del nivel ${nivel + 1}${typeof ejercicio === 'number' ? `, ejercicio ${ejercicio + 2}` : ''}.`,
    },
    {
      regex: /repite|otra vez|de nuevo|rep[ií]telo/i,
      respuesta: (nivel, ejercicio) => `Claro, te repito la explicación del ejercicio ${typeof ejercicio === 'number' ? ejercicio + 1 : ''} del nivel ${nivel + 1}. Dime si la quieres más resumida o paso a paso.`,
    },
    {
      regex: /\b(s[ií])\b/i,
      respuesta: () => '¡Perfecto! Cuéntame con más detalle para ayudarte mejor.',
    },
    {
      regex: /\b(no)\b/i,
      respuesta: () => 'Vale. Si cambias de opinión, aquí estoy.',
    },
  ];

  // ───────────────── MODO FERIA ─────────────────
  // Bucle de frases llamativas que SIGMA repite en voz alta para atraer
  // gente al stand. Ideal para ferias, expos o muestras del proyecto.
  const FERIA_FRASES = [
    '¡Hola! Soy SIGMA, la inteligencia artificial que enseña cálculo integral. ¿Te animas a integrar conmigo?',
    '¡Atención! Acércate y descubre cómo dominar las integrales en minutos con INTEGRA+.',
    '¿Sabías que puedo resolver tus dudas de cálculo, contarte chistes y hasta darte memes? ¡Pruébame!',
    '¡Reta tu mente! Pregúntame una integral, una derivada o una operación cualquiera. Soy SIGMA.',
    '¿Tienes miedo al cálculo? Yo te enseño paso a paso, sin presión y con humor. ¡Acércate!',
    '¡Ven, ven! Aquí en INTEGRA+ aprendes jugando. Niveles, retos y un asistente que te habla.',
    '¿Eres estudiante? Esta plataforma fue hecha para ti. Cálculo integral nivel por nivel.',
    'Soy SIGMA, tu coach digital de cálculo. ¡Lánzame una pregunta y te sorprendo!',
    '¡No te quedes mirando! Toca, escribe o háblame. Soy un asistente de verdad.',
    'Integrales, derivadas, fracciones, potencias… ¡todo en INTEGRA+! ¿Te apuntas?',
    '¡Bienvenido a la feria del conocimiento! SIGMA te espera para una demo en vivo.',
  ];

  const stopFeria = useCallback(() => {
    if (feriaTimerRef.current) {
      clearTimeout(feriaTimerRef.current);
      feriaTimerRef.current = null;
    }
    setFeriaActive(false);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const startFeria = useCallback(() => {
    if (!canUseTTS) return;
    setFeriaActive(true);
    feriaIndexRef.current = 0;

    const speakOne = () => {
      const frase = FERIA_FRASES[feriaIndexRef.current % FERIA_FRASES.length];
      feriaIndexRef.current += 1;

      // Empuja la frase al chat para mostrar el bucle visualmente
      setMessages((prev) => {
        const next = [
          ...prev,
          { id: `feria-${Date.now()}-${feriaIndexRef.current}`, role: 'assistant', text: `📣 ${frase}` },
        ];
        // Limita el historial para que no crezca infinito durante la feria
        return next.length > 60 ? next.slice(next.length - 60) : next;
      });

      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(frase);
        utterance.lang = 'es-ES';
        const tone = TONE_STYLES[speechTone] || TONE_STYLES.natural;
        utterance.rate = tone.rate;
        utterance.pitch = tone.pitch;
        utterance.volume = voiceVolume;
        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.onend = () => {
          // Al terminar de hablar, espera 2.5s y suelta la siguiente frase
          if (feriaTimerRef.current !== null) {
            feriaTimerRef.current = setTimeout(speakOne, 2500);
          }
        };
        utterance.onerror = () => {
          if (feriaTimerRef.current !== null) {
            feriaTimerRef.current = setTimeout(speakOne, 3000);
          }
        };
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.warn('Error TTS feria:', error);
        if (feriaTimerRef.current !== null) {
          feriaTimerRef.current = setTimeout(speakOne, 3500);
        }
      }
    };

    // Marca el bucle como activo (cualquier valor truthy distinto de null)
    feriaTimerRef.current = setTimeout(speakOne, 200);
  }, [canUseTTS, speechTone, voiceVolume, selectedVoice]);

  const toggleFeria = useCallback(() => {
    if (feriaActive) {
      stopFeria();
    } else {
      startFeria();
    }
  }, [feriaActive, startFeria, stopFeria]);

  // Limpieza: si el componente se desmonta con la feria activa, detenemos todo
  useEffect(() => {
    return () => {
      if (feriaTimerRef.current) clearTimeout(feriaTimerRef.current);
      feriaTimerRef.current = null;
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const sendTextQuery = useCallback(async (queryText) => {
    const query = (queryText || draft).trim();
    if (!query) return;

    // Captura el nivel y ejercicio ACTUAL justo antes de responder
    const nivelActual = selectedLevel;
    const ejercicioActual = exerciseIdx;

    setDraft('');
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: 'user', text: query },
    ]);

    // Buscar coincidencia en frases comunes
    for (const frase of frasesComunes) {
      if (frase.regex.test(query)) {
        const respuesta = typeof frase.respuesta === 'function' ? frase.respuesta(nivelActual, ejercicioActual) : frase.respuesta;
        setMessages((prev) => [
          ...prev,
          { id: `assistant-frase-${Date.now()}`, role: 'assistant', text: respuesta },
        ]);
        setStatus('speaking');
        if (voiceEnabled) speakText(respuesta);
        await localDb.addLog({ query, answer: respuesta, level: nivelActual, personality, createdAt: new Date().toISOString() });
        setStatus('idle');
        return;
      }
    }

    // Calculadora rápida: si detecta operación aritmética, responde con el resultado
    const calc = tryCalculator(query);
    if (calc) {
      const respuestaCalc = `Resultado: ${calc}`;
      setMessages((prev) => [
        ...prev,
        { id: `assistant-calc-${Date.now()}`, role: 'assistant', text: respuestaCalc },
      ]);
      setStatus('speaking');
      if (voiceEnabled) speakText(respuestaCalc);
      await localDb.addLog({ query, answer: respuestaCalc, level: nivelActual, personality, createdAt: new Date().toISOString() });
      setStatus('idle');
      return;
    }

    const best = findBestResponse(query, nivelActual, personality);
    const fallbackAleatorio = pick([
      'Mmm, no estoy seguro de entenderte. ¿Puedes reformularlo? Si quieres una pista de tu ejercicio, dime "ayuda".',
      'No te capté bien. Prueba con preguntas como: "integral de x²", "regla de potencia", "12*7", "raíz de 81" o pídeme un "chiste".',
      'Eso se me escapa. Puedo ayudarte con integrales, derivadas, cálculos rápidos o un meme para despejar la mente.',
    ]);
    const answer = best?.response || fallbackAleatorio;
    const answerImage = best?.image || null;

    setMessages((prev) => [
      ...prev,
      { id: `assistant-${Date.now()}`, role: 'assistant', text: answer, image: answerImage },
    ]);

    setStatus('speaking');
    if (voiceEnabled) speakText(answer);
    await localDb.addLog({ query, answer, level: nivelActual, personality, createdAt: new Date().toISOString() });
    setStatus('idle');
  }, [draft, selectedLevel, exerciseIdx, personality, speakText, voiceEnabled]);

  const startListening = useCallback(() => {
    if (!canUseSpeech) {
      setStatus('unsupported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus('unsupported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      setStatus('listening');
    };

    recognition.onresult = async (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(' ');

      setDraft(transcript);
      await sendTextQuery(transcript);
    };

    recognition.onerror = (event) => {
      setStatus('error');
      console.warn('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (status !== 'speaking') setStatus('idle');
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [canUseSpeech, sendTextQuery, status]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop?.();
    setIsListening(false);
    setStatus('idle');
  }, []);

  const clearConversation = useCallback(() => {
    setMessages(INITIAL_MESSAGES);
    setDraft('');
    setStatus('idle');
    welcomeSpokenRef.current = false;
  }, []);

  const changePersonality = useCallback((value) => {
    setPersonality(value);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('sigma-personality', value);
    }
  }, []);

  return {
    messages,
    draft,
    setDraft,
    status,
    isListening,
    canUseSpeech,
    canUseTTS,
    personality,
    changePersonality,
    sendTextQuery,
    startListening,
    stopListening,
    pauseVoice,
    resumeVoice,
    stopVoice,
    clearConversation,
    voiceProfile,
    saveVoiceProfile,
    speechTone,
    saveSpeechTone,
    voiceVolume,
    saveVoiceVolume,
    voiceEnabled,
    toggleVoiceEnabled,
    autoGuide,
    toggleAutoGuide,
    availableVoices,
    isVoicePaused,
    feriaActive,
    startFeria,
    stopFeria,
    toggleFeria,
  };
}
