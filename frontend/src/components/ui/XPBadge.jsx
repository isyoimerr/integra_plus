export default function XPBadge({ points }) {
  return (
    <span style={{
      background: '#FFF8E1', color: '#F57F17', fontWeight: 700, fontSize: 14,
      borderRadius: 20, padding: '6px 16px', border: '1.5px solid #FFE082',
      display: 'inline-flex', alignItems: 'center', gap: 5,
    }}>
      +{points} XP ⚡
    </span>
  );
}
