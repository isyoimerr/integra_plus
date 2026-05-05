import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useProgress } from '../contexts/ProgressContext';
import { LEVEL_CONFIG } from '../data/levelConfig';
import LevelNode from '../components/ui/LevelNode';
import SigmaBubble from '../components/sigma/SigmaBubble';
import BottomNav from '../components/ui/BottomNav';

export default function LevelMapScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const { levels, setSelectedLevel, setExerciseIdx, fetchAll, isUnlocked, getProgreso, getStars } = useProgress();

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const goToTheory   = (levelKey) => { setSelectedLevel(levelKey); navigate('/level/fase-a'); };
  const goToPractice = (levelKey) => { setSelectedLevel(levelKey); setExerciseIdx(0); navigate('/level/fase-b'); };

  // Construir nodos desde la DB, complementados con UI config
  const nodes = levels.map((lv) => {
    const levelKey = lv.id - 1; // LEVEL_CONFIG key
    const cfg      = LEVEL_CONFIG[levelKey] || {};
    const prog     = getProgreso(levelKey);
    const unlocked = isUnlocked(levelKey);
    const status   = prog?.completado ? 'done' : unlocked ? 'active' : 'locked';
    const stars    = getStars(levelKey);
    return {
      key: levelKey,
      title: `${lv.nombre} · ${lv.subtitulo || ''}`,
      status,
      stars,
      color: cfg.color || lv.color || '#2E7D32',
    };
  });

  const completados = nodes.filter(n => n.status === 'done').length;
  const sigmaMsg = completados === 0
    ? 'Empieza por el Nivel 0 — las bases lo son todo. 💪'
    : completados === nodes.length
    ? '¡Todos los niveles completados! Eres un crack. 🏆'
    : `Tienes ${completados} nivel${completados !== 1 ? 'es' : ''} completado${completados !== 1 ? 's' : ''}. ¡Sigue! 🚀`;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: t.appBg, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(150deg,#1B5E20 0%,#2E7D32 100%)', padding: '22px 20px 26px', flexShrink: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <button onClick={() => navigate('/dashboard')}
            style={{ background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: 20, flexShrink: 0 }}>←</button>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>Ruta de aprendizaje</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.72)', marginTop: 2 }}>
              {completados} de {nodes.length} niveles completados
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px' }}>
        <SigmaBubble state="neutral">{sigmaMsg}</SigmaBubble>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 28 }}>
          {nodes.map((node, i) => (
            <div key={node.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
                <LevelNode
                  status={node.status}
                  number={node.key}
                  title={node.title}
                  stars={node.stars}
                  onClick={() => node.status !== 'locked' && goToTheory(node.key)}
                />
              </div>

              {node.status !== 'locked' && (
                <div style={{ display: 'flex', gap: 8, marginTop: 10, width: '100%', maxWidth: 300 }}>
                  <button onClick={() => goToTheory(node.key)}
                    style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: `1.5px solid ${node.color}50`, background: 'transparent', color: node.color, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                    📖 Teoría
                  </button>
                  <button onClick={() => goToPractice(node.key)}
                    style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', background: node.color, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 14px ${node.color}44` }}>
                    ✏️ PRÁCTICA
                  </button>
                </div>
              )}

              {i < nodes.length - 1 && (
                <div style={{ width: 3, height: 38, borderRadius: 4, margin: '8px 0',
                  background: node.status === 'done' ? `linear-gradient(${node.color},${nodes[i+1]?.color || '#DDD'})` : '#DDD' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
