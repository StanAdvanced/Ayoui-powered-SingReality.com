import React from 'react';
import { motion } from 'motion/react';

export function ConcertEffects() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" style={{ perspective: '2000px' }}>
      {/* Deep Smoke Layering */}
      <motion.div 
        className="absolute inset-0 opacity-70 mix-blend-screen" 
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 120%, rgba(112, 0, 255, 0.6) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(0, 240, 255, 0.5) 0%, transparent 60%), radial-gradient(circle at 80% 90%, rgba(255, 140, 0, 0.4) 0%, transparent 50%)',
          filter: 'blur(40px)'
        }} 
      />
      
      {/* 9D Anyma-Style Mega Hologram (Jumping out of screen) */}
      <div className="absolute inset-0 flex items-center justify-center mix-blend-screen pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
        <motion.div
          animate={{
            scale: [0.5, 2.5, 0.5],
            translateZ: [-500, 800, -500],
            rotateY: [-15, 15, -15],
            opacity: [0.1, 0.9, 0.1]
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative w-[150vw] h-[150vw] max-w-[1500px] max-h-[1500px] flex items-center justify-center"
        >
          {/* Giant Cybernetic Entity / Core */}
          <div className="absolute w-1/2 h-1/2 rounded-full border-[3px] border-singularity shadow-[0_0_200px_rgba(0,240,255,1),inset_0_0_50px_rgba(255,140,0,0.5)]" style={{ background: 'radial-gradient(circle, rgba(0,240,255,0.3) 0%, rgba(255,140,0,0.1) 60%)' }} />
          <motion.div 
            animate={{ rotateZ: [0, 180, 360], scale: [1, 1.1, 1] }} 
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute w-[60%] h-[60%] rounded-full border-t-[6px] border-b-[6px] border-quantum opacity-90 shadow-[0_0_50px_rgba(255,0,255,0.8),0_0_20px_rgba(255,140,0,0.6)]"
          />
          <motion.div 
            animate={{ rotateZ: [0, -180, -360], scale: [1, 1.2, 1] }} 
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute w-[70%] h-[70%] rounded-full border-l-[4px] border-r-[4px] border-[#ff8c00] opacity-80 shadow-[0_0_50px_rgba(255,140,0,0.7)]"
          />
          {/* Digital Display Glitch Artifacts */}
          <motion.div
            animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1.5, 2, 0.8], skewX: [0, 20, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute w-full h-[4px] bg-white shadow-[0_0_30px_white,0_0_15px_#ff8c00]"
          />
        </motion.div>
      </div>

      {/* Volumetric Laser Beams Cutting Through Smoke */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full flex justify-center items-end" style={{ transformStyle: 'preserve-3d' }}>
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`laser-${i}`}
            className="absolute bottom-[-10%] w-[5px] h-[150vh] origin-bottom mix-blend-screen"
            style={{
              background: i % 3 === 0 ? 'linear-gradient(to top, rgba(0,240,255,1), transparent)' : i % 3 === 1 ? 'linear-gradient(to top, rgba(255,140,0,1), transparent)' : 'linear-gradient(to top, rgba(255,255,255,1), transparent)',
              boxShadow: i % 3 === 0 ? '0 0 40px 8px rgba(0,240,255,0.9)' : i % 3 === 1 ? '0 0 40px 8px rgba(255,140,0,0.9)' : '0 0 40px 8px rgba(255,255,255,0.9)',
              rotateZ: `${(i - 7) * 10}deg`,
              rotateX: '45deg', // Tilt forward into the crowd
            }}
            animate={{
              rotateZ: [`${(i - 7) * 10}deg`, `${(i - 7) * 18}deg`, `${(i - 7) * 10}deg`],
              opacity: [0, 1, 0],
              scaleY: [0.5, 1.3, 0.5]
            }}
            transition={{
              duration: 1.5 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Lifelike Crowd Lights (Sea of phones/glowsticks) - Multi-layered */}
      <div className="absolute bottom-0 left-0 w-full h-[40vh] overflow-hidden mix-blend-screen pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent z-10" />
        
        {/* Background Crowd (Small, blurry) */}
        {[...Array(150)].map((_, i) => (
          <motion.div
            key={`crowd-bg-${i}`}
            className="absolute w-[2px] h-[2px] rounded-full bg-white/50 blur-[1px]"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -5 - Math.random() * 10, 0],
              opacity: [0.1, 0.5, 0.1]
            }}
            transition={{ duration: 1 + Math.random() * 2, repeat: Infinity }}
          />
        ))}

        {/* Foreground Crowd (Large, bright, colored) */}
        {[...Array(80)].map((_, i) => (
          <motion.div
            key={`crowd-fg-${i}`}
            className="absolute w-[4px] h-[4px] rounded-full bg-white z-20"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 50}%`,
              boxShadow: Math.random() > 0.5 ? '0 0 15px 3px rgba(0,240,255,1)' : '0 0 15px 3px rgba(255,0,128,1)'
            }}
            animate={{
              y: [0, -15 - Math.random() * 30, 0],
              x: [0, (Math.random() - 0.5) * 20, 0],
              opacity: [0.4, 1, 0.4],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 0.5 + Math.random() * 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
    </div>
  );
}
