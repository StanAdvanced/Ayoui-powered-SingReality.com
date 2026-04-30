import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Activity, Sliders, Play, Share2, Save, Wand2 } from 'lucide-react';
import { QuantumMusicEngine } from '../services/quantumMusicEngine';
import { HyperMediaBackscreen } from '../components/HyperMediaBackscreen';
import { SpatialCard } from '../components/SpatialCard';
import { QuantumVisualizer } from '../components/QuantumVisualizer';

const algorithms: { id: any; name: string; description: string }[] = [
  { id: 'QUANTUM_SYMPHONY', name: 'Quantum Symphony', description: 'Probability-based superposition of notes across the cosmic frequency.' },
  { id: 'NEURAL_HARMONICS', name: 'Neural Harmonics', description: 'Mimics neural firing patterns to create organic, biological melodies.' },
  { id: 'FRACTAL_RECURSION', name: 'Fractal Recursion', description: 'Infinite melodic loops that reveal detail as you listen deeper.' },
  { id: 'FIBONACCI_CADENCE', name: 'Fibonacci Cadence', description: 'Uses the Golden Ratio to structure timing and harmony.' },
  { id: 'STOCHASTIC_EVOLUTION', name: 'Stochastic Evolution', description: 'Randomized mutations that evolve into cohesive musical organisms.' },
  { id: 'MARKOV_MELODY', name: 'Markov Melody', description: 'State-based transitions derived from classical music theoretical models.' },
  { id: 'CHAOS_ORCHESTRATION', name: 'Chaos Orchestration', description: 'Butterfly-effect dynamics where small input shifts create grand variations.' },
  { id: 'NANO_PARTICLE_PERCUSSION', name: 'Nano Percussion', description: 'Granular synthesis of sub-atomic rhythmic structures.' },
  { id: 'ENTROPIC_ARPEGGIO', name: 'Entropic Arpeggio', description: 'Decaying structures that find beauty in musical dissolution.' },
  { id: 'SUPERPOSITION_STRUCTURE', name: 'Superposition', description: 'Multiple conflicting harmonies that collapse into perfect chords.' },
];

export function QuantumLab() {
  const [selectedAlgo, setSelectedAlgo] = useState(algorithms[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const engine = QuantumMusicEngine.getInstance();

  const handleGenerate = async () => {
    setIsGenerating(true);
    const notes = engine.generate(selectedAlgo.id);
    await engine.play(notes);
    setTimeout(() => setIsGenerating(false), 4000);
  };

  return (
    <div className="min-h-screen relative bg-black">
      <HyperMediaBackscreen />
      
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-quantum font-bold uppercase tracking-widest text-[10px] mb-4">
            <Cpu className="w-3 h-3" /> Genomical Generator
          </div>
          <h1 className="text-5xl md:text-8xl font-display font-black tracking-tighter mb-6 uppercase italic">
            QUANTUM <span className="text-gradient">LAB</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Experiment with 20 world-leading generative music algorithms. Fusing quantum mechanics with neuro-aesthetic harmonics.
          </p>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Algorithm Selector */}
          <div className="lg:col-span-4 space-y-4">
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest px-4">Selected Algorithm</div>
            <div className="space-y-2 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
              {algorithms.map((algo) => (
                <button
                  key={algo.id}
                  onClick={() => setSelectedAlgo(algo)}
                  className={`w-full text-left p-6 rounded-3xl transition-all border ${
                    selectedAlgo.id === algo.id 
                      ? 'bg-white/10 border-white/20' 
                      : 'bg-white/5 border-transparent hover:bg-white/10'
                  }`}
                >
                  <div className="font-bold mb-1">{algo.name}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">{algo.id.replace(/_/g, ' ')}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Visualizer & Controls */}
          <div className="lg:col-span-8 space-y-8">
            <SpatialCard glowColor={isGenerating ? "#ff00ff" : "#00f0ff"} className="rounded-[3rem] border border-white/5 relative h-[450px] flex flex-col justify-end overflow-hidden">
              {/* Particle System Projection */}
              <div className="absolute inset-0 z-0">
                <QuantumVisualizer isGenerating={isGenerating} />
              </div>

              <div className="absolute inset-0 flex items-center justify-center gap-[2px] px-12 z-5 pointer-events-none">
                {[...Array(64)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-gradient-to-t from-singularity to-quantum h-2 rounded-full"
                    animate={isGenerating ? {
                      height: [
                        8, 
                        Math.random() * 250 + 40, 
                        Math.random() * 100 + 10,
                        8
                      ],
                      opacity: [0.1, 1, 0.5, 0.1]
                    } : { height: 8, opacity: 0.1 }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.02,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>

              <div className="relative z-20 p-12 bg-gradient-to-t from-black via-black/50 to-transparent">
                <h3 className="text-3xl font-black mb-2">{selectedAlgo.name}</h3>
                <p className="text-gray-400 max-w-lg mb-8">{selectedAlgo.description}</p>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="px-10 py-5 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-tighter flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50"
                  >
                    {isGenerating ? <Activity className="w-5 h-5 animate-pulse" /> : <Play className="w-5 h-5 fill-current" />}
                    {isGenerating ? 'Resonating...' : 'Initiate Synthesis'}
                  </button>
                  <button className="p-5 glass rounded-2xl hover:bg-white/5 transition-all">
                    <Sliders className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </SpatialCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SpatialCard className="p-8 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-none">Parameters</div>
                  <Wand2 className="w-4 h-4 text-singularity" />
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-gray-400 uppercase tracking-widest font-mono">Quantum Flux</span>
                      <span className="font-bold">84%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-singularity w-[84%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-gray-400 uppercase tracking-widest font-mono">Harmonic Resonance</span>
                      <span className="font-bold">62%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-quantum w-[62%]" />
                    </div>
                  </div>
                </div>
              </SpatialCard>

              <SpatialCard className="p-8 border border-white/5 flex flex-col justify-center gap-4">
                <button className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all group">
                   <div className="flex items-center gap-3">
                     <Save className="w-4 h-4 text-gray-400 group-hover:text-white" />
                     <span className="text-xs font-bold uppercase tracking-widest">Store Projection</span>
                   </div>
                   <Zap className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all group">
                   <div className="flex items-center gap-3">
                     <Share2 className="w-4 h-4 text-gray-400 group-hover:text-white" />
                     <span className="text-xs font-bold uppercase tracking-widest">Broadcast Wave</span>
                   </div>
                   <Zap className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </SpatialCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
