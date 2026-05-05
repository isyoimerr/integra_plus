import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../../contexts/ProgressContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LEVEL_CONFIG } from '../../data/levelConfig';
import { FormulaBlock } from '../../components/ui/Formula';
import SigmaBubble from '../../components/sigma/SigmaBubble';

export default function ResultWrongScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const { selectedLevel, lastWrong, lives } = useProgress();
  const lv = LEVEL_CONFIG[selectedLevel] || LEVEL_CONFIG[0];
  const [show, setShow] = useState(false);
  useEffect(() => { const id = setTimeout(() => setShow(true), 80); return () => clearTimeout(id); }, []);
  const a = (d) => show ? { animation: `fadeSlideUp 0.4s ${d}s both` } : { opacity: 0 };

  const { opciones = [], selectedAnswer, respuestaCorrecta, hint, formula } = lastWrong || {};

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
            <div style={{ fontSize: 12, fontWeight: 700, color: '#E65100', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 12 }}>Comparación de respuestas</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Respuesta seleccionada (incorrecta) */}
              {selectedAnswer && selectedAnswer !== respuestaCorrecta && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: '#FFEBEE', border: '1.5px solid #FFCDD2' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, background: '#E53935', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>✕</div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#C62828', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 3 }}>Tu respuesta</div>
                    <div style={{ fontSize: 17, fontFamily: 'Georgia,serif', fontWeight: 600, color: '#B71C1C' }}>{selectedAnswer}</div>
                  </div>
                </div>
              )}
              {/* Respuesta correcta */}
              {respuestaCorrecta && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: '#E8F5E9', border: '1.5px solid #A5D6A7' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, background: '#2E7D32', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>✓</div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#2E7D32', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 3 }}>Respuesta correcta</div>
                    <div style={{ fontSize: 17, fontFamily: 'Georgia,serif', fontWeight: 600, color: '#1B5E20' }}>{respuestaCorrecta}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div style={a(0.45)}><SigmaBubble state="apoyo">{hint || lv.sigmaWrong1}</SigmaBubble></div>

        {/* Fórmula recordatorio */}
        {formula && (
          <div style={{ marginBottom: 14, ...a(0.55) }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#E65100', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 8 }}>Recuerda la fórmula</div>
            <FormulaBlock math={formula} bgColor="#FFF8E1" borderColor="#FFE082" />
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, ...a(0.65) }}>
          <button onClick={() => navigate('/level/fase-b')}
            style={{ padding: '18px', borderRadius: 14, background: 'linear-gradient(135deg,#E65100,#F57F17)', color: '#fff', border: 'none', fontSize: 17, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 26px rgba(245,127,23,0.38)' }}>
            {lives > 0 ? 'Intentar de nuevo 🔄' : 'Ver teoría y reintentar'}
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
