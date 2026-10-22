export default function ProgressBar({ value, color = '#2E7D32', height = 8, bgColor = '#EEEEEE' }) {
  return (
    <div style={{ 
      background: bgColor, 
      borderRadius: height, 
      height, 
      overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
      position: 'relative',
    }}>
      <div style={{
        width: `${Math.max(0, Math.min(100, value))}%`, 
        height, 
        borderRadius: height,
        background: color, 
        transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Shine effect on progress bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            animation: 'progressShine 2s infinite',
          }}
        />
      </div>
    </div>
  );
}
