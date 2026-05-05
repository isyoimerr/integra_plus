import { useState } from 'react';

export default function InputField({ type = 'text', placeholder, value, onChange, extraStyle }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type} placeholder={placeholder} value={value} onChange={onChange}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        width: '100%', padding: '14px 16px', borderRadius: 13, fontFamily: 'inherit',
        fontSize: 15, outline: 'none', background: '#fff', color: '#1A1A1A',
        border: `1.5px solid ${focused ? '#2E7D32' : '#E4E4E4'}`,
        transition: 'border-color 0.2s', ...extraStyle,
      }}
    />
  );
}
