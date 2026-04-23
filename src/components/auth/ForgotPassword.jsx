import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { validateEmail } from '../../utils/validation';
import FormField from '../common/FormField';
import Button from '../common/Button';
import Icon from '../common/Icon';
import StatusMessage from '../common/StatusMessage';
import '../common/Input.css';
import './Auth.css';

function ForgotPassword({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
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
      <StatusMessage
        type="success"
        title="E-mail envoyé !"
        message="Vérifiez votre boîte mail. Nous vous avons envoyé un lien pour réinitialiser votre mot de passe."
        buttonText="Retour à la connexion"
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
          <h1 className="page-header__title">Mot de passe oublié ?</h1>
          <p className="page-header__subtitle">
            Entrez votre e-mail pour recevoir un lien de réinitialisation
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

            {/* Error */}
            {error && <div className="auth-error">{error}</div>}

            {/* Submit */}
            <Button type="submit" variant="primary" loading={loading}>
              {loading ? 'Envoi...' : 'Envoyer le lien'}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="page-footer">
          Vous vous souvenez ?{' '}
          <button onClick={() => onNavigate('signin')} className="auth-form__link">
            Se connecter
          </button>
        </p>
      </div>
    </main>
  );
}

export default ForgotPassword;