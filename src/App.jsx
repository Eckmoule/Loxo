import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Nav from './components/Nav';
import Home from './components/Home';
import Contact from './components/pages/Contact';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import './App.css';

function App() {
  const [screen, setScreen] = useState('home');
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {

    // Détecter si on arrive sur un lien de reset password
    if (window.location.hash.includes('type=recovery')) {
      setScreen('reset-password');
    }

    // Récupérer la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Écouter les changements de session (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);


  const handleToggleTheme = () => {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  };

  const handleNavigate = (to, data = {}) => {
    setScreen(to);
    window.scrollTo({ top: 0 });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setScreen('home');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text-1)' }}>
      <Nav
        theme={theme}
        onToggleTheme={handleToggleTheme}
        screen={screen}
        city={null}
        onNavigate={handleNavigate}
        user={user}
        onSignOut={handleSignOut}
      />
      {screen === 'home' && <Home onNavigate={handleNavigate} />}
      {screen === 'contact' && <Contact onNavigate={handleNavigate} user={user} />}
      {screen === 'signin' && <SignIn onNavigate={handleNavigate} />}
      {screen === 'signup' && <SignUp onNavigate={handleNavigate} />}
      {screen === 'forgot-password' && <ForgotPassword onNavigate={handleNavigate} />}
      {screen === 'reset-password' && <ResetPassword onNavigate={handleNavigate} />}
    </div>
  );
}

export default App;