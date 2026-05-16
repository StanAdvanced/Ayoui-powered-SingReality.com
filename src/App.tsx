import React, { Suspense, lazy, useState } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { Loader2 } from 'lucide-react';
import { OnboardingTour } from './components/OnboardingTour';
import { AudioPlayer } from './components/AudioPlayer';
import { IntroVideo } from './components/IntroVideo';

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
const Auth = lazy(() => import('./pages/Auth').then(m => ({ default: m.Auth })));
const LiveArena = lazy(() => import('./pages/LiveArena').then(m => ({ default: m.LiveArena })));
const GlobalMap = lazy(() => import('./pages/GlobalMap').then(m => ({ default: m.GlobalMap })));
const NeuralClones = lazy(() => import('./pages/NeuralClones').then(m => ({ default: m.NeuralClones })));
const SingRealityTV = lazy(() => import('./pages/SingRealityTV').then(m => ({ default: m.SingRealityTV })));
const KaraokeArena = lazy(() => import('./pages/KaraokeArena').then(m => ({ default: m.KaraokeArena })));
const Showcase = lazy(() => import('./pages/Showcase'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage').then(m => ({ default: m.ProjectDetailPage })));
const DeepSeekMusicSuite = lazy(() => import('./components/DeepSeekMusicSuite').then(m => ({ default: m.DeepSeekMusicSuite })));
const LiveARStage = lazy(() => import('./components/LiveARStage').then(m => ({ default: m.LiveARStage })));
const MusicGraphExplorer = lazy(() => import('./components/MusicGraphExplorer').then(m => ({ default: m.MusicGraphExplorer })));
const SingularitySettlement = lazy(() => import('./components/SingularitySettlement').then(m => ({ default: m.SingularitySettlement })));
const MetamorphosisStage = lazy(() => import('./components/MetamorphosisStage').then(m => ({ default: m.MetamorphosisStage })));
const ShortsRemixFactory = lazy(() => import('./components/ShortsRemixFactory').then(m => ({ default: m.ShortsRemixFactory })));
const NFTCollectibles = lazy(() => import('./pages/NFTCollectibles').then(m => ({ default: m.NFTCollectibles })));

const Wellness = lazy(() => import('./pages/Wellness').then(m => ({ default: m.Wellness })));

import { useStore } from './store/useStore';

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
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem('singreality_intro_seen') && false; // Disabled for faster load times
  });

  const handleReplayIntro = () => {
    sessionStorage.removeItem('singreality_intro_seen');
    setShowIntro(true);
  };

  return (
    <ErrorBoundary>
      {showIntro && <IntroVideo onComplete={() => setShowIntro(false)} />}
      <OnboardingTour />
      <AudioPlayer />
      <Layout onReplayIntro={handleReplayIntro}>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<KaraokeRoom />} />
            <Route path="/home" element={<Home />} />
            <Route path="/studio" element={<ProtectedRoute><Studio /></ProtectedRoute>} />
            <Route path="/clones" element={<ProtectedRoute><NeuralClones /></ProtectedRoute>} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/marketplace/:id" element={<MarketplaceItemDetail />} />
            <Route path="/quantum-lab" element={<QuantumLab />} />
            <Route path="/dev-portal" element={<ProtectedRoute><DeveloperPortal /></ProtectedRoute>} />
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
            <Route path="/showcase/:id" element={<ProjectDetailPage />} />
            <Route path="/deepseek-suite" element={<ProtectedRoute><DeepSeekMusicSuite /></ProtectedRoute>} />
            <Route path="/live-ar-stage" element={<ProtectedRoute><LiveARStage /></ProtectedRoute>} />
            <Route path="/music-graph" element={<ProtectedRoute><MusicGraphExplorer /></ProtectedRoute>} />
            <Route path="/wellness" element={<ProtectedRoute><Wellness /></ProtectedRoute>} />
            <Route path="/singularity-settlement" element={<ProtectedRoute><SingularitySettlement /></ProtectedRoute>} />
            <Route path="/metamorphosis" element={<ProtectedRoute><MetamorphosisStage /></ProtectedRoute>} />
            <Route path="/shorts-remix" element={<ProtectedRoute><ShortsRemixFactory /></ProtectedRoute>} />
            <Route path="/nft-collectibles" element={<ProtectedRoute><NFTCollectibles /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
}
