import React from 'react';
import { motion } from 'motion/react';

interface CinematicTransitionProps {
  children: React.ReactNode;
  isReady: boolean;
}

export function CinematicTransition({ children, isReady }: CinematicTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, filter: 'brightness(0)' }}
      animate={isReady ? { 
        opacity: 1, 
        scale: 1, 
        filter: 'brightness(1)',
      } : {}}
      transition={{ 
        duration: 2, 
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
        delay: 0.2
      }}
      className="min-h-screen w-full relative"
    >
      {/* Entrance Light Flash */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isReady ? { opacity: [0, 0.8, 0] } : {}}
        transition={{ duration: 1.5, times: [0, 0.2, 1] }}
        className="fixed inset-0 z-[5000] bg-white pointer-events-none"
      />
      
      {children}
    </motion.div>
  );
}
