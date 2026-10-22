import { useEffect, useState } from 'react';

const COLORS = {
  success: { bg: '#E8F5E9', border: '#A5D6A7', icon: '✅', text: '#1B5E20' },
  error:   { bg: '#FFEBEE', border: '#FFCDD2', icon: '❌', text: '#B71C1C' },
  info:    { bg: '#E3F2FD', border: '#BBDEFB', icon: 'ℹ️',  text: '#0D47A1' },
  warn:    { bg: '#FFF8E1', border: '#FFE082', icon: '⚠️',  text: '#E65100' },
};

export default function Toast({ message, type = 'info', duration = 3500, onClose }) {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const c = COLORS[type] || COLORS.info;

  useEffect(() => {
    const t = setTimeout(() => {
      setExiting(true);
      // Esperar la animación de salida antes de desmontar
      setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, 260);
    }, duration);

    return () => clearTimeout(t);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div
      role="alert"
      className={exiting ? 'toast-exit' : 'toast-enter'}
      style={{
        position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
        zIndex: 9999, background: c.bg, border: `1.5px solid ${c.border}`,
        borderRadius: 14, padding: '12px 18px', display: 'flex', alignItems: 'center',
        gap: 10, boxShadow: '0 8px 28px rgba(0,0,0,0.12)', minWidth: 240, maxWidth: 360,
      }}>

      <span style={{ fontSize: 18, fontWeight: 700 }}>{c.icon}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: c.text, flex: 1 }}>{message}</span>
      <button
        onClick={() => {
          setExiting(true);
          setTimeout(() => {
            setVisible(false);
            onClose?.();
          }, 260);
        }}
        aria-label="Cerrar notificación"

        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer', 
          color: c.text, 
          fontSize: 16, 
          padding: 2, 
          lineHeight: 1,
          opacity: 0.6,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.transform = 'scale(1.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.6';
          e.currentTarget.style.transform = 'scale(1)';
        }}>×</button>
    </div>
  );
}

// Hook para manejar toasts
import { useState as useStateToast } from 'react';

export function useToast() {
  const [toasts, setToasts] = useStateToast([]);
  const show = (message, type = 'info', duration = 3500) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };
  const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id));
  const ToastContainer = () => (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999, pointerEvents: 'none' }}>
      {toasts.map((t, i) => (
        <div key={t.id} style={{ pointerEvents: 'auto', marginTop: 12 + i * 4 }}>
          <Toast {...t} onClose={() => remove(t.id)} />
        </div>
      ))}
    </div>
  );
  return { show, ToastContainer };
}
