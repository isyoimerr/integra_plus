import { useTheme } from '../../contexts/ThemeContext';

export default function LevelNode({ status, number, title, stars = 0, onClick }) {
  const { t } = useTheme();
  const isDone   = status === 'done';
  const isActive = status === 'active';
  const isLocked = status === 'locked';

  return (
    <div onClick={!isLocked ? onClick : undefined}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: !isLocked ? 'pointer' : 'default', userSelect: 'none' }}>
      <div style={{
        width: 68, height: 68, borderRadius: '50%',
        background: isDone ? '#2E7D32' : isActive ? t.cardBg : t.progressBg,
        border: `3px solid ${isDone ? '#2E7D32' : isActive ? '#2E7D32' : t.cardBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: isDone ? 24 : 20, fontWeight: 700,
        color: isDone ? '#fff' : isActive ? '#2E7D32' : t.text3,
        boxShadow: isActive ? '0 0 0 8px rgba(46,125,50,0.13), 0 0 24px rgba(46,125,50,0.4)' : isDone ? '0 4px 14px rgba(46,125,50,0.28)' : 'none',
        animation: isActive ? 'levelPulse 2.2s ease-in-out infinite' : 'none',
        transition: 'all 0.25s ease',
      }}>
        {isDone ? '✓' : isActive ? number : '🔒'}
      </div>
      <div style={{ textAlign: 'center', maxWidth: 110 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: isLocked ? t.text3 : t.text, lineHeight: 1.3 }}>{title}</div>
        {isDone   && <div style={{ fontSize: 14, marginTop: 3 }}>{'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}</div>}
        {isActive && <div style={{ fontSize: 11, color: '#2E7D32', fontWeight: 700, marginTop: 3 }}>En curso →</div>}
        {isLocked && <div style={{ fontSize: 11, color: t.text3, marginTop: 2 }}>Bloqueado</div>}
      </div>
    </div>
  );
}
