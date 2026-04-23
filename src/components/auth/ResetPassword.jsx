import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { validateForm } from '../../utils/validation';

function ResetPassword({ onNavigate }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    // Vérifier si on a un token de reset valide dans l'URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');
    
    if (type === 'recovery' && accessToken) {
      setValidToken(true);
    } else {
      setError('Lien de réinitialisation invalide ou expiré.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const errors = validateForm({
      password: password,
      confirmPassword: confirmPassword,
    });
    
    if (Object.keys(errors).length > 0) {
      setError(Object.values(errors)[0]);
      return;
    }
    
    setLoading(true);
    
    const { error } = await supabase.auth.updateUser({
      password: password
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
              <path d="M6 14l6 6 10-10" stroke="var(--positive)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 24, letterSpacing: '-0.04em', color: 'var(--text-1)', marginBottom: 12,
          }}>Mot de passe réinitialisé !</h2>
          <p style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.7, marginBottom: 28 }}>
            Votre mot de passe a été mis à jour avec succès.
          </p>
          <button onClick={() => onNavigate('home')} style={{
            padding: '10px 24px',
            background: 'var(--accent)', color: '#fff',
            border: 'none', borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500,
            cursor: 'pointer',
          }}>
            Accéder à mon compte
          </button>
        </div>
      </main>
    );
  }

  if (!validToken && error) {
    return (
      <main style={{
        minHeight: 'calc(100vh - 56px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px',
      }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'var(--negative-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 9v5M14 18v.5" stroke="var(--negative)" strokeWidth="2.2" strokeLinecap="round"/>
              <circle cx="14" cy="14" r="10" stroke="var(--negative)" strokeWidth="2"/>
            </svg>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 24, letterSpacing: '-0.04em', color: 'var(--text-1)', marginBottom: 12,
          }}>Lien invalide</h2>
          <p style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.7, marginBottom: 28 }}>
            {error}
          </p>
          <button onClick={() => onNavigate('forgot-password')} style={{
            padding: '10px 24px',
            background: 'var(--accent)', color: '#fff',
            border: 'none', borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500,
            cursor: 'pointer',
          }}>
            Demander un nouveau lien
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
          }}>Nouveau mot de passe</h1>
          <p style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.6 }}>
            Choisissez un nouveau mot de passe sécurisé
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

            {/* Password */}
            <div>
              <label style={labelStyle}>Nouveau mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  style={{ ...inputStyle(), paddingRight: 44 }}
                  onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={e => Object.assign(e.target.style, inputBlurStyle)}
                />
                <button
                  type="button" tabIndex="1"
                  onClick={() => setShowPass(s => !s)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-3)', padding: 4, lineHeight: 0,
                  }}
                >
                  {showPass ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
                Minimum 6 caractères
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label style={labelStyle}>Confirmer le mot de passe</label>
              <input
                type={showPass ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
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
              {loading ? 'Mise à jour...' : 'Réinitialiser le mot de passe'}
            </button>
          </form>
        </div>
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

export default ResetPassword;