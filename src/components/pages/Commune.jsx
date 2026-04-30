import { useEffect } from 'react';
import './Commune.css';

function Commune({ commune, onNavigate }) {

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' || e.key === 'Backspace') {
                onNavigate('home');
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onNavigate]);

    if (!commune) {
        return (
            <main className="commune-page">
                <div className="commune-error">
                    <h2>Commune introuvable</h2>
                    <button onClick={() => onNavigate('home')} className="commune-back-btn">
                        Retour à l'accueil
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="commune-page">
            <div className="commune-header">
                <button onClick={() => onNavigate('home')} className="commune-back-btn">
                    ← Retour
                </button>
                <h1 className="commune-title">{commune.nom_commune}</h1>
                <div className="commune-info">
                    <span className="commune-badge">Code commune : {commune.code_commune}</span>
                    {commune.code_postal && (
                        <span className="commune-badge">Code postal : {commune.code_postal[0]}</span>
                    )}
                    {commune.population && (
                        <span className="commune-badge">
                            Population : {commune.population.toLocaleString('fr-FR')} habitants
                        </span>
                    )}
                </div>
            </div>

            <div className="commune-content">
                <p className="commune-placeholder">
                    📊 Les graphiques d'évolution des prix seront affichés ici (Phase P3)
                </p>
            </div>
        </main>
    );
}

export default Commune;
