import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Heart, Search, Filter, Play, Zap, Hexagon, Fingerprint, Activity } from 'lucide-react';
import { YouTubeSearch } from './YouTubeSearch';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../store/useStore';
import * as Tone from 'tone';

const MARKETPLACE_ITEMS = [
  {
    id: 'm1',
    title: 'Neural Synthesizer Core V9',
    type: 'electronic',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80',
    description: 'Quantum-entangled audio generator with 9D spatial audio pathways.',
    creator: 'God-Tier Audio',
  },
  {
    id: 'm2',
    title: 'Holographic Pop Avatar',
    type: 'pop',
    price: 125000,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80',
    description: 'Fully rigged, biometrically linked pop star avatar with real-time lip sync.',
    creator: 'SingReality Labs',
  },
  {
    id: 'm3',
    title: 'Bio-Acoustic Hip-Hop Drum Kit',
    type: 'hip-hop',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80',
    description: 'Drums generated from human heartbeat algorithms and neuro-rhythms.',
    creator: 'BeatMind',
  },
  {
    id: 'm4',
    title: 'Crystalline Guitar Splat',
    type: 'rock',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80',
    description: 'A 3D Gaussian Splatting rendering of a distorted stratocaster.',
    creator: 'RockAI',
  },
  {
    id: 'm5',
    title: 'Symphonic AI Director',
    type: 'classical',
    price: 88000,
    image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&q=80',
    description: 'Autonomous multi-modal swarm agent that conducts entire virtual orchestras.',
    creator: 'Mozart Engine',
  },
  {
    id: 'm6',
    title: 'Liquid Jazz Saxophone',
    type: 'jazz',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&q=80',
    description: 'A structural tone-bend instrument reacting fluidly to physics environments.',
    creator: 'Fluid Acoustics',
  },
];

export function Marketplace() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart, setIsCartOpen, currency } = useStore();
  
  // Sound setup
  const synthRef = useRef<Tone.PolySynth | null>(null);
  
  useEffect(() => {
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: "fmsquare",
        modulationType: "sawtooth",
        modulationIndex: 3,
        harmonicity: 3.4
      },
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.1,
        release: 0.1
      }
    }).toDestination();
    
    // Add some reverb for the "corridor" sound
    const reverb = new Tone.Reverb(2).toDestination();
    synthRef.current.connect(reverb);
    
    return () => {
      synthRef.current?.dispose();
      reverb.dispose();
    };
  }, []);

  const playHoverSound = () => {
    if (Tone.context.state !== 'running') {
      Tone.start();
    }
    synthRef.current?.triggerAttackRelease("C5", "16n", undefined, 0.1);
  };

  const playClickSound = () => {
    if (Tone.context.state !== 'running') {
      Tone.start();
    }
    synthRef.current?.triggerAttackRelease(["C4", "E4", "G4", "C5"], "8n", undefined, 0.3);
  };

  const handleAddToCart = (item: any) => {
    playClickSound();
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
    });
    setIsCartOpen(true);
  };

  const filteredItems = MARKETPLACE_ITEMS.filter(item => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black text-white p-8 overflow-x-hidden relative">
      {/* Background Ambience Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-singularity/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-[#00f2fe]/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-singularity text-sm font-mono uppercase tracking-widest">
              <Activity className="w-4 h-4" /> Structural Convergence
            </div>
            <h1 className="text-5xl md:text-7xl font-black font-display tracking-tighter">
              ASSET <span className="text-transparent bg-clip-text bg-gradient-to-r from-singularity to-[#00f2fe]">NEXUS</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl font-light">
              Acquire hyper-dimensional 3D models, AI instruments, and God-tier sound pathways.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full md:w-96"
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-500" />
            </div>
            <input 
              type="text" 
              placeholder="Query neural network..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-singularity/50 transition-colors placeholder:text-gray-600 font-mono"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <Fingerprint className="w-5 h-5 text-singularity/50" />
            </div>
          </motion.div>
        </header>
        
        <div className="mb-12">
          <YouTubeSearch />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center gap-3 mb-10 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10"
        >
          <Filter className="w-5 h-5 text-gray-400 ml-2 mr-3" />
          {[
            { id: 'all', label: 'All Assets' },
            { id: 'electronic', label: 'Electronic' },
            { id: 'pop', label: 'Pop' },
            { id: 'hip-hop', label: 'Hip-Hop' },
            { id: 'rock', label: 'Rock' },
            { id: 'classical', label: 'Classical' },
            { id: 'jazz', label: 'Jazz' }
          ].map((cat) => (
            <button 
              key={cat.id}
              onClick={() => {
                setFilter(cat.id);
                playHoverSound();
              }} 
              onMouseEnter={playHoverSound}
              className={`px-5 py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                filter === cat.id 
                  ? 'bg-singularity text-black shadow-[0_0_20px_rgba(208,255,0,0.3)]' 
                  : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode='popLayout'>
            {filteredItems.map((item, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ delay: index * 0.05, type: 'spring', damping: 20 }}
                key={item.id}
                onMouseEnter={playHoverSound}
                className="group relative rounded-3xl bg-white/5 border border-white/10 overflow-hidden hover:border-singularity/50 transition-all duration-500"
              >
                {/* Image Section */}
                <div className="relative aspect-square overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700 blur-sm group-hover:blur-none"
                  />
                  <div className="absolute top-4 left-4 z-20 flex gap-2">
                    <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs font-mono text-singularity uppercase font-bold border border-white/10">
                      {item.type}
                    </span>
                  </div>
                  <button className="absolute top-4 right-4 z-20 p-2 bg-black/50 backdrop-blur-md text-gray-400 hover:text-red-400 rounded-full border border-white/10 transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>

                {/* Content Section */}
                <div className="p-6 relative z-20 -mt-16 bg-gradient-to-b from-transparent to-black">
                  <h3 className="text-2xl font-bold font-display mb-2 group-hover:text-singularity transition-colors">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2 min-h-[40px]">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-singularity to-blue-500 flex items-center justify-center">
                      <Hexagon className="w-3 h-3 text-black" fill="currentColor" />
                    </div>
                    <span className="text-xs font-mono text-gray-500">By {item.creator}</span>
                  </div>

                  <div className="flex items-end justify-between mt-auto">
                    <div>
                      <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Acquisition Core</p>
                      <p className="text-3xl font-bold font-mono tracking-tighter">
                        {currency}{item.price.toLocaleString()}
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-singularity hover:text-black flex items-center justify-center transition-all duration-300 group/btn overflow-hidden relative"
                    >
                      <div className="absolute inset-0 bg-singularity translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                      <ShoppingCart className="w-5 h-5 relative z-10" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <Zap className="w-16 h-16 mx-auto text-gray-600 mb-6 opacity-30" />
            <h3 className="text-2xl font-mono text-gray-400">No signals found in this quadrant.</h3>
            <p className="text-gray-600 mt-2 font-mono text-sm">Adjust your semantic filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
