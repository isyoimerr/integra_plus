export default function Spinner({ size = 18, color = '#fff' }) {
  return (
    <span style={{
      display: 'inline-block', width: size, height: size,
      border: `2.5px solid ${color}44`, borderTopColor: color,
      borderRadius: '50%', animation: 'spin 0.7s linear infinite',
      verticalAlign: 'middle',
    }} />
  );
}
