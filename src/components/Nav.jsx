import { useState, useRef, useEffect } from 'react';
import Icon from './common/Icon';
import './Nav.css';

function Nav({ theme, onToggleTheme, screen, city, onNavigate, user, onSignOut }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const breadcrumb = () => {
    if (screen === 'home' || screen === 'signin' || screen === 'contact') return null;

    return (
      <div className="nav__breadcrumb">
        <button onClick={() => onNavigate('home')} className="nav__breadcrumb-link">
          Accueil
        </button>
        {city && (
          <>
            <span className="nav__breadcrumb-separator">/</span>
            <button
              onClick={() => onNavigate('macro', { city })}
              className={`nav__breadcrumb-link ${screen === 'macro' ? 'nav__breadcrumb-link--active' : ''}`}
            >
              {city.name}
            </button>
          </>
        )}
        {screen === 'micro' && (
          <>
            <span className="nav__breadcrumb-separator">/</span>
            <span className="nav__breadcrumb-link nav__breadcrumb-link--active">Carte</span>
          </>
        )}
      </div>
    );
  };

  const menuItems = [
    {
      label: 'Nous contacter',
      icon: <Icon name="mail" size={14} />,
      action: () => { onNavigate('contact'); setMenuOpen(false); }
    },
    {
      label: 'À propos',
      icon: <Icon name="info" size={14} />,
      action: () => setMenuOpen(false)
    },
    {
      label: 'Documentation DVF',
      icon: <Icon name="document" size={14} />,
      action: () => setMenuOpen(false)
    },
  ];

  return (
    <header className="nav">
      <div className="nav__container">
        {/* Logo */}
        <button onClick={() => onNavigate('home')} className="nav__logo">
          <Icon name="logo" size={22} />
          Loxo
        </button>

        {/* Breadcrumb */}
        <div style={{ flex: 1 }}>{breadcrumb()}</div>

        {/* Actions */}
        <div className="nav__actions">
          {/* Menu hamburger */}
          <div className="nav__menu" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className={`nav__icon-button ${menuOpen ? 'nav__icon-button--active' : ''}`}
              title="Menu"
            >
              <Icon name="menu" size={15} />
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div className="nav__menu-dropdown">
                {menuItems.map((item, i) => (
                  <button key={i} onClick={item.action} className="nav__menu-item">
                    <span className="nav__menu-item-icon">{item.icon}</span>
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
            className="nav__icon-button"
          >
            <Icon name={theme === 'light' ? 'sun' : 'moon'} size={16} />
          </button>

          {/* Sign in / User */}
          {user ? (
            <button onClick={onSignOut} className="nav__user-button">
              <Icon name="user" size={14} />
              Déconnexion
            </button>
          ) : (
            <button onClick={() => onNavigate('signin')} className="nav__signin-button">
              <Icon name="user" size={14} color="white" />
              Se connecter
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Nav;