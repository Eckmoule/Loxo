// Nav.jsx — Loxo navigation bar
import { useState } from 'react';

function Nav({ theme, onToggleTheme, screen, city, onNavigate }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const logoMark = (
    <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
      <path d="M18 7L7 7L7 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 33L33 33L33 22" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="10" y1="30" x2="30" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 3" strokeOpacity="0.45"/>
      <circle cx="30" cy="10" r="2.8" fill="currentColor"/>
    </svg>
  );

  const breadcrumb = () => {
    if (screen === 'home') return null;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-3)' }}>
        <button onClick={() => onNavigate('home')} style={navLinkStyle}>Accueil</button>
        {city && <>
          <span style={{ color: 'var(--border)' }}>/</span>
          <button
            onClick={() => onNavigate('macro', { city })}
            style={{ ...navLinkStyle, color: screen === 'macro' ? 'var(--text-1)' : 'var(--text-3)' }}
          >
            {city.name}
          </button>
        </>}
        {screen === 'micro' && <>
          <span style={{ color: 'var(--border)' }}>/</span>
          <span style={{ color: 'var(--text-1)', fontWeight: 500 }}>Carte</span>
        </>}
      </div>
    );
  };

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border-subtle)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '0 24px',
        height: 56,
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        {/* Logo */}
        <button
          onClick={() => onNavigate('home')}
          style={{
            display: 'flex', alignItems: 'center', gap: 9,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-1)', padding: 0,
            fontFamily: 'var(--font-display)',
            fontWeight: 700, fontSize: 17, letterSpacing: '-0.02em',
            flexShrink: 0,
          }}
        >
          {logoMark}
          Loxo
        </button>

        {/* Breadcrumb */}
        <div style={{ flex: 1 }}>{breadcrumb()}</div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {screen !== 'home' && (
            <a
              href="https://www.data.gouv.fr/fr/datasets/demandes-de-valeurs-foncieres/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 12, color: 'var(--text-3)',
                textDecoration: 'none', padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                fontFamily: 'var(--font-mono)',
                transition: 'color 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => { e.target.style.color = 'var(--text-2)'; e.target.style.borderColor = 'var(--border)'; }}
              onMouseLeave={e => { e.target.style.color = 'var(--text-3)'; e.target.style.borderColor = 'var(--border-subtle)'; }}
            >
              DVF
            </a>
          )}

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            title={theme === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair'}
            style={{
              width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'none', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              color: 'var(--text-2)',
              transition: 'background 0.15s, border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-2)'; }}
          >
            {theme === 'light' ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.1 3.1l1.06 1.06M11.84 11.84l1.06 1.06M3.1 12.9l1.06-1.06M11.84 4.16l1.06-1.06" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                <circle cx="8" cy="8" r="2.8" stroke="currentColor" strokeWidth="1.4"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.5 9.5A5.5 5.5 0 016.5 2.5 5.5 5.5 0 1013.5 9.5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

const navLinkStyle = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'var(--text-3)', fontFamily: 'var(--font-sans)',
  fontSize: 13, padding: 0,
  transition: 'color 0.15s',
};

export default Nav;
