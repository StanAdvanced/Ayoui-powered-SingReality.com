import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { AudioLines, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function VoiceSelector() {
  const { narrationVoice, setNarrationVoice } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const voices = [
    { id: 'Puck', label: 'Puck', desc: 'Default Quantum Voice' },
    { id: 'Aoede', label: 'Aoede', desc: 'Bright & Energetic' },
    { id: 'alloy', label: 'Alloy', desc: 'Neutral & Versatile' },
    { id: 'nova', label: 'Nova', desc: 'Bright (Mapped to Aoede)' },
    { id: 'shimmer', label: 'Shimmer', desc: 'Clear' },
    { id: 'echo', label: 'Echo', desc: 'Warm' },
    { id: 'fable', label: 'Fable', desc: 'Storyteller' },
    { id: 'onyx', label: 'Onyx', desc: 'Deep' },
  ];

  const currentVoice = voices.find(v => v.id === narrationVoice) || voices[0];

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <AudioLines className="w-24 h-24 text-singularity" />
      </div>
      
      <div className="relative z-10 flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2 tracking-widest uppercase mb-1">
            <AudioLines className="w-4 h-4 text-quantum" /> AI Avatar Voice
          </h3>
          <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">
            Configure neural vocal synthesis
          </p>
        </div>

        <div className="relative">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left focus:ring-2 focus:ring-singularity/50 outline-none"
          >
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white uppercase tracking-wider">{currentVoice.label}</span>
              <span className="text-[10px] text-gray-400 font-mono uppercase truncate">{currentVoice.desc}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full left-0 right-0 mt-2 z-50 glass-card p-2 rounded-xl border border-white/10 shadow-2xl max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10"
              >
                {voices.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setNarrationVoice(v.id as any);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all text-left mb-1 last:mb-0 ${
                      narrationVoice === v.id 
                        ? 'bg-singularity/20 text-white' 
                        : 'hover:bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-bold uppercase tracking-wider">{v.label}</span>
                      <span className="text-[9px] font-mono opacity-60 uppercase">{v.desc}</span>
                    </div>
                    {narrationVoice === v.id && (
                      <Check className="w-4 h-4 text-singularity" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {narrationVoice && (
          <div className="flex items-center gap-2 px-2">
            <div className="flex gap-1 h-3 items-center">
              {[...Array(5)].map((_, i) => (
                <motion.div 
                  key={i} 
                  className="w-1 bg-singularity rounded-full" 
                  animate={{ 
                    height: [4, 12, 6, 10, 4],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
            <span className="text-[10px] text-singularity/70 font-mono uppercase tracking-tighter">
              Neural Link Optimized
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
