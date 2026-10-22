import { useTheme } from '../../contexts/ThemeContext';

const ACHIEVEMENTS = {
  first_complete: { 
    emoji: '🏁', 
    label: 'Primer paso', 
    description: 'Completa tu primer ejercicio',
    color: '#3B82F6',
    target: 1,
    category: 'starter'
  },
  three_day_streak: { 
    emoji: '🔥', 
    label: 'Racha de 3 días', 
    description: 'Mantén consistencia en tu aprendizaje',
    color: '#F59E0B',
    target: 3,
    category: 'consistency'
  },
  level_master: { 
    emoji: '👑', 
    label: 'Maestro de nivel', 
    description: 'Completa un nivel con todas las estrellas',
    color: '#8B5CF6',
    target: 1,
    category: 'mastery'
  },
  all_stars: { 
    emoji: '⭐', 
    label: 'Tres estrellas', 
    description: 'Obtén 3 estrellas en cualquier ejercicio',
    color: '#EC4899',
    target: 1,
    category: 'excellence'
  },
  speed_demon: { 
    emoji: '⚡', 
    label: 'Rápido', 
    description: 'Resuelve ejercicios en tiempo récord',
    color: '#10B981',
    target: 5,
    category: 'speed'
  },
  perfect_week: { 
    emoji: '📈', 
    label: 'Semana perfecta', 
    description: 'Practica 7 días consecutivos',
    color: '#6366F1',
    target: 7,
    category: 'dedication'
  },
  thousand_points: { 
    emoji: '💎', 
    label: 'Mil puntos', 
    description: 'Acumula 1000 XP totales',
    color: '#F97316',
    target: 1000,
    category: 'milestone'
  },
  teacher_mode: { 
    emoji: '🎓', 
    label: 'Modo maestro', 
    description: 'Ayuda a otros compañeros',
    color: '#14B8A6',
    target: 10,
    category: 'community'
  },
};

// Componente card grande tipo Duolingo
export function AchievementCard({ achievement, earned = false, current = 0, animated = false }) {
  const { t } = useTheme();
  const badge = ACHIEVEMENTS[achievement] || { emoji: '🏆', label: 'Logro', description: '', color: '#64748B', target: 1 };
  const progress = Math.min((current / badge.target) * 100, 100);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        padding: '16px',
        borderRadius: 14,
        background: earned ? `${badge.color}12` : `${badge.color}08`,
        border: `1.5px solid ${earned ? `${badge.color}60` : `${badge.color}30`}`,
        transition: 'all 0.3s ease',
        opacity: earned ? 1 : 0.75,
        animation: earned && animated ? 'slideInBadge 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' : undefined,
      }}
    >
      {/* Ícono grande con fondo de color */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 60,
          height: 60,
          borderRadius: 12,
          background: earned ? badge.color : `${badge.color}30`,
          fontSize: 32,
          flexShrink: 0,
          filter: earned ? 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.05))',
        }}
      >
        {badge.emoji}
      </div>

      {/* Contenido */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Encabezado con título y estado */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 8,
          marginBottom: 4,
        }}>
          <h3 style={{
            margin: 0,
            fontSize: 15,
            fontWeight: 700,
            color: t.text,
            lineHeight: 1.3,
          }}>
            {badge.label}
          </h3>
          {earned && (
            <span style={{
              fontSize: 13,
              fontWeight: 600,
              color: badge.color,
              whiteSpace: 'nowrap',
            }}>
              ✓ Desbloqueado
            </span>
          )}
        </div>

        {/* Descripción */}
        <p style={{
          margin: 0,
          fontSize: 13,
          color: t.text3,
          lineHeight: 1.4,
          marginBottom: 10,
        }}>
          {badge.description}
        </p>

        {/* Barra de progreso */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            flex: 1,
            height: 6,
            borderRadius: 3,
            background: `${badge.color}20`,
            overflow: 'hidden',
          }}>
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: badge.color,
                borderRadius: 3,
                transition: 'width 0.4s ease',
              }}
            />
          </div>
          <span style={{
            fontSize: 15,
            fontWeight: 600,
            color: t.text2,
            minWidth: '32px',
            textAlign: 'right',
          }}>
            {current}/{badge.target}
          </span>
        </div>
      </div>
    </div>
  );
}

// Componente badge pequeño (versión compacta para compatibilidad)
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
        background: earned ? `${badge.color}18` : `${badge.color}08`,
        border: `2px solid ${earned ? badge.color : `${badge.color}40`}`,
        transition: 'all 0.3s ease',
        opacity: earned ? 1 : 0.7,
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
        fontSize: 13,
        fontWeight: 700,
        color: earned ? badge.color : t.text2,
        textAlign: 'center',
        letterSpacing: '0.3px',
        lineHeight: 1.2,
      }}>
        {badge.label}
      </div>
    </div>
  );
}

export default function AchievementBadges({ 
  achievements = [], 
  earned = [], 
  showTitle = true,
  mode = 'badge', // 'badge' (pequeño) o 'card' (grande tipo Duolingo)
  progressData = {} // { achievement_id: current_value }
}) {
  const { t } = useTheme();

  const renderAchievements = () => {
    const achievementList = achievements.length > 0 ? achievements : Object.keys(ACHIEVEMENTS);
    
    if (mode === 'card') {
      // Modo card grande (tipo Duolingo)
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {achievementList.map((ach, idx) => (
            <div
              key={idx}
              style={{
                animation: `slideInUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 0.1}s forwards`,
                opacity: 0,
                willChange: 'transform, opacity',
              }}>
              <AchievementCard
                achievement={ach}
                earned={earned?.includes(ach) || false}
                current={progressData[ach] || 0}
                animated={true}
              />
            </div>
          ))}
        </div>
      );
    } else {
      // Modo badge pequeño (original)
      return (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
          gap: 10,
        }}>
          {achievementList.map((ach, idx) => (
            <div
              key={idx}
              style={{
                animation: `badgeStagger 0.4s ease-out ${idx * 0.08}s forwards`,
                opacity: 0,
                willChange: 'transform, opacity',
              }}>
              <AchievementBadge
                achievement={ach}
                earned={earned?.includes(ach) || false}
                animated={true}
              />
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div style={{ padding: '0' }}>
      {showTitle && (
        <div style={{
          fontSize: 14,
          fontWeight: 700,
          color: t.text,
          marginBottom: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          🏆 Logros ({earned?.length || 0} desbloqueados)
        </div>
      )}
      
      {renderAchievements()}

      <style>{``}</style>
    </div>
  );
}
