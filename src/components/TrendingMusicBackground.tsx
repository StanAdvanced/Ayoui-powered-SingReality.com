import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

// Simulated Trending Graph - Updates every 30 minutes in a real app
const TRENDING_30MIN_WINDOW = [
  { id: '1', title: "Cyber-Symphony Beta", youtubeId: "c_vX8S_N474" }, // generic chillhop / synthwave
  { id: '2', title: "Neon Gradients (Live)", youtubeId: "jfKfPfyJRdk" }, // lofi girl
  { id: '3', title: "Quantum Dreams", youtubeId: "5qap5aO4i9A" }, // Synthwave
  { id: '4', title: "Vibes & Transactions", youtubeId: "bM02rl1vMow" }, // chill beats
];

interface TrendingMusicBackgroundProps {
  opacity?: number;
  onSongChange?: (song: any) => void;
}

export function TrendingMusicBackground({ opacity = 0.4, onSongChange }: TrendingMusicBackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Automatically cycle to the next song when finished
  const handleEnded = () => {
    const nextIndex = (currentIndex + 1) % TRENDING_30MIN_WINDOW.length;
    setCurrentIndex(nextIndex);
    if (onSongChange) onSongChange(TRENDING_30MIN_WINDOW[nextIndex]);
  };

  useEffect(() => {
    if (onSongChange) onSongChange(TRENDING_30MIN_WINDOW[currentIndex]);
  }, [currentIndex, onSongChange]);

  const currentSong = TRENDING_30MIN_WINDOW[currentIndex];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black" style={{ opacity }}>
      {/* Real-time Rendered Visuals overlay over the video */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none mix-blend-multiply z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-singularity/30 to-quantum/30 mix-blend-overlay pointer-events-none z-10" />

      {/* Synchronized YouTube Visualizer Engine */}
      {React.createElement(ReactPlayer as any, {
        url: `https://www.youtube.com/watch?v=${currentSong.youtubeId}`,
        playing: isPlaying,
        muted: false,
        volume: 0.8,
        width: "100vw",
        height: "100vh",
        style: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(1.5)',
          pointerEvents: 'none',
        },
        onEnded: handleEnded,
        config: {
          youtube: {
            playerVars: { 
              disablekb: 1, 
              rel: 0, 
              iv_load_policy: 3
            }
          }
        }
      })}
      
      {/* Pulse visualizer modal overlay block */}
      <AnimatePresence>
        <motion.div 
          className="absolute inset-0 bg-singularity/10 mix-blend-screen z-20 pointer-events-none"
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </AnimatePresence>
    </div>
  );
}
