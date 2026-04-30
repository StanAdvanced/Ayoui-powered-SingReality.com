import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ShieldCheck, Zap, Globe, Cpu } from 'lucide-react';

interface BootSequenceProps {
  progress: number;
}

export function BootSequence({ progress }: BootSequenceProps) {
  const [status, setStatus] = useState('Initializing Core...');

  useEffect(() => {
    if (progress > 80) setStatus('System Converged.');
    else if (progress > 60) setStatus('Syncing Neural Clones...');
    else if (progress > 40) setStatus('Establishing Quantum Link...');
    else if (progress > 20) setStatus('Calibrating Biometrics...');
  }, [progress]);

  return (
    <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center p-8 bg-black/40 backdrop-blur-md pointer-events-none">
      <div className="max-w-md w-full space-y-6">
        <div className="flex justify-between items-end mb-2">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-singularity uppercase tracking-[0.4em] opacity-50">
              SingReality OS v4.2.0
            </span>
            <h2 className="text-xl font-bold text-white tracking-widest uppercase italic">
              {status}
            </h2>
          </div>
          <span className="text-2xl font-black font-mono text-singularity italic">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
          <motion.div 
            className="h-full bg-gradient-to-r from-cyan-500 via-singularity to-purple-600 shadow-[0_0_20px_rgba(0,184,212,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          />
        </div>

        <div className="grid grid-cols-4 gap-4 pt-8">
          {[
            { icon: <Cpu size={16} />, label: 'Neural', active: progress > 20 },
            { icon: <Globe size={16} />, label: 'Quantum', active: progress > 40 },
            { icon: <ShieldCheck size={16} />, label: 'Secure', active: progress > 60 },
            { icon: <Zap size={16} />, label: 'Hyper', active: progress > 80 },
          ].map((item, i) => (
            <div key={i} className={`flex flex-col items-center gap-2 transition-all duration-500 ${item.active ? 'text-singularity opacity-100' : 'text-white/20 opacity-40'}`}>
              <div className={`p-3 rounded-xl border transition-all duration-500 ${item.active ? 'bg-singularity/10 border-singularity/50 scale-110' : 'bg-white/5 border-white/5'}`}>
                {item.icon}
              </div>
              <span className="text-[8px] font-mono uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="pt-12 flex justify-center">
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-singularity animate-pulse" />
            <span className="text-[8px] font-mono text-white/40 uppercase tracking-[0.3em]">Hardware Acceleration Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
