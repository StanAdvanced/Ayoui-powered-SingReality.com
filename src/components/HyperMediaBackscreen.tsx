import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { getMediaAssetForPath, PageMediaAsset } from '../constants/pageMediaRegistry';
import { SUMFEngine, ConvergenceState } from '../services/sumfEngine';
import { useStore } from '../store/useStore';
import { generateSpeech, playRawAudio, stopAudio } from '../lib/tts';
import { VideoBackground } from './VideoBackground';

export function HyperMediaBackscreen() {
  const location = useLocation();
  const [asset, setAsset] = useState<PageMediaAsset>(getMediaAssetForPath(location.pathname));
  const [sumfState, setSumfState] = useState<ConvergenceState | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const narrationVoice = useStore(state => state.narrationVoice);
  const setAvatarTalking = useStore(state => state.setAvatarTalking);

  useEffect(() => {
    const newAsset = getMediaAssetForPath(location.pathname);
    setAsset(newAsset);

    // Audio Logic
    if (audioRef.current) {
      const currentAudio = audioRef.current;
      // Fade out current
      const fadeOut = setInterval(() => {
        if (currentAudio.volume > 0.05) {
          currentAudio.volume -= 0.05;
        } else {
          currentAudio.pause();
          currentAudio.src = newAsset.audioScapes.ambient;
          currentAudio.volume = 0;
          currentAudio.play().catch(e => console.log("Audio play failed, user interaction needed."));
          
          // Fade in new
          const fadeIn = setInterval(() => {
            if (currentAudio.volume < 0.25) {
              currentAudio.volume += 0.05;
            } else {
              clearInterval(fadeIn);
            }
          }, 100);
          clearInterval(fadeOut);
        }
      }, 50);
    }

    // Voice Narration
    if (newAsset.voiceScript) {
      const triggerNarration = async () => {
        try {
          stopAudio();
          setAvatarTalking(true);
          const audio = await generateSpeech(newAsset.voiceScript || '', narrationVoice);
          if (audio) await playRawAudio(audio);
        } catch (e) {
          console.error("Narration error", e);
        } finally {
          setAvatarTalking(false);
        }
      };
      
      const timer = setTimeout(triggerNarration, 1500);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, narrationVoice, setAvatarTalking]);

  useEffect(() => {
    // Initialize audio on first load
    if (!audioRef.current) {
      audioRef.current = new Audio(asset.audioScapes.ambient);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.15; // Set lower initially to avoid shock
      audioRef.current.play().catch(e => console.log("Ambient audio requires interaction"));
    }

    const sumf = SUMFEngine.getInstance();
    const unsubscribe = sumf.subscribe(setSumfState);
    return () => {
      unsubscribe();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={asset.path}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Layer (Video or Image) */}
          {asset.backgroundMedia.type === 'video' ? (
            <VideoBackground 
              url={asset.backgroundMedia.url} 
              brightness={asset.backgroundMedia.brightness} 
            />
          ) : (
            <div 
              className="absolute inset-0 transition-all duration-1000"
              style={{
                backgroundImage: `url(${asset.backgroundMedia.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: `brightness(${asset.backgroundMedia.brightness || 0.5}) blur(${asset.backgroundMedia.blur || 0}px)`
              }}
            />
          )}

          {/* Liquid Shimmer Overlay */}
          <motion.div
            animate={{
              opacity: [0.1, 0.2, 0.1],
              background: [
                `radial-gradient(circle at 30% 30%, ${asset.themeColor}33 0%, transparent 70%)`,
                `radial-gradient(circle at 70% 70%, ${asset.themeColor}33 0%, transparent 70%)`,
                `radial-gradient(circle at 30% 30%, ${asset.themeColor}33 0%, transparent 70%)`,
              ]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 mix-blend-screen"
          />

          {/* Liquid Gooey Visuals (Elite Refraction) */}
          <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay filter blur-[60px] contrast-[150%]">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${Math.random() * 40 + 30}vw`,
                  height: `${Math.random() * 40 + 30}vw`,
                  backgroundColor: asset.themeColor,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, Math.random() * 200 - 100, 0],
                  y: [0, Math.random() * 200 - 100, 0],
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: Math.random() * 20 + 20,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Dynamic Light Wrap Overlay */}
          <motion.div 
            className="absolute inset-0 mix-blend-overlay"
            style={{ backgroundColor: `${asset.themeColor}1a` }}
            animate={{
              opacity: sumfState?.volume ? (sumfState.volume / 100) * 0.3 : 0.1
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Atmospheric Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      
      {/* Hyper-Dimensional Rays */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300vw] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent blur-sm" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300vw] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent blur-sm rotate-90" />
      </motion.div>

      {/* Cinematic Scanline Texture */}
      <div className="absolute inset-0 bg-scanlines opacity-[0.03] pointer-events-none" />
      
      {/* Vibe Pulse Bloom */}
      {sumfState?.isBeatHit && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.2, 0], scale: [0.8, 1.2, 1.4] }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 border-[100px] border-white/5 blur-3xl pointer-events-none"
        />
      )}
    </div>
  );
}
