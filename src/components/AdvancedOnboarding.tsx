import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { generateSpeech, playRawAudio, stopAudio } from '../lib/tts';
import { Sparkles, ArrowRight, X, Play, Music, Mic2, Cpu, Globe2, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OnboardingStep {
  id: string;
  target?: string;
  title: string;
  content: string;
  icon: React.ReactNode;
  scene?: 'cinematic' | 'tooltip';
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'THE SINGULARITY AWAITS',
    content: "Welcome to SingReality, legends! We're talking 100% free, unlimited, uncensored AI access. I'm your guide to the music revolution. Buckle up, we're about to bend reality together!",
    icon: <Sparkles className="w-8 h-8 text-cyan-400" />,
    scene: 'cinematic',
  },
  {
    id: 'studio',
    target: '.nav-studio',
    title: 'KHORAL-FLOW STUDIO',
    content: "The absolute magic happens here. Translate emotions into synesthetic masterpieces via our Babylon Engine. Earn Resonance just for being a genius!",
    icon: <Music className="w-8 h-8 text-pink-500" />,
    scene: 'tooltip',
  },
  {
    id: 'arenas',
    target: '.nav-arenas',
    title: 'LIVE ARENAS',
    content: "Jam globally with zero latency. Sync your biometrics and perform for millions. The world is your stage, literally.",
    icon: <Mic2 className="w-8 h-8 text-purple-500" />,
    scene: 'tooltip',
  },
  {
    id: 'clones',
    target: '.nav-clones',
    title: 'NEURAL CLONES',
    content: "Need God-tier bandmates? Your AI clones never sleep and always hit the high notes. Elevate your production to the next dimension.",
    icon: <Cpu className="w-8 h-8 text-indigo-500" />,
    scene: 'tooltip',
  },
  {
    id: 'marketplace',
    target: '.nav-marketplace',
    title: 'RESONANCE MARKET',
    content: "The Wall Street of Music. Trade holographic blueprints, assets, and VIP gear. Make it rain Resonance!",
    icon: <Wallet className="w-8 h-8 text-emerald-400" />,
    scene: 'tooltip',
  },
  {
    id: 'quantum',
    target: '.nav-quantum',
    title: 'QUANTUM LAB',
    content: "899th Dimension Twist Algorithms live here. We push the absolute boundaries of sound and light. Extreme sonic experimentation ahead.",
    icon: <Globe2 className="w-8 h-8 text-blue-400" />,
    scene: 'tooltip',
  }
];

export function AdvancedOnboarding() {
  const [activeStep, setActiveStep] = useState(-1);
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const { setAvatarTalking } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    const hasSeen = localStorage.getItem('hasSeenEliteOnboarding');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setActiveStep(0);
      }, 5000); // Trigger sooner than before for impact
      return () => clearTimeout(timer);
    }
  }, []);

  const currentStep = ONBOARDING_STEPS[activeStep];

  // Logic to handle speech when step changes
  useEffect(() => {
    if (activeStep >= 0 && activeStep < ONBOARDING_STEPS.length) {
      const step = ONBOARDING_STEPS[activeStep];
      
      const speakAndStop = async () => {
        stopAudio();
        setAvatarTalking(true);
        try {
          const audio = await generateSpeech(step.content, 'Aoede');
          if (audio) await playRawAudio(audio);
        } catch (e) {
          console.error("Onboarding Speech Error:", e);
        } finally {
          setAvatarTalking(false);
        }
      }
      speakAndStop();

      // Position tooltip if it's a tooltip scene
      if (step.scene === 'tooltip' && step.target) {
        const el = document.querySelector(step.target);
        if (el) {
          const rect = el.getBoundingClientRect();
          setTooltipPos({
            top: rect.bottom + 20,
            left: rect.left + (rect.width / 2)
          });
        }
      }
    }
  }, [activeStep, setAvatarTalking]);

  const handleNext = () => {
    if (activeStep < ONBOARDING_STEPS.length - 1) {
      setActiveStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setActiveStep(-1);
    stopAudio();
    localStorage.setItem('hasSeenEliteOnboarding', 'true');
  };

  if (!isVisible || activeStep === -1) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Background Dimming for Tooltip Scenes */}
      <AnimatePresence>
        {currentStep?.scene === 'tooltip' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
            onClick={handleComplete}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {currentStep?.scene === 'cinematic' ? (
          <motion.div
            key="cinematic"
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            className="absolute inset-0 flex items-center justify-center p-6 bg-black/90 pointer-events-auto"
          >
            <div className="max-w-3xl w-full text-center space-y-8">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 mx-auto bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/20"
              >
                {currentStep.icon}
              </motion.div>
              
              <div className="space-y-4">
                <h1 className="text-6xl font-black tracking-tighter text-white leading-none italic uppercase">
                  {currentStep.title}
                </h1>
                <p className="text-2xl text-gray-400 font-light leading-relaxed max-w-xl mx-auto">
                  {currentStep.content}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="group relative px-12 py-5 bg-white text-black font-bold text-xl uppercase tracking-widest rounded-full overflow-hidden transition-all hover:bg-cyan-400"
              >
                <span className="relative z-10 flex items-center gap-3">
                  INITIATE SEQUENCE <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </span>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`tooltip-${activeStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              top: tooltipPos.top,
              left: tooltipPos.left,
              translateX: '-50%'
            }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute z-[10001] w-[400px] pointer-events-auto"
            style={{ 
              top: tooltipPos.top, 
              left: tooltipPos.left,
              transform: 'translateX(-50%)'
            }}
          >
            <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-cyan-500/10">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  {currentStep.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-bold text-cyan-400 tracking-widest uppercase mb-1">
                    System Asset 0{activeStep + 1}
                  </h3>
                  <h2 className="text-xl font-bold text-white tracking-tight leading-tight">
                    {currentStep.title}
                  </h2>
                </div>
                <button 
                  onClick={handleComplete}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              
              <p className="text-gray-300 text-lg leading-relaxed mb-6 font-light">
                {currentStep.content}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  {ONBOARDING_STEPS.map((_, idx) => (
                    <div 
                      key={idx}
                      className={`h-1 rounded-full transition-all duration-500 ${
                        idx === activeStep ? 'w-8 bg-cyan-400' : 'w-2 bg-white/20'
                      }`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold uppercase text-xs tracking-widest hover:bg-cyan-400 transition-colors"
                >
                  {activeStep === ONBOARDING_STEPS.length - 1 ? 'FINALIZE' : 'CONTINUE'}
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
            
            {/* Tooltip Arrow */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-zinc-900 border-l border-t border-white/10 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
