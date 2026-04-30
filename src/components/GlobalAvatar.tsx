import React, { useRef, useEffect, useState } from 'react';
import { SafeCanvas } from './SafeCanvas';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAvatarSpeech } from '../hooks/useAvatarSpeech';
import { AnimatePresence, motion } from 'framer-motion';
import { useSound } from '../hooks/useSound';

import { Humanoid } from './Avatar';

export function GlobalAvatar() {
  const { isTalking, currentText } = useAvatarSpeech();
  const [isOpen, setIsOpen] = useState(false);
  const { playClick } = useSound();

  // Auto-open when talking starts on a new page (or keep it open)
  useEffect(() => {
    if (isTalking) {
      setIsOpen(true);
    }
  }, [isTalking]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      
      <AnimatePresence>
        {isOpen && isTalking && (
          <motion.div 
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            className="mb-4 p-4 rounded-2xl bg-black/80 backdrop-blur-xl border border-purple-500/30 max-w-sm pointer-events-auto shadow-[0_0_30px_rgba(168,85,247,0.3)]"
          >
            <div id="nexus-guide-popover" className="flex justify-between items-start mb-2">
              <span id="nexus-guide-label" className="text-xs font-bold uppercase tracking-widest text-purple-400">Nexus Guide</span>
              <button 
                onClick={(e) => { 
                  e.stopPropagation();
                  playClick(); 
                  setIsOpen(false); 
                }} 
                className="text-gray-500 hover:text-white"
              >
                &times;
              </button>
            </div>
            <p className="text-sm text-gray-200 leading-relaxed font-light">
              <TypewriterText text={currentText} />
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden bg-black/40 backdrop-blur-md border hover:border-purple-500/50 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] pointer-events-auto cursor-pointer transition-colors"
        onClick={() => { playClick(); setIsOpen(!isOpen); }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <SafeCanvas camera={{ position: [0, 0, 4], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[5, 5, 5]} intensity={2} color="#00f0ff" />
          <spotLight position={[-5, 5, -5]} intensity={2} color="#ff00ff" />
          
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <Humanoid 
              isTalking={isTalking} 
              scale={1.4} 
              position={[0, -1.5, 0]} 
              instrumentType="synth" 
              wireframe={!isTalking}
            />
          </Float>
          
          <Sparkles count={50} scale={3} size={2} color={isTalking ? "#ff00ff" : "#00f0ff"} />
          
          <EffectComposer>
            <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} intensity={2} />
          </EffectComposer>
        </SafeCanvas>
      </motion.div>
    </div>
  );
}

function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('');
  
  useEffect(() => {
    let index = 0;
    setDisplayed('');
    
    // Calculate typing speed based on sentence length, typically ~50ms per char
    // to keep it somewhat in sync with standard speech rate
    const speed = Math.max(30, Math.min(80, 5000 / Math.max(1, text.length)));
    
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, index));
      index++;
      if (index > text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text]);

  return <span>{displayed}</span>;
}
