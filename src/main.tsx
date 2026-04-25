import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useStore } from './store/useStore';

console.log('SingReality: Mounting Quantum Architecture...');

function Root() {
  const setUser = useStore(state => state.setUser);
  const setAuthReady = useStore(state => state.setAuthReady);

  useEffect(() => {
    console.log('SingReality: Subscribing to Auth Singularity...');
    let mounted = true;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (mounted) {
        console.log('SingReality: Identity Locked ->', user ? user.uid : 'Anonymous Guest');
        setUser(user);
        setAuthReady(true);
      }
    });
    return () => {
      mounted = false;
      unsubscribe();
    };
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
