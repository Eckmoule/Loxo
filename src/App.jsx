import { useState, useEffect } from 'react';
import Nav from './components/Nav';
import Home from './components/Home';
import Contact from './components/Contact';
import SignIn from './components/SignIn';
import './App.css';

function App() {
  const [screen, setScreen] = useState('home');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  };

  const handleNavigate = (to, data = {}) => {
    setScreen(to);
    window.scrollTo({ top: 0 });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text-1)' }}>
    <Nav
      theme={theme}
      onToggleTheme={handleToggleTheme}
      screen={screen}
      city={null}
      onNavigate={handleNavigate}
    />
    {screen === 'home' && <Home onNavigate={handleNavigate} />}
    {screen === 'contact' && <Contact onNavigate={handleNavigate} />}
    {screen === 'signin' && <SignIn onNavigate={handleNavigate} />}
  </div>
  );
}

export default App;