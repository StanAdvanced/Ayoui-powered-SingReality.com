import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { SafeCanvas } from './SafeCanvas';
import { Activity, Settings2 } from 'lucide-react';

export function PointCloudVisualizer() {
  const [pointCount, setPointCount] = useState(50000);
  const [pointSize, setPointSize] = useState(0.015);
  const [renderMode, setRenderMode] = useState('balanced');
  const [dlssMode, setDlssMode] = useState('1');
  const pointsRef = useRef<THREE.Points>(null);

  // Generate synthetic depth/point cloud data simulating a 3D scan
  const { positions, colors } = useMemo(() => {
    let modeMultiplier = 1;
    if (renderMode === 'performance') modeMultiplier = 0.5;
    if (renderMode === 'quality') modeMultiplier = 2.0;

    const currentCount = Math.floor(pointCount * modeMultiplier);
    const pos = new Float32Array(currentCount * 3);
    const col = new Float32Array(currentCount * 3);
    
    for (let i = 0; i < currentCount; i++) {
        const t = Math.random() * Math.PI * 2;
        const u = Math.random() * Math.PI;
        
        const radius = Math.random() * 2 + 1;
        const x = Math.sin(u) * Math.cos(t) * radius;
        const y = Math.sin(u) * Math.sin(t) * radius;
        const z = Math.cos(u) * radius;
        
        const noise = Math.random() * 0.5;
        
        pos[i * 3] = x + (Math.random() - 0.5) * noise;
        pos[i * 3 + 1] = y + (Math.random() - 0.5) * noise;
        pos[i * 3 + 2] = z + (Math.random() - 0.5) * noise;
        
        const normalizedDepth = (z + 3) / 6;
        const color = new THREE.Color().setHSL(0.5 + normalizedDepth * 0.3, 1, 0.5);
        
        col[i * 3] = color.r;
        col[i * 3 + 1] = color.g;
        col[i * 3 + 2] = color.b;
    }
    
    return { positions: pos, colors: col };
  }, [pointCount, renderMode]);

  useFrame((state) => {
      if (pointsRef.current) {
          pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      }
  });

  return (
    <div className="relative w-full h-[600px] bg-black rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
      <SafeCanvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <OrbitControls makeDefault />
        <ambientLight intensity={0.5} />
        
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={colors.length / 3}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={renderMode === 'performance' ? pointSize * 1.5 : pointSize}
                vertexColors
                transparent
                opacity={renderMode === 'quality' ? 0.9 : 0.7}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
      </SafeCanvas>

      <div className="absolute top-6 left-6 max-w-[320px]">
         <div className="glass p-6 rounded-2xl border border-white/10">
            <h3 className="font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2 text-quantum">
               <Activity className="w-5 h-5" />
               Isaac Lab RenderCfg
            </h3>
            
            <div className="space-y-5">
                <div>
                   <label className="text-[10px] text-gray-500 font-mono uppercase block mb-2">Rendering Mode</label>
                   <div className="grid grid-cols-3 gap-2">
                       {['performance', 'balanced', 'quality'].map(mode => (
                           <button
                             key={mode}
                             onClick={() => setRenderMode(mode)}
                             className={`py-2 px-1 text-[10px] uppercase font-bold tracking-widest rounded-lg border transition-all ${
                                 renderMode === mode 
                                 ? 'bg-quantum/20 border-quantum text-white' 
                                 : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                             }`}
                           >
                              {mode}
                           </button>
                       ))}
                   </div>
                </div>

                <div>
                   <label className="text-[10px] text-gray-500 font-mono uppercase block mb-2">DLSS Mode</label>
                   <div className="grid grid-cols-4 gap-2">
                       {['0', '1', '2', '3'].map(mode => (
                           <button
                             key={mode}
                             onClick={() => setDlssMode(mode)}
                             className={`py-2 px-1 text-[10px] font-bold rounded-lg border transition-all ${
                                 dlssMode === mode 
                                 ? 'bg-singularity/20 border-singularity text-white' 
                                 : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                             }`}
                           >
                              {mode}
                           </button>
                       ))}
                   </div>
                   <div className="text-[8px] text-gray-500 mt-1 uppercase">
                       {dlssMode === '0' && 'Perf'}
                       {dlssMode === '1' && 'Balanced'}
                       {dlssMode === '2' && 'Quality'}
                       {dlssMode === '3' && 'Auto'}
                   </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] uppercase font-mono text-gray-400">
                        <span>Base Resolution Target</span>
                        <span className="text-quantum">{pointCount.toLocaleString()}</span>
                    </div>
                    <input 
                        type="range" min="10000" max="250000" step="10000"
                        value={pointCount}
                        onChange={(e) => setPointCount(parseInt(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-full accent-quantum"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] uppercase font-mono text-gray-400">
                        <span>Point Density (Size)</span>
                        <span className="text-quantum">{pointSize.toFixed(3)}</span>
                    </div>
                    <input 
                        type="range" min="0.005" max="0.1" step="0.005"
                        value={pointSize}
                        onChange={(e) => setPointSize(parseFloat(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-full accent-quantum"
                    />
                </div>

                <div className="mt-4 p-3 bg-black/40 rounded-xl border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                         <span className="text-[9px] uppercase font-mono text-gray-500">Translucency</span>
                         <span className="text-[9px] uppercase font-bold text-green-400">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between">
                         <span className="text-[9px] uppercase font-mono text-gray-500">Global Illumination</span>
                         <span className="text-[9px] uppercase font-bold text-green-400">Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                         <span className="text-[9px] uppercase font-mono text-gray-500">Approx Node Count</span>
                         <span className="text-[9px] uppercase font-bold text-white">{(positions.length / 3).toLocaleString()}</span>
                    </div>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}
