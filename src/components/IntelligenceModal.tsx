import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Sparkles, Shield, Cpu, Zap, Activity, Globe, Disc, MessageSquare } from 'lucide-react';
import { ThoughtStep, ThoughtProcessUI } from './ThoughtProcessUI';

const AGENTS = [
  { id: 'orchestrator', name: 'Master Orchestrator', icon: Brain, color: 'text-singularity' },
  { id: 'creative', name: 'Neural Composer', icon: Disc, color: 'text-pink-500' },
  { id: 'sales', name: 'Elite Sales Strategist', icon: Zap, color: 'text-yellow-400' },
  { id: 'security', name: 'Quantum Ethics Guard', icon: Shield, color: 'text-blue-400' }
];

export function IntelligenceModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [thinkingSteps, setThinkingSteps] = useState<ThoughtStep[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const simulateIntelligenceCycle = async () => {
    setIsProcessing(true);
    setThinkingSteps([]);
    
    const cycles = [
      { 
        signature: "alpha_swarm_init_0x892", 
        summary: ["Initializing Swarm of God-Tier Agents", "Synchronizing Multi-Modal Stacks", "Bootstrapping 3D Gaussian Splatting Engine"]
      },
      {
        signature: "creative_synthesis_v9",
        summary: ["Neural Composer analyzing global music trends", "Synthesizing novel lore algorithms", "Optimizing for photorealistic human clone-level realism"]
      },
      {
        signature: "market_expansion_delta",
        summary: ["Sales Strategist identifies high-value creative assets", "Deploying convergent AI tech for global value monetization", "Persuading ethical scalability across all verticals"]
      }
    ];

    for (const cycle of cycles) {
      await new Promise(r => setTimeout(r, 1200));
      setThinkingSteps(prev => [...prev, cycle]);
    }
    
    setIsProcessing(false);
  };

  useEffect(() => {
    if (isOpen) {
      simulateIntelligenceCycle();
    }
  }, [isOpen]);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-24 left-6 z-50 flex items-center gap-3 px-4 py-2 glass-card rounded-full border border-white/10 hover:border-singularity/50 transition-all group"
      >
        <div className="relative">
          <Brain className="w-5 h-5 text-singularity group-hover:scale-110 transition-transform" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-singularity rounded-full animate-pulse" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-white/70 group-hover:text-singularity transition-colors">Intelligence Hub</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl glass-card rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_0_100px_rgba(208,255,0,0.1)] flex flex-col md:flex-row h-[70vh]"
            >
              {/* Sidebar - Agents */}
              <div className="w-full md:w-64 bg-white/5 border-r border-white/10 p-6 flex flex-col gap-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-singularity rounded-xl">
                    <Cpu className="w-5 h-5 text-black" />
                  </div>
                  <div className="leading-tight">
                    <h3 className="font-black text-xs uppercase tracking-tighter text-white">SingReality</h3>
                    <p className="text-[10px] text-singularity font-mono">Agent Swarm v1.0.4</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {AGENTS.map(agent => (
                    <div key={agent.id} className="flex items-center gap-3 group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors">
                      <agent.icon className={`w-4 h-4 ${agent.color}`} />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 group-hover:text-white">{agent.name}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-6 border-t border-white/5 text-[9px] text-white/30 font-mono italic">
                  Running multiple simulations... Ensuring end-to-end intelligent creations.
                </div>
              </div>

              {/* Main Feed */}
              <div className="flex-1 p-8 flex flex-col overflow-hidden relative">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
                >
                  <Disc className="w-5 h-5" />
                </button>

                <div className="mb-8">
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-2 leading-none flex items-center gap-3">
                    Reinvened Platform <Sparkles className="text-singularity w-6 h-6 animate-pulse" />
                  </h2>
                  <p className="text-white/40 text-xs font-mono">Orchestrated Multi-Modal Intelligence Stack</p>
                </div>

                <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar">
                  <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                    <p className="text-[11px] text-white/80 leading-relaxed font-mono">
                      Establishing neural connection to the 899th dimension. Converging millions of modal and model assets into a unified transformational architecture.
                    </p>
                  </div>

                  <ThoughtProcessUI steps={thinkingSteps} isThinking={isProcessing} />

                  {!isProcessing && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="grid grid-cols-2 gap-3"
                    >
                      <button className="p-4 bg-singularity text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform">
                        Execute Splat Optmization
                      </button>
                      <button className="p-4 bg-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10">
                        Launch Swarm Simulation
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Bottom StatsBar */}
                <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-widest text-white/30">Latency</span>
                      <span className="text-[10px] font-mono text-singularity truncate">0.0004ms</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-widest text-white/30">Compute</span>
                      <span className="text-[10px] font-mono text-singularity truncate">Maximum</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[9px] text-white/40 font-mono">
                    <Activity className="w-3 h-3 text-singularity animate-pulse" /> Live Uplink Active
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
