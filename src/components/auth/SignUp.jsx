import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { validateForm } from '../../utils/validation';
import FormField from '../common/FormField';
import PasswordInput from '../common/PasswordInput';
import Button from '../common/Button';
import Icon from '../common/Icon';
import StatusMessage from '../common/StatusMessage';
import '../common/Input.css';
import './Auth.css';

function SignUp({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const errors = validateForm({
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    });

    if (Object.keys(errors).length > 0) {
      setError(Object.values(errors)[0]);
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
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
      <StatusMessage
        type="success"
        title="Compte créé !"
        message="Vérifiez votre boîte mail pour confirmer votre adresse e-mail."
        buttonText="Se connecter"
        onButtonClick={() => onNavigate('signin')}
      />
    );
  }

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
          <h1 className="page-header__title">Créer un compte</h1>
          <p className="page-header__subtitle">
            Commencez à analyser le marché immobilier
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
            <div>
              <label className="form-field__label">Mot de passe</label>
              <PasswordInput
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <p className="signup-hint">Minimum 6 caractères</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="form-field__label">Confirmer le mot de passe</label>
              <PasswordInput
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            {/* Error */}
            {error && <div className="auth-error">{error}</div>}

            {/* Submit */}
            <Button type="submit" variant="primary" loading={loading}>
              {loading ? 'Création...' : 'Créer mon compte'}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="page-footer">
          Déjà un compte ?{' '}
          <button onClick={() => onNavigate('signin')} className="auth-form__link">
            Se connecter
          </button>
        </p>
      </div>
    </main>
  );
}

export default SignUp;