import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, Maximize2, Minimize2, Settings, Zap, Music, Cpu, Lock, ChevronUp, ChevronDown } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useSound } from '../hooks/useSound';

export function NexusPlayer() {
  const { globalTrack, isPlayerOpen, setPlayerOpen, setGlobalTrack, setEnterprisePortalOpen } = useStore();
  const { playClick, playWhoosh } = useSound();
  
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showProUpgrade, setShowProUpgrade] = useState(false);
  const [activeTab, setActiveTab] = useState<'video' | 'stems' | 'api'>('video');

  // Simulated progress
  useEffect(() => {
    if (!isPlaying || !globalTrack) return;
    const interval = setInterval(() => {
      setProgress(p => (p >= 100 ? 0 : p + 0.1));
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, globalTrack]);

  if (!globalTrack || !isPlayerOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        drag
        dragConstraints={{ left: -100, right: window.innerWidth - 450, top: 0, bottom: window.innerHeight - 300 }}
        dragElastic={0.1}
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        className={`fixed z-[100] bottom-6 right-6 flex flex-col pointer-events-auto touch-none
          ${isMinimized ? 'w-[320px]' : 'w-[420px]'}
          transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]`}
        style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.5))" }}
      >
        {/* Pro / API Upgrade Banner Hook */}
        <AnimatePresence>
          {showProUpgrade && !isMinimized && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="w-full bg-gradient-to-r from-singularity to-quantum text-black rounded-t-3xl overflow-hidden -mb-4 pb-6 pt-3 px-6 shadow-lg shadow-singularity/20"
            >
               <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                       <Zap className="w-4 h-4" /> Enterprise API Enabled
                    </h4>
                    <p className="text-[10px] font-mono mt-1 opacity-80 leading-relaxed">
                      Scale this player infrastructure seamlessly. Access Neural Stem Extraction, global WebRTC syncing, and Monetization SDKs for your business.
                    </p>
                  </div>
                  <button onClick={() => setShowProUpgrade(false)} className="p-1 hover:bg-black/10 rounded-full">
                    <X className="w-3 h-3" />
                  </button>
               </div>
               <button 
                 onClick={() => { setShowProUpgrade(false); setEnterprisePortalOpen(true); }}
                 className="mt-3 w-full py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2"
               >
                 Generate Publisher License
               </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Floating Glass Container */}
        <div className="glass-card backdrop-blur-2xl rounded-[2rem] border border-white/20 shadow-[-10px_-10px_30px_rgba(255,255,255,0.05),_10px_10px_30px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* Top Drag Bar & Controls */}
          <div className="flex items-center justify-between px-5 py-3 cursor-grab active:cursor-grabbing border-b border-white/5 bg-black/40">
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
               <span className="text-[10px] font-bold tracking-widest uppercase text-white/50">Nexus Player</span>
             </div>
             <div className="flex items-center gap-2">
               <button onClick={() => setShowProUpgrade(!showProUpgrade)} className="p-1.5 text-singularity hover:bg-white/10 rounded-lg transition-colors">
                 <Zap className="w-4 h-4" />
               </button>
               <button onClick={() => { playWhoosh(); setIsMinimized(!isMinimized); }} className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors">
                 {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
               </button>
               <button onClick={() => { playClick(); setPlayerOpen(false); setGlobalTrack(null); }} className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg transition-colors">
                 <X className="w-4 h-4" />
               </button>
             </div>
          </div>

          <AnimatePresence mode="popLayout">
            {!isMinimized && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
              >
                {/* Visualizer / Video Frame */}
                <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden border-b border-white/10 group">
                   {activeTab === 'video' && globalTrack.youtubeId ? (
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${globalTrack.youtubeId}?autoplay=1&controls=0&modestbranding=1&rel=0&mute=${!isPlaying ? '1' : '0'}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                   ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 transition-colors">
                         {activeTab === 'stems' ? (
                            <div className="w-full space-y-4">
                               {['Vocals', 'Drums', 'Bass'].map((stem, i) => (
                                 <div key={stem} className="flex justify-between items-center text-xs font-mono">
                                    <span className="text-gray-400">{stem}</span>
                                    <div className="flex-1 mx-4 h-1 bg-white/10 rounded-full overflow-hidden">
                                       <motion.div 
                                         animate={{ width: `${Math.random() * 60 + 20}%` }}
                                         transition={{ repeat: Infinity, duration: 0.5 + i * 0.2, repeatType: 'reverse' }}
                                         className={`h-full ${i === 0 ? 'bg-singularity' : i===1 ? 'bg-quantum' : 'bg-pink-500'}`} 
                                       />
                                    </div>
                                    <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-singularity uppercase text-[8px] font-bold">Mute</button>
                                 </div>
                               ))}
                            </div>
                         ) : (
                            <div className="flex flex-col items-center gap-3">
                              <Lock className="w-8 h-8 text-quantum mb-2" />
                              <h4 className="font-bold text-sm">B2B API Console</h4>
                              <p className="text-[10px] text-gray-400 font-mono">Requires enterprise authentication key to access raw stream buffers.</p>
                            </div>
                         )}
                      </div>
                   )}
                   
                   {/* Multimodal Tab Switcher */}
                   <div className="absolute top-2 left-2 flex gap-1 p-1 bg-black/60 backdrop-blur-md rounded-xl z-20">
                     <button onClick={() => setActiveTab('video')} className={`p-2 rounded-lg transition-colors ${activeTab === 'video' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}><Play className="w-3 h-3" /></button>
                     <button onClick={() => setActiveTab('stems')} className={`p-2 rounded-lg transition-colors ${activeTab === 'stems' ? 'bg-white/10 text-singularity' : 'text-gray-500 hover:text-singularity'}`}><Music className="w-3 h-3" /></button>
                     <button onClick={() => setActiveTab('api')} className={`p-2 rounded-lg transition-colors ${activeTab === 'api' ? 'bg-white/10 text-quantum' : 'text-gray-500 hover:text-quantum'}`}><Cpu className="w-3 h-3" /></button>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lower Third Info & Controls */}
          <div className="p-5 flex items-center justify-between gap-4">
             <div className="flex items-center gap-4 flex-1 min-w-0">
               <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${isPlaying ? 'from-singularity to-quantum' : 'from-gray-800 to-gray-900'} flex items-center justify-center shrink-0 border border-white/10 shadow-[0_0_15px_rgba(0,240,255,0.2)]`}>
                  <Music className={`w-5 h-5 ${isPlaying ? 'text-black' : 'text-gray-500'}`} />
               </div>
               <div className="flex flex-col min-w-0 flex-1">
                 <h3 className="font-bold text-sm truncate">{globalTrack.title}</h3>
                 <p className="text-xs text-gray-500 truncate">{globalTrack.artist}</p>
                 
               </div>
             </div>
             
             <button 
               onClick={() => { playWhoosh(); setIsPlaying(!isPlaying); }}
               className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shrink-0 shadow-xl"
             >
               {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-1" />}
             </button>
          </div>
          
          {/* Progress Bar (Global Appended) */}
          <div className="h-1 w-full bg-white/5 relative group cursor-pointer">
             <motion.div 
               className="absolute left-0 top-0 h-full bg-gradient-to-r from-singularity to-quantum shadow-[0_0_10px_rgba(0,240,255,0.5)]"
               style={{ width: `${progress}%` }}
             />
             <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
