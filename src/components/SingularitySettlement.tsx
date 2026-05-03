import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Layers, GitMerge, DollarSign, Loader2, Sparkles, Youtube, CheckCircle2, Zap } from 'lucide-react';

export function SingularitySettlement() {
  const [status, setStatus] = useState<'idle' | 'executing' | 'complete'>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  
  const executeSettlement = async () => {
    setStatus('executing');
    setLogs([]);
    
    const processes = [
        "Initializing Singularity Settlement Orchestrator...",
        "Querying YouTube Content ID for asset overlap...",
        "Found 3 derivative claims (Universal Music Group, Artist X, Producer Y).",
        "DeepSeek-R1 128k context calculating proportional royalty split...",
        "Split calculated: 30% UMG, 15% Artist X, 15% Producer Y, 40% Creator.",
        "Grok 4.20 Multi-Agent negotiating final split with UMG AI Agent...",
        "Agreement reached. Minting C2PA Content Credentials...",
        "Initiating Stripe Connect micropayment mesh...",
        "Google AdSense campaign bootstrapped with remaining collateral.",
        "Self-Representing Audio File (SRAF) compiled."
    ];

    for (let i = 0; i < processes.length; i++) {
        await new Promise(r => setTimeout(r, 800 + Math.random() * 1000));
        setLogs(prev => [...prev, processes[i]]);
    }

    setStatus('complete');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white pt-24 px-6 relative overflow-hidden font-inter">
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-singularity opacity-10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-2xl mb-4 border border-white/10">
               <GitMerge className="w-12 h-12 text-singularity" />
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tighter">
                Singularity <span className="text-transparent bg-clip-text bg-gradient-to-r from-singularity to-blue-500">Settlement</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                The ultimate economic orchestration. A single click triggers a cascade of AI agents negotiating rights, managing royalties, and distributing assets globally.
            </p>
        </div>

        <div className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-6">
                <h3 className="text-2xl font-bold font-heading">Asset <span className="text-singularity">C-X99</span></h3>
                <div className="p-4 bg-black/50 border border-white/5 rounded-xl space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Track:</span>
                        <span className="font-mono">Neon Dreams (AI Cover)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Revenue Pool:</span>
                        <span className="font-mono text-green-400">$12,450.00 USDC</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Status:</span>
                        <span className="font-mono text-yellow-400 uppercase tracking-widest">Pending Clearing</span>
                    </div>
                </div>
            </div>
            <div className="w-full md:w-auto">
                <button 
                  onClick={executeSettlement}
                  disabled={status !== 'idle'}
                  className="w-full md:w-64 h-64 rounded-full bg-gradient-to-br from-singularity to-blue-600 flex flex-col items-center justify-center gap-4 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_50px_rgba(108,60,225,0.4)]"
                >
                    {status === 'idle' && (
                        <>
                            <Sparkles className="w-12 h-12 text-white" />
                            <span className="font-bold text-xl uppercase tracking-widest">Execute Split</span>
                        </>
                    )}
                    {status === 'executing' && (
                        <>
                            <Loader2 className="w-12 h-12 text-white animate-spin" />
                            <span className="font-bold text-sm uppercase tracking-widest">Orchestrating...</span>
                        </>
                    )}
                    {status === 'complete' && (
                        <>
                            <CheckCircle2 className="w-12 h-12 text-white" />
                            <span className="font-bold text-xl uppercase tracking-widest">Settled</span>
                        </>
                    )}
                </button>
            </div>
        </div>

        {/* Live Execution Logs */}
        {status !== 'idle' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 rounded-2xl border border-white/10 space-y-6">
                <h3 className="font-heading font-semibold text-gray-300 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-singularity" /> Agent Execution Log
                </h3>
                
                <div className="space-y-4">
                    {logs.map((log, index) => (
                        <motion.div 
                            key={index} 
                            initial={{ opacity: 0, x: -10 }} 
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-start gap-4 p-4 bg-black/40 rounded-xl border border-white/5"
                        >
                            <div className="mt-1">
                                {log.includes("Stripe") ? <DollarSign className="w-4 h-4 text-green-400" /> :
                                 log.includes("YouTube") ? <Youtube className="w-4 h-4 text-red-500" /> :
                                 log.includes("DeepSeek") ? <Layers className="w-4 h-4 text-blue-400" /> :
                                 <Zap className="w-4 h-4 text-yellow-500" />}
                            </div>
                            <p className="font-mono text-sm text-gray-300 leading-relaxed">{log}</p>
                        </motion.div>
                    ))}
                    {status === 'executing' && (
                        <div className="flex gap-2 items-center p-4">
                            <div className="w-2 h-2 bg-singularity rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-singularity rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            <div className="w-2 h-2 bg-singularity rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                        </div>
                    )}
                </div>
            </motion.div>
        )}
      </div>
    </div>
  );
}
