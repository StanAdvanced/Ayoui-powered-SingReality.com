import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BootSequence } from './BootSequence';
import { FastForward, Play } from 'lucide-react';

// @ts-ignore
import introVideo from '../assets/intro.mp4';

export function IntroVideo({ onComplete }: { onComplete: () => void }) {
  const [hasStarted, setHasStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        console.log("Autoplay blocked, waiting for interaction");
      });
    }
  }, []);

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
    }, 2000); // Cinematic dissolve
  };

  const initiatePlayback = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play();
      setHasStarted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[999999] bg-black overflow-hidden select-none">
      <AnimatePresence>
        {!isExiting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(40px)' }}
            transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-full h-full"
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              preload="auto"
              onTimeUpdate={handleTimeUpdate}
              onEnded={triggerExit}
              onPlay={() => setHasStarted(true)}
              className="fixed top-0 left-0 w-full h-full object-cover"
            >
              <source src={introVideo} type="video/mp4" />
              <source src="https://player.vimeo.com/external/517088497.hd.mp4?s=d007d3910c538a7c293674c1071427a13d74f260&profile_id=172" type="video/mp4" />
              <source src="/intro.mp4" type="video/mp4" />
            </video>

            {/* Cinematic Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60 pointer-events-none" />
            <div className="absolute inset-0 bg-scanlines opacity-[0.03] pointer-events-none" />

            <BootSequence progress={progress} />

            {/* Interaction Layer for Blocked Autoplay */}
            {!hasStarted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-xl z-[1000000]"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={initiatePlayback}
                  className="group flex flex-col items-center gap-8"
                >
                  <div className="w-32 h-32 rounded-full border border-singularity/30 flex items-center justify-center group-hover:border-singularity group-hover:shadow-[0_0_50px_rgba(0,184,212,0.3)] transition-all duration-700">
                    <Play className="w-12 h-12 text-singularity ml-2" />
                  </div>
                  <div className="text-center space-y-3">
                    <h1 className="text-4xl font-black italic tracking-[0.3em] text-white uppercase translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      Initiate Convergence
                    </h1>
                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.5em]">
                      Establishing Secure Neural Link
                    </p>
                  </div>
                </motion.button>
              </motion.div>
            )}

            {/* Skip Option - Only shows after a few seconds */}
            {progress > 10 && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={handleSkip}
                className="absolute bottom-12 right-12 flex items-center gap-4 px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 hover:border-singularity/50 transition-all group overflow-hidden z-[1000001]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-white/50 group-hover:text-white">
                  Skip Sequence
                </span>
                <FastForward className="w-4 h-4 text-white/30 group-hover:text-singularity transition-colors" />
              </motion.button>
            )}

            {/* System Details HUD */}
            <div className="absolute top-12 left-12 flex flex-col gap-1 pointer-events-none opacity-40">
              <span className="text-[8px] font-mono text-white uppercase tracking-widest">Client: {window.location.hostname}</span>
              <span className="text-[8px] font-mono text-white uppercase tracking-widest">Lat: {Number(progress).toFixed(4)}ms</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

