import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from './common/Icon';
import './Nav.css';

function Nav({ theme, onToggleTheme, user, onSignOut }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

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

  // Déterminer la page actuelle depuis l'URL
  const isHome = location.pathname === '/';
  const isCommune = location.pathname.startsWith('/commune/');
  const isContact = location.pathname === '/contact';

  const breadcrumb = () => {
    // Pas de breadcrumb sur home, contact, signin
    if (isHome || isContact || location.pathname === '/signin') return null;

    // Si on est sur une page commune, on pourrait afficher un breadcrumb
    // Pour l'instant on le laisse simple
    if (isCommune) {
      return (
        <div className="nav__breadcrumb">
          <button onClick={() => navigate('/')} className="nav__breadcrumb-link">
            Accueil
          </button>
          {/* Optionnel : ajouter le nom de la commune ici si nécessaire */}
        </div>
      );
    }

    return null;
  };

  const menuItems = [
    {
      label: 'Nous contacter',
      icon: <Icon name="mail" size={14} />,
      action: () => {
        navigate('/contact');
        setMenuOpen(false);
      }
    },
    {
      label: 'Sources des données',
      icon: <Icon name="document" size={14} />,
      action: () => {
        window.open('https://app.dvf.etalab.gouv.fr/', '_blank');
        setMenuOpen(false);
      }
    },
  ];

  return (
    <header className="nav">
      <div className="nav__container">
        {/* Logo */}
        <button onClick={() => navigate('/')} className="nav__logo">
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
            <button onClick={() => navigate('/profile')} className="nav__user-button">
              <Icon name="user" size={14} />
              {user.email}
            </button>
          ) : (
            <button onClick={() => navigate('/signin')} className="nav__signin-button">
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
