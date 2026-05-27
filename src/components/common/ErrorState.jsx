import { useNavigate } from 'react-router-dom';
import './ErrorState.css';

function ErrorState({
    title = 'Une erreur est survenue',
    message = 'La page que vous cherchez est introuvable.',
    buttonText = 'Retour à l\'accueil',
    buttonAction = null,
}) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (buttonAction) {
            buttonAction();
        } else {
            navigate('/');
        }
    };

    return (
        <div className="error-state">
            <div className="error-state__inner">

                {/* Icône */}
                <div className="error-state__icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M16 10v7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <circle cx="16" cy="21.5" r="1.2" fill="currentColor" />
                    </svg>
                </div>

                {/* Texte */}
                <h2 className="error-state__title">{title}</h2>
                <p className="error-state__message">{message}</p>

                {/* Bouton */}
                <button onClick={handleClick} className="error-state__btn">
                    ← {buttonText}
                </button>
            </div>
        </div>
    );
}

export default ErrorState;
