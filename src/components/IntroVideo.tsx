import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';

export function IntroVideo({ onComplete }: { onComplete?: () => void }) {
  const [isDone, setIsDone] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('singreality_intro_seen');
    if (hasSeenIntro) {
      handleComplete();
    }
  }, []);

  const handleComplete = () => {
    sessionStorage.setItem('singreality_intro_seen', 'true');
    setIsDone(true);
    if (onComplete) onComplete();
  };

  if (isDone) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <video
          ref={videoRef}
          src="https://drive.google.com/uc?export=download&id=1OFuhiy8bbF0sdJwJzg2HUFJVQyCwH12t"
          className="w-full h-full object-cover"
          autoPlay
          playsInline
          onEnded={handleComplete}
          onError={(e) => {
            console.warn("Video failed to load:", e);
            handleComplete();
          }}
        />
        
        {/* Skip Button */}
        <motion.button
          className="absolute bottom-12 right-12 px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white font-bold uppercase tracking-widest text-xs transition-all z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={handleComplete}
        >
          Skip Intro
        </motion.button>

        {/* Branding Overlay (Subtle) */}
        <div className="absolute top-12 left-12 z-20 opacity-50 pointer-events-none">
          <Logo size="sm" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
