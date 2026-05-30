import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getUserAlerts, unfollowCommune } from '../../services/alertsService';
import Icon from '../common/Icon';
import './Profile.css';

function Profile({ user, onSignOut }) {
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Redirect si non connecté
    useEffect(() => {
        if (!user) {
            navigate('/signin');
        }
    }, [user, navigate]);

    // Charger les alertes
    useEffect(() => {
        async function loadAlerts() {
            if (!user) return;
            const data = await getUserAlerts();
            setAlerts(data);
            setLoading(false);
        }
        loadAlerts();
    }, [user]);

    const handleUnfollow = async (codeCommune) => {
        await unfollowCommune(codeCommune);
        setAlerts(prev => prev.filter(a => a.code_commune !== codeCommune));
    };

    const handleSignOut = async () => {
        await onSignOut();
        navigate('/');
    };

    // Formater la date
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Provider label
    const getProvider = () => {
        const provider = user?.app_metadata?.provider;
        if (provider === 'google') return 'Google';
        if (provider === 'email') return 'Email';
        return provider;
    };

    if (!user) return null;

    return (
        <>
            <Helmet>
                <title>Mon profil | Loxo</title>
                <meta name="robots" content="noindex" />
            </Helmet>

            <div className="profile">
                <main className="profile__main">

                    {/* Header */}
                    <div className="profile__header">
                        <div className="profile__header-left">
                            <div className="profile__avatar">
                                <Icon name="user" size={24} />
                            </div>
                            <div>
                                <h1 className="profile__email">{user.email}</h1>
                                <span className="profile__provider">
                                    Connecté via {getProvider()}
                                </span>
                            </div>
                        </div>
                        <button onClick={handleSignOut} className="profile__signout-btn">
                            Se déconnecter
                        </button>
                    </div>

                    {/* Communes suivies */}
                    <div className="profile__section">
                        <h2 className="profile__section-title">
                            Communes suivies
                            {alerts.length > 0 && (
                                <span className="profile__section-count">
                                    {alerts.length}
                                </span>
                            )}
                        </h2>

                        {loading ? (
                            <p className="profile__empty">Chargement...</p>
                        ) : alerts.length === 0 ? (
                            <div className="profile__empty">
                                <p>Vous ne suivez aucune commune pour l'instant.</p>
                                <button
                                    onClick={() => navigate('/')}
                                    className="profile__cta-btn"
                                >
                                    Rechercher une commune
                                </button>
                            </div>
                        ) : (
                            <div className="profile__alerts">
                                {alerts.map(alert => (
                                    <div key={alert.code_commune} className="profile__alert-card">
                                        <div className="profile__alert-info">
                                            <h3 className="profile__alert-name">
                                                {alert.commune?.nom_commune}
                                            </h3>
                                            <span className="profile__alert-meta">
                                                {alert.commune?.code_postal?.[0]} · Suivi depuis le {formatDate(alert.created_at)}
                                            </span>
                                        </div>
                                        <div className="profile__alert-actions">
                                            <button
                                                onClick={() => navigate(`/commune/${alert.code_commune}`)}
                                                className="profile__alert-btn profile__alert-btn--secondary"
                                            >
                                                <Icon name="document" size={13} />
                                                Voir
                                            </button>
                                            <button
                                                onClick={() => handleUnfollow(alert.code_commune)}
                                                className="profile__alert-btn profile__alert-btn--danger"
                                            >
                                                <Icon name="close" size={13} />
                                                Ne plus suivre
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </main>
            </div>
        </>
    );
}

export default Profile;
