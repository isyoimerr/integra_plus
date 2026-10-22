import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../../contexts/ProgressContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LEVEL_CONFIG } from '../../data/levelConfig';
import { FormulaBlock } from '../../components/ui/Formula';
import SigmaBubble from '../../components/sigma/SigmaBubble';
import LevelGraph from './LevelGraph';

export default function LevelFaseAScreen() {
  const navigate = useNavigate();
  const { selectedLevel, setExerciseIdx } = useProgress();
  const { t } = useTheme();
  const lv = LEVEL_CONFIG[selectedLevel] || LEVEL_CONFIG[0];
  const concepts = lv.faseA.concepts || [];

  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => { setVisible(true); }, []);

  const isOverview = step === 0;
  const totalSteps = 1 + concepts.length;
  const isLast = step >= totalSteps - 1;

  const next = () => {
    if (isLast) {
      setExerciseIdx(0);
      navigate('/level/fase-b');
    } else {
      setVisible(false);
      setTimeout(() => { setStep(s => s + 1); setVisible(true); }, 150);
    }
  };

  const prev = () => {
    if (step <= 0) return;
    setVisible(false);
    setTimeout(() => { setStep(s => s - 1); setVisible(true); }, 150);
  };

  const c = !isOverview ? concepts[step - 1] : null;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: t.appBg, overflow: 'hidden' }}>
      <div style={{ background: lv.headerBg, padding: '18px 20px 16px', flexShrink: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <button onClick={() => navigate('/levels')}
            style={{ background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: 20, flexShrink: 0 }}>←</button>
          <div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>{lv.title} · FASE A</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 1 }}>{lv.subtitle}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 3,
              background: i <= step ? '#fff' : 'rgba(255,255,255,0.25)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', fontWeight: 600 }}>
            {isOverview ? 'Visión general' : `${c.title} (${step}/${totalSteps - 1})`}
          </span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', fontWeight: 600 }}>
            {Math.round((step / (totalSteps - 1)) * 100)}%
          </span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        {isOverview ? (
          <div style={{ animation: visible ? 'fadeSlideUp 0.3s ease both' : 'none' }}>
            <SigmaBubble state="neutral">{lv.sigmaEntry}</SigmaBubble>

            <div style={{ background: t.cardBg, borderRadius: 16, padding: '18px 20px', border: `1px solid ${t.cardBorder}`, marginBottom: 14, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: lv.color, textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 6 }}>Conceptos clave</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: t.text, marginBottom: 8 }}>{lv.faseA.headline}</div>
              <div style={{ fontSize: 14, color: t.text2, lineHeight: 1.7, marginBottom: 14 }}>{lv.faseA.desc}</div>
              <div style={{ background: t.appBg, borderRadius: 12, padding: '12px', border: `1px solid ${t.cardBorder}` }}>
                <LevelGraph levelId={selectedLevel} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {concepts.map((concept, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px', borderRadius: 14,
                  background: t.cardBg, border: `1.5px solid ${t.cardBorder}`,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 12,
                    background: `${lv.color}18`, color: lv.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 17, fontWeight: 700, flexShrink: 0,
                  }}>{concept.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 2 }}>{concept.title}</div>
                    <div style={{ fontSize: 15, color: t.text3 }}>Paso {i + 1} de {concepts.length}</div>
                  </div>
                  <div style={{ fontSize: 16, color: t.text3 }}>›</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ animation: visible ? 'fadeSlideUp 0.3s ease both' : 'none' }}>
            <SigmaBubble state="neutral">
              {step === 1 ? 'Aquí tienes el primer concepto. Tómate tu tiempo para entenderlo.' :
               step === totalSteps - 1 ? 'Último concepto de esta fase. ¡Luego a practicar!' :
               'Sigue avanzando. Cada concepto construye sobre el anterior.'}
            </SigmaBubble>

            <div style={{
              background: t.cardBg, borderRadius: 18, padding: '20px 22px',
              border: `2px solid ${lv.color}28`,
              boxShadow: `0 6px 24px ${lv.color}18`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: `${lv.color}18`, color: lv.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, fontWeight: 700, flexShrink: 0,
                  border: `2px solid ${lv.color}30`,
                }}>{c.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: lv.color, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    Concepto {step} de {concepts.length}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: t.text, marginTop: 2 }}>{c.title}</div>
                </div>
              </div>

              <FormulaBlock math={c.formula} color={lv.color} bgColor={`${lv.color}08`} borderColor={`${lv.color}22`} />

              <div style={{ fontSize: 15, color: t.text2, lineHeight: 1.75, marginTop: 16, marginBottom: 0 }}>
                {c.desc}
              </div>
            </div>
          </div>
        )}
        <div style={{ height: 16 }} />
      </div>

      <div style={{ padding: '12px 20px 24px', flexShrink: 0, borderTop: `1px solid ${t.cardBorder}`, background: t.cardBg }}>
        <div style={{ display: 'flex', gap: 10 }}>
          {step > 0 && (
            <button onClick={prev}
              style={{
                padding: '16px 20px', borderRadius: 14, border: `1.5px solid ${t.cardBorder}`,
                background: t.appBg, color: t.text2, fontSize: 15, fontWeight: 700,
                cursor: 'pointer', flexShrink: 0,
              }}>
              ← Anterior
            </button>
          )}
          <button onClick={next}
            style={{
              flex: 1, padding: '16px', borderRadius: 14, border: 'none',
              background: lv.headerBg, color: '#fff', fontSize: 16, fontWeight: 700,
              cursor: 'pointer', boxShadow: `0 6px 20px ${lv.color}44`,
            }}>
            {isLast ? 'Ir a práctica ✏️' : 'Siguiente →'}
          </button>
        </div>
      </div>
    </div>
  );
}
