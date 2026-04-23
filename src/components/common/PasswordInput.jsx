import { useState } from 'react';
import Icon from './Icon';
import './Input.css';

function PasswordInput({ 
  value, 
  onChange, 
  placeholder = '••••••••',
  showForgotLink = false,
  onForgotClick,
  autoComplete = 'current-password'
}) {
  const [showPass, setShowPass] = useState(false);

  return (
    <div>
      {showForgotLink && (
        <div className="auth-form__field-header">
          <label className="form-field__label">Mot de passe</label>
          <button 
            type="button" 
            tabIndex="-1"
            onClick={onForgotClick}
            className="auth-form__link"
          >
            Mot de passe oublié ?
          </button>
        </div>
      )}
      
      <div className="input-wrapper">
        <input
          type={showPass ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="input"
        />
        <button
          type="button"
          tabIndex="-1"
          onClick={() => setShowPass(s => !s)}
          className="input-wrapper__icon"
          aria-label={showPass ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        >
          <Icon name={showPass ? 'eyeOff' : 'eye'} />
        </button>
      </div>
    </div>
  );
}

export default PasswordInput;