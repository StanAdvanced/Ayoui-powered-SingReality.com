import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { Loader2 } from 'lucide-react';
import { AdvancedOnboarding } from './components/AdvancedOnboarding';
import { AudioPlayer } from './components/AudioPlayer';
import { IntroVideo } from './components/IntroVideo';
import AdminDashboard from './components/AdminDashboard';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Studio = lazy(() => import('./pages/Studio').then(m => ({ default: m.Studio })));
const Portal = lazy(() => import('./pages/Portal').then(m => ({ default: m.Portal })));
const Arenas = lazy(() => import('./pages/Arenas').then(m => ({ default: m.Arenas })));
const Marketplace = lazy(() => import('./pages/Marketplace').then(m => ({ default: m.Marketplace })));
const MarketplaceItemDetail = lazy(() => import('./pages/MarketplaceItemDetail').then(m => ({ default: m.MarketplaceItemDetail })));
const DeveloperPortal = lazy(() => import('./pages/DeveloperPortal').then(m => ({ default: m.DeveloperPortal })));
const QuantumLab = lazy(() => import('./pages/QuantumLab').then(m => ({ default: m.QuantumLab })));
const KaraokeRoom = lazy(() => import('./components/KaraokeRoom').then(m => ({ default: m.KaraokeRoom })));
const AISongStudio = lazy(() => import('./components/AISongStudio').then(m => ({ default: m.AISongStudio })));
const Funding = lazy(() => import('./pages/Funding').then(m => ({ default: m.Funding })));
const Projects = lazy(() => import('./pages/Projects').then(m => ({ default: m.Projects })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const Auth = lazy(() => import('./pages/Auth'));
const LiveArena = lazy(() => import('./pages/LiveArena').then(m => ({ default: m.LiveArena })));
const GlobalMap = lazy(() => import('./pages/GlobalMap').then(m => ({ default: m.GlobalMap })));
const NeuralClones = lazy(() => import('./pages/NeuralClones').then(m => ({ default: m.NeuralClones })));
const SingRealityTV = lazy(() => import('./pages/SingRealityTV').then(m => ({ default: m.SingRealityTV })));
const KaraokeArena = lazy(() => import('./pages/KaraokeArena').then(m => ({ default: m.KaraokeArena })));
const Showcase = lazy(() => import('./pages/Showcase'));
const StudioPro = lazy(() => import('./pages/StudioPro').then(m => ({ default: m.StudioPro })));

import { useStore } from './store/useStore';
import { useBootSequence } from './hooks/useBootSequence';
import { CinematicTransition } from './components/CinematicTransition';

const LoadingFallback = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <Loader2 className="w-12 h-12 text-singularity animate-spin" />
  </div>
);

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthReady } = useStore();
  
  if (!isAuthReady) return <LoadingFallback />;
  if (!user) return <Navigate to="/auth" replace />;
  
  return <>{children}</>;
}

export default function App() {
  const { isBooting, completeBoot } = useBootSequence();
  const [isFullyInitialized, setIsFullyInitialized] = useState(false);

  useEffect(() => {
    if (!isBooting) {
      const timer = setTimeout(() => setIsFullyInitialized(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isBooting]);

  const handleReplayIntro = () => {
    sessionStorage.removeItem('singreality_boot_complete');
    window.location.reload();
  };

  return (
    <ErrorBoundary>
      {!isFullyInitialized && (
        <IntroVideo onComplete={completeBoot} />
      )}

      {isFullyInitialized && (
        <CinematicTransition isReady={true}>
          <AdvancedOnboarding />
          <AudioPlayer />
          <Layout onReplayIntro={handleReplayIntro}>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/studio" element={<ProtectedRoute><Studio /></ProtectedRoute>} />
                <Route path="/clones" element={<ProtectedRoute><NeuralClones /></ProtectedRoute>} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/marketplace/:id" element={<MarketplaceItemDetail />} />
                <Route path="/quantum-lab" element={<QuantumLab />} />
                <Route path="/dev-portal" element={<ProtectedRoute><DeveloperPortal /></ProtectedRoute>} />
                <Route path="/studio-pro" element={<ProtectedRoute><StudioPro /></ProtectedRoute>} />
                <Route path="/karaoke/:sessionId" element={<KaraokeRoom />} />
                <Route path="/ai-studio" element={<ProtectedRoute><AISongStudio /></ProtectedRoute>} />
                <Route path="/funding" element={<ProtectedRoute><Funding /></ProtectedRoute>} />
                <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/portal" element={<Portal />} />
                <Route path="/arenas" element={<Arenas />} />
                <Route path="/live-arena" element={<LiveArena />} />
                <Route path="/karaoke-arena" element={<KaraokeArena />} />
                <Route path="/global-map" element={<GlobalMap />} />
                <Route path="/tv" element={<SingRealityTV />} />
                <Route path="/showcase" element={<Showcase />} />
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Layout>
        </CinematicTransition>
      )}
    </ErrorBoundary>
  );
}

