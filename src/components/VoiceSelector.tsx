import React from 'react';
import { useStore } from '../store/useStore';
import { AudioLines } from 'lucide-react';

export function VoiceSelector() {
  const { narrationVoice, setNarrationVoice } = useStore();

  const voices = [
    { id: 'alloy', label: 'Alloy', desc: 'Neutral & Versatile' },
    { id: 'nova', label: 'Nova', desc: 'Bright & Energetic' },
    { id: 'shimmer', label: 'Shimmer', desc: 'Clear & Exciting' },
    { id: 'echo', label: 'Echo', desc: 'Calm & Warm' },
    { id: 'fable', label: 'Fable', desc: 'Storyteller & Expressive' },
    { id: 'onyx', label: 'Onyx', desc: 'Deep & Authoritative' },
    { id: 'Puck', label: 'Puck (Gemini)', desc: 'Default Quantum Voice' },
  ];

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <AudioLines className="w-24 h-24 text-singularity" />
      </div>
      
      <div className="relative z-10 flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2 tracking-widest uppercase mb-1">
            <AudioLines className="w-4 h-4 text-quantum" /> AI Avatar Voice
          </h3>
          <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">
            Configure the neural vocal synthesis engine
          </p>
        </div>

        <div className="grid gap-2">
          {voices.map((v) => (
            <label 
              key={v.id} 
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                narrationVoice === v.id 
                  ? 'border-singularity bg-singularity/10' 
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <input 
                  type="radio" 
                  name="voice" 
                  value={v.id} 
                  checked={narrationVoice === v.id}
                  onChange={() => setNarrationVoice(v.id as any)}
                  className="hidden"
                />
                <div className={`w-3 h-3 rounded-full border border-white/30 flex items-center justify-center ${narrationVoice === v.id ? 'border-singularity' : ''}`}>
                  {narrationVoice === v.id && <div className="w-1.5 h-1.5 rounded-full bg-singularity" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{v.label}</span>
                  <span className="text-[9px] text-gray-400 font-mono uppercase truncate">{v.desc}</span>
                </div>
              </div>
              
              {narrationVoice === v.id && (
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-1 bg-singularity rounded-full animate-pulse" 
                      style={{ height: `${Math.random() * 12 + 4}px`, animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              )}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
