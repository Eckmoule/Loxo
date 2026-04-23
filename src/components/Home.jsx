// Home.jsx — Landing page
import { useState, useRef } from 'react';

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
      <section style={{
        minHeight: 'calc(100vh - 56px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '80px 0px',
        position: 'relative', overflow: 'hidden',
      }}>

        {/* Background grid */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `
            linear-gradient(var(--border-subtle) 1px, transparent 1px),
            linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          opacity: 0.6,
        }} />
        {/* Radial fade over grid */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, var(--bg) 80%)',
        }} />

        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 680, textAlign: 'center' }}>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '5px 12px 5px 8px',
            borderRadius: 99,
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            marginBottom: 36,
            fontSize: 12, color: 'var(--text-2)',
            fontFamily: 'var(--font-mono)',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--positive)',
              display: 'inline-block',
              boxShadow: '0 0 0 3px var(--positive-subtle)',
            }}/>
            Données DVF — Mises à jour 2024
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 800,
            letterSpacing: '-0.035em',
            lineHeight: 1.06,
            color: 'var(--text-1)',
            marginBottom: 20,
          }}>
            Visualisez le marché<br />
            <span style={{ color: 'var(--accent)' }}>immobilier</span>
          </h1>

          <p style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            color: 'var(--text-2)',
            lineHeight: 1.6,
            marginBottom: 44,
            maxWidth: 480, margin: '0 auto 44px',
          }}>
            Les vraies transactions, issues des données officielles DVF.
            Pas d'estimation. Pas de modèle opaque. Juste les faits.
          </p>

          {/* Search */}
          <form onSubmit={handleSubmit} style={{ position: 'relative', maxWidth: 480, margin: '0 auto 20px' }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              background: 'var(--surface)',
              border: `1.5px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: var_radius_lg,
              boxShadow: focused ? `0 0 0 3px var(--accent-subtle), var(--shadow-md)` : 'var(--shadow-sm)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              overflow: 'visible',
            }}>
              <div style={{ padding: '0 16px', color: 'var(--text-3)', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M11 11l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 150)}
                placeholder="Paris, Lyon, 69000, Bordeaux..."
                style={{
                  flex: 1, padding: '14px 0',
                  background: 'none', border: 'none', outline: 'none',
                  fontFamily: 'var(--font-sans)', fontSize: 15,
                  color: 'var(--text-1)',
                }}
              />
              <button type="submit" style={{
                margin: 5, padding: '9px 18px',
                background: 'var(--accent)', color: 'white',
                border: 'none', borderRadius: 'calc(var(--radius-lg) - 4px)',
                cursor: 'pointer', fontSize: 14, fontWeight: 500,
                fontFamily: 'var(--font-sans)',
                transition: 'background 0.15s',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
              >
                Rechercher
              </button>
            </div>

            {/* Dropdown */}
            {focused && filtered.length > 0 && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                overflow: 'hidden', zIndex: 50,
              }}>
                {filtered.slice(0, 6).map(s => (
                  <button key={s} onMouseDown={() => handleSelect(s)} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    width: '100%', padding: '10px 16px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: 'var(--font-sans)', fontSize: 14,
                    color: 'var(--text-1)', textAlign: 'left',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: 'var(--text-3)', flexShrink: 0 }}>
                      <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
                      <path d="M6 10c0 0-4-3.5-4-5a4 4 0 018 0c0 1.5-4 5-4 5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                    </svg>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </form>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {['Données officielles', 'Gratuit', 'Sans estimation', 'Source traçable'].map(tag => (
              <span key={tag} style={{
                fontSize: 12, color: 'var(--text-3)',
                padding: '3px 10px',
                borderRadius: 99,
                border: '1px solid var(--border-subtle)',
                fontFamily: 'var(--font-mono)',
              }}>{tag}</span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

// Helper
const var_radius_lg = 'var(--radius-lg)';

export default Home;
