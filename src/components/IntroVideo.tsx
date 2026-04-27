import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';

export function IntroVideo({ onComplete }: { onComplete?: () => void }) {
  const [isExiting, setIsExiting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const triggerExit = () => {
    setIsExiting(true);
    // Allow 2s for the fade out as requested by the Producer
    setTimeout(() => {
      handleComplete();
    }, 2000);
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
          exit={{ opacity: 0, filter: 'blur(20px) scale(1.1)' }}
          transition={{ duration: 2, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-black/20 to-black pointer-events-none" />
          
          <video
            ref={videoRef}
            src="https://drive.google.com/uc?export=download&id=1Tn6Rf05djgrqqDTjyD2GOj2_o3iVRHj36fznwsaAIo8"
            className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1]"
            autoPlay
            muted
            playsInline
            onEnded={triggerExit}
            onError={(e) => {
              const errMsg = e.currentTarget?.error?.message || "Unknown error";
              console.warn(`Stanley Phani Media: Transmission failed. [${errMsg}]`);
              handleComplete();
            }}
          />
          
          {/* Hollywood Style Intro Overlays */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: [0, 0.5, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="text-white/10 font-display text-[15vw] font-black uppercase tracking-[0.5em] blur-2xl"
            >
              SINGREALITY
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
