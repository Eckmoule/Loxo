import { useState, useEffect } from 'react';
import Nav from './components/Nav';
import Home from './components/Home';
import './App.css';

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  };

  const handleNavigate = (screen, data) => {
    // Pour l'instant on ne fait rien, juste la home
    console.log('Navigate to:', screen, data);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text-1)' }}>
      <Nav
        theme={theme}
        onToggleTheme={handleToggleTheme}
        screen="home"
        city={null}
        onNavigate={handleNavigate}
      />
      <Home onNavigate={handleNavigate} />
    </div>
  );
}

export default App;