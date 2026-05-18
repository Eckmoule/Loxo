import SearchBar from './common/SearchBar';
import { Helmet } from 'react-helmet-async'
import { SEO_CONFIG } from '../config/seo'
import './Home.css';

const TAGS = ['Données officielles', 'Gratuit', 'Sans estimation', 'Source traçable'];

function Home({ onNavigate }) {
  const handleSearch = (selectedCommune) => {
    // Navigation vers la page commune avec les données
    onNavigate('commune', { commune: selectedCommune });
  };

  return (
    <>
      {/* Meta tags SEO */}
      <Helmet>
        <title>Loxo - Prix immobilier en France | Données officielles </title>
        <meta
          name="description"
          content={`Consultez gratuitement l'évolution des prix immobiliers en France. ${SEO_CONFIG.DATA_SOURCE} ${SEO_CONFIG.DATA_PERIOD_LABEL}, mises à jour semestriellement.`}
        />
        <meta
          name="keywords"
          content="prix immobilier, DVF, prix m², marché immobilier France, transactions immobilières, données officielles"
        />

        {/* Open Graph */}
        <meta property="og:title" content="Loxo - Prix immobilier en France" />
        <meta property="og:description" content="Consultez gratuitement l'évolution des prix immobiliers en France. Données DVF officielles." />
        <meta property="og:image" content="https://loxo.fr/og-image.png" />
        <meta property="og:url" content="https://loxo.fr" />
        <meta property="og:type" content="website" />
      </Helmet>
      <main>
        {/* Hero */}
        <section className="hero">
          {/* Background grid */}
          <div className="hero__background" />

          {/* Radial fade over grid */}
          <div className="hero__gradient" />

          <div className="hero__content">
            {/* Badge */}
            <div className="hero__badge">
              <span className="hero__badge-dot" />
              Données DVF — Mises à jour : {SEO_CONFIG.getLastUpdateLabel()}
            </div>

            {/* Headline */}
            <h1 className="hero__title">
              Visualisez le marché<br />
              <span className="hero__title-accent">immobilier</span>
            </h1>

            <p className="hero__subtitle">
              Les vraies transactions, issues des données officielles DVF.
              Pas d'estimation. Pas de modèle opaque. Juste les faits.
            </p>

            {/* Search */}
            <SearchBar onSelect={handleSearch} />

            {/* Tags */}
            <div className="hero__tags">
              {TAGS.map(tag => (
                <span key={tag} className="hero__tag">{tag}</span>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;
