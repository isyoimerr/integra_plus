import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../../contexts/ProgressContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LEVEL_CONFIG } from '../../data/levelConfig';
import { Explanation } from '../../components/ui/Explanation';
import { FormulaBlock } from '../../components/ui/Formula';
import SigmaBubble from '../../components/sigma/SigmaBubble';

export default function ResultWrongScreen() {
  const navigate = useNavigate();
  const { t, themeName } = useTheme();
  const { selectedLevel, lastWrong, lives, setLastWrong } = useProgress();
  const lv = LEVEL_CONFIG[selectedLevel] || LEVEL_CONFIG[0];
  const hintBg = themeName === 'dark' ? 'rgba(255,255,255,0.06)' : '#FFF3E0';
  const hintBorder = themeName === 'dark' ? 'rgba(255,255,255,0.12)' : '#FFCC80';
  const completeBg = themeName === 'dark' ? 'rgba(86,204,2,0.12)' : '#E8F5E9';
  const completeBorder = themeName === 'dark' ? 'rgba(86,204,2,0.28)' : '#A5D6A7';
  const answerBg = themeName === 'dark' ? 'rgba(86,204,2,0.12)' : '#E8F5E9';
  const answerBorder = themeName === 'dark' ? 'rgba(86,204,2,0.28)' : '#C8E6C9';
  const formulaBg = themeName === 'dark' ? 'rgba(255,255,255,0.05)' : '#FFF8E1';
  const formulaBorder = themeName === 'dark' ? 'rgba(255,255,255,0.12)' : '#FFE082';
  const [show, setShow] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [floatingRight, setFloatingRight] = useState(20);
  const completeRef = useRef(null);
  useEffect(() => { const id = setTimeout(() => setShow(true), 80); return () => clearTimeout(id); }, []);
  const a = (d) => show ? { animation: `fadeSlideUp 0.4s ${d}s both` } : { opacity: 0 };

  const {
    opciones = [], selectedAnswer, respuestaCorrecta,
    hint, pista, formula, helpUsed,
    explain, explicacion,
  } = lastWrong || {};
  const showHintBlock = showHint || (helpUsed && !showComplete);
  const showCompleteBlock = showComplete;
  const ayudaActiva = helpUsed || showHint || showComplete;

  const rawExplanation = explain || explicacion || '';
  const genericPlaceholder = 'Revisa por qué la opción correcta es mejor y vuelve a intentarlo.';
  const buildFallbackExplanation = () => {
    const explanationLines = [];
    const explanationIsTooShort = rawExplanation.trim().length > 0 && rawExplanation.trim().length < 40;
    if (rawExplanation && rawExplanation !== genericPlaceholder && !explanationIsTooShort) {
      return rawExplanation;
    }
    if (!respuestaCorrecta && !hint && !formula) {
      return rawExplanation || genericPlaceholder;
    }
    if (hint) {
      explanationLines.push(`1. Mira la pista: ${hint}`);
    }
    if (formula) {
      explanationLines.push(`2. Usa la fórmula: ${formula}`);
    }
    if (respuestaCorrecta) {
      explanationLines.push(`3. La respuesta correcta es: ${respuestaCorrecta}`);
    }
    if (selectedAnswer) {
      explanationLines.push(`4. Tu elección fue: ${selectedAnswer}`);
    }
    if (rawExplanation && rawExplanation !== genericPlaceholder) {
      explanationLines.push(`5. Más explicación: ${rawExplanation}`);
    }
    if (!explanationLines.length) {
      return genericPlaceholder;
    }
    return explanationLines.join('\n');
  };
  const completeExplanation = buildFallbackExplanation();

  useEffect(() => {
    // position the floating bubble a bit left from the assistant button to avoid overlap
    const updatePos = () => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 800;
      // if narrow screen, show bubble centered above the assistant with small right margin
      setFloatingRight(w < 520 ? 16 : 92);
    };
    updatePos();
    window.addEventListener('resize', updatePos);
    return () => window.removeEventListener('resize', updatePos);
  }, []);

  useEffect(() => {
    if (showComplete && completeRef.current) {
      // smooth scroll the explanation into view so user sees step-by-step
      try { completeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch(e) { /* ignore */ }
    }
  }, [showComplete]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: t.appBg, overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 20px 24px' }}>
        {/* Ícono incorrecto */}
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ width: 94, height: 94, borderRadius: '50%', background: 'linear-gradient(135deg,#E65100,#F57F17)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 42, color: '#fff', boxShadow: '0 12px 36px rgba(245,127,23,0.42)', animation: show ? 'popIn 0.55s cubic-bezier(0.34,1.56,0.64,1) both' : 'none' }}>✕</div>
          <div style={{ marginTop: 16, fontSize: 28, fontWeight: 800, color: '#E65100', letterSpacing: '-0.5px', ...a(0.2) }}>¡Casi!</div>
          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center', gap: 6, ...a(0.3) }}>
            {[1, 2, 3].map(i => <span key={i} style={{ fontSize: 22, filter: i > lives ? 'grayscale(1) opacity(0.3)' : 'none', transition: 'all 0.3s' }}>❤️</span>)}
            <span style={{ fontSize: 14, color: t.text3, marginLeft: 4, alignSelf: 'center' }}>
              {lives === 0 ? 'Sin intentos' : `${lives} intento${lives !== 1 ? 's' : ''} restante${lives !== 1 ? 's' : ''}`}
            </span>
          </div>
        </div>

        {/* Comparación respuestas */}
        {opciones.length > 0 && (
          <div style={{ background: t.cardBg, borderRadius: 16, padding: '16px 18px', border: '1.5px solid #FFE0B2', marginBottom: 14, boxShadow: '0 2px 14px rgba(245,127,23,0.1)', ...a(0.35) }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#E65100', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 12 }}>Comparación de respuestas</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Respuesta seleccionada (incorrecta) */}
              {selectedAnswer && selectedAnswer !== respuestaCorrecta && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: '#FFEBEE', border: '1.5px solid #FFCDD2' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, background: '#E53935', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>✕</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#C62828', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 3 }}>Tu respuesta</div>
                    <div style={{ fontSize: 17, fontFamily: 'Georgia,serif', fontWeight: 600, color: '#B71C1C' }}>{selectedAnswer}</div>
                  </div>
                </div>
              )}
              {/* Respuesta correcta: ocultada hasta que el usuario pida la explicación completa */}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12, ...a(0.45) }}>
          <button onClick={() => {
              setShowHint(true);
              setLastWrong(prev => prev ? { ...prev, helpUsed: true } : prev);
            }}
            style={{ flex: '1 1 180px', padding: '14px 16px', borderRadius: 14, border: `1.5px solid ${t.cardBorder}`, background: t.appBg, color: t.text, fontWeight: 700, cursor: 'pointer' }}>
            Mostrar pista
          </button>
          <button onClick={() => {
              setShowComplete(true);
              setLastWrong(prev => prev ? { ...prev, helpUsed: true } : prev);
            }}
            style={{ flex: '1 1 180px', padding: '14px 16px', borderRadius: 14, border: 'none', background: lv.headerBg, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
            Mostrar completa
          </button>
        </div>

        {!ayudaActiva && (
          <div style={{ position: 'fixed', bottom: 100, right: floatingRight, zIndex: 1400, maxWidth: '90vw' }}>
            <div style={{ width: Math.min(360, (typeof window !== 'undefined' ? window.innerWidth : 800) - 120), maxWidth: '90vw', maxHeight: '40vh', overflow: 'auto' }}>
              <SigmaBubble state="apoyo">La respuesta correcta se muestra arriba, pero necesitas entender por qué. Pulsa "Mostrar completa" para que SIGMA te explique paso a paso.</SigmaBubble>
            </div>
          </div>
        )}

        {ayudaActiva && (
          <div style={{ position: 'fixed', bottom: 100, right: floatingRight, zIndex: 1400, maxWidth: '90vw' }}>
            <div style={{ width: Math.min(360, (typeof window !== 'undefined' ? window.innerWidth : 800) - 120), maxWidth: '90vw', maxHeight: '40vh', overflow: 'auto' }}>
              <SigmaBubble state="apoyo">Estás usando ayuda de SIGMA. Esto puede bajar tu puntuación y afectar la estrella final del nivel.</SigmaBubble>
            </div>
          </div>
        )}

        {showHintBlock && (
          <div style={{ marginTop: 14, background: hintBg, borderRadius: 16, padding: '16px 18px', border: `1px solid ${hintBorder}`, ...a(0.55) }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#E65100', marginBottom: 10 }}>Pista SIGMA</div>
            <div style={{ fontSize: 16, color: t.text2, lineHeight: 1.7, whiteSpace: 'pre-line' }}>{hint || lv.sigmaWrong1}</div>
          </div>
        )}

        {showCompleteBlock && (
          <div ref={completeRef} style={{ marginTop: 14, background: completeBg, borderRadius: 16, padding: '16px 18px', border: `1px solid ${completeBorder}`, ...a(0.6) }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#2E7D32', marginBottom: 10 }}>Explicación completa</div>

            {/* Mostrar respuesta correcta primero cuando se expone la explicación */}
            {respuestaCorrecta && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, background: answerBg, border: `1px solid ${answerBorder}`, marginBottom: 10 }}>
                <div style={{ width: 26, height: 26, borderRadius: 6, background: '#2E7D32', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>✓</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#2E7D32', textTransform: 'uppercase' }}>Respuesta correcta</div>
                  <div style={{ fontSize: 16, fontFamily: 'Georgia,serif', fontWeight: 700, color: themeName === 'dark' ? '#FFFFFF' : '#1B5E20' }}>{respuestaCorrecta}</div>
                </div>
              </div>
            )}

            <Explanation
              text={completeExplanation}
              bgColor={themeName === 'dark' ? 'rgba(255,255,255,0.05)' : '#E8F5E9'}
              borderColor={themeName === 'dark' ? 'rgba(255,255,255,0.12)' : '#C8E6C9'}
              style={{ fontSize: 16, lineHeight: 1.7 }}
            />
          </div>
        )}

        {/* Fórmula recordatorio */}
        {formula && (
          <div style={{ marginBottom: 14, ...a(0.55) }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#E65100', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 8 }}>Recuerda la fórmula</div>
            <FormulaBlock math={formula} bgColor={formulaBg} borderColor={formulaBorder} />
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, ...a(0.65) }}>
          <button onClick={() => navigate(lives > 0 ? '/level/fase-b' : '/level/fase-a')}
            style={{ padding: '18px', borderRadius: 14, background: 'linear-gradient(135deg,#E65100,#F57F17)', color: '#fff', border: 'none', fontSize: 17, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 26px rgba(245,127,23,0.38)' }}>
            {lives > 0 ? 'Intentar de nuevo 🔄' : 'Repasar teoría 📖'}
          </button>
          <button onClick={() => navigate('/level/fase-a')}
            style={{ padding: '14px', borderRadius: 14, background: 'transparent', border: '1.5px solid #FFE0B2', color: '#E65100', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            Volver a teoría
          </button>
        </div>
      </div>
    </div>
  );
}
