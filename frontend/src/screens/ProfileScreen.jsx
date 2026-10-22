import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { userService } from '../services/user.service';
import SigmaLogo from '../components/sigma/SigmaLogo';
import AchievementBadges from '../components/ui/AchievementBadges';
import { SIGMA_STATES } from '../data/levelConfig';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { user, token, logout, updateUser } = useAuth();
  const { t, themeName, changeTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editFoto, setEditFoto] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => { setIsVisible(true); }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  const startEdit = () => {
    setEditName(user?.nombre || '');
    setEditFoto(null);
    setMsg(null);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditFoto(null);
    setMsg(null);
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setMsg('La imagen debe ser menor a 2MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setEditFoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const data = {};
      if (editName.trim() && editName !== user?.nombre) data.nombre = editName.trim();
      if (editFoto) data.foto = editFoto;
      if (Object.keys(data).length === 0) { setEditing(false); setSaving(false); return; }
      const res = await userService.updateProfile(token, data);
      updateUser({ nombre: res.usuario.nombre, foto: res.usuario.foto });
      setEditing(false);
      setEditFoto(null);
      setMsg({ type: 'success', text: 'Perfil actualizado' });
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const THEMES_LIST = [
    { id: 'light',  label: '☀️ Claro' },
    { id: 'dark',   label: '🌙 Oscuro' },
    { id: 'custom', label: '🎨 Personalizado' },
  ];

  const cardStyle = (delay) => ({
    animation: isVisible ? `slideInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s forwards` : 'none',
    opacity: isVisible ? 1 : 0,
    willChange: 'transform, opacity',
  });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: t.appBg, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ 
        background: t.headerBg, 
        padding: '28px 20px 24px', 
        flexShrink: 0, 
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)', 
        textAlign: 'center',
        animation: isVisible ? 'fadeInDown 0.5s ease-out' : 'none',
      }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div style={{ 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            background: editFoto ? `url(${editFoto}) center/cover` : (user?.foto ? `url(${user.foto}) center/cover` : 'rgba(255,255,255,0.2)'), 
            border: '3px solid rgba(255,255,255,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 12px', 
            fontSize: 32, 
            fontWeight: 800, 
            color: '#fff',
            animation: isVisible ? 'scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
            cursor: editing ? 'pointer' : 'default',
          }} onClick={() => editing && fileRef.current?.click()}>
            {!editFoto && !user?.foto && (user?.nombre || 'U')[0].toUpperCase()}
          </div>
          {editing && (
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
          )}
          {editing && (
            <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 13, padding: '2px 8px', borderRadius: 8, whiteSpace: 'nowrap' }}>
              {editFoto ? 'Cambiar' : 'Añadir foto'}
            </div>
          )}
        </div>
        {editing ? (
          <input 
            value={editName} 
            onChange={e => setEditName(e.target.value)}
            style={{
              fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px',
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 10, padding: '6px 14px', textAlign: 'center', width: '70%',
              outline: 'none',
            }}
            placeholder="Tu nombre"
          />
        ) : (
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>{user?.nombre || 'Estudiante'}</div>
        )}
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{user?.email || ''}</div>

        {msg && (
          <div style={{ marginTop: 8, fontSize: 15, color: msg.type === 'success' ? '#A5D6A7' : '#EF9A9A', fontWeight: 600 }}>
            {msg.text}
          </div>
        )}

        <div style={{ marginTop: 12, display: 'inline-flex', gap: 16 }}>
          {[{ val: user?.puntos ?? 540, label: 'XP' }, { val: `${user?.racha ?? 7}🔥`, label: 'Racha' }].map((s, i) => (
            <div key={i} style={{ 
              background: 'rgba(255,255,255,0.15)', 
              borderRadius: 12, 
              padding: '8px 16px', 
              textAlign: 'center',
              animation: isVisible ? `slideInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.2 + i * 0.1}s forwards` : 'none',
              opacity: isVisible ? 1 : 0,
              transition: 'all 0.3s ease',
              cursor: 'default',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{s.val}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Botón editar / acciones */}
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 8 }}>
          {editing ? (
            <>
              <button onClick={cancelEdit} disabled={saving}
                style={{ padding: '8px 20px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.3)', background: 'transparent', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Cancelar
              </button>
              <button onClick={saveProfile} disabled={saving}
                style={{ padding: '8px 20px', borderRadius: 10, border: 'none', background: '#fff', color: t.primary || '#2E7D32', fontSize: 13, fontWeight: 700, cursor: saving ? 'wait' : 'pointer' }}>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </>
          ) : (
            <button onClick={startEdit}
              style={{ padding: '8px 20px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Editar perfil
            </button>
          )}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px' }}>

        {/* Tema */}
        <div style={{ 
          background: t.cardBg, 
          borderRadius: 14, 
          padding: '16px 18px', 
          border: `1px solid ${t.cardBorder}`, 
          marginBottom: 14, 
          boxShadow: '0 2px 14px rgba(0,0,0,0.05)',
          ...cardStyle(0.2),
          transition: 'all 0.3s ease',
          cursor: 'default',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 14px rgba(0,0,0,0.05)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 12 }}>Tema visual</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {THEMES_LIST.map(th => (
              <button key={th.id} onClick={() => changeTheme(th.id)}
                style={{ 
                  flex: 1, 
                  padding: '9px 6px', 
                  borderRadius: 10, 
                  border: `2px solid ${themeName === th.id ? t.primary : t.cardBorder}`, 
                  background: themeName === th.id ? `${t.primary}15` : t.cardBg, 
                  color: themeName === th.id ? t.primary : t.text2, 
                  fontSize: 15, 
                  fontWeight: 600, 
                  cursor: 'pointer', 
                  transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transform: 'translateZ(0)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                {th.label}
              </button>
            ))}
          </div>
        </div>

        {/* SIGMA estados */}
        <div style={{ 
          background: t.cardBg, 
          borderRadius: 14, 
          padding: '16px 18px', 
          border: `1px solid ${t.cardBorder}`, 
          marginBottom: 14, 
          boxShadow: '0 2px 14px rgba(0,0,0,0.05)',
          ...cardStyle(0.35),
          transition: 'all 0.3s ease',
          cursor: 'default',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 14px rgba(0,0,0,0.05)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 12 }}>SIGMA — Estados emocionales</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {Object.keys(SIGMA_STATES).map((state, idx) => (
              <div key={state} style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: 6,
                animation: isVisible ? `fadeInScale 0.5s ease-out ${0.4 + idx * 0.05}s forwards` : 'none',
                opacity: isVisible ? 1 : 0,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1) translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
              }}>
                <SigmaLogo state={state} size={44} />
                <span style={{ fontSize: 13, color: t.text3, fontWeight: 600, textTransform: 'capitalize' }}>{state}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Logros */}
        <div style={{ 
          background: t.cardBg, 
          borderRadius: 14, 
          padding: '16px 18px', 
          border: `1px solid ${t.cardBorder}`, 
          marginBottom: 14, 
          boxShadow: '0 2px 14px rgba(0,0,0,0.05)',
          ...cardStyle(0.5),
          transition: 'all 0.3s ease',
          cursor: 'default',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 14px rgba(0,0,0,0.05)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}>
          <AchievementBadges 
            mode="card"
            earned={['first_complete', 'three_day_streak', 'level_master']}
            progressData={{
              three_day_streak: 3,
              level_master: 1,
              all_stars: 2,
              perfect_week: 5,
              thousand_points: 850,
              speed_demon: 3,
            }}
          />
        </div>

        {/* Cerrar sesión */}
        <button onClick={handleLogout}
          style={{ 
            width: '100%', 
            padding: '14px', 
            borderRadius: 13, 
            background: 'transparent', 
            border: '1.5px solid #FFCDD2', 
            color: '#E53935', 
            fontSize: 15, 
            fontWeight: 600, 
            cursor: 'pointer', 
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            animation: isVisible ? `slideInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.65s forwards` : 'none',
            opacity: isVisible ? 1 : 0,
            marginBottom: 8,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#FFCDD2';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.transform = 'scale(1.01)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#E53935';
            e.currentTarget.style.transform = 'scale(1)';
          }}>
          Cerrar sesión
        </button>
      </div>

      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes popBadge {
          from { opacity: 0; transform: scale(0.6) rotate(-10deg); }
          50% { transform: scale(1.1); }
          to { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes slideInBadge {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
