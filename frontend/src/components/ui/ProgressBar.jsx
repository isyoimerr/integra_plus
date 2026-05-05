export default function ProgressBar({ value, color = '#2E7D32', height = 8, bgColor = '#EEEEEE' }) {
  return (
    <div style={{ background: bgColor, borderRadius: height, height, overflow: 'hidden' }}>
      <div style={{
        width: `${Math.max(0, Math.min(100, value))}%`, height, borderRadius: height,
        background: color, transition: 'width 0.7s cubic-bezier(0.4,0,0.2,1)',
      }} />
    </div>
  );
}
