import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, X, Radio, Volume2, Cpu } from 'lucide-react';
import { djVerseService } from '../services/djVerseService';
import { useStore } from '../store/useStore';

export function DJVerseOverlay() {
  const { globalTrack, biometricSync } = useStore();
  const [state, setState] = useState(djVerseService.getState());
  const [isVisible, setIsVisible] = useState(false);
  const [eqLevels, setEqLevels] = useState<number[]>(new Array(16).fill(0));
  const lastTrackId = useRef<string | null>(null);

  useEffect(() => {
    const updateLocalState = () => {
      const s = djVerseService.getState();
      setState({ ...s });
      if (s.isTalking) setIsVisible(true);
    };

    const interval = setInterval(() => {
      if (djVerseService.getState().isTalking) {
        setEqLevels(prev => prev.map(() => Math.random() * 80 + 20));
      } else {
        setEqLevels(new Array(16).fill(4));
      }
      updateLocalState();
    }, 150);

    return () => clearInterval(interval);
  }, []);

  // Monitor Track Changes
  useEffect(() => {
    if (globalTrack && globalTrack.id !== lastTrackId.current) {
      lastTrackId.current = globalTrack.id;
      
      const activityCtx = biometricSync.active 
        ? `Heart Rate at ${biometricSync.heartRate} BPM, Stress Level ${biometricSync.stressLevel}` 
        : 'High-intensity vibing';

      // Slight delay for the crossfade
      setTimeout(() => {
        djVerseService.generateTrackCommentary(globalTrack, activityCtx);
      }, 3000);
    }
  }, [globalTrack, biometricSync]);

  // Resonance Milestone Monitor
  const { resonance } = useStore();
  const lastMilestone = useRef(resonance);
  useEffect(() => {
    if (resonance >= lastMilestone.current + 5000) {
      lastMilestone.current = resonance;
      djVerseService.generateActivityCommentary(`Global resonance has breached ${resonance.toLocaleString()}. The singularity is near!`);
    }
  }, [resonance]);

  const handleManualShoutout = () => {
    const activityCtx = biometricSync.active 
      ? `Synchronization active at ${biometricSync.heartRate} BPM` 
      : 'Pure energy focus';
    djVerseService.generateActivityCommentary(`Manual pulse requested. ${activityCtx}`);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.9 }}
          className="fixed bottom-32 right-8 z-[150] w-full max-w-[320px]"
        >
          <div className="glass-modern overflow-hidden relative group p-6 rounded-[2rem] border border-singularity/30 shadow-[0_0_50px_rgba(0,240,255,0.2)] bg-black/80 backdrop-blur-3xl">
            {/* Energy Particle Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-singularity to-quantum rounded-full blur-[100px]"
              />
            </div>
            
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-full transition-colors z-20"
            >
              <X className="w-4 h-4 text-white/40" />
            </button>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-singularity flex items-center justify-center relative shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                   <Radio className="w-5 h-5 text-black animate-pulse" />
                </div>
                <div>
                  <h3 className="text-white font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
                    DJ-VERSE <span className="inline-block w-1.5 h-1.5 rounded-full bg-singularity animate-pulse" />
                  </h3>
                  <p className="text-[9px] text-singularity/60 font-mono uppercase tracking-widest">
                    {state.mood} MODE
                  </p>
                </div>
              </div>

              <div className="min-h-[60px] flex items-center mb-6">
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={state.currentMessage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm font-display font-medium text-white/90 leading-snug italic"
                  >
                    "{state.currentMessage || "Scanning the frequency..."}"
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={handleManualShoutout}
                  className="flex-1 flex items-center justify-center gap-2 py-3 glass hover:bg-white/10 rounded-xl border border-white/10 text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105"
                >
                  <Zap className="w-3 h-3 text-quantum" />
                  Hype Pulse
                </button>
                <div className="flex gap-1">
                  <div className="w-8 h-8 rounded-lg glass flex items-center justify-center">
                    <Volume2 className={`w-3 h-3 ${state.isTalking ? 'text-singularity' : 'text-gray-500'}`} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Reactive EQ at bottom */}
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between h-8 opacity-30 pointer-events-none px-4">
              {eqLevels.map((lvl, i) => (
                <motion.div 
                   key={i}
                   animate={{ height: `${lvl}%` }}
                   transition={{ type: "spring", stiffness: 300, damping: 20 }}
                   className="w-1 bg-singularity rounded-t-sm"
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
