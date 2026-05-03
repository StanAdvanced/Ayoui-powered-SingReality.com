import { Suspense } from 'react';
import { FrontierNexus } from './components/FrontierNexus';

function App() {
  return (
    <Suspense fallback={<div className="h-screen bg-[#020205] flex items-center justify-center text-singularity uppercase tracking-widest font-mono text-xs animate-pulse">Initializing Nexus...</div>}>
      <FrontierNexus />
    </Suspense>
  );
}

export default App;
