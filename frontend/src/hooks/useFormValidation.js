import { useState } from 'react';

export function useFormValidation(rules) {
  const [errors, setErrors] = useState({});

  const validate = (values) => {
    const newErrors = {};
    for (const [field, fns] of Object.entries(rules)) {
      for (const fn of fns) {
        const err = fn(values[field], values);
        if (err) { newErrors[field] = err; break; }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field) => setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });

  return { errors, validate, clearError, setErrors };
}

// Validators reutilizables
export const validators = {
  required: (msg = 'Campo requerido') => (val) => !val?.trim() ? msg : null,
  minLen:   (n, msg) => (val) => (val?.length || 0) < n ? (msg || `Mínimo ${n} caracteres`) : null,
  email:    (val) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val || '') ? 'Email inválido' : null,
  match:    (field, msg = 'No coincide') => (val, values) => val !== values[field] ? msg : null,
  hasUpper: (val) => !/[A-Z]/.test(val || '') ? 'Debe tener al menos 1 mayúscula' : null,
  hasNum:   (val) => !/[0-9]/.test(val || '') ? 'Debe tener al menos 1 número' : null,
};
