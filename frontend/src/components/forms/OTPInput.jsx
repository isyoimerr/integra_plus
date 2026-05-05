import { useRef } from 'react';

export default function OTPInput({ value = '', onChange, disabled, length = 6 }) {
  const inputs = useRef([]);
  const digits = (value + ' '.repeat(length)).slice(0, length).split('');
  const last   = length - 1;

  const handleChange = (i, e) => {
    const v = e.target.value.replace(/\D/g, '').slice(-1);
    const arr = digits.map(d => d.trim());
    arr[i] = v;
    onChange(arr.join('').trimEnd());
    if (v && i < last) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace') {
      const arr = digits.map(d => d.trim());
      if (!arr[i] && i > 0) {
        arr[i - 1] = '';
        onChange(arr.join('').trimEnd());
        inputs.current[i - 1]?.focus();
      }
    }
    if (e.key === 'ArrowLeft'  && i > 0)    inputs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < last) inputs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(paste);
    inputs.current[Math.min(paste.length, last)]?.focus();
  };

  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}
      role="group" aria-label={`Código de verificación de ${length} dígitos`}>
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={el => (inputs.current[i] = el)}
          type="text" inputMode="numeric" maxLength={1}
          value={digits[i].trim()}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          aria-label={`Dígito ${i + 1}`}
          style={{
            width: 52, height: 62, textAlign: 'center', fontSize: 26, fontWeight: 800,
            borderRadius: 13, border: `2.5px solid ${digits[i].trim() ? '#2E7D32' : '#DDD'}`,
            background: digits[i].trim() ? '#F0FBF1' : '#FAFAFA',
            color: '#1A1A1A', outline: 'none', transition: 'all 0.18s',
            caretColor: 'transparent',
          }}
          onFocus={e => { e.target.style.borderColor = '#2E7D32'; e.target.style.boxShadow = '0 0 0 3px rgba(46,125,50,0.15)'; }}
          onBlur={e => { e.target.style.borderColor = digits[i].trim() ? '#2E7D32' : '#DDD'; e.target.style.boxShadow = 'none'; }}
        />
      ))}
    </div>
  );
}
