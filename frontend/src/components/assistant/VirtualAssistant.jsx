import { useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useSigmaAssistant } from '../../hooks/useSigmaAssistant';

export default function VirtualAssistant({ compact = false }) {
  const { t } = useTheme();
  const {
    messages,
    draft,
    setDraft,
    status,
    isListening,
    canUseSpeech,
    canUseTTS,
    personality,
    changePersonality,
    sendTextQuery,
    startListening,
    stopListening,
    pauseVoice,
    resumeVoice,
    clearConversation,
    voiceProfile,
    saveVoiceProfile,
    speechTone,
    saveSpeechTone,
    voiceVolume,
    saveVoiceVolume,
    voiceEnabled,
    toggleVoiceEnabled,
    autoGuide,
    toggleAutoGuide,
    isVoicePaused,
    feriaActive,
    toggleFeria,
  } = useSigmaAssistant();

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const compactMode = compact;

  return (
    <div style={{
      background: t.cardBg,
      border: `1.5px solid ${t.cardBorder}`,
      borderRadius: 20,
      padding: compactMode ? '14px' : '18px',
      maxWidth: compactMode ? 380 : 760,
      width: '100%',
      margin: compactMode ? '0' : '0 auto 24px',
      boxShadow: compactMode ? '0 12px 30px rgba(0,0,0,0.12)' : '0 8px 24px rgba(0,0,0,0.08)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: compactMode ? 12 : 18, gap: compactMode ? 8 : 0 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 900, color: t.text }}>Asistente SIGMA</div>
          <div style={{ fontSize: 15, color: t.text3, marginTop: 4 }}>SIGMA te da una guía activa: te habla, te recuerda pistas y te sugiere qué hacer en tu nivel.</div>
          <div style={{ marginTop: 10, display: 'grid', gap: 10, fontSize: 15 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 14, color: t.text3 }}>Modo:</span>
              <select
                value={personality}
                onChange={(e) => changePersonality(e.target.value)}
                style={{ padding: '7px 10px', borderRadius: 14, border: `1px solid ${t.cardBorder}`, background: t.appBg, color: t.text, fontSize: 15, cursor: 'pointer' }}
              >
                <option value="coach">Coach</option>
                <option value="techy">Techy</option>
                <option value="tutor">Tutor</option>
                <option value="zen">Zen</option>
                <option value="meme">Meme</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 14, color: t.text3 }}>Voz:</span>
              <select
                value={voiceProfile}
                onChange={(e) => saveVoiceProfile(e.target.value)}
                style={{ padding: '7px 10px', borderRadius: 14, border: `1px solid ${t.cardBorder}`, background: t.appBg, color: t.text, fontSize: 15, cursor: 'pointer' }}
              >
                <option value="luz">Luz (natural)</option>
                <option value="nano">Nano (energético)</option>
                <option value="robo">Robo (futurista)</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 14, color: t.text3 }}>Tono:</span>
              <select
                value={speechTone}
                onChange={(e) => saveSpeechTone(e.target.value)}
                style={{ padding: '7px 10px', borderRadius: 14, border: `1px solid ${t.cardBorder}`, background: t.appBg, color: t.text, fontSize: 15, cursor: 'pointer' }}
              >
                <option value="natural">Natural</option>
                <option value="energico">Dinámico</option>
                <option value="robotico">Robótico</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: t.text3, fontSize: 14 }}>
                <input
                  type="checkbox"
                  checked={voiceEnabled}
                  onChange={(e) => toggleVoiceEnabled(e.target.checked)}
                  style={{ width: 14, height: 14 }}
                />
                Voz activa
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: t.text3, fontSize: 14 }}>
                <input
                  type="checkbox"
                  checked={autoGuide}
                  onChange={(e) => toggleAutoGuide(e.target.checked)}
                  style={{ width: 14, height: 14 }}
                />
                Guía automática
              </label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 14, color: t.text3 }}>Volumen:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={voiceVolume}
                onChange={(e) => saveVoiceVolume(Number(e.target.value))}
                style={{ width: compactMode ? 170 : 220 }}
              />
              <span style={{ color: t.text3, fontSize: 14 }}>{Math.round(voiceVolume * 100)}%</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 14, padding: '6px 10px', borderRadius: 999, background: `${t.primary}14`, color: t.primary, fontWeight: 700, textTransform: 'uppercase' }}>{status === 'listening' ? 'Escuchando' : status === 'paused' ? 'Pausado' : status === 'speaking' ? 'Hablando' : 'Listo'}</div>
          <button onClick={toggleFeria}
            title={feriaActive ? 'Detener bucle de feria' : 'Activar bucle llamativo para feria'}
            style={{
              border: `1px solid ${feriaActive ? '#ff5b8a' : t.cardBorder}`,
              background: feriaActive ? 'linear-gradient(135deg,#ff5b8a,#ffb347)' : t.appBg,
              color: feriaActive ? '#fff' : t.text2,
              borderRadius: 10, padding: '8px 12px', cursor: 'pointer', fontSize: 15, fontWeight: 800,
              boxShadow: feriaActive ? '0 0 0 3px rgba(255,91,138,0.25)' : 'none',
              animation: feriaActive ? 'pulseFeria 1.4s ease-in-out infinite' : 'none',
            }}>
            {feriaActive ? '■ Feria ON' : '📣 Feria'}
          </button>
          <button onClick={clearConversation}
            style={{ border: `1px solid ${t.cardBorder}`, background: t.appBg, color: t.text2, borderRadius: 10, padding: '8px 10px', cursor: 'pointer', fontSize: 15, fontWeight: 700 }}>
            Reiniciar
          </button>
        </div>
      </div>
      <style>{`@keyframes pulseFeria { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }`}</style>

      <div ref={scrollRef} style={{ maxHeight: compactMode ? 260 : 320, overflowY: 'auto', paddingRight: 4, marginBottom: compactMode ? 14 : 18 }}>
        {messages.map((message) => (
          <div key={message.id} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
            <div style={{
              width: 38, height: 38, borderRadius: 14,
              background: message.role === 'assistant' ? `${t.primary}18` : `${t.progressBg}`,
              display: 'grid', placeItems: 'center', color: message.role === 'assistant' ? t.primaryDark : t.text2,
              fontSize: 16, fontWeight: 800,
            }}>
              {message.role === 'assistant' ? 'Σ' : 'T'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 6, fontSize: 15, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.7px', color: t.text3 }}>
                {message.role === 'assistant' ? 'SIGMA' : 'Tú'}
              </div>
              <div style={{ background: message.role === 'assistant' ? t.appBg : `${t.progressBg}`, border: `1px solid ${t.cardBorder}`, borderRadius: 16, padding: '14px 16px', color: t.text, lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                {message.text}
                {message.image && (
                  <div style={{ marginTop: 12, borderRadius: 16, overflow: 'hidden', background: '#010101', textAlign: 'center' }}>
                    <img src={message.image} alt="Meme de SIGMA" style={{ width: '100%', display: 'block' }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginBottom: compactMode ? 12 : 14 }}>
        <button onClick={startListening}
          disabled={!canUseSpeech || isListening}
          style={{
            flex: 1, minWidth: 160, padding: '12px 14px', borderRadius: 14,
            border: 'none', background: isListening ? `${t.primary}22` : t.primary,
            color: '#fff', fontWeight: 700, cursor: canUseSpeech ? 'pointer' : 'not-allowed',
            opacity: canUseSpeech ? 1 : 0.55,
          }}>
          {isListening ? 'Escuchando…' : 'Hablar con SIGMA'}
        </button>

        <button onClick={stopListening}
          disabled={!isListening}
          style={{
            flex: 0, minWidth: 130, padding: '12px 14px', borderRadius: 14,
            border: `1px solid ${t.cardBorder}`, background: t.appBg, color: t.text,
            cursor: isListening ? 'pointer' : 'not-allowed', opacity: isListening ? 1 : 0.5,
          }}>
          Detener voz
        </button>

        <button onClick={pauseVoice}
          disabled={!canUseTTS || !voiceEnabled || status !== 'speaking'}
          style={{
            flex: 0, minWidth: 130, padding: '12px 14px', borderRadius: 14,
            border: `1px solid ${t.cardBorder}`, background: t.appBg, color: t.text,
            cursor: canUseTTS && voiceEnabled && status === 'speaking' ? 'pointer' : 'not-allowed', opacity: canUseTTS && voiceEnabled && status === 'speaking' ? 1 : 0.5,
          }}>
          Pausar voz
        </button>

        <button onClick={resumeVoice}
          disabled={!canUseTTS || !voiceEnabled || !isVoicePaused}
          style={{
            flex: 0, minWidth: 130, padding: '12px 14px', borderRadius: 14,
            border: `1px solid ${t.cardBorder}`, background: t.appBg, color: t.text,
            cursor: canUseTTS && voiceEnabled && isVoicePaused ? 'pointer' : 'not-allowed', opacity: canUseTTS && voiceEnabled && isVoicePaused ? 1 : 0.5,
          }}>
          Reanudar voz
        </button>

        <button onClick={() => sendTextQuery(draft)}
          disabled={!draft.trim()}
          style={{
            flex: 0, minWidth: 130, padding: '12px 14px', borderRadius: 14,
            border: 'none', background: draft.trim() ? t.primary : t.progressBg,
            color: draft.trim() ? '#fff' : t.text3, fontWeight: 700, cursor: draft.trim() ? 'pointer' : 'not-allowed',
          }}>
          Enviar texto
        </button>
      </div>

      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') sendTextQuery(draft); }}
        placeholder="Escribe tu pregunta aquí..."
        style={{
          width: '100%', minHeight: 48, padding: '14px 16px', borderRadius: 16,
          border: `1.5px solid ${t.cardBorder}`, background: t.appBg, color: t.text,
          fontSize: 14, outline: 'none', boxShadow: `inset 0 1px 2px rgba(0,0,0,0.06)`,
        }}
      />

      {!canUseSpeech && (
        <div style={{ marginTop: 12, fontSize: 15, color: t.text3 }}>
          Tu navegador no soporta dictado por voz. Usa el campo de texto para interactuar con SIGMA.
        </div>
      )}
    </div>
  );
}
