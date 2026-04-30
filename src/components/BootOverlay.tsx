import React from 'react';
import { motion } from 'framer-motion';

export function BootOverlay() {
  return (
    <div className="fixed inset-0 z-[10001] pointer-events-none overflow-hidden mix-blend-screen opacity-40">
      {/* Scanlines Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* HUD Corners */}
      <div className="absolute top-10 left-10 w-24 h-24 border-t border-l border-singularity/30" />
      <div className="absolute top-10 right-10 w-24 h-24 border-t border-r border-singularity/30" />
      <div className="absolute bottom-10 left-10 w-24 h-24 border-b border-l border-singularity/30" />
      <div className="absolute bottom-10 right-10 w-24 h-24 border-b border-r border-singularity/30" />

      {/* Floating Data Layers */}
      <div className="absolute top-1/4 left-10 space-y-2 opacity-50">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ width: 0 }}
            animate={{ width: Math.random() * 100 + 50 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse', delay: i * 0.2 }}
            className="h-1 bg-singularity/40"
          />
        ))}
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.5)]" />
      
      {/* Glitch Overlay */}
      <motion.div
        animate={{ 
          opacity: [0, 0.05, 0],
          y: [-10, 10, -5]
        }}
        transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 5 }}
        className="absolute inset-0 bg-white"
      />
    </div>
  );
}
