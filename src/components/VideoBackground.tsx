import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoBackgroundProps {
  url: string;
  brightness?: number;
  opacity?: number;
}

export function VideoBackground({ url, brightness = 0.5, opacity = 1 }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75; // Cinematic slow motion
    }
  }, [url]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 overflow-hidden"
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        src={url}
        className="w-full h-full object-cover"
        style={{ filter: `brightness(${brightness})` }}
      />
    </motion.div>
  );
}
