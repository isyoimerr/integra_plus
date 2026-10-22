import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress, toDbId } from '../../contexts/ProgressContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LEVEL_CONFIG } from '../../data/levelConfig';
import { exerciseService } from '../../services/exercise.service';
import { FormulaBlock, FormulaInline } from '../../components/ui/Formula';
import SigmaBubble from '../../components/sigma/SigmaBubble';
import Spinner from '../../components/common/Spinner';

const OPT_IDS = ['A', 'B', 'C'];

export default function LevelFaseBScreen() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { t } = useTheme();
  const {
    selectedLevel, exerciseIdx, setExerciseIdx,
    lives, setLives, resetLives, setLastWrong,
    currentExercises, setCurrentExercises,
  } = useProgress();

  const lv = LEVEL_CONFIG[selectedLevel] || LEVEL_CONFIG[0];

  const [exercises, setExercises]   = useState(currentExercises.length ? currentExercises : []);
  const [loadingEx, setLoadingEx]   = useState(!currentExercises.length);
  const [selected,  setSelected]    = useState(null);
  const [verifying, setVerifying]   = useState(false);

  // Cargar ejercicios desde la DB al montar
  useEffect(() => {
    resetLives();
    setLastWrong(null);
    let cancelled = false;
    const load = async () => {
      setLoadingEx(true);
      try {
        if (!token || token === 'demo-local') {
          throw new Error('demo-mode');
        }
        const data = await exerciseService.getByNivel(token, toDbId(selectedLevel));
        if (!cancelled) {
          setExercises(data);
          setCurrentExercises(data);
        }
      } catch {
        // fallback: mapear LEVEL_CONFIG al formato API para demo/local sin backend
        if (!cancelled) {
          const fallback = lv.exercises.map(e => ({
            id: e.dbId, enunciado: e.q, formula: e.formula,
            opciones: e.opts, pista: e.hint, explicacion: e.explain,
            xpRecompensa: lv.xpPerExercise,
            correct: e.correct,
          }));
          setExercises(fallback);
          setCurrentExercises(fallback);
        }
      } finally {
        if (!cancelled) setLoadingEx(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [selectedLevel, token]);

  const ex = exercises[exerciseIdx];

  const verify = async () => {
    if (!selected || !ex) return;
    setVerifying(true);
    try {
      const selectedAnswer = selected;
      let correcto = false;
      let respuestaCorrecta = null;

      let res = null;
      if (token && token !== 'demo-local') {
        res = await exerciseService.verify(token, ex, selectedAnswer).catch(() => null);
      }

      if (res) {
        correcto = res.correcto;
        respuestaCorrecta = res.respuestaCorrecta;
      } else {
        correcto = selected === ex.correct;
        respuestaCorrecta = ex.opciones?.[OPT_IDS.indexOf(ex.correct)] ?? null;
      }

      if (correcto) {
        navigate('/level/result-correct');
      } else {
        setLives(Math.max(0, lives - 1));
        const explanation = res?.explicacion || res?.explain || ex.explicacion || ex.explain || '';
        const hintText = res?.pista || res?.hint || ex.pista || ex.hint || '';
        setLastWrong({
          hint:              hintText,
          explain:           explanation,
          formula:           ex.formula,
          opciones:          ex.opciones,
          selectedAnswer,
          respuestaCorrecta,
          helpUsed: false,
        });
        navigate('/level/result-wrong');
      }
    } finally {
      setVerifying(false);
      setSelected(null);
    }
  };

  const sigmaMsg = !ex ? '¡Cargando ejercicios…'
    : exerciseIdx === 0 ? '¡Arrancamos! Lee bien el enunciado antes de responder. 🎯'
    : exerciseIdx === exercises.length - 1 ? '¡Último ejercicio! Lo tienes. Dale con todo. 💪'
    : 'Vas bien. Piensa antes de marcar. ¿Listo/a? 🧠';

  if (loadingEx) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.appBg }}>
        <Spinner />
      </div>
    );
  }

  if (!ex) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.appBg }}>
        <p style={{ color: t.text2 }}>No se encontraron ejercicios.</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: t.appBg, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: lv.headerBg, padding: '18px 20px 22px', flexShrink: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <button onClick={() => navigate('/level/fase-a')}
            style={{ background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: 20, flexShrink: 0 }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.5px', fontWeight: 600 }}>{lv.title} · FASE B</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginTop: 2 }}>Ejercicio {exerciseIdx + 1} de {exercises.length}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', gap: 3 }}>
              {[1, 2, 3].map(i => (
                <span key={i} style={{ fontSize: 16, filter: i > lives ? 'grayscale(1) opacity(0.35)' : 'none', transition: 'all 0.3s' }}>❤️</span>
              ))}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 20, padding: '5px 12px', fontSize: 13, color: '#fff', fontWeight: 700 }}>
              {ex.xpRecompensa || lv.xpPerExercise} XP
            </div>
          </div>
        </div>
        {/* Barra de progreso */}
        <div style={{ display: 'flex', gap: 4 }}>
          {exercises.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 5, borderRadius: 4, background: i < exerciseIdx ? '#fff' : i === exerciseIdx ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.22)', transition: 'background 0.3s' }} />
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px' }}>
        <SigmaBubble state="neutral">{sigmaMsg}</SigmaBubble>

        {/* Pregunta */}
        <div style={{ background: t.cardBg, borderRadius: 16, padding: '18px 20px', border: `1px solid ${t.cardBorder}`, marginBottom: 14, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: lv.color, textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 10 }}>Pregunta {exerciseIdx + 1}</div>
          <div style={{ fontSize: 16, color: t.text2, lineHeight: 1.65, marginBottom: 16 }}>{ex.enunciado}</div>
          <FormulaBlock math={ex.formula} color={lv.color} bgColor={`${lv.color}10`} borderColor={`${lv.color}28`} />
        </div>

        {/* Opciones */}
        <div style={{ fontSize: 13, fontWeight: 700, color: t.text3, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Elige tu respuesta</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          {ex.opciones.map((opt, i) => {
            const id = OPT_IDS[i];
            const sel = selected === id;
            return (
              <button key={id} onClick={() => setSelected(id)}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderRadius: 14, border: `2px solid ${sel ? lv.color : t.cardBorder}`, background: sel ? `${lv.color}14` : t.cardBg, cursor: 'pointer', textAlign: 'left', transition: 'all 0.18s', outline: 'none', boxShadow: sel ? `0 4px 16px ${lv.color}22` : 'none' }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: sel ? lv.color : t.progressBg, color: sel ? '#fff' : t.text2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, transition: 'all 0.18s' }}>{id}</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: sel ? lv.colorDark : t.text, fontFamily: 'Georgia,serif', flex: 1, minWidth: 0 }}>
                  <FormulaInline math={opt} />
                </div>
                {sel && <div style={{ color: lv.color, fontSize: 20 }}>◉</div>}
              </button>
            );
          })}
        </div>

        <button onClick={verify} disabled={!selected || verifying}
          style={{ width: '100%', padding: '18px', borderRadius: 14, border: 'none', background: selected ? lv.headerBg : t.progressBg, color: selected ? '#fff' : t.text3, fontSize: 17, fontWeight: 700, cursor: selected ? 'pointer' : 'not-allowed', boxShadow: selected ? `0 8px 26px ${lv.color}44` : 'none', transition: 'all 0.22s' }}>
          {verifying ? 'Verificando…' : 'Verificar respuesta ✓'}
        </button>
      </div>
    </div>
  );
}
