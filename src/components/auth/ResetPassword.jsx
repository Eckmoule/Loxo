import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { validateForm } from '../../utils/validation';
import PasswordInput from '../common/PasswordInput';
import Button from '../common/Button';
import Icon from '../common/Icon';
import StatusMessage from '../common/StatusMessage';
import '../common/Input.css';
import './Auth.css';

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const getTokenFromUrl = () => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');
    return type === 'recovery' && accessToken;
  };

  const [validToken] = useState(getTokenFromUrl);
  const [error, setError] = useState(
    getTokenFromUrl() ? '' : 'Lien de réinitialisation invalide ou expiré.'
  );



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
      <StatusMessage
        type="success"
        title="Mot de passe réinitialisé !"
        message="Votre mot de passe a été mis à jour avec succès."
        buttonText="Accéder à mon compte"
        onButtonClick={() => navigate('/')}
      />
    );
  }

  if (!validToken && error) {
    return (
      <StatusMessage
        type="error"
        title="Lien invalide"
        message={error}
        buttonText="Demander un nouveau lien"
        onButtonClick={() => navigate('/forgot-password')}
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
          <h1 className="page-header__title">Nouveau mot de passe</h1>
          <p className="page-header__subtitle">
            Choisissez un nouveau mot de passe sécurisé
          </p>
        </div>

        {/* Card */}
        <div className="page-card">
          <form onSubmit={handleSubmit} className="page-form">

            {/* Password */}
            <div>
              <label className="form-field__label">Nouveau mot de passe</label>
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
              {loading ? 'Mise à jour...' : 'Réinitialiser le mot de passe'}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default ResetPassword;