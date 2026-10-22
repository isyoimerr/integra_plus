import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../../contexts/ProgressContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LEVEL_CONFIG } from '../../data/levelConfig';
import SigmaBubble from '../../components/sigma/SigmaBubble';
import Confetti from '../../components/ui/Confetti';

export default function LevelCompleteScreen() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { t } = useTheme();
  const { selectedLevel, lives, completeLevel, setLives, currentExercises, lastWrong } = useProgress();
  const lv = LEVEL_CONFIG[selectedLevel] || LEVEL_CONFIG[0];
  const helpUsed = lastWrong?.helpUsed;
  const baseStars = lives >= 3 ? 3 : lives >= 1 ? 2 : 1;
  const stars = Math.max(0, baseStars - (helpUsed ? 1 : 0));
  const exerciseCount = currentExercises.length || lv.exercises.length;
  const xp = currentExercises.reduce((s, e) => s + (e.xpRecompensa || 15), 0) || lv.xpTotal;
  const [show, setShow] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setShow(true), 100);
    // Usar selectedLevel como LEVEL_CONFIG key; completeLevel convierte a DB nivelId internamente
    if (token) completeLevel(selectedLevel, 3 - stars).catch(() => {});
    return () => clearTimeout(id);
  }, []);

  const a = (d) => show ? { animation: `fadeSlideUp 0.5s ${d}s both` } : { opacity: 0 };
  const handleNext = () => { setLives(3); navigate('/levels'); };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: t.cardBg, overflow: 'hidden', position: 'relative' }}>
      <Confetti />
      <div style={{ flex: 1, overflowY: 'auto', padding: '40px 20px 28px', position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ animation: show ? 'popIn 0.65s cubic-bezier(0.34,1.56,0.64,1) both' : 'none' }}>
            <div style={{ width: 114, height: 114, borderRadius: '50%', background: lv.headerBg, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 16px 50px ${lv.color}55`, border: `4px solid ${t.cardBg}` }}>
              <span style={{ fontSize: 50 }}>🏆</span>
            </div>
          </div>
          <div style={{ fontSize: 34, fontWeight: 900, color: t.text, letterSpacing: '-1px', marginTop: 22, lineHeight: 1.1, ...a(0.25) }}>¡Nivel completado!</div>
          <div style={{ fontSize: 17, color: lv.color, fontWeight: 600, marginTop: 6, ...a(0.35) }}>{lv.title} — {lv.subtitle}</div>

          <div style={{ marginTop: 22, ...a(0.45) }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ fontSize: 42, filter: i <= stars ? 'none' : 'grayscale(1) opacity(0.3)', animation: show && i <= stars ? `popIn 0.5s ${0.5 + i * 0.1}s both` : 'none' }}>⭐</div>
              ))}
            </div>
            <div style={{ fontSize: 14, color: t.text3, marginTop: 8 }}>
              {stars === 3 ? '¡Perfecto! Todo en primer intento' : stars === 2 ? 'Muy bien, con un par de errores' : 'Completado con esfuerzo — ¡sigue!'}
            </div>
          </div>

          <div style={{ marginTop: 20, ...a(0.55) }}>
            <span style={{ background: t.streakBg, color: t.streakColor, fontWeight: 800, fontSize: 22, borderRadius: 24, padding: '12px 28px', border: `2px solid ${t.streakColor}55`, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              +{xp} XP ⚡
            </span>
          </div>
        </div>

        <div style={a(0.65)}><SigmaBubble state="celebracion">{lv.sigmaComplete}</SigmaBubble></div>

        {helpUsed && (
          <div style={{ background: '#FFF8E1', borderRadius: 16, padding: '16px 18px', border: '1px solid #FFE082', marginBottom: 18, color: '#6D4C41', boxShadow: '0 4px 20px rgba(255,193,7,0.15)', ...a(0.7) }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Atención:</div>
            <div style={{ fontSize: 15, lineHeight: 1.7 }}>Usaste ayuda de SIGMA en este nivel. Por eso tu calificación final baja una estrella en el ranking.</div>
          </div>
        )}

        <div style={{ background: t.appBg, borderRadius: 16, padding: '18px 20px', border: `1.5px solid ${lv.color}30`, marginBottom: 18, boxShadow: `0 4px 20px ${lv.color}18`, ...a(0.75) }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, textAlign: 'center' }}>
            {[
              { label: 'Ejercicios', val: `${exerciseCount}✓` },
              { label: 'Estrellas',  val: '⭐'.repeat(stars) },
              { label: 'XP ganados', val: `${xp} XP` },
            ].map((s, i) => (
              <div key={i} style={{ padding: '14px 8px', background: `${lv.color}10`, borderRadius: 12 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: lv.color }}>{s.val}</div>
                <div style={{ fontSize: 15, color: t.text3, marginTop: 4, fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, ...a(0.85) }}>
          <button onClick={handleNext}
            style={{ padding: '18px', borderRadius: 14, background: lv.headerBg, color: '#fff', border: 'none', fontSize: 17, fontWeight: 700, cursor: 'pointer', boxShadow: `0 8px 26px ${lv.color}44`, letterSpacing: '-0.2px' }}>
            Desbloquear siguiente nivel 🔓
          </button>
          <button onClick={() => navigate('/dashboard')}
            style={{ padding: '14px', borderRadius: 14, background: 'transparent', border: `1.5px solid ${lv.color}33`, color: lv.color, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
