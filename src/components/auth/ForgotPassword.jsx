import { useState } from 'react';
import { supabase } from '../../lib/supabase';

function ForgotPassword({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Veuillez entrer votre adresse e-mail.');
      return;
    }
    
    setLoading(true);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    setLoading(false);
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <main style={{
        minHeight: 'calc(100vh - 56px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px',
      }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'var(--positive-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect x="2" y="6" width="24" height="16" rx="2" stroke="var(--positive)" strokeWidth="2"/>
              <path d="M2 9l12 8 12-8" stroke="var(--positive)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 24, letterSpacing: '-0.04em', color: 'var(--text-1)', marginBottom: 12,
          }}>E-mail envoyé !</h2>
          <p style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.7, marginBottom: 28 }}>
            Vérifiez votre boîte mail. Nous vous avons envoyé un lien pour réinitialiser votre mot de passe.
          </p>
          <button onClick={() => onNavigate('signin')} style={{
            padding: '10px 24px',
            background: 'var(--accent)', color: '#fff',
            border: 'none', borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500,
            cursor: 'pointer',
          }}>
            Retour à la connexion
          </button>
        </div>
      </main>
    );
  }

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
          }}>Mot de passe oublié ?</h1>
          <p style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.6 }}>
            Entrez votre e-mail pour recevoir un lien de réinitialisation
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
                style={inputStyle()}
                onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={e => Object.assign(e.target.style, inputBlurStyle)}
              />
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
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'var(--accent-hover)'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--accent)'; }}
            >
              {loading ? 'Envoi...' : 'Envoyer le lien'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-3)' }}>
          Vous vous souvenez ?{' '}
          <button onClick={() => onNavigate('signin')} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--accent)', fontFamily: 'var(--font-sans)', fontSize: 13,
            fontWeight: 500,
          }}>
            Se connecter
          </button>
        </p>
      </div>
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

export default ForgotPassword;