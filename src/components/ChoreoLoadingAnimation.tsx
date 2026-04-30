import React from 'react';
import { motion } from 'framer-motion';

export const ChoreoLoadingAnimation = ({ complexity, style, emotionIntensity }: { complexity: number, style: string, emotionIntensity: number }) => {
  const isFluid = style === 'fluid';
  
  return (
    <div className="flex items-center justify-center gap-2">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: isFluid ? [0, 360] : [0, 90, 0],
          borderRadius: isFluid ? ["50%", "20%", "50%"] : ["20%", "50%", "20%"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          width: `${20 + (complexity / 5)}px`,
          height: `${20 + (complexity / 5)}px`,
          background: `conic-gradient(from 0deg, #ff00ff, #00f0ff, #ff00ff)`,
          opacity: emotionIntensity / 100,
        }}
        className="rounded-full"
      />
      <span className="text-xs font-mono uppercase tracking-widest text-[#00f0ff] animate-pulse">
        {isFluid ? 'Fluidizing' : style === 'sharp' ? 'Sharpening' : 'Contemporary'} Vectors...
      </span>
    </div>
  );
};
