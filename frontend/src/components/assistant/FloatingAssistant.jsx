import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import VirtualAssistant from './VirtualAssistant';

export default function FloatingAssistant() {
  const { t } = useTheme();
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  if (!isAuthenticated) return null;

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1200, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
      {open && (
        <div style={{ width: 380, maxWidth: '92vw', minHeight: 440, borderRadius: 28, overflow: 'hidden', boxShadow: '0 28px 80px rgba(0,0,0,0.22)', border: `1px solid ${t.cardBorder}`, background: t.appBg }}>
          <div style={{ padding: '14px 16px', background: t.cardBg, borderBottom: `1px solid ${t.cardBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 900, color: t.text }}>SIGMA — Asistente</div>
              <div style={{ fontSize: 14, color: t.text3, marginTop: 2 }}>Disponible en toda la app.</div>
            </div>
            <button onClick={() => setOpen(false)}
              style={{ width: 34, height: 34, borderRadius: 12, border: 'none', background: t.progressBg, color: t.text, cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>
              ×
            </button>
          </div>
          <div style={{ padding: '0 0 14px', background: t.appBg }}>
            <VirtualAssistant compact />
          </div>
        </div>
      )}
      <button onClick={() => setOpen((value) => !value)}
        style={{
          width: 64, height: 64, borderRadius: '50%', border: 'none', background: t.primary,
          color: '#fff', fontSize: 24, fontWeight: 900, cursor: 'pointer', boxShadow: '0 16px 30px rgba(0,0,0,0.18)',
          display: 'grid', placeItems: 'center', transition: 'transform 0.14s ease',
        }}
        aria-label={open ? 'Cerrar SIGMA' : 'Abrir SIGMA'}>
        Σ
      </button>
    </div>
  );
}
