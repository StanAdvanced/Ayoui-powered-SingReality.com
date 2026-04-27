import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bot, Layers, Zap, Search, Globe, Code, Box, Shield, Workflow, Eye, BrainCircuit } from 'lucide-react';

const AGENT_TEMPLATES = [
  { id: 'musician', name: 'Virtual Synthesist Agent', desc: 'Auto-generates multi-modal stems using SingReality SUMF formulas', icon: Box, color: 'text-pink-400' },
  { id: 'promoter', name: 'Global Outreach Agent', desc: 'Real-time multi-lingual promotion across X, Meta, and YouTube', icon: Globe, color: 'text-blue-400' },
  { id: 'manager', name: 'Royalty & Escrow Agent', desc: 'Quantum-secured smart contracts and split payments via Stripe/Crypto', icon: Shield, color: 'text-green-400' },
  { id: 'scout', name: 'A&R Talent Scout Agent', desc: 'Predictive analytics scanning the Mega Node Nexus for viral velocity', icon: Eye, color: 'text-singularity' },
];

export function AyouiAgentBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState(AGENT_TEMPLATES[0].id);
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => setIsDeploying(false), 3000);
  };

  return (
    <div className="glass-card rounded-[2rem] p-8 border border-white/10 relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-singularity/5 to-quantum/5 pointer-events-none" />
      <div className="absolute top-0 right-0 p-8 opacity-10 blur-xl pointer-events-none">
        <Bot className="w-64 h-64 text-singularity" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white mb-4">
              <img src="https://www.google.com/s2/favicons?domain=ayoui.com&sz=128" className="w-4 h-4 rounded" alt="Ayoui" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              <span className="text-[10px] font-bold tracking-widest uppercase">Powered by Ayoui.com</span>
            </div>
            
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white glow-text leading-tight flex items-center gap-3">
              <BrainCircuit className="w-8 h-8 text-quantum" />
              Agentic Symphony<br />Builder
            </h2>
            <p className="text-gray-400 font-mono text-xs mt-4 max-w-md">
              Build, deploy, and optimize production-ready agents faster. 
              Leverage multi-stacked modal intelligent pollinational transformer functions and real-time SUMF music algorithms.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {AGENT_TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                className={`flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-all ${
                  selectedTemplate === t.id 
                    ? 'border-singularity bg-singularity/10 shadow-[0_0_20px_rgba(0,255,255,0.2)]' 
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <t.icon className={`w-5 h-5 ${t.color}`} />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{t.name}</span>
                </div>
                <span className="text-[10px] text-gray-400 font-mono leading-relaxed">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <div className="flex-1 glass rounded-xl border border-white/10 p-6 flex flex-col">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Workflow className="w-4 h-4 text-quantum" />
              Deployment Matrix
            </h3>
            
            <div className="flex-1 space-y-4 font-mono text-[10px]">
              <div className="flex justify-between items-center text-gray-400 border-b border-white/5 pb-2">
                <span>Core Logic:</span> <span className="text-white">Ayoui Universal</span>
              </div>
              <div className="flex justify-between items-center text-gray-400 border-b border-white/5 pb-2">
                <span>LLM Integration:</span> <span className="text-blue-400">Grok + Gemini 1.5</span>
              </div>
              <div className="flex justify-between items-center text-gray-400 border-b border-white/5 pb-2">
                <span>Neural Audio:</span> <span className="text-pink-400">Suno / Udio API</span>
              </div>
              <div className="flex justify-between items-center text-gray-400 border-b border-white/5 pb-2">
                <span>SUMF Capacity:</span> <span className="text-singularity glow-text">Level 9 (MAX)</span>
              </div>
              
              {isDeploying && (
                <div className="mt-4 p-3 bg-black/50 rounded-lg text-singularity flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-singularity animate-ping" />
                  Orchestrating multi-modal mesh...
                </div>
              )}
            </div>

            <button 
              onClick={handleDeploy}
              disabled={isDeploying}
              className="mt-6 w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-singularity hover:text-white transition-all disabled:opacity-50"
            >
              {isDeploying ? 'Deploying Agent...' : 'Launch Agent Network'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
