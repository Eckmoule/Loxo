import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import FormField from '../common/FormField';
import PasswordInput from '../common/PasswordInput';
import Button from '../common/Button';
import Icon from '../common/Icon';
import '../common/Input.css';
import './Auth.css';

function SignIn({ onNavigate }) {
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
      onNavigate('home');
    }
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
              onForgotClick={() => onNavigate('forgot-password')}
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
          <button onClick={() => onNavigate('signup')} className="auth-form__link">
            Créer un compte
          </button>
        </p>
      </div>
    </main>
  );
}

export default SignIn;