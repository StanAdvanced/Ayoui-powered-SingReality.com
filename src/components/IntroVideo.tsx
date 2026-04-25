import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';

export function IntroVideo({ onComplete }: { onComplete?: () => void }) {
  const [isExiting, setIsExiting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const triggerExit = () => {
    setIsExiting(true);
    // Allow 1.5s for the fade out as requested by the Director
    setTimeout(() => {
      handleComplete();
    }, 1500);
  };

  const handleComplete = () => {
    sessionStorage.setItem('singreality_intro_seen', 'true');
    if (onComplete) onComplete();
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 z-[10000] bg-black flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <video
            ref={videoRef}
            src="https://drive.google.com/uc?export=download&id=1OFuhiy8bbF0sdJwJzg2HUFJVQyCwH12t"
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            onEnded={triggerExit}
            onError={(e) => {
              console.warn("Stanley Phani: Neural link disrupted. Skipping intro...", e);
              handleComplete();
            }}
          />
          
          {/* Stanley Phani Experience Branding - Subtle/Director Style */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.1, 0] }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.5, 1] }}
              className="font-display text-[10vw] font-black text-white/5 tracking-[0.2em] whitespace-nowrap"
            >
              STANLEY PHANI EXPERIENCE
            </motion.div>
          </div>

          {/* Escape Hatch (Skip Button) */}
          <motion.button
            className="absolute bottom-12 right-12 px-6 py-2 bg-black/40 hover:bg-singularity/20 backdrop-blur-xl border border-white/10 hover:border-singularity/50 rounded-full text-white/50 hover:text-singularity font-mono text-[10px] uppercase tracking-[0.3em] transition-all z-[10001] group"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2, duration: 1 }}
            onClick={triggerExit}
          >
            <span className="relative z-10">SKIP INTRO</span>
            <div className="absolute inset-0 bg-singularity/5 opacity-0 group-hover:opacity-100 blur-md transition-opacity rounded-full" />
          </motion.button>

          {/* The Director's Corner */}
          <div className="absolute top-12 left-12 mix-blend-exclusion">
            <div className="flex flex-col gap-1">
              <div className="h-0.5 w-12 bg-singularity/40" />
              <p className="text-[10px] font-mono text-singularity/60 tracking-widest uppercase">Initializing Stanley Phani Nexus</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
