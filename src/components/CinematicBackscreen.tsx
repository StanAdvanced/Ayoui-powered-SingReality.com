import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'motion/react';
import { SUMFEngine, ConvergenceState } from '../services/sumfEngine';

interface CinematicBackscreenProps {
  imageUrl?: string;
  videoUrl?: string;
  opacity?: number;
  blur?: number;
  rimLightColor?: string;
}

export function CinematicBackscreen({
  imageUrl = "https://images.unsplash.com/photo-1514525253361-b83f6b4b27c0?q=80&w=2000&auto=format&fit=crop",
  opacity = 0.5,
  blur = 0,
  rimLightColor = "rgba(0, 240, 255, 0.4)"
}: CinematicBackscreenProps) {
  const [sumfState, setSumfState] = useState<ConvergenceState | null>(null);
  const controls = useAnimation();

  useEffect(() => {
    const sumf = SUMFEngine.getInstance();
    const unsubscribe = sumf.subscribe((state) => {
      setSumfState(state);
      if (state.isBeatHit) {
        controls.start({
          scale: [1, 1.05, 1],
          filter: [`brightness(1)`, `brightness(1.5)`, `brightness(1)`],
          transition: { duration: 0.2 }
        });
      }
    });

    return () => unsubscribe();
  }, [controls]);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-black">
      {/* Main Cinematic Image with SUMF-driven Pulses */}
      <motion.div
        className="absolute inset-0"
        animate={controls}
        initial={{ scale: 1.1 }}
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: opacity,
          filter: blur > 0 ? `blur(${blur}px)` : 'none'
        }}
      >
        {/* Dynamic Light Wrap Overlay */}
        <motion.div 
          className="absolute inset-0 bg-singularity/10 mix-blend-overlay"
          animate={{
            opacity: sumfState?.volume ? (sumfState.volume / 100) * 0.3 : 0.1
          }}
        />
      </motion.div>

      {/* Atmospheric Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      
      {/* Volumetric Beam Simulation (High-End) */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        animate={{
          rotate: [0, 360],
        }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[20px] bg-gradient-to-r from-transparent via-white/20 to-transparent blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[20px] bg-gradient-to-r from-transparent via-white/20 to-transparent blur-2xl rotate-45" />
      </motion.div>

      {/* Light Wrap Simulation (Edge Glow) */}
      <div 
        className="absolute inset-x-0 bottom-0 h-[50vh] blur-[120px] opacity-20"
        style={{ backgroundColor: rimLightColor }}
      />
      
      {/* Particle Convergence */}
      <div className="absolute inset-0 opacity-20 mix-blend-screen overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white blur-[1px]"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -200],
              opacity: [0, 1, 0],
              scale: sumfState?.isBeatHit ? [1, 2, 1] : 1
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 10
            }}
          />
        ))}
      </div>

      {/* Cinematic Scanline Texture */}
      <div className="absolute inset-0 bg-scanlines opacity-[0.03] pointer-events-none" />
    </div>
  );
}
