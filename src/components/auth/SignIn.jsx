import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import FormField from '../common/FormField';
import PasswordInput from '../common/PasswordInput';
import Button from '../common/Button';
import Icon from '../common/Icon';
import '../common/Input.css';
import './Auth.css';

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      navigate('/');
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) console.error(error);
  };

  return (
    <main className="page-layout">
      <div className="page-layout__background" />
      <div className="page-layout__gradient" />

      <div className="page-layout__content">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo__box">
            <Icon name="logo" size={28} />
          </div>
        </div>

        {/* Header */}
        <div className="page-header page-header--center">
          <h1 className="page-header__title">Bon retour</h1>
          <p className="page-header__subtitle">
            Connectez-vous pour accéder à vos analyses
          </p>
        </div>

        {/* Card */}
        <div className="page-card">
          <form onSubmit={handleSubmit} className="page-form">

            <button
              onClick={handleGoogleSignIn}
              className="signin__google-btn"
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z" />
                <path fill="#34A353" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z" />
                <path fill="#4285F4" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z" />
                <path fill="#FBBC05" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z" />
              </svg>
              Continuer avec Google
            </button>

            {/* Séparateur */}
            <div className="signin__divider">
              <span>ou</span>
            </div>

            {/* Email */}
            <FormField label="Adresse e-mail">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="vous@exemple.fr"
                autoComplete="email"
                className="input"
              />
            </FormField>

            {/* Password */}
            <PasswordInput
              value={password}
              onChange={e => setPassword(e.target.value)}
              showForgotLink={true}
              onForgotClick={() => navigate('/forgot-password')}
            />

            {/* Error */}
            {error && <div className="auth-error">{error}</div>}

            {/* Submit */}
            <Button type="submit" variant="primary" loading={loading}>
              {loading ? (
                <>
                  <Icon name="spinner" />
                  Connexion…
                </>
              ) : 'Se connecter'}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="page-footer">
          Pas encore de compte ?{' '}
          <button onClick={() => navigate('/signup')} className="auth-form__link">
            Créer un compte
          </button>
        </p>
      </div>
    </main>
  );
}

export default SignIn;