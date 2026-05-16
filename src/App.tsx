import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { XR, createXRStore } from '@react-three/xr';
import { OrbitControls, Environment } from '@react-three/drei';
import { Play } from 'lucide-react';
import { ARStage } from './components/ARStage';

const store = createXRStore({
  emulate: false,
});

export default function App() {
  const [arMode, setArMode] = useState(false);

  const startAR = async () => {
    try {
      await store.enterAR();
      setArMode(true);
    } catch (e) {
      console.error('Failed to enter AR:', e);
      alert('AR not supported or failed to start.');
    }
  };

  return (
    <div className="w-full h-screen bg-black text-white overflow-hidden relative">
      {/* Background visual before AR */}
      {!arMode && (
        <div className="absolute inset-0 z-0 opacity-40">
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <mesh rotation={[0.5, 0.5, 0]}>
              <torusKnotGeometry args={[1, 0.3, 128, 16]} />
              <meshStandardMaterial color="#8b5cf6" wireframe />
            </mesh>
            <OrbitControls autoRotate />
            <Environment preset="city" />
          </Canvas>
        </div>
      )}

      {/* Hero UI */}
      {!arMode ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none p-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            SingReality OS
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl text-center mb-12">
            The ultimate convergent AI platform.
            Experience God-tier life-like avatars seamlessly integrated into your reality.
          </p>
          
          <div className="pointer-events-auto">
            <button 
              className="bg-white text-black font-semibold py-4 px-8 rounded-full flex items-center gap-3 hover:scale-105 transition-transform"
              onClick={startAR}
            >
              <Play size={20} fill="currentColor" />
              Enter Live AR Stage
            </button>
          </div>
          
          <p className="mt-8 text-sm text-gray-500 text-center max-w-md">
            Requires an AR-capable device (e.g., modern smartphone) or headset.
            On desktop, this will open an immersive 3D view.
          </p>
        </div>
      ) : (
        <div className="w-full h-full">
          <Canvas>
            <XR store={store}>
              <ARStage />
            </XR>
          </Canvas>
        </div>
      )}
    </div>
  );
}
