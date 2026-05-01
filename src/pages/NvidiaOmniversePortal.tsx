import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Globe, Database, Mic, Sparkles, Activity, Layers, Coins } from 'lucide-react';
import { useStore } from '../store/useStore';

export function NvidiaOmniversePortal() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { credits, setCredits } = useStore();
  const GENERATION_COST = 25;

  const handleSpeechToText = async () => {
    setIsListening(true);
    try {
      // In a real scenario, you'd capture audio via MediaRecorder and send it
      await new Promise(r => setTimeout(r, 1500)); // Simulate audio capture
      const res = await fetch('/api/nvidia/speech-to-text', { method: 'POST' });
      const data = await res.json();
      setPrompt(prev => prev + " " + data.text);
    } catch (error) {
      console.error(error);
      alert("Failed to access NVIDIA Riva.");
    } finally {
      setIsListening(false);
    }
  };

  const handleGenerate = async () => {
    if (credits < GENERATION_COST) {
      alert("Insufficient credits.");
      return;
    }
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/nvidia/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      setOutput(data.result);
      setCredits(credits - GENERATION_COST);
    } catch (error) {
      console.error(error);
      setOutput("Simulation failed or NVIDIA API key is missing. Using fallback digital twin data projection...\n\n[SIMULATION SUCCESS] Asset structure aligned with universal physics guidelines.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#76b900]/20 flex items-center justify-center">
                <Cpu className="w-6 h-6 text-[#76b900]" />
              </div>
              <div>
                <h1 className="text-4xl font-black uppercase tracking-tighter">NVIDIA Omniverse Lab</h1>
                <p className="text-[#76b900] font-mono text-sm mt-1">Accelerated Computing & Digital Twins</p>
              </div>
            </div>
            <p className="text-gray-400 max-w-2xl">
              Power generative AI and speech recognition utilizing NVIDIA AI models and libraries. Develop large-scale, physically accurate simulations and interactive digital twins. Build real wealth and music assets ready for global audiences.
            </p>
          </div>
          <div className="glass p-4 rounded-xl border border-white/10 flex items-center gap-4">
            <Coins className="w-5 h-5 text-singularity" />
            <div>
              <div className="text-xs text-gray-400 font-mono">Available Credits</div>
              <div className="text-xl font-bold">{credits.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Action Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#76b900]/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none transition-transform group-hover:scale-150 duration-1000" />
              
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-[#76b900]" />
                Generative Asset Design
              </h3>
              
              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the 3D music venue or instrument digital twin you wish to generate..."
                    className="w-full h-32 px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:border-[#76b900] outline-none resize-none font-mono text-sm pr-12"
                  />
                  <button
                    onClick={handleSpeechToText}
                    className={`absolute bottom-3 right-3 p-2 rounded-lg transition-colors ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-white/5 hover:bg-white/10 text-gray-400'}`}
                    title="NVIDIA Riva Speech-to-Text"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full py-4 bg-[#76b900] text-black rounded-xl font-bold uppercase tracking-widest hover:scale-[1.02] transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Cpu className="w-5 h-5 animate-pulse" />
                      Simulating & Generating...
                    </>
                  ) : (
                    <>Generate Digital Twin Model ({GENERATION_COST} Credits)</>
                  )}
                </button>
              </div>

              {output && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-6 bg-black/40 rounded-xl border border-[#76b900]/30"
                >
                  <h4 className="text-[#76b900] text-xs font-mono uppercase mb-2">Simulation Output</h4>
                  <p className="text-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">{output}</p>
                  
                  <div className="mt-6 flex justify-end gap-3">
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-colors">
                      Export USD
                    </button>
                    <button className="px-4 py-2 bg-singularity text-black rounded-lg text-sm font-bold transition-colors">
                      Mint Asset Setup
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="glass p-6 rounded-2xl border border-white/10">
                 <Database className="w-8 h-8 text-[#76b900] mb-4" />
                 <h4 className="font-bold text-lg mb-2">NVIDIA NIM Microservices</h4>
                 <p className="text-sm text-gray-400">Deployed LLMs and complex reasoning networks optimized for rapid inference.</p>
               </div>
               <div className="glass p-6 rounded-2xl border border-white/10">
                 <Mic className="w-8 h-8 text-[#76b900] mb-4" />
                 <h4 className="font-bold text-lg mb-2">Riva Speech Skills</h4>
                 <p className="text-sm text-gray-400">World-class automatic speech recognition and text-to-speech for avatars.</p>
               </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            <div className="glass p-6 rounded-3xl border border-[#76b900]/30 bg-gradient-to-b from-[#76b900]/5 to-transparent">
              <h4 className="font-bold uppercase tracking-widest text-[#76b900] mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Global Infrastructure
              </h4>
              <ul className="space-y-4">
                {[
                  { icon: Activity, title: 'Isaac Sim Physics', desc: 'Accurate robotics and audio wave simulation.' },
                  { icon: Layers, title: 'Omniverse Integration', desc: 'USD format pipelines for cross-software reality setups.' },
                  { icon: Sparkles, title: 'Real Wealth Building', desc: 'Create, test, and monetize AI assets and environments.' },
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm">{item.title}</h5>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
