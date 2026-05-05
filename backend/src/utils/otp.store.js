// OTP en memoria con TTL de 5 minutos
const store = new Map();
const TTL = 5 * 60 * 1000;

export const otpStore = {
  set(email, code) {
    store.set(email.toLowerCase(), { code, expiresAt: Date.now() + TTL });
  },
  verify(email, code) {
    const entry = store.get(email.toLowerCase());
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) { store.delete(email.toLowerCase()); return false; }
    if (entry.code !== code) return false;
    store.delete(email.toLowerCase());
    return true;
  },
  has(email) {
    const entry = store.get(email.toLowerCase());
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) { store.delete(email.toLowerCase()); return false; }
    return true;
  },
};
