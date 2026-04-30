import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Globe2, Zap, Languages, Check, Server } from 'lucide-react';

export function GlobalAudioSync() {
  const [syncedNodes, setSyncedNodes] = useState(0);
  const [status, setStatus] = useState<'idle' | 'linking' | 'synced'>('idle');
  const [activeLanguage, setActiveLanguage] = useState('English');

  const LANGUAGES = ['English', 'Spanish', 'French', 'Japanese', 'Mandarin', 'German', 'Global Swahili'];

  useEffect(() => {
    if (status === 'linking') {
      const interval = setInterval(() => {
        setSyncedNodes(prev => {
          if (prev >= 1240) {
            setStatus('synced');
            return 1240;
          }
          return prev + Math.floor(Math.random() * 50) + 10;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [status]);

  return (
    <div className="glass p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Server className="w-20 h-20 text-singularity" />
      </div>

      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl border ${status === 'synced' ? 'bg-singularity/10 border-singularity' : 'bg-white/5 border-white/10'}`}>
                 <Radio className={`w-4 h-4 ${status === 'synced' ? 'text-singularity' : 'text-gray-400'}`} />
              </div>
              <div>
                 <h4 className="text-xs font-bold text-white uppercase tracking-widest">Global Sync Engine</h4>
                 <p className="text-[9px] text-gray-500 font-mono uppercase tracking-widest leading-none mt-1">Real-time Node Distribution</p>
              </div>
           </div>
           
           <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-singularity">
                 {syncedNodes.toLocaleString()} NODES
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-singularity animate-pulse" />
           </div>
        </div>

        <div className="flex gap-2">
          {status === 'idle' ? (
            <button 
              onClick={() => setStatus('linking')}
              className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-[10px] font-bold uppercase tracking-[0.2em] text-white"
            >
              Initialize Global Mesh
            </button>
          ) : (
            <div className="flex-1 h-10 bg-white/5 rounded-xl border border-white/10 overflow-hidden relative">
               <motion.div 
                 className="h-full bg-singularity/20"
                 initial={{ width: 0 }}
                 animate={{ width: `${(syncedNodes / 1240) * 100}%` }}
               />
               <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black uppercase tracking-widest text-singularity/50">
                  {status === 'linking' ? 'Orchestrating Sub-Nodes...' : 'Hyper-Sync Active'}
               </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-white/5 pt-4">
           <div className="flex items-center gap-2">
              <Languages className="w-3 h-3 text-quantum" />
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Auto-Translate:</span>
           </div>
           <div className="flex flex-1 gap-1 overflow-x-auto no-scrollbar">
              {LANGUAGES.map(lang => (
                <button
                  key={lang}
                  onClick={() => setActiveLanguage(lang)}
                  className={`px-3 py-1.5 rounded-lg text-[8px] font-bold uppercase tracking-tighter transition-all whitespace-nowrap ${activeLanguage === lang ? 'bg-quantum text-white' : 'bg-white/5 text-gray-500 hover:text-gray-300'}`}
                >
                  {lang}
                </button>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
