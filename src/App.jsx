import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Nav from './components/Nav';
import Home from './components/Home';
import Commune from './components/pages/Commune';
import CommuneTransactions from './components/pages/CommuneTransactions';
import Contact from './components/pages/Contact';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import NotFound from './components/pages/NotFound';
import './App.css';

function App() {
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState(null);

  // Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Auth
  useEffect(() => {
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text-1)' }}>
        <Nav
          theme={theme}
          onToggleTheme={handleToggleTheme}
          user={user}
          onSignOut={handleSignOut}
        />

        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Communes */}
          <Route path="/commune/:codeCommune" element={<Commune />} />
          <Route path="/commune/:codeCommune/transactions" element={<CommuneTransactions />} />

          {/* Pages statiques */}
          <Route path="/contact" element={<Contact user={user} />} />

          {/* Auth */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* 404 - Redirect to home */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
