// SignIn.jsx — Page de connexion Loxo
import { useState } from 'react';

function SignIn({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Veuillez remplir tous les champs.'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNavigate('home');
    }, 1200);
  };

  return (
    <main style={{
      minHeight: 'calc(100vh - 56px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background grid */}
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
        background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 0%, var(--bg) 80%)',
      }}/>

      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 400 }}>

        {/* Logo mark */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-md)',
            color: 'var(--text-1)',
          }}>
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
              <path d="M18 7L7 7L7 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 33L33 33L33 22" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="10" y1="30" x2="30" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 3" strokeOpacity="0.45"/>
              <circle cx="30" cy="10" r="2.8" fill="currentColor"/>
            </svg>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 26, letterSpacing: '-0.04em', color: 'var(--text-1)',
            marginBottom: 8,
          }}>Bon retour</h1>
          <p style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.6 }}>
            Connectez-vous pour accéder à vos analyses
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
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Email */}
            <div>
              <label style={labelStyle}>Adresse e-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="vous@exemple.fr"
                autoComplete="email"
                style={inputStyle(false)}
                onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={e => Object.assign(e.target.style, inputBlurStyle)}
              />
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Mot de passe</label>
                <button type="button" style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-sans)',
                }}>Mot de passe oublié ?</button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{ ...inputStyle(false), paddingRight: 44 }}
                  onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={e => Object.assign(e.target.style, inputBlurStyle)}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-3)', padding: 4, lineHeight: 0,
                  }}
                >
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.3"/>
                      <circle cx="8" cy="8" r="1.8" fill="currentColor"/>
                      <path d="M3 3l10 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 8s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.3"/>
                      <circle cx="8" cy="8" r="1.8" fill="currentColor"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                background: 'var(--negative-subtle)',
                border: '1px solid var(--negative)',
                fontSize: 13, color: 'var(--negative)',
              }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '11px 0',
                background: loading ? 'var(--accent-subtle)' : 'var(--accent)',
                color: loading ? 'var(--accent-text)' : '#fff',
                border: 'none', borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500,
                cursor: loading ? 'wait' : 'pointer',
                transition: 'background 0.2s, color 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--accent-hover)'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--accent)'; }}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
                    <circle cx="8" cy="8" r="6" stroke="var(--accent-text)" strokeWidth="1.5" strokeDasharray="28" strokeDashoffset="10"/>
                  </svg>
                  Connexion…
                </>
              ) : 'Se connecter'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }}/>
            <span style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>ou</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }}/>
          </div>

          {/* SSO */}
          <button style={{
            width: '100%', padding: '10px 0',
            background: 'var(--surface-2)', color: 'var(--text-1)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'background 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-3)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M15 8.18A7 7 0 11 8.18 1 7 7 0 0115 8.18z" stroke="var(--text-3)" strokeWidth="1.2"/>
              <path d="M8 1v14M1 8h14" stroke="var(--text-3)" strokeWidth="1.2"/>
              <path d="M2 5.5Q5 7 8 7t6-1.5M2 10.5Q5 9 8 9t6 1.5" stroke="var(--text-3)" strokeWidth="1.2"/>
            </svg>
            Continuer avec SSO
          </button>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-3)' }}>
          Pas encore de compte ?{' '}
          <button style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--accent)', fontFamily: 'var(--font-sans)', fontSize: 13,
            fontWeight: 500,
          }}>
            Créer un compte
          </button>
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}

const labelStyle = {
  display: 'block', fontSize: 12, fontWeight: 500,
  color: 'var(--text-2)', marginBottom: 7,
  fontFamily: 'var(--font-sans)',
};

const inputStyle = () => ({
  width: '100%', padding: '10px 14px',
  background: 'var(--surface-2)',
  border: '1.5px solid var(--border-subtle)',
  borderRadius: 'var(--radius-sm)',
  fontFamily: 'var(--font-sans)', fontSize: 14,
  color: 'var(--text-1)', outline: 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s',
});

const inputFocusStyle = {
  borderColor: 'var(--accent)',
  boxShadow: '0 0 0 3px var(--accent-subtle)',
  background: 'var(--surface)',
};
const inputBlurStyle = {
  borderColor: 'var(--border-subtle)',
  boxShadow: 'none',
  background: 'var(--surface-2)',
};

export default SignIn;
