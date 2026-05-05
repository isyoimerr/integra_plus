import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../../contexts/ProgressContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LEVEL_CONFIG } from '../../data/levelConfig';
import SigmaBubble from '../../components/sigma/SigmaBubble';

export default function ResultCorrectScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const { selectedLevel, exerciseIdx, setExerciseIdx, setLives, currentExercises, lastWrong } = useProgress();
  const lv = LEVEL_CONFIG[selectedLevel] || LEVEL_CONFIG[0];
  const [show, setShow] = useState(false);
  useEffect(() => { const id = setTimeout(() => setShow(true), 80); return () => clearTimeout(id); }, []);
  const a = (d) => show ? { animation: `fadeSlideUp 0.45s ${d}s both` } : { opacity: 0 };

  const total  = currentExercises.length || lv.exercises.length;
  const isLast = exerciseIdx >= total - 1;
  const xp     = currentExercises[exerciseIdx]?.xpRecompensa || lv.xpPerExercise;
  const explain = lastWrong?.explain || currentExercises[exerciseIdx]?.explicacion || '';

  const handleNext = () => {
    if (isLast) {
      navigate('/level/complete');
    } else {
      setExerciseIdx(exerciseIdx + 1);
      setLives(3);
      navigate('/level/fase-b');
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: t.appBg, overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '36px 20px 24px' }}>
        {/* Ícono correcto */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 104, height: 104, borderRadius: '50%', background: 'linear-gradient(135deg,#2E7D32,#43A047)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, color: '#fff', boxShadow: '0 14px 44px rgba(46,125,50,0.42)', animation: show ? 'popIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both' : 'none' }}>✓</div>
          <div style={{ marginTop: 20, fontSize: 32, fontWeight: 800, color: '#2E7D32', letterSpacing: '-0.8px', ...a(0.2) }}>¡Correcto!</div>
          <div style={{ fontSize: 16, color: t.text2, marginTop: 6, ...a(0.3) }}>
            {!isLast ? `Ejercicio ${exerciseIdx + 1} de ${total} completado` : '¡Todos los ejercicios completados!'}
          </div>
          <div style={{ marginTop: 14, ...a(0.4) }}>
            <span style={{ background: t.streakBg, color: t.streakColor, fontWeight: 700, fontSize: 16, borderRadius: 20, padding: '8px 20px', border: `1.5px solid ${t.streakColor}44`, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              +{xp} XP ⚡
            </span>
          </div>
        </div>

        <div style={a(0.5)}><SigmaBubble state="celebracion">{lv.sigmaCorrect}</SigmaBubble></div>

        {explain && (
          <div style={{ background: t.cardBg, borderRadius: 16, padding: '18px 20px', border: `1px solid ${t.cardBorder}`, marginBottom: 14, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', ...a(0.6) }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#2E7D32', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 12 }}>¿Por qué es correcto?</div>
            <div style={{ background: `${lv.color}10`, borderRadius: 12, padding: '14px 16px', marginBottom: 8, textAlign: 'center', border: `1px solid ${lv.color}22` }}>
              <span style={{ fontSize: 17, fontFamily: 'Georgia,serif', color: lv.colorDark, fontWeight: 600 }}>{explain}</span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, ...a(0.7) }}>
          <button onClick={handleNext}
            style={{ padding: '18px', borderRadius: 14, background: lv.headerBg, color: '#fff', border: 'none', fontSize: 17, fontWeight: 700, cursor: 'pointer', boxShadow: `0 8px 26px ${lv.color}44`, letterSpacing: '-0.2px' }}>
            {isLast ? 'Ver resultados del nivel 🏆' : 'Siguiente ejercicio →'}
          </button>
          <button onClick={() => navigate('/level/fase-a')}
            style={{ padding: '14px', borderRadius: 14, background: 'transparent', border: `1.5px solid ${lv.color}44`, color: lv.color, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            Repasar teoría
          </button>
        </div>
      </div>
    </div>
  );
}
