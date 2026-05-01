import React, { useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity, Server, Zap, Cpu, Database, Network } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import { SafeCanvas } from '../components/SafeCanvas';

function HPCCluster3D() {
  const nodesCount = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(nodesCount * 3);
    for (let i = 0; i < nodesCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, [nodesCount]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#00ffcc" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#ff00ff" />
      <OrbitControls enableZoom={false} makeDefault autoRotate autoRotateSpeed={1} />
      
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.15} 
          color="#00ffcc" 
          transparent 
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Core Node */}
      <Sphere args={[1, 32, 32]}>
        <meshStandardMaterial 
          color="#ff00ff" 
          emissive="#ff00ff"
          emissiveIntensity={2}
          wireframe
        />
      </Sphere>
    </>
  );
}

export function HPCDashboard() {
  const { user } = useStore();
  const [jobActive, setJobActive] = useState(false);
  const [progress, setProgress] = useState(0);

  const startHPCJob = () => {
    setJobActive(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setJobActive(false);
          return 100;
        }
        return p + Math.random() * 5;
      });
    }, 200);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-quantum/20 flex items-center justify-center">
                <Server className="w-6 h-6 text-quantum" />
              </div>
              <div>
                <h1 className="text-4xl font-black uppercase tracking-tighter">HPC Cluster</h1>
                <p className="text-quantum font-mono text-sm mt-1">High-Performance Computing Matrix</p>
              </div>
            </div>
            <p className="text-gray-400 max-w-2xl">
              Utilize ground-breaking High-Performance Computing (HPC) for the SingReality platform. 
              Process massive 3D biometric datasets, complex quantum simulations, and train advanced AGI models 
              at exascale speeds.
            </p>
          </div>
          
          <div className="glass p-4 rounded-xl border border-white/10 flex items-center gap-6">
            <div>
              <div className="text-xs text-gray-400 font-mono">Allocated Compute</div>
              <div className="text-xl font-bold text-singularity flex items-center gap-2">
                12.5 PFLOPS <Activity className="w-4 h-4 animate-pulse" />
              </div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <div className="text-xs text-gray-400 font-mono">Active Nodes</div>
              <div className="text-xl font-bold">4,096</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Visualization */}
          <div className="lg:col-span-2 relative h-[500px] rounded-3xl overflow-hidden glass border border-white/10">
            <div className="absolute inset-0 z-0">
               <SafeCanvas camera={{ position: [0, 5, 25], fov: 60 }}>
                 <HPCCluster3D />
               </SafeCanvas>
            </div>
            
            <div className="absolute top-6 left-6 z-10 glass p-4 rounded-2xl border border-white/10 backdrop-blur-md">
               <h3 className="text-sm font-bold uppercase tracking-widest text-quantum mb-2 flex items-center gap-2">
                 <Network className="w-4 h-4" /> Network Topology
               </h3>
               <div className="space-y-2 text-xs font-mono text-gray-300">
                  <div className="flex justify-between gap-8"><span>Node Connectivity</span> <span className="text-white">99.99%</span></div>
                  <div className="flex justify-between gap-8"><span>Infiniband Bandwidth</span> <span className="text-white">400 Gbps</span></div>
                  <div className="flex justify-between gap-8"><span>Current Latency</span> <span className="text-white">1.2 μs</span></div>
               </div>
            </div>
          </div>

          {/* HPC Operations */}
          <div className="space-y-6">
            <div className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-quantum/10 blur-3xl -mr-16 -mt-16 pointer-events-none" />
              
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <Zap className="w-6 h-6 text-quantum" />
                Submit Job
              </h3>
              
              <div className="space-y-4">
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-quantum text-sm font-mono text-gray-300">
                  <option value="quantum">Quantum Material Simulation</option>
                  <option value="agi">Global AGI Neural Training</option>
                  <option value="climate">Planetary Climate Modeling</option>
                  <option value="music">Symphonic Vector Space Mapping</option>
                </select>
                
                <button
                  onClick={startHPCJob}
                  disabled={jobActive}
                  className="w-full py-4 bg-quantum text-black rounded-xl font-bold uppercase tracking-widest hover:scale-[1.02] transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {jobActive ? (
                    <>
                      <Activity className="w-5 h-5 animate-pulse" />
                      Processing...
                    </>
                  ) : (
                    'Allocate & Run'
                  )}
                </button>
                
                {jobActive && (
                  <div className="pt-4 space-y-2">
                     <div className="flex justify-between text-xs font-mono text-gray-400">
                       <span>Progress</span>
                       <span>{Math.min(100, Math.floor(progress))}%</span>
                     </div>
                     <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                         className="h-full bg-quantum"
                         initial={{ width: 0 }}
                         animate={{ width: `${progress}%` }}
                         transition={{ ease: "linear" }}
                       />
                     </div>
                  </div>
                )}
                {progress >= 100 && !jobActive && (
                  <div className="text-green-400 text-xs font-mono text-center pt-2">
                    Computation Complete. Results stored in SingReality Vector DB.
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center">
                 <Cpu className="w-8 h-8 text-singularity mb-3" />
                 <h4 className="text-[10px] font-mono text-gray-400 uppercase">GPU Cores</h4>
                 <div className="text-xl font-bold mt-1">262,144</div>
               </div>
               <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center">
                 <Database className="w-8 h-8 text-quantum mb-3" />
                 <h4 className="text-[10px] font-mono text-gray-400 uppercase">Total Memory</h4>
                 <div className="text-xl font-bold mt-1">2.5 PB</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
