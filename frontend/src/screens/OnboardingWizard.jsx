import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Confetti from '../components/ui/Confetti';

const LEVELS = [
  { id: 'zero', emoji: '🟢', title: 'Empiezo desde cero' },
  { id: 'mid', emoji: '🟡', title: 'Lo he visto un poco' },
  { id: 'basic', emoji: '🔵', title: 'Ya sé lo básico' },
];
const STYLES = [
  { id: 'intense', emoji: '🔥', title: 'Intenso' },
  { id: 'chill', emoji: '😄', title: 'Relajado' },
  { id: 'serious', emoji: '📚', title: 'Directo' },
];
const THEMES_LIST = [
  { id: 'light', emoji: '☀️', title: 'Claro' },
  { id: 'dark', emoji: '🌙', title: 'Oscuro' },
  { id: 'custom', emoji: '🎨', title: 'Personalizado' },
];
const CUSTOM_COLORS = [
  { label: 'Naranja', color: '#f2a16d' },
  { label: 'Violeta', color: '#7E57C2' },
  { label: 'Azul', color: '#4f83ff' },
  { label: 'Rosa', color: '#ff6fa4' },
  { label: 'Verde', color: '#2ec4b6' },
];

const STEPS = [
  { title: '¿Cómo te llamo?', subtitle: 'Pon tu nombre para que todo se sienta tuyo.', type: 'input' },
  { title: 'Tu nivel', subtitle: 'Elige tu punto de partida.', type: 'options', options: LEVELS },
  { title: 'Tu ritmo', subtitle: 'Elige cómo quieres avanzar.', type: 'options', options: STYLES },
  { title: 'Modo visual', subtitle: 'Claro, oscuro o personalizado.', type: 'options', options: THEMES_LIST },
];

const QUOTES = [
  '«La matemática es el lenguaje con el que Dios ha escrito el universo.» — Galileo',
  '«El placer más noble es el deleite del entendimiento.» — Leonardo da Vinci',
  '«No hay rama de la matemática, por abstracta que sea, que no pueda algún día ser utilizada en la realidad.» — Nicolás Bourbaki',
  '«La belleza es la primera prueba: no hay matemáticas sin belleza.» — G.H. Hardy',
  '«Cada problema tiene dentro de sí la solución.» — Rudolf Emil Kálmán',
  '«La imaginación es más importante que el conocimiento.» — Albert Einstein',
  '«Si no puedo dibujarla, no la entiendo.» — Paul Halmos',
  '«Matemáticas no es sobre números, ecuaciones o algoritmos: es sobre entender.» — William Paul Thurston',
  '«La limitación de nuestra vista no es la de nuestras ideas.» — Henri Poincaré',
  '«El álgebra es la música de la razón.» — James Joseph Sylvester',
];

const FORMULA_FLOATS = [
  { symbol: '∫', top: '10%', left: '8%', size: 42, opacity: 0.08, delay: '0s' },
  { symbol: '√', top: '18%', left: '78%', size: 28, opacity: 0.08, delay: '1.2s' },
  { symbol: 'Σ', top: '44%', left: '15%', size: 34, opacity: 0.06, delay: '0.6s' },
  { symbol: 'π', top: '68%', left: '72%', size: 30, opacity: 0.05, delay: '1.8s' },
  { symbol: '∞', top: '57%', left: '38%', size: 40, opacity: 0.07, delay: '0.4s' },
  { symbol: 'Δ', top: '82%', left: '23%', size: 24, opacity: 0.05, delay: '1.4s' },
  { symbol: 'lim', top: '28%', left: '50%', size: 24, opacity: 0.06, delay: '0.9s' },
  { symbol: '∂', top: '76%', left: '58%', size: 26, opacity: 0.04, delay: '1.1s' },
];

function OptionCard({ selected, onClick, emoji, title, accent }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '18px 22px',
        borderRadius: 20,
        border: selected ? '1px solid rgba(72,207,133,0.95)' : '1px solid rgba(255,255,255,0.08)',
        background: selected ? 'rgba(72,207,133,0.12)' : 'rgba(255,255,255,0.03)',
        color: '#eff7ec',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        cursor: 'pointer',
        transition: 'transform 0.18s ease, border-color 0.18s ease, background 0.18s ease',
        boxShadow: selected ? '0 24px 50px rgba(72,207,133,0.16)' : 'none',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontWeight: 700, fontSize: 15 }}>
        <span style={{ width: 34, height: 34, borderRadius: 14, background: accent || 'rgba(255,255,255,0.08)', display: 'grid', placeItems: 'center', fontSize: 18 }}>{emoji}</span>
        {title}
      </div>
      <span style={{ opacity: selected ? 1 : 0.35, fontSize: 16 }}>{selected ? '✓' : '○'}</span>
    </button>
  );
}

