import { useTheme } from '../../contexts/ThemeContext';

const ACHIEVEMENTS = {
  first_complete: { emoji: '🏁', label: 'Primer paso', color: '#3B82F6' },
  three_day_streak: { emoji: '🔥', label: 'Racha de 3 días', color: '#F59E0B' },
  level_master: { emoji: '👑', label: 'Maestro de nivel', color: '#8B5CF6' },
  all_stars: { emoji: '⭐', label: 'Tres estrellas', color: '#EC4899' },
  speed_demon: { emoji: '⚡', label: 'Rápido', color: '#10B981' },
  perfect_week: { emoji: '📈', label: 'Semana perfecta', color: '#6366F1' },
  thousand_points: { emoji: '💎', label: 'Mil puntos', color: '#F97316' },
  teacher_mode: { emoji: '🎓', label: 'Modo maestro', color: '#14B8A6' },
};

export function AchievementBadge({ achievement, earned = false, animated = false }) {
  const { t } = useTheme();
  const badge = ACHIEVEMENTS[achievement] || { emoji: '🏆', label: 'Logro', color: '#64748B' };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        padding: '12px 10px',
        borderRadius: 12,
        background: earned ? `${badge.color}18` : `${t.cardBg}`,
        border: `2px solid ${earned ? badge.color : t.cardBorder}`,
        transition: 'all 0.3s ease',
        opacity: earned ? 1 : 0.5,
        transform: earned && animated ? 'scale(1)' : undefined,
        animation: earned && animated ? 'popBadge 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' : undefined,
      }}
      title={badge.label}
    >
      <div style={{
        fontSize: 28,
        filter: earned ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'grayscale(80%)',
      }}>
        {badge.emoji}
      </div>
      <div style={{
        fontSize: 10,
        fontWeight: 700,
        color: earned ? badge.color : t.text3,
        textAlign: 'center',
        letterSpacing: '0.3px',
      }}>
        {badge.label}
      </div>
    </div>
  );
}

export default function AchievementBadges({ achievements = [], earned = [], showTitle = true }) {
  const { t } = useTheme();

  return (
    <div style={{ padding: '0' }}>
      {showTitle && (
        <div style={{
          fontSize: 14,
          fontWeight: 700,
          color: t.text,
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          🏆 Logros ({earned?.length || 0} desbloqueados)
        </div>
      )}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
        gap: 10,
      }}>
        {achievements.length > 0 ? (
          achievements.map((ach, idx) => (
            <AchievementBadge
              key={idx}
              achievement={ach}
              earned={earned?.includes(ach) || false}
              animated={true}
            />
          ))
        ) : (
          Object.keys(ACHIEVEMENTS).map((ach, idx) => (
            <AchievementBadge
              key={idx}
              achievement={ach}
              earned={earned?.includes(ach) || false}
              animated={true}
            />
          ))
        )}
      </div>

      <style>{`
        @keyframes popBadge {
          0% {
            opacity: 0;
            transform: scale(0.3) rotateZ(-180deg);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotateZ(0deg);
          }
        }
      `}</style>
    </div>
  );
}
