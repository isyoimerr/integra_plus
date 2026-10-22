import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';

// Datos de ejemplo: últimos 7 días
function generateWeeklyData() {
  const data = [];
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      day: days[date.getDay() === 0 ? 6 : date.getDay() - 1],
      puntos: Math.floor(Math.random() * 40) + 10,
      ejercicios: Math.floor(Math.random() * 8) + 2,
    });
  }
  return data;
}

const CustomTooltip = ({ active, payload, t }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: t?.cardBg || '#fff',
        border: `1px solid ${t?.cardBorder || '#e5e7eb'}`,
        borderRadius: 8,
        padding: '8px 12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: t?.text || '#000' }}>
          {payload[0].payload.day}
        </p>
        <p style={{ margin: '4px 0 0 0', fontSize: 14, color: payload[0].color }}>
          {payload[0].name}: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function WeeklyActivityChart({ type = 'bar', showLegend = true }) {
  const { t } = useTheme();
  const data = generateWeeklyData();

  const colors = {
    primary: '#FF6B6B',
    secondary: '#4D96FF',
    grid: t?.cardBorder || '#e5e7eb',
    text: t?.text || '#000',
  };

  return (
    <div style={{
      background: t?.cardBg || '#fff',
      borderRadius: 16,
      padding: '18px 12px',
      border: `1px solid ${t?.cardBorder || '#e5e7eb'}`,
      boxShadow: '0 2px 14px rgba(0,0,0,0.05)',
    }}>
      <div style={{
        fontSize: 15,
        fontWeight: 700,
        color: t?.text || '#000',
        marginBottom: 14,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        📊 Actividad semanal
      </div>

      <ResponsiveContainer width="100%" height={280}>
        {type === 'bar' ? (
          <BarChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
            <XAxis
              dataKey="day"
              stroke={colors.text}
              style={{ fontSize: 15, fontWeight: 600 }}
            />
            <YAxis
              stroke={colors.text}
              style={{ fontSize: 14 }}
              width={35}
            />
            <Tooltip content={<CustomTooltip t={t} />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
            <Bar dataKey="puntos" fill={colors.primary} radius={[8, 8, 0, 0]} name="Puntos" />
            <Bar dataKey="ejercicios" fill={colors.secondary} radius={[8, 8, 0, 0]} name="Ejercicios" />
          </BarChart>
        ) : (
          <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
            <XAxis
              dataKey="day"
              stroke={colors.text}
              style={{ fontSize: 15, fontWeight: 600 }}
            />
            <YAxis
              stroke={colors.text}
              style={{ fontSize: 14 }}
              width={35}
            />
            <Tooltip content={<CustomTooltip t={t} />} />
            <Line
              type="monotone"
              dataKey="puntos"
              stroke={colors.primary}
              strokeWidth={3}
              dot={{ fill: colors.primary, r: 5 }}
              activeDot={{ r: 7 }}
              name="Puntos"
            />
            <Line
              type="monotone"
              dataKey="ejercicios"
              stroke={colors.secondary}
              strokeWidth={3}
              dot={{ fill: colors.secondary, r: 5 }}
              activeDot={{ r: 7 }}
              name="Ejercicios"
            />
          </LineChart>
        )}
      </ResponsiveContainer>

      {showLegend && (
        <div style={{
          display: 'flex',
          gap: 20,
          justifyContent: 'center',
          marginTop: 12,
          fontSize: 15,
          fontWeight: 600,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, background: colors.primary }} />
            <span style={{ color: t?.text2 || '#666' }}>Puntos</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, background: colors.secondary }} />
            <span style={{ color: t?.text2 || '#666' }}>Ejercicios</span>
          </div>
        </div>
      )}
    </div>
  );
}
