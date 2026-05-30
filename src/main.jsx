import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './App.css'
import App from './App.jsx'

// ── Error Handler global ──
window.onerror = (message, source, lineno, colno, error) => {
  console.error('🔴 Global Error:', {
    message,
    source: source?.replace(window.location.origin, ''), // Chemin relatif
    line: lineno,
    col: colno,
    error: error?.stack
  });
};

window.onunhandledrejection = (event) => {
  console.error('🔴 Unhandled Promise:', {
    reason: event.reason,
    stack: event.reason?.stack
  });
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
