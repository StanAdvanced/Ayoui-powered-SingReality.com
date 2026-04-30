import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BootOverlay } from './BootOverlay';
import { Volume2, VolumeX, FastForward, Play, AlertCircle } from 'lucide-react';

export function IntroVideo({ onComplete }: { onComplete: () => void }) {
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [useYouTubeFallback, setUseYouTubeFallback] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const localVideoUrl = "/intro.mp4";
  const cdnVideoUrl = "https://player.vimeo.com/external/517088497.hd.mp4?s=d007d3910c538a7c293674c1071427a13d74f260&profile_id=172";
  const youtubeFallbackId = "XpS_6-O9_3s"; // Cinematic GlassVerse-style fallback

  const videoUrl = videoError ? cdnVideoUrl : localVideoUrl;

  useEffect(() => {
    if (videoRef.current && !useYouTubeFallback) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => setIsMuted(true));
      }
    }
  }, [videoUrl, useYouTubeFallback]);

  const handleVideoError = () => {
    if (!videoError) {
      console.warn("Local intro failed, trying CDN...");
      setVideoError(true);
    } else {
      console.error("CDN intro failed, switching to YouTube Fallback...");
      setUseYouTubeFallback(true);
      setHasStarted(true); // YouTube autoplay usually works better with iframe
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const handleSkip = () => {
    triggerExit();
  };

  const triggerExit = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 1500); // Dissolve duration
  };

  const startWithAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.play();
      setHasStarted(true);
    }
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden cursor-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(30px)' }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        >
          {!useYouTubeFallback ? (
            videoUrl && !videoError ? (
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onEnded={triggerExit}
                onPlay={() => setHasStarted(true)}
                onError={handleVideoError}
                onCanPlay={() => {
                  if (!isMuted) videoRef.current?.play();
                }}
              />
            ) : (
              <div className="w-full h-full bg-black flex items-center justify-center">
                <motion.div 
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-singularity font-mono text-[10px] uppercase tracking-[1em]"
                >
                  Establishing Link...
                </motion.div>
              </div>
            )
          ) : (
            <div className="w-full h-full relative">
              <iframe
                className="w-full h-full object-cover pointer-events-none scale-[1.3]"
                src={`https://www.youtube.com/embed/${youtubeFallbackId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&showinfo=0&rel=0&loop=1&playlist=${youtubeFallbackId}&modestbranding=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          )}

          <BootOverlay />

          {/* Dynamic HUD Elements */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
            <span className="text-[10px] font-mono text-singularity opacity-60 uppercase tracking-[0.5em]">System Boot Sequence</span>
            <div className="w-64 h-[1px] bg-white/10 relative">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-singularity shadow-[0_0_15px_rgba(0,184,212,0.8)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Interactivity layer if blocked */}
          {!hasStarted && isMuted && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-[10002]"
            >
              <button 
                onClick={startWithAudio}
                className="flex flex-col items-center gap-6 group"
              >
                <div className="w-24 h-24 rounded-full border-2 border-singularity/50 flex items-center justify-center group-hover:scale-110 group-hover:border-singularity transition-all duration-500">
                  <Play className="w-10 h-10 text-singularity ml-1" />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-display font-black text-white italic tracking-widest group-hover:text-singularity transition-colors">INITIATE GLASSVERSE</h2>
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">Audio Permission Required for Full Immersion</p>
                </div>
              </button>
            </motion.div>
          )}

          {/* Controls */}
          <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end z-[10003]">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 text-white/30 font-mono text-[9px] uppercase tracking-widest">
                <span>Core: AI_SINGULARITY_V4</span>
                <span className="opacity-20">|</span>
                <span>Buffer: OPTIMIZED</span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-3 glass rounded-full hover:bg-white/10 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-singularity" />}
                </button>
              </div>
            </div>

            <button
              onClick={handleSkip}
              className="flex items-center gap-4 px-8 py-3 glass rounded-xl border border-white/10 hover:border-singularity/50 hover:bg-singularity/5 text-white/50 hover:text-white transition-all group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em]">Skip Sequence</span>
              <FastForward className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          {/* Ambient Lighting Particles */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-singularity/10 to-transparent opacity-20" />
            <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-singularity/10 to-transparent opacity-20" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
