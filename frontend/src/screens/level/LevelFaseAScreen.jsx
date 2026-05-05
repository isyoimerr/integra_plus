import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../../contexts/ProgressContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LEVEL_CONFIG } from '../../data/levelConfig';
import { FormulaBlock, FormulaInline } from '../../components/ui/Formula';
import SigmaBubble from '../../components/sigma/SigmaBubble';
import LevelGraph from './LevelGraph';

export default function LevelFaseAScreen() {
  const navigate = useNavigate();
  const { selectedLevel, setExerciseIdx } = useProgress();
  const { t } = useTheme();
  const lv = LEVEL_CONFIG[selectedLevel] || LEVEL_CONFIG[0];
  const [expanded, setExpanded] = useState(null);

  const startPractice = () => { setExerciseIdx(0); navigate('/level/fase-b'); };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: t.appBg, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: lv.headerBg, padding: '22px 20px 26px', flexShrink: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <button onClick={() => navigate('/levels')} style={{ background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: 20, flexShrink: 0 }}>←</button>
          <div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>{lv.title} · FASE A</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginTop: 2 }}>{lv.subtitle}</div>
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.16)', borderRadius: 10, padding: '8px 14px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>📖 Aprendizaje</span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>·</span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>Sin penalización</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px' }}>
        <SigmaBubble state="neutral">{lv.sigmaEntry}</SigmaBubble>

        {/* Teoría */}
        <div style={{ background: t.cardBg, borderRadius: 16, padding: '18px 20px', border: `1px solid ${t.cardBorder}`, marginBottom: 14, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: lv.color, textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 8 }}>Conceptos clave</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: t.text, marginBottom: 14 }}>{lv.faseA.headline}</div>
          <div style={{ fontSize: 15, color: t.text2, lineHeight: 1.7, marginBottom: 16 }}>{lv.faseA.desc}</div>
          <div style={{ background: t.appBg, borderRadius: 12, padding: '14px', border: `1px solid ${t.cardBorder}` }}>
            <LevelGraph levelId={selectedLevel} />
          </div>
        </div>

        {/* Acordeón de conceptos */}
        {lv.faseA.concepts.map((c, i) => (
          <button key={i} onClick={() => setExpanded(expanded === i ? null : i)}
            style={{ width: '100%', display: 'block', background: t.cardBg, borderRadius: 16, padding: '16px 18px', border: `1.5px solid ${expanded === i ? lv.color : t.cardBorder}`, marginBottom: 10, textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s', outline: 'none', boxShadow: expanded === i ? `0 4px 18px ${lv.color}25` : `0 2px 10px rgba(0,0,0,0.05)` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `${lv.color}20`, color: lv.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, flexShrink: 0 }}>{c.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 4 }}>{c.title}</div>
                <div style={{ fontSize: 14, overflow: 'hidden' }}>
                  <FormulaInline math={c.formula} />
                </div>
              </div>
              <div style={{ fontSize: 18, color: t.text3, transition: 'transform 0.2s', transform: expanded === i ? 'rotate(90deg)' : 'none', flexShrink: 0 }}>›</div>
            </div>
            {expanded === i && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${lv.color}25`, fontSize: 15, color: t.text2, lineHeight: 1.7, animation: 'fadeSlideUp 0.2s ease both' }}>
                {c.desc}
              </div>
            )}
          </button>
        ))}
        <div style={{ height: 16 }} />
      </div>

      {/* Botón práctica */}
      <div style={{ padding: '14px 20px 28px', flexShrink: 0, borderTop: `1px solid ${t.cardBorder}`, background: t.cardBg }}>
        <button onClick={startPractice}
          style={{ width: '100%', padding: '18px', borderRadius: 16, border: 'none', background: lv.headerBg, color: '#fff', fontSize: 17, fontWeight: 700, cursor: 'pointer', boxShadow: `0 8px 26px ${lv.color}44`, letterSpacing: '-0.2px' }}>
          Entendido — ir a práctica ✏️
        </button>
      </div>
    </div>
  );
}
