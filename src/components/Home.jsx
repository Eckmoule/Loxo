import SearchBar from './common/SearchBar';
import './Home.css';

const TAGS = ['Données officielles', 'Gratuit', 'Sans estimation', 'Source traçable'];

function Home({ onNavigate }) {
  const handleSearch = (selectedCommune) => {
    // Navigation vers la page commune avec les données
    onNavigate('commune', { commune: selectedCommune });
  };

  return (
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
            Données DVF — Mises à jour : Décembre 2025
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
  );
}

export default Home;
