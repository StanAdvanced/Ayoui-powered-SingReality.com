import React, { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';
import { useStore } from './store/useStore';

console.log('SingReality: Mounting Quantum Architecture...');

function Root() {
  const setUser = useStore(state => state.setUser);
  const setAuthReady = useStore(state => state.setAuthReady);

  useEffect(() => {
    console.log('SingReality: Subscribing to Local Auth...');
    
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetch('/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.id) {
            setUser({ uid: data.id, email: data.email, displayName: data.name, photoURL: null, token });
          } else {
            localStorage.removeItem('auth_token');
            setUser(null);
          }
        })
        .catch(err => {
          console.error(err);
          localStorage.removeItem('auth_token');
          setUser(null);
        })
        .finally(() => {
          setAuthReady(true);
        });
    } else {
      setAuthReady(true);
      setUser(null);
    }
  }, [setUser, setAuthReady]);

  return (
    <StrictMode>
      <ErrorBoundary>
        <HashRouter>
          <App />
        </HashRouter>
      </ErrorBoundary>
    </StrictMode>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<Root />);
  console.log('SingReality: Root rendered.');
} else {
  console.error('SingReality Error: Root element not found! Matrix collapse imminent.');
}
