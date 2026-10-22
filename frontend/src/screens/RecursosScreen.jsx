import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { FormulaBlock, FormulaInline } from '../components/ui/Formula';

const CATEGORIES = [
  {
    id: 'derivadas',
    title: 'Reglas de Derivación',
    icon: '∂',
    color: '#2E7D32',
    items: [
      { name: 'Constante', formula: "\\frac{d}{dx}[k] = 0" },
      { name: 'Potencia', formula: "\\frac{d}{dx}[x^n] = n x^{n-1}" },
      { name: 'Producto por constante', formula: "\\frac{d}{dx}[k \\cdot f(x)] = k \\cdot f'(x)" },
      { name: 'Suma / Resta', formula: "\\frac{d}{dx}[f(x) \\pm g(x)] = f'(x) \\pm g'(x)" },
      { name: 'Producto', formula: "\\frac{d}{dx}[f(x)g(x)] = f'(x)g(x) + f(x)g'(x)" },
      { name: 'Cociente', formula: "\\frac{d}{dx}\\left[\\frac{f(x)}{g(x)}\\right] = \\frac{f'(x)g(x) - f(x)g'(x)}{[g(x)]^2}" },
      { name: 'Regla de la cadena', formula: "\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)" },
      { name: 'Exponencial', formula: "\\frac{d}{dx}[e^x] = e^x" },
      { name: 'Logaritmo natural', formula: "\\frac{d}{dx}[\\ln(x)] = \\frac{1}{x}" },
      { name: 'Seno', formula: "\\frac{d}{dx}[\\sin(x)] = \\cos(x)" },
      { name: 'Coseno', formula: "\\frac{d}{dx}[\\cos(x)] = -\\sin(x)" },
      { name: 'Tangente', formula: "\\frac{d}{dx}[\\tan(x)] = \\sec^2(x)" },
      { name: 'Arco seno', formula: "\\frac{d}{dx}[\\arcsin(x)] = \\frac{1}{\\sqrt{1-x^2}}" },
      { name: 'Arco tangente', formula: "\\frac{d}{dx}[\\arctan(x)] = \\frac{1}{1+x^2}" },
    ],
  },
  {
    id: 'integrales',
    title: 'Integrales Inmediatas',
    icon: '∫',
    color: '#1565C0',
    items: [
      { name: 'Potencia (n ≠ -1)', formula: "\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C" },
      { name: '1/x', formula: "\\int \\frac{1}{x} \\, dx = \\ln|x| + C" },
      { name: 'Exponencial', formula: "\\int e^x \\, dx = e^x + C" },
      { name: 'a^x', formula: "\\int a^x \\, dx = \\frac{a^x}{\\ln(a)} + C" },
      { name: 'Seno', formula: "\\int \\sin(x) \\, dx = -\\cos(x) + C" },
      { name: 'Coseno', formula: "\\int \\cos(x) \\, dx = \\sin(x) + C" },
      { name: 'Tangente', formula: "\\int \\sec^2(x) \\, dx = \\tan(x) + C" },
      { name: 'Secante por tangente', formula: "\\int \\sec(x)\\tan(x) \\, dx = \\sec(x) + C" },
      { name: '1 / √(1-x²)', formula: "\\int \\frac{1}{\\sqrt{1-x^2}} \\, dx = \\arcsin(x) + C" },
      { name: '1 / (1+x²)', formula: "\\int \\frac{1}{1+x^2} \\, dx = \\arctan(x) + C" },
      { name: 'Linealidad', formula: "\\int [f(x) \\pm g(x)] \\, dx = \\int f(x)\\,dx \\pm \\int g(x)\\,dx" },
      { name: 'Constante por función', formula: "\\int k \\cdot f(x) \\, dx = k \\int f(x) \\, dx" },
    ],
  },
  {
    id: 'trigonometria',
    title: 'Identidades Trigonométricas',
    icon: '◉',
    color: '#7E57C2',
    items: [
      { name: 'Pitagórica', formula: "\\sin^2(x) + \\cos^2(x) = 1" },
      { name: 'Tangente y secante', formula: "1 + \\tan^2(x) = \\sec^2(x)" },
      { name: 'Cotangente y cosecante', formula: "1 + \\cot^2(x) = \\csc^2(x)" },
      { name: 'Seno del ángulo doble', formula: "\\sin(2x) = 2\\sin(x)\\cos(x)" },
      { name: 'Coseno del ángulo doble', formula: "\\cos(2x) = \\cos^2(x) - \\sin^2(x)" },
      { name: 'Seno de suma', formula: "\\sin(a \\pm b) = \\sin(a)\\cos(b) \\pm \\cos(a)\\sin(b)" },
      { name: 'Coseno de suma', formula: "\\cos(a \\pm b) = \\cos(a)\\cos(b) \\mp \\sin(a)\\sin(b)" },
      { name: 'Medio ángulo (seno)', formula: "\\sin^2(x) = \\frac{1 - \\cos(2x)}{2}" },
      { name: 'Medio ángulo (coseno)', formula: "\\cos^2(x) = \\frac{1 + \\cos(2x)}{2}" },
    ],
  },
  {
    id: 'tecnicas',
    title: 'Técnicas de Integración',
    icon: '🛠',
    color: '#E67E22',
    items: [
      { name: 'Sustitución simple', formula: "\\int f(g(x)) \\cdot g'(x) \\, dx = \\int f(u) \\, du \\quad \\text{con } u = g(x)" },
      { name: 'Integración por partes', formula: "\\int u \\, dv = uv - \\int v \\, du" },
      { name: 'Fracciones parciales', formula: "\\frac{P(x)}{(x-a)(x-b)} = \\frac{A}{x-a} + \\frac{B}{x-b}" },
      { name: 'Sust. trigonométrica (√a²-x²)', formula: "x = a\\sin(\\theta) \\quad \\sqrt{a^2 - x^2} = a\\cos(\\theta)" },
      { name: 'Sust. trigonométrica (√a²+x²)', formula: "x = a\\tan(\\theta) \\quad \\sqrt{a^2 + x^2} = a\\sec(\\theta)" },
      { name: 'Sust. trigonométrica (√x²-a²)', formula: "x = a\\sec(\\theta) \\quad \\sqrt{x^2 - a^2} = a\\tan(\\theta)" },
    ],
  },
  {
    id: 'teorema',
    title: 'Teorema Fundamental del Cálculo',
    icon: '📐',
    color: '#00897B',
    items: [
      { name: '1er TFC (derivada de integral)', formula: "\\frac{d}{dx} \\int_a^x f(t) \\, dt = f(x)" },
      { name: '2do TFC (integral definida)', formula: "\\int_a^b f(x) \\, dx = F(b) - F(a)" },
      { name: 'Área entre curvas', formula: "A = \\int_a^b [f(x) - g(x)] \\, dx" },
      { name: 'Volumen (discos, eje x)', formula: "V = \\pi \\int_a^b [f(x)]^2 \\, dx" },
      { name: 'Longitud de arco', formula: "L = \\int_a^b \\sqrt{1 + [f'(x)]^2} \\, dx" },
      { name: 'Valor promedio', formula: "f_{\\text{prom}} = \\frac{1}{b-a} \\int_a^b f(x) \\, dx" },
      { name: 'Trabajo (fuerza variable)', formula: "W = \\int_a^b F(x) \\, dx" },
    ],
  },
  {
    id: 'algebra',
    title: 'Álgebra y Exponentes',
    icon: '⬆',
    color: '#E53935',
    items: [
      { name: 'Potencia de potencia', formula: "(x^n)^m = x^{n \\cdot m}" },
      { name: 'Producto de potencias', formula: "x^n \\cdot x^m = x^{n+m}" },
      { name: 'Cociente de potencias', formula: "\\frac{x^n}{x^m} = x^{n-m}" },
      { name: 'Exponente negativo', formula: "x^{-n} = \\frac{1}{x^n}" },
      { name: 'Exponente fraccionario', formula: "x^{1/n} = \\sqrt[n]{x}" },
      { name: 'Raíz como potencia', formula: "\\sqrt{x} = x^{1/2}" },
      { name: 'Logaritmo de producto', formula: "\\ln(ab) = \\ln(a) + \\ln(b)" },
      { name: 'Logaritmo de cociente', formula: "\\ln\\left(\\frac{a}{b}\\right) = \\ln(a) - \\ln(b)" },
      { name: 'Logaritmo de potencia', formula: "\\ln(a^n) = n \\cdot \\ln(a)" },
    ],
  },
];

