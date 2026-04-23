// Nav.jsx — Loxo navigation bar
import { useState, useRef, useEffect } from 'react';

function Nav({ theme, onToggleTheme, screen, city, onNavigate, user, onSignOut }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const logoMark = (
    <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
      <path d="M18 7L7 7L7 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 33L33 33L33 22" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="10" y1="30" x2="30" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 3" strokeOpacity="0.45"/>
      <circle cx="30" cy="10" r="2.8" fill="currentColor"/>
    </svg>
  );

  const breadcrumb = () => {
    if (screen === 'home' || screen === 'signin' || screen === 'contact') return null;
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

  const menuItems = [
    {
      label: 'Nous contacter',
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="3" width="12" height="8.5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M1 4.5l6 4 6-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      ),
      action: () => { onNavigate('contact'); setMenuOpen(false); }
    },
  ];

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

          {/* Menu hamburger */}
          <div style={{ position: 'relative' }} ref={menuRef}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              style={{
                width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: menuOpen ? 'var(--surface-2)' : 'none',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                color: menuOpen ? 'var(--text-1)' : 'var(--text-2)',
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-1)'; }}
              onMouseLeave={e => { if (!menuOpen) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-2)'; } }}
              title="Menu"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M2 4h11M2 7.5h11M2 11h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                minWidth: 200,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                overflow: 'hidden',
                zIndex: 200,
              }}>
                {menuItems.map((item, i) => (
                  <button key={i} onClick={item.action} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    width: '100%', padding: '10px 14px',
                    background: 'none', border: 'none',
                    borderBottom: i < menuItems.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)', fontSize: 13,
                    color: 'var(--text-1)', textAlign: 'left',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <span style={{ color: 'var(--text-3)', flexShrink: 0 }}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
            style={{
              width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'none', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              color: 'var(--text-2)',
              transition: 'background 0.15s, color 0.15s',
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

          {/* Sign in / User menu */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '0 14px', height: 36,
                  background: 'var(--surface-2)',
                  color: 'var(--text-1)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500,
                  transition: 'background 0.15s',
                }}
                onClick={onSignOut}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M1.5 12.5c0-2.5 2.5-4 5.5-4s5.5 1.5 5.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                Déconnexion
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('signin')}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '0 14px', height: 36,
                background: screen === 'signin' ? 'var(--accent)' : 'var(--accent)',
                color: '#fff',
                border: 'none', borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500,
                transition: 'background 0.15s',
                flexShrink: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="5" r="2.5" stroke="white" strokeWidth="1.3"/>
                <path d="M1.5 12.5c0-2.5 2.5-4 5.5-4s5.5 1.5 5.5 4" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              Se connecter
            </button>
          )}
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
