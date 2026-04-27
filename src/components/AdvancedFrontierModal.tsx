import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe, Radio, Cpu, Network, Database, Sparkles, Layers, Search, Code, Lock, Shield,
  Zap, Navigation, Video, Mic, Smartphone, Map
} from 'lucide-react';

const MEGA_APIS = [
  { name: 'Grok AGI Engine', icon: Cpu, color: 'text-blue-400' },
  { name: 'NVIDIA Omniverse', icon: Layers, color: 'text-green-500' },
  { name: 'Google Full Stack', icon: Search, color: 'text-red-500' },
  { name: 'YouTube Content API', icon: Video, color: 'text-red-600' },
  { name: 'NASA Exoplanet Archive', icon: Navigation, color: 'text-indigo-400' },
  { name: 'EASA Skyway API', icon: Globe, color: 'text-blue-300' },
  { name: 'SpaceX Starlink Telemetry', icon: Radio, color: 'text-white' },
  { name: 'Google Maps 3D/Drone', icon: Map, color: 'text-green-400' },
  { name: 'Apple CoreML & ARKit', icon: Smartphone, color: 'text-gray-300' },
  { name: 'Microsoft Azure Quantum', icon: CloudServerIcon, color: 'text-blue-500' },
  { name: 'SAP S/4HANA ERP', icon: Database, color: 'text-yellow-500' },
  { name: 'Meta / Facebook Graph', icon: Network, color: 'text-blue-600' },
  { name: 'Music AI Gen (Suno/Udio)', icon: Mic, color: 'text-pink-500' },
  { name: 'Secret SUMF Core', icon: Shield, color: 'text-singularity' },
];

function CloudServerIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <rect width="18" height="6" x="3" y="14" rx="2" />
      <path d="M7 17h.01" />
      <path d="M11 17h.01" />
    </svg>
  );
}

export function AdvancedFrontierModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [activeApiIndex, setActiveApiIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setActiveApiIndex((prev) => (prev + 1) % MEGA_APIS.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            className="relative glass-card border border-white/20 rounded-[3rem] p-8 md:p-12 max-w-5xl w-full mx-auto overflow-hidden shadow-2xl"
          >
            {/* Background Holographic Grid */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
              <div className="w-full h-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="flex flex-col gap-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-singularity/50 text-singularity w-fit">
                  <Shield className="w-4 h-4" />
                  <span className="text-[10px] font-bold tracking-widest uppercase">Secret SUMF Paradigm Level 9</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none glow-text">
                  Elite Architecture<br />Mega Node Nexus
                </h2>
                
                <p className="text-gray-400 font-mono text-sm leading-relaxed">
                  Initializing volumetric compute mass via Elon-Musk-inspired generative adaptive split payments marketplace model. 
                  Converging interstellar telemetry, 9D spatial audio, and super-generative intuitiveness across all major tech frontiers.
                </p>

                <div className="glass p-6 rounded-2xl border border-white/10 space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-singularity via-quantum to-transparent" />
                  <h4 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
                    <Code className="w-4 h-4 text-quantum" /> Algorithm Stream: ∑(n)
                  </h4>
                  <div className="h-32 overflow-y-auto hide-scrollbar font-mono text-[10px] text-singularity opacity-80 leading-relaxed">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div key={i} className="whitespace-nowrap">
                        0x{Math.random().toString(16).substr(2, 8).toUpperCase()} : VALIDATING NEURAL PATHWAY [{(Math.random() * 100).toFixed(2)}%] ... [OK]
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={onClose} className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-singularity hover:text-white transition-all transform hover:scale-105">
                  Engage Universal Link
                </button>
              </div>

              <div className="relative flex flex-col justify-center border-l border-white/10 pl-12 h-full">
                <h3 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
                  <Network className="w-4 h-4" />
                  Converging APIs
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {MEGA_APIS.map((api, index) => {
                    const isActive = index === activeApiIndex;
                    return (
                      <motion.div 
                        key={api.name}
                        animate={{
                          scale: isActive ? 1.05 : 1,
                          opacity: isActive ? 1 : 0.4,
                          boxShadow: isActive ? '0 0 20px rgba(0, 255, 255, 0.2)' : '0 0 0px rgba(0,0,0,0)'
                        }}
                        className={`flex items-center gap-3 p-3 rounded-xl border ${isActive ? 'border-singularity bg-singularity/10' : 'border-white/5 bg-white/5'} transition-all duration-500`}
                      >
                        <api.icon className={`w-5 h-5 ${api.color} ${isActive ? 'animate-pulse' : ''}`} />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white truncate">{api.name}</span>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
