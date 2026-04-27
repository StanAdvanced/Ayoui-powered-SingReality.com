import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Palette, Shirt, Scan, 
  Maximize2, RotateCcw, Save, X,
  Sparkles, Camera, Layers
} from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera } from '@react-three/drei';
import { GlobalAvatar } from './GlobalAvatar';

interface AvatarStudioProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AvatarStudio({ isOpen, onClose }: AvatarStudioProps) {
  const [activeTab, setActiveTab] = useState<'scan' | 'face' | 'style' | 'outfit'>('scan');
  const [loading, setLoading] = useState(false);

  const TABS = [
    { id: 'scan', icon: Scan, label: 'Neural Scan' },
    { id: 'face', icon: User, label: 'Facial Mesh' },
    { id: 'style', icon: Palette, label: 'Skin & Tone' },
    { id: 'outfit', icon: Shirt, label: 'Apparel' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            className="relative w-full max-w-7xl aspect-[16/9] bg-[#050505] rounded-[3rem] border border-white/10 overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(0,0,0,1)]"
          >
            {/* 3D Preview Area */}
            <div className="flex-1 relative bg-[radial-gradient(circle_at_50%_50%,#111_0%,#000_100%)] overflow-hidden">
               <div className="absolute inset-0 pointer-events-none opacity-20">
                  <div className="w-full h-full bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
               </div>

               <Canvas shadows>
                 <PerspectiveCamera makeDefault position={[0, 1.5, 4]} fov={40} />
                 <Stage environment="city" intensity={0.5}>
                   <GlobalAvatar />
                 </Stage>
                 <OrbitControls 
                    enablePan={false} 
                    minPolarAngle={Math.PI / 4} 
                    maxPolarAngle={Math.PI / 1.5}
                    autoRotate={true}
                    autoRotateSpeed={0.5}
                 />
               </Canvas>

               {/* Viewport Overlay Controls */}
               <div className="absolute top-8 left-8 flex flex-col gap-4">
                  <div className="glass px-4 py-2 rounded-full border border-singularity/50 text-singularity text-[10px] font-black tracking-widest uppercase flex items-center gap-2">
                    <Sparkles className="w-3 h-3 animate-pulse" />
                    Neural Simulation Active
                  </div>
                  <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-[0.8]">
                    Holographic<br />Studio V1.0
                  </h2>
               </div>

               <div className="absolute bottom-8 left-8 flex gap-2">
                  <button className="p-4 glass rounded-2xl border border-white/10 hover:bg-white/5 transition-all">
                    <Camera className="w-5 h-5 text-gray-400" />
                  </button>
                  <button className="p-4 glass rounded-2xl border border-white/10 hover:bg-white/5 transition-all">
                    <RotateCcw className="w-5 h-5 text-gray-400" />
                  </button>
               </div>
            </div>

            {/* Customization Side Panel */}
            <div className="w-full md:w-[450px] bg-black border-l border-white/10 flex flex-col">
               {/* Header */}
               <div className="p-8 border-b border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Persona Matrix</span>
                  <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
               </div>

               {/* Tabs */}
               <div className="flex px-4 py-2 gap-2 border-b border-white/5">
                  {TABS.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl transition-all ${activeTab === tab.id ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span className="text-[9px] font-bold uppercase tracking-wider">{tab.label}</span>
                    </button>
                  ))}
               </div>

               {/* Scrollable Controls */}
               <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                  {activeTab === 'scan' && (
                    <div className="space-y-6">
                       <div className="p-6 rounded-3xl bg-singularity/5 border border-singularity/20 flex flex-col gap-4">
                          <h4 className="text-xs font-bold text-singularity uppercase tracking-widest flex items-center gap-2">
                            <Scan className="w-4 h-4" /> Start Biometric Scan
                          </h4>
                          <p className="text-[10px] text-gray-400 font-mono leading-relaxed">
                            Upload a photo or enable camera for 1:1 facial mesh reconstruction using SUMF Neural Topology.
                          </p>
                          <button className="w-full py-4 bg-singularity text-black font-bold text-xs uppercase tracking-widest rounded-2xl hover:opacity-90 transition-all">
                             INITIALIZE SENSOR
                          </button>
                       </div>
                    </div>
                  )}

                  {activeTab === 'face' && (
                    <div className="space-y-8">
                       <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">Cranium & Facial Mesh</h4>
                       {[
                         { label: 'Jaw Definition', value: 72 },
                         { label: 'Ocular Focus', value: 45 },
                         { label: 'Mouth Topology', value: 60 },
                         { label: 'Nasal Bridge', value: 30 },
                       ].map(slider => (
                         <div key={slider.label} className="space-y-3">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                               <span>{slider.label}</span>
                               <span className="text-white">{slider.value}%</span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full relative">
                               <div className="absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-white rounded-full border-2 border-black" style={{ left: `${slider.value}%` }} />
                               <div className="h-full bg-white/20 rounded-full" style={{ width: `${slider.value}%` }} />
                            </div>
                         </div>
                       ))}
                    </div>
                  )}

                  {activeTab === 'style' && (
                    <div className="space-y-8">
                       <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">Chromodynamics</h4>
                       <div className="grid grid-cols-4 gap-4">
                          {['#00f0ff', '#ff0055', '#7000ff', '#ffcc00', '#00ff44', '#ffffff', '#111111', '#555555'].map(color => (
                            <button 
                              key={color}
                              className="aspect-square rounded-full border-2 border-white/10 hover:border-white transition-all flex items-center justify-center p-1"
                            >
                               <div className="w-full h-full rounded-full" style={{ backgroundColor: color }} />
                            </button>
                          ))}
                       </div>
                       
                       <div className="space-y-4 pt-4 border-t border-white/5">
                          <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">Material Texture</h4>
                          <div className="space-y-4">
                             {['Volumetric Glow', 'Carbon Fiber', 'Liquid Mercury', 'Polished Obsidian'].map(tex => (
                               <label key={tex} className="flex items-center justify-between p-4 glass rounded-2xl border border-white/5 cursor-pointer hover:bg-white/5 transition-all">
                                  <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{tex}</span>
                                  <div className="w-4 h-4 rounded-full border-2 border-singularity flex items-center justify-center">
                                     {tex === 'Volumetric Glow' && <div className="w-2 h-2 rounded-full bg-singularity" />}
                                  </div>
                               </label>
                             ))}
                          </div>
                       </div>
                    </div>
                  )}

                  {activeTab === 'outfit' && (
                    <div className="grid grid-cols-2 gap-4">
                       {[1,2,3,4,5,6].map(i => (
                         <div key={i} className="aspect-square glass rounded-3xl border border-white/5 hover:border-singularity/50 transition-all cursor-pointer flex items-center justify-center group overflow-hidden">
                            <span className="text-[10px] font-mono text-gray-500 group-hover:text-singularity transition-colors tracking-widest uppercase">UPGRADE {i}</span>
                         </div>
                       ))}
                    </div>
                  )}

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">Global Parameters</h4>
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-gray-400">Volumetric Density</span>
                            <span className="text-singularity">88%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full w-[88%] bg-singularity shadow-[0_0_10px_#00F0FF]" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-gray-400">Emission Strength</span>
                            <span className="text-quantum">42%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full w-[42%] bg-quantum shadow-[0_0_10px_#FF0055]" />
                          </div>
                       </div>
                    </div>
                  </div>
               </div>

               {/* Footer */}
               <div className="p-8 border-t border-white/5 flex gap-4">
                  <button className="flex-1 py-4 glass rounded-2xl font-bold text-xs uppercase tracking-widest border border-white/10 hover:bg-white/5 transition-all text-white flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" /> SAVE PERSONA
                  </button>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