export default function OnboardingWizard() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const { changeTheme, themeName } = useTheme();
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState('');
  const [levelChoice, setLevelChoice] = useState(null);
  const [styleChoice, setStyleChoice] = useState(null);
  const [themeChoice, setThemeChoice] = useState('light');
  const [customColor, setCustomColor] = useState('#7E57C2');
  const [showFinal, setShowFinal] = useState(false);

  const activeStep = STEPS[step];
  const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);

  const canContinue = () => {
    if (step === 0) return nickname.trim().length > 0;
    if (step === 1) return levelChoice !== null;
    if (step === 2) return styleChoice !== null;
    return !!themeChoice;
  };

  const handleThemeChange = (value, accent) => {
    setThemeChoice(value);
    if (value === 'custom') {
      const color = accent || customColor;
      setCustomColor(color);
      changeTheme(value, color);
      return;
    }
    changeTheme(value);
  };

  const handleNext = () => {
    if (!canContinue()) return;
    if (step === STEPS.length - 1) {
      setShowFinal(true);
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step === 0) return;
    setStep((prev) => prev - 1);
  };

  const handleFinish = () => {
    handleThemeChange(themeChoice, themeChoice === 'custom' ? customColor : undefined);
    updateUser?.({ nombre: nickname, nivel: levelChoice, estilo: styleChoice });
    localStorage.setItem('integra_onboarding_done', '1');
    navigate('/dashboard');
  };

  if (showFinal) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #081c14 0%, #0c2d1d 45%, #0f3b23 100%)', display: 'grid', placeItems: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 540, background: 'linear-gradient(180deg, rgba(10,36,24,0.98), rgba(8,29,18,0.96))', borderRadius: 28, padding: '38px 32px', boxShadow: '0 35px 90px rgba(2,70,42,0.36)', border: '1px solid rgba(72,207,133,0.18)' }}>
          <Confetti />
          <div style={{ display: 'grid', placeItems: 'center', gap: 18 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(72,207,133,0.18)', display: 'grid', placeItems: 'center', color: '#d9fbe6', fontSize: 26 }}>∫</div>
            <div style={{ color: '#f7fff7', fontSize: 28, fontWeight: 800, textAlign: 'center' }}>¡Listo, {nickname || 'amigo'}!</div>
            <div style={{ color: '#b7ddc6', textAlign: 'center', lineHeight: 1.7 }}>Tu onboarding está guardado. La app ya tiene tu estilo y tu color personalizado.</div>
            <button
              onClick={handleFinish}
              style={{ width: '100%', padding: '16px 0', borderRadius: 18, border: 'none', background: 'linear-gradient(135deg, #4ac47e, #1f8f55)', color: '#111', fontWeight: 800, cursor: 'pointer', fontSize: 16, transition: 'transform 0.2s', boxShadow: '0 20px 45px rgba(72,207,133,0.22)' }}>
              Comenzar ahora
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative', background: 'linear-gradient(180deg, #091c13 0%, #0c2d1c 38%, #0e3721 100%)', padding: 24, display: 'grid', placeItems: 'center' }}>
      <style>{`
        @keyframes floatUpDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .formula-fill {
          position: absolute;
          color: rgba(206, 255, 214, 0.12);
          font-family: inherit;
          user-select: none;
          pointer-events: none;
          animation: floatUpDown 6s ease-in-out infinite;
        }
      `}</style>
      {FORMULA_FLOATS.map((item, index) => (
        <span
          key={index}
          className="formula-fill"
          style={{
            top: item.top,
            left: item.left,
            fontSize: item.size,
            opacity: item.opacity,
            animationDelay: item.delay,
          }}>
          {item.symbol}
        </span>
      ))}
      <div style={{ width: '100%', maxWidth: 560, background: 'linear-gradient(180deg, rgba(10,34,19,0.98), rgba(11,31,16,0.96))', borderRadius: 32, padding: '36px 32px', border: '1px solid rgba(72,207,133,0.16)', boxShadow: '0 38px 100px rgba(13,71,48,0.35)', position: 'relative', overflow: 'hidden', zIndex: 1 }}>
        <div style={{ position: 'absolute', top: -20, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(72,207,133,0.12)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -12, left: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(72,207,133,0.08)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
          <span style={{ color: '#99d7b4', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Onboarding</span>
          <div style={{ color: '#f7fff7', fontSize: 32, fontWeight: 800, lineHeight: 1.04 }}>{activeStep.title}</div>
          <div style={{ color: '#b9d8c5', fontSize: 15, maxWidth: 520 }}>{activeStep.subtitle}</div>
          <div style={{ marginTop: 14, padding: '16px 18px', borderRadius: 20, background: 'rgba(42,142,82,0.12)', border: '1px solid rgba(72,207,133,0.18)', color: '#d8f4d8', fontSize: 14, lineHeight: 1.65 }}>
            {quote}
          </div>
        </div>

        <div style={{ minHeight: 220, overflow: 'hidden' }}>
          <div style={{ display: 'flex', width: '400%', transform: `translateX(-${step * 25}%)`, transition: 'transform 0.45s ease' }}>
            <div style={{ width: '100%', paddingRight: 16 }}>
              <div style={{ display: 'grid', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', borderRadius: 22, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '18px 16px' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 16, background: '#11151f', display: 'grid', placeItems: 'center', color: '#f2a16d', fontSize: 22 }}>⌁</div>
                  <input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && canContinue() && handleNext()}
                    placeholder="Introduce tu nombre"
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      color: '#eef2ff',
                      fontSize: 16,
                      padding: '14px 0',
                    }}
                  />
                  <button
                    onClick={handleNext}
                    disabled={!canContinue()}
                    style={{
                      width: 54,
                      height: 54,
                      borderRadius: 16,
                      border: 'none',
                      background: canContinue() ? '#f2a16d' : 'rgba(255,255,255,0.08)',
                      color: canContinue() ? '#111' : 'rgba(255,255,255,0.42)',
                      cursor: canContinue() ? 'pointer' : 'not-allowed',
                      fontSize: 20,
                      transition: 'transform 0.2s, background 0.2s',
                    }}>
                    →
                  </button>
                </div>
              </div>
            </div>

            {[LEVELS, STYLES, THEMES_LIST].map((group, groupIndex) => (
              <div key={groupIndex} style={{ width: '100%', paddingRight: 16 }}>
                <div style={{ display: 'grid', gap: 14 }}>
                  {group.map((item) => {
                    const selected =
                      groupIndex === 0 ? levelChoice === item.id :
                      groupIndex === 1 ? styleChoice === item.id :
                      themeChoice === item.id;

                    const onClick = () => {
                      if (groupIndex === 0) setLevelChoice(item.id);
                      if (groupIndex === 1) setStyleChoice(item.id);
                      if (groupIndex === 2) handleThemeChange(item.id, item.id === 'custom' ? customColor : undefined);
                    };

                    return (
                      <OptionCard
                        key={item.id}
                        selected={selected}
                        emoji={item.emoji}
                        title={item.title}
                        accent={item.id === 'custom' ? '#f2a16d' : undefined}
                        onClick={onClick}
                      />
                    );
                  })}
                  {step === 3 && themeChoice === 'custom' && (
                    <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
                      <div style={{ color: '#99a6c3', fontSize: 13 }}>Elige un color para tu tema personalizado.</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 10 }}>
                        {CUSTOM_COLORS.map((item) => (
                          <button
                            key={item.color}
                            onClick={() => handleThemeChange('custom', item.color)}
                            style={{
                              width: '100%',
                              height: 48,
                              borderRadius: 16,
                              border: customColor === item.color ? '2px solid #f2a16d' : '1px solid rgba(255,255,255,0.1)',
                              background: item.color,
                              cursor: 'pointer',
                              transition: 'transform 0.2s, border-color 0.2s',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, marginTop: 30, flexWrap: 'wrap' }}>
          <button
            onClick={handleBack}
            disabled={step === 0}
            style={{
              minWidth: 132,
              padding: '14px 18px',
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
              color: step === 0 ? 'rgba(255,255,255,0.35)' : '#fff',
              cursor: step === 0 ? 'not-allowed' : 'pointer',
              fontWeight: 700,
            }}>
            ← Atrás
          </button>
          <button
            onClick={step === STEPS.length - 1 ? handleFinish : handleNext}
            disabled={!canContinue()}
            style={{
              minWidth: 160,
              padding: '14px 18px',
              borderRadius: 16,
              border: 'none',
              background: canContinue() ? 'linear-gradient(135deg, #f2a16d, #d97c50)' : 'rgba(255,255,255,0.08)',
              color: canContinue() ? '#111' : 'rgba(255,255,255,0.45)',
              cursor: canContinue() ? 'pointer' : 'not-allowed',
              fontWeight: 800,
            }}>
            {step === STEPS.length - 1 ? 'Finalizar' : 'Siguiente'}
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 24 }}>
          {STEPS.map((_, index) => (
            <span
              key={index}
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: step === index ? '#f2a16d' : 'rgba(255,255,255,0.08)',
                transition: 'background 0.2s',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
