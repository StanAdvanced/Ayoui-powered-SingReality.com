import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Volume2, Database, Share2, Youtube, Music, Radio, Zap } from 'lucide-react';
import { YouTubeBackground } from './YouTubeBackground';
import { djVerseService } from '../services/djVerseService';

const TRENDING_MIXES = [
  { id: 'XpS_6-O9_3s', title: 'Anyma - Live at Tomorrowland', bpm: 126 },
  { id: 'h7VpC3YhI0M', title: 'Tiesto - Ultra Miami 2024', bpm: 128 },
  { id: 'dQw4w9WgXcQ', title: 'DJ-VERSE Originals - Neural Resonance', bpm: 130 }
];

export function DJVerseLiveFeed() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isMixing, setIsMixing] = useState(false);
  const [djMessage, setDjMessage] = useState("");

  useEffect(() => {
    const interval = setInterval(async () => {
      const msg = await djVerseService.generateCommentary("Mixing live visuals");
      setDjMessage(msg);
      setIsMixing(true);
      setTimeout(() => setIsMixing(false), 3000);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const currentMix = TRENDING_MIXES[currentIdx];

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-[4rem] group border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
      {/* Background Stream */}
      <YouTubeBackground videoId={currentMix.id} opacity={0.4} />
      
      {/* Overlay UI */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-transparent to-black/40 p-12 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="px-6 py-2 bg-red-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 animate-pulse">
              <Radio className="w-4 h-4" /> Live Stream
            </div>
            <div className="px-6 py-2 glass rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
              43K Global Listeners
            </div>
          </div>
          
          <div className="flex gap-4">
             <button className="w-14 h-14 glass rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all border border-white/10">
               <Share2 className="w-6 h-6" />
             </button>
             <button className="w-14 h-14 glass rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all border border-white/10">
               <Database className="w-6 h-6" />
             </button>
          </div>
        </div>

        <div className="max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div 
               key={djMessage}
               initial={{ opacity: 0, scale: 0.9, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 1.1, y: -30 }}
               className="bg-singularity/20 backdrop-blur-3xl border-l-8 border-singularity p-10 rounded-r-[3rem] mb-12 shadow-2xl relative overflow-hidden"
            >
               {/* Cyber Lines */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none">
                 <div className="absolute top-0 right-0 w-1 h-full bg-singularity group-hover:h-full transition-all duration-700" />
                 <div className="absolute top-0 right-0 w-full h-1 bg-singularity group-hover:w-full transition-all duration-700" />
              </div>

              <div className="text-quantum font-black text-xs uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                 <Zap className="w-4 h-4" /> DJ-VERSE AI VOCAL
              </div>
              <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white leading-tight uppercase">
                "{djMessage || "PREPARING NEXT FREQUENCY DROP..."}"
              </h2>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-end gap-12">
            <div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Now Mixing</p>
              <h3 className="text-5xl md:text-6xl font-black tracking-tighter text-white uppercase group-hover:text-singularity transition-colors">
                {currentMix.title}
              </h3>
            </div>
            
            <div className="flex gap-4 pb-2">
              <div className="text-center">
                <div className="text-2xl font-black text-quantum mb-1">{currentMix.bpm}</div>
                <div className="text-[8px] text-white/40 font-black uppercase tracking-[0.2em]">BPM</div>
              </div>
              <div className="w-[1px] h-10 bg-white/10 mx-2" />
              <div className="text-center">
                <div className="text-2xl font-black text-reality mb-1">8K</div>
                <div className="text-[8px] text-white/40 font-black uppercase tracking-[0.2em]">RES</div>
              </div>
            </div>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="absolute bottom-12 right-12 flex items-center gap-6">
           <div className="flex flex-col items-end gap-2 pr-6 border-r border-white/10">
             <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/40">Neural Audio Sync</p>
             <div className="flex gap-1 h-8">
               {[...Array(12)].map((_, i) => (
                 <motion.div
                   key={i}
                   animate={{ height: isMixing ? [4, 24, 4] : [4, 12, 4] }}
                   transition={{ duration: 0.3, repeat: Infinity, delay: i * 0.05 }}
                   className="w-1 bg-singularity/60 rounded-full"
                 />
               ))}
             </div>
           </div>
           
           <button 
             onClick={() => setCurrentIdx((currentIdx + 1) % TRENDING_MIXES.length)}
             className="w-24 h-24 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_50px_rgba(255,255,255,0.4)]"
           >
              <Play className="w-10 h-10 fill-current ml-1" />
           </button>
        </div>

        {/* Floating Icons */}
        <div className="absolute top-1/2 left-12 -translate-y-1/2 flex flex-col gap-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
           <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center border border-white/10"><Youtube className="w-5 h-5 text-red-500" /></div>
           <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center border border-white/10"><Music className="w-5 h-5 text-singularity" /></div>
           <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center border border-white/10"><Zap className="w-5 h-5 text-quantum" /></div>
        </div>
      </div>
      
      {/* Visual Glitch Overlays */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] group-hover:opacity-10 transition-opacity">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-white animate-scanline" />
        <div className="absolute top-0 left-0 w-full h-full bg-noise opacity-5" />
      </div>
    </div>
  );
}
