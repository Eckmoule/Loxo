import { useState, useRef } from 'react';
import Icon from './common/Icon';
import './Home.css';

const SUGGESTIONS = ['Paris', 'Lyon', 'Bordeaux', 'Toulouse', 'Nantes', 'Marseille', 'Montpellier', 'Lille'];

function Home({ onNavigate }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const filtered = query.length > 0
    ? SUGGESTIONS.filter(s => s.toLowerCase().startsWith(query.toLowerCase()))
    : SUGGESTIONS;

  const handleSelect = (name) => {
    const city = window.LOXO_DATA.cities[name.toLowerCase()];
    if (city) {
      onNavigate('macro', { city });
    } else {
      // fallback to paris for unlisted cities
      onNavigate('macro', { city: { ...window.LOXO_DATA.cities.paris, name, id: name.toLowerCase() } });
    }
    setQuery('');
    setFocused(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query) handleSelect(query);
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
          <form onSubmit={handleSubmit} className="search-form">
            <div className={`search-input-wrapper ${focused ? 'search-input-wrapper--focused' : ''}`}>
              <div className="search-input-wrapper__icon">
                <Icon name="search" size={16} />
              </div>

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 150)}
                placeholder="Paris, Lyon, 69000, Bordeaux..."
                className="search-input"
              />

              <button type="submit" className="search-submit">
                Rechercher
              </button>
            </div>

            {/* Dropdown */}
            {focused && filtered.length > 0 && (
              <div className="search-dropdown">
                {filtered.slice(0, 6).map(s => (
                  <button
                    key={s}
                    onMouseDown={() => handleSelect(s)}
                    className="search-dropdown__item"
                  >
                    <Icon name="mapPin" size={12} className="search-dropdown__item-icon" />
                    {s}
                  </button>
                ))}
              </div>
            )}
          </form>

          {/* Tags */}
          <div className="hero__tags">
            {['Données officielles', 'Gratuit', 'Sans estimation', 'Source traçable'].map(tag => (
              <span key={tag} className="hero__tag">{tag}</span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
