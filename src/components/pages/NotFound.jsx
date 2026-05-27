import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SearchBar from '../common/SearchBar';
import './NotFound.css';

function NotFound() {
    const navigate = useNavigate();

    const handleSearch = (selectedCommune) => {
        navigate(`/commune/${selectedCommune.code_commune}`);
    };

    return (
        <>
            <Helmet>
                <title>Page introuvable | Loxo</title>
                <meta name="robots" content="noindex" />
            </Helmet>

            <div className="not-found">
                <div className="not-found__inner">

                    {/* Code 404 */}
                    <div className="not-found__code">404</div>

                    {/* Texte */}
                    <h1 className="not-found__title">Page introuvable</h1>
                    <p className="not-found__message">
                        Cette page n'existe pas ou a été déplacée.<br />
                        Recherchez une commune pour continuer.
                    </p>

                    {/* SearchBar */}
                    <div className="not-found__search">
                        <SearchBar onSelect={handleSearch} />
                    </div>

                    {/* Lien retour */}
                    <button
                        onClick={() => navigate('/')}
                        className="not-found__btn"
                    >
                        ← Retour à l'accueil
                    </button>

                </div>
            </div>
        </>
    );
}

export default NotFound;
