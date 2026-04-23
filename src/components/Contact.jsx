// Contact.jsx — Page de contact Loxo
import { useState } from 'react';

const SUBJECTS = [
  'Question générale',
  'Problème technique',
  'Demande de données',
  'Partenariat',
  'Presse',
  'Autre',
];

function Contact({ onNavigate }) {
  const [form, setForm] = useState({ email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [subjectOpen, setSubjectOpen] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.email.includes('@')) e.email = 'Adresse e-mail invalide';
    if (!form.subject) e.subject = 'Veuillez choisir un sujet';
    if (form.message.trim().length < 10) e.message = 'Message trop court (10 caractères min.)';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    setErrors(e2);
    if (Object.keys(e2).length) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1400);
  };

  if (sent) {
    return (
      <main style={{
        minHeight: 'calc(100vh - 56px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px',
      }}>
        <div style={{ textAlign: 'center', maxWidth: 380 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'var(--positive-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M6 14l6 6 10-10" stroke="var(--positive)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 24, letterSpacing: '-0.04em', color: 'var(--text-1)', marginBottom: 12,
          }}>Message envoyé !</h2>
          <p style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.7, marginBottom: 28 }}>
            Nous avons bien reçu votre message et vous répondrons dans les meilleurs délais.
          </p>
          <button onClick={() => onNavigate('home')} style={{
            padding: '10px 24px',
            background: 'var(--accent)', color: '#fff',
            border: 'none', borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500,
            cursor: 'pointer',
          }}>
            Retour à l'accueil
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{
      minHeight: 'calc(100vh - 56px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '60px 24px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(var(--border-subtle) 1px, transparent 1px),
          linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px', opacity: 0.5,
      }}/>
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 0%, var(--bg) 80%)',
      }}/>

      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 520 }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 30, letterSpacing: '-0.04em', color: 'var(--text-1)', marginBottom: 8,
          }}>Nous contacter</h1>
          <p style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.6 }}>
            Une question, un problème ou une suggestion ? Nous lisons tous les messages.
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          boxShadow: 'var(--shadow-md)',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Email */}
            <Field label="Adresse e-mail" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="vous@exemple.fr"
                style={fieldInput(!!errors.email)}
                onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={e => Object.assign(e.target.style, errors.email ? inputErrorStyle : inputBlurStyle)}
              />
            </Field>

            {/* Subject select */}
            <Field label="Sujet" error={errors.subject}>
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setSubjectOpen(o => !o)}
                  style={{
                    ...fieldInput(!!errors.subject),
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer', textAlign: 'left',
                    color: form.subject ? 'var(--text-1)' : 'var(--text-3)',
                  }}
                >
                  {form.subject || 'Choisir un sujet…'}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, transform: subjectOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: 'var(--text-3)' }}>
                    <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {subjectOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    overflow: 'hidden', zIndex: 50,
                  }}>
                    {SUBJECTS.map(s => (
                      <button key={s} type="button"
                        onMouseDown={() => { set('subject', s); setSubjectOpen(false); }}
                        style={{
                          display: 'block', width: '100%',
                          padding: '9px 14px', textAlign: 'left',
                          background: form.subject === s ? 'var(--accent-subtle)' : 'none',
                          border: 'none', cursor: 'pointer',
                          fontFamily: 'var(--font-sans)', fontSize: 13,
                          color: form.subject === s ? 'var(--accent-text)' : 'var(--text-1)',
                          transition: 'background 0.1s',
                        }}
                        onMouseEnter={e => { if (form.subject !== s) e.currentTarget.style.background = 'var(--surface-2)'; }}
                        onMouseLeave={e => { if (form.subject !== s) e.currentTarget.style.background = 'none'; }}
                      >{s}</button>
                    ))}
                  </div>
                )}
              </div>
            </Field>

            {/* Message */}
            <Field label="Message" error={errors.message}>
              <textarea
                value={form.message}
                onChange={e => set('message', e.target.value)}
                placeholder="Décrivez votre demande…"
                rows={5}
                style={{
                  ...fieldInput(!!errors.message),
                  resize: 'vertical', minHeight: 120,
                  fontFamily: 'var(--font-sans)', lineHeight: 1.6,
                }}
                onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={e => Object.assign(e.target.style, errors.message ? inputErrorStyle : inputBlurStyle)}
              />
              <div style={{ marginTop: 4, textAlign: 'right', fontSize: 11, color: form.message.length < 10 ? 'var(--text-3)' : 'var(--positive)', fontFamily: 'var(--font-mono)' }}>
                {form.message.length} / 1000
              </div>
            </Field>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '12px 0',
                background: loading ? 'var(--accent-subtle)' : 'var(--accent)',
                color: loading ? 'var(--accent-text)' : '#fff',
                border: 'none', borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500,
                cursor: loading ? 'wait' : 'pointer',
                transition: 'background 0.2s, color 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                marginTop: 4,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--accent-hover)'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--accent)'; }}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
                    <circle cx="8" cy="8" r="6" stroke="var(--accent-text)" strokeWidth="1.5" strokeDasharray="28" strokeDashoffset="10"/>
                  </svg>
                  Envoi en cours…
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7l12-5-5 12-2-4.5L1 7z" stroke="white" strokeWidth="1.3" strokeLinejoin="round"/>
                  </svg>
                  Envoyer le message
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info band */}
        <div style={{
          marginTop: 20, padding: '14px 18px',
          background: 'var(--surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 'var(--radius-sm)',
            background: 'var(--accent-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="var(--accent)" strokeWidth="1.3"/>
              <path d="M1 5l7 5 7-5" stroke="var(--accent)" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-1)' }}>contact@loxo.fr</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>Réponse sous 24 à 48h ouvrées</div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label style={{
        display: 'block', fontSize: 12, fontWeight: 500,
        color: 'var(--text-2)', marginBottom: 7,
        fontFamily: 'var(--font-sans)',
      }}>{label}</label>
      {children}
      {error && (
        <div style={{ marginTop: 5, fontSize: 12, color: 'var(--negative)', fontFamily: 'var(--font-sans)' }}>
          {error}
        </div>
      )}
    </div>
  );
}

const fieldInput = (hasError) => ({
  width: '100%', padding: '10px 14px',
  background: 'var(--surface-2)',
  border: `1.5px solid ${hasError ? 'var(--negative)' : 'var(--border-subtle)'}`,
  borderRadius: 'var(--radius-sm)',
  fontFamily: 'var(--font-sans)', fontSize: 14,
  color: 'var(--text-1)', outline: 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s',
  boxSizing: 'border-box',
});

const inputFocusStyle = { borderColor: 'var(--accent)', boxShadow: '0 0 0 3px var(--accent-subtle)', background: 'var(--surface)' };
const inputBlurStyle  = { borderColor: 'var(--border-subtle)', boxShadow: 'none', background: 'var(--surface-2)' };
const inputErrorStyle = { borderColor: 'var(--negative)', boxShadow: '0 0 0 3px var(--negative-subtle)', background: 'var(--surface)' };

export default Contact;