export default function RecursosScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const [open, setOpen] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => { setVisible(true); }, []);

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: t.appBg, overflow: 'hidden',
      animation: visible ? 'screenIn 0.25s ease both' : 'none',
    }}>
      <div style={{
        background: 'linear-gradient(150deg, #E67E22 0%, #F39C12 100%)',
        padding: '22px 20px 26px', flexShrink: 0,
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <button onClick={() => navigate(-1)}
            style={{
              background: 'rgba(255,255,255,0.18)', border: 'none', borderRadius: 10,
              width: 40, height: 40, display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: 20,
            }}>←</button>
          <div>
            <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>Material de apoyo</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginTop: 2 }}>Recursos Didácticos</div>
          </div>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.16)', borderRadius: 10,
          padding: '8px 14px', display: 'inline-flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>📖 Fórmulas, tablas y reglas</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 24px' }}>
        <div style={{
          background: t.cardBg, borderRadius: 16, padding: '16px 18px',
          border: `1px solid ${t.cardBorder}`, marginBottom: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        }}>
          <div style={{ fontSize: 14, color: t.text2, lineHeight: 1.7 }}>
            Selecciona una categoría para ver las fórmulas y reglas correspondientes.
            Úsalo como referencia rápida mientras resuelves ejercicios.
          </div>
        </div>

        {CATEGORIES.map((cat) => {
          const isOpen = open === cat.id;
          return (
            <div key={cat.id} style={{ marginBottom: 12 }}>
              <button onClick={() => setOpen(isOpen ? null : cat.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px', borderRadius: 14,
                  border: `1.5px solid ${isOpen ? cat.color : t.cardBorder}`,
                  background: isOpen ? `${cat.color}0A` : t.cardBg,
                  cursor: 'pointer', textAlign: 'left',
                  boxShadow: isOpen ? `0 4px 16px ${cat.color}18` : '0 1px 6px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s',
                }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: `${cat.color}18`, color: cat.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 700, flexShrink: 0,
                }}>{cat.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>{cat.title}</div>
                  <div style={{ fontSize: 13, color: t.text3, marginTop: 2 }}>{cat.items.length} fórmulas</div>
                </div>
                <div style={{
                  fontSize: 20, color: t.text3,
                  transition: 'transform 0.25s',
                  transform: isOpen ? 'rotate(180deg)' : 'none',
                }}>▾</div>
              </button>

              {isOpen && (
                <div style={{
                  marginTop: 6, borderRadius: 14, overflow: 'hidden',
                  border: `1px solid ${t.cardBorder}`,
                  background: t.cardBg,
                  animation: 'fadeSlideUp 0.25s ease both',
                }}>
                  {cat.items.map((item, i) => (
                    <div key={i} style={{
                      padding: '14px 16px',
                      borderBottom: i < cat.items.length - 1 ? `1px solid ${t.cardBorder}` : 'none',
                    }}>
                      <div style={{
                        fontSize: 13, fontWeight: 600, color: cat.color,
                        marginBottom: 8, textTransform: 'uppercase',
                        letterSpacing: '0.4px',
                      }}>{item.name}</div>
                      <FormulaBlock
                        math={item.formula}
                        color={cat.color}
                        bgColor={`${cat.color}08`}
                        borderColor={`${cat.color}18`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}
