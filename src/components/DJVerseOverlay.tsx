import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic2, Activity, Zap, Play, FastForward, X, Radio, SkipForward } from 'lucide-react';
import { djVerseService } from '../services/djVerseService';

export function DJVerseOverlay() {
  const [state, setState] = useState(djVerseService.getState());
  const [isVisible, setIsVisible] = useState(true);
  const [eqLevels, setEqLevels] = useState<number[]>(new Array(12).fill(0));
  const [isMixing, setIsMixing] = useState(false);

  useEffect(() => {
    const djState = djVerseService.getState();
    setState(djState);

    const interval = setInterval(() => {
      setEqLevels(prev => prev.map(() => Math.random() * 100));
      setState({ ...djVerseService.getState() });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleShoutout = async () => {
    setIsMixing(true);
    await djVerseService.generateCommentary('Live crowd interaction');
    setTimeout(() => setIsMixing(false), 2000);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.95 }}
          className="fixed bottom-12 right-12 z-50 w-full max-w-sm"
        >
          <div className="glass-modern overflow-hidden relative group p-8 rounded-[3rem] border border-white/20 shadow-[0_0_80px_rgba(168,85,247,0.3)] bg-black/60 backdrop-blur-3xl">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-50" />
            
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors z-20"
            >
              <X className="w-5 h-5 text-white/40" />
            </button>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-singularity to-quantum flex items-center justify-center relative shadow-2xl">
                    <motion.div 
                      className="absolute inset-0 bg-white/20 blur-xl"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <Radio className="w-8 h-8 text-white relative z-10 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-xs uppercase tracking-[0.3em] flex items-center gap-2">
                      DJ-VERSE <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ height: [4, 16, 4] }}
                          transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
                          className="w-1 bg-quantum/60 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <div className="text-[10px] text-quantum font-black uppercase tracking-widest mb-3 opacity-80">
                  {state.mood} // {state.theme}
                </div>
                <div className="h-20 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.p 
                      key={state.currentMessage}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="text-lg font-bold text-white/90 leading-tight italic tracking-tight"
                    >
                      "{state.currentMessage || "RESONATING THROUGH THE VOID..."}"
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handleShoutout}
                  disabled={isMixing}
                  className="flex items-center justify-center gap-3 py-5 bg-white/5 hover:bg-white/10 rounded-[1.5rem] border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  <Zap className={`w-4 h-4 ${isMixing ? 'animate-spin text-quantum' : 'text-quantum'}`} />
                  Shoutout
                </button>
                
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center bg-singularity text-black rounded-[1.5rem] transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,240,255,0.3)]">
                    <Play className="w-5 h-5 fill-current" />
                  </button>
                  <button className="flex-1 flex items-center justify-center bg-white/5 border border-white/10 text-white rounded-[1.5rem] transition-all hover:scale-105 active:scale-95">
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Interactive EQ Bars at bottom */}
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-around h-16 opacity-10 pointer-events-none px-4">
              {eqLevels.map((lvl, i) => (
                <div 
                  key={i} 
                  className="w-1 bg-white rounded-t-full transition-all duration-100"
                  style={{ height: `${lvl}%` }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
