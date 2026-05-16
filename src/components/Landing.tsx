import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mic2, Globe, Zap, Cpu, Layers, Music, Star, ArrowRight, Play } from 'lucide-react';
import { cn } from '../lib/utils';
import { playSpark } from '../lib/audioEngine';
import { useStore } from '../store/useStore';
import { Logo } from './Logo';
import { YouTubeBackground } from './YouTubeBackground';

export function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6"
    >
      <div className="flex items-center gap-2">
        <Logo size="md" />
        <div className="flex flex-col ml-2">
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[8px] font-mono text-green-500 uppercase tracking-widest">Live Convergence: 4.2B</span>
          </div>
        </div>
      </div>
      
      <div className="hidden md:flex items-center gap-8 glass px-8 py-3 rounded-full">
        {['The Singularity', 'Holographic', 'Marketplace', 'Convergence'].map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium hover:text-singularity transition-colors">
            {item}
          </a>
        ))}
      </div>

      <button className="bg-white text-black px-6 py-2 rounded-full text-sm font-bold hover:bg-singularity transition-all hover:scale-105">
        LAUNCH APP
      </button>
    </motion.nav>
  );
}

export function Hero() {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      <YouTubeBackground videoId="XpS_6-O9_3s" opacity={0.2} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="z-10"
      >
        <h1 className="text-6xl md:text-9xl font-display font-black tracking-tighter leading-none mb-6">
          SING<span className="text-gradient">REALITY</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 font-light leading-relaxed mb-10">
          The world's first quantum-optimized global sing-a-long platform. 
          Converging 6 billion voices in real-time holographic harmony.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <button className="group relative px-8 py-4 bg-singularity text-black font-bold rounded-full overflow-hidden transition-all hover:pr-12">
            START SINGING
            <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all" />
          </button>
          <button className="px-8 py-4 glass rounded-full font-bold hover:bg-white/10 transition-all">
            EXPLORE MARKETPLACE
          </button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500">Scroll to Converge</span>
        <div className="w-px h-12 bg-gradient-to-b from-gray-500 to-transparent" />
      </motion.div>
    </section>
  );
}

export function FeatureCard({ icon: Icon, title, description, delay = 0 }: { icon: any, title: string, description: string, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="glass p-8 rounded-3xl group hover:border-singularity/50 transition-all"
    >
      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-singularity group-hover:text-black transition-all">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-display font-bold mb-4">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

export function MarketplaceItem({ title, creator, price, image }: { title: string, creator: string, price: string | number, image: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const { currency } = useStore();

  const handlePlay = async () => {
    setIsPlaying(true);
    try {
      const synths: ('FM' | 'AM' | 'Poly' | 'Membrane')[] = ['FM', 'AM', 'Poly'];
      const randomSynth = synths[Math.floor(Math.random() * synths.length)];
      const randomTempo = Math.floor(Math.random() * 40) + 100;
      
      const notes = ['C4', 'E4', 'G4', 'B4', 'D5', 'F5', 'A5'];
      const recipeNotes = [];
      for (let i = 0; i < 8; i++) {
        recipeNotes.push({
          note: notes[Math.floor(Math.random() * notes.length)],
          duration: '8n',
          time: `0:0:${i * 2}`
        });
      }

      await playSpark({
        synthType: randomSynth,
        tempo: randomTempo,
        notes: recipeNotes
      });
      
      setTimeout(() => setIsPlaying(false), 2000);
    } catch (e) {
      console.error(e);
      setIsPlaying(false);
    }
  };

  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-square rounded-3xl overflow-hidden mb-4">
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 gap-2">
          <button className="w-full py-3 bg-white text-black font-bold rounded-xl text-sm hover:scale-105 transition-transform">MINT ASSET</button>
          <button 
            onClick={(e) => { e.stopPropagation(); handlePlay(); }}
            disabled={isPlaying}
            className="w-full py-3 bg-singularity text-black font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:scale-105 transition-transform disabled:opacity-50"
          >
            <Play className="w-4 h-4" /> {isPlaying ? 'PLAYING...' : 'PLAY SPARK'}
          </button>
        </div>
      </div>
      <h4 className="font-bold text-lg">{title}</h4>
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs text-gray-500 uppercase tracking-wider">{creator}</span>
        <span className="text-singularity font-mono font-bold">{price} {currency}</span>
      </div>
    </div>
  );
}
