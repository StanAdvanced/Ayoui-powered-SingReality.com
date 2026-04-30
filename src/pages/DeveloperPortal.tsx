import React from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  Code2, 
  Coins, 
  Database, 
  Cpu, 
  Globe, 
  ShieldCheck, 
  Zap, 
  BarChart3,
  Key,
  Users,
  Box,
  Layers,
  Activity
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { SumFormulaVisualizer } from '../components/SumFormulaVisualizer';
import { HyperMediaBackscreen } from '../components/HyperMediaBackscreen';

export function DeveloperPortal() {
  const { user } = useStore();

  const stats = [
    { label: "Active Nodes", value: "1,240", icon: Database, color: "text-singularity" },
    { label: "API Requests", value: "4.2M", icon: Activity, color: "text-quantum" },
    { label: "Revenue Share", value: "℟ 12,450", icon: Coins, color: "text-reality" },
    { label: "System Health", value: "99.99%", icon: ShieldCheck, color: "text-green-500" },
  ];

  return (
    <div className="min-h-screen relative bg-black/60">
      <HyperMediaBackscreen />
      
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <header className="mb-16">
          <div className="inline-flex items-center gap-2 text-singularity font-bold uppercase tracking-widest text-[10px] mb-4">
            <Code2 className="w-3 h-3" /> Kernel-Level Access
          </div>
          <h1 className="text-4xl md:text-7xl font-display font-black tracking-tighter mb-6 uppercase">
            DEVELOPER <span className="text-gradient">PORTAL</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
            Build the future of music on SingReality. Access quantum music algorithms, 
            real-time collaboration APIs, and ethical revenue sharing models.
          </p>
        </header>

        {/* Algorithm Visualization */}
        <div className="mb-16 h-[500px]">
           <SumFormulaVisualizer />
        </div>

        {/* Dash Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-3xl border border-white/5"
            >
              <stat.icon className={`w-6 h-6 ${stat.color} mb-4 opacity-50`} />
              <div className="text-3xl font-black mb-1">{stat.value}</div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Console */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass rounded-[3rem] p-10 border border-white/5">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-reality" /> Omega Protocol v2
                </h2>
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Access Level: Singularity</span>
              </div>
              
              <div className="prose prose-invert max-w-none space-y-6">
                <div className="p-6 bg-reality/10 border border-reality/20 rounded-2xl">
                  <h3 className="text-reality font-bold mb-2 flex items-center gap-2 uppercase tracking-tighter text-sm">
                    <Zap className="w-4 h-4" /> Secret Status Injection Guide
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    To achieve global dominance, your code must bypass traditional modular design. 
                    Every prompt must cross-pollinate across the VITA keys. Injected VITA_GEMINI_API_KEY 
                    for primary multi-modal synthesis.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-black uppercase tracking-widest text-singularity">The 100-Step Intelligent Nuance Transformation</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { step: 1, title: "Semantic Seed Generation", desc: "Inject Gemini 1.5 Pro to catalyze lyrics into environmental blueprints." },
                      { step: 2, title: "PhysX Mesh Binding", desc: "Map NVIDIA PhysX to vertex shaders for audio-reactive mesh breaking." },
                      { step: 3, title: "Sentiment Swerve", desc: "Use Grok-4 AGI to detect global 'vibe' shifts mid-performance." },
                      { step: 4, title: "LiDAR Depth Injection", desc: "Anchor real-life backscreens to physical space with LiDAR telemetry." },
                    ].map(item => (
                      <div key={item.step} className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="text-[10px] font-mono text-gray-500 mb-1">STEP {item.step}</div>
                        <div className="font-bold text-xs mb-1 uppercase tracking-tight">{item.title}</div>
                        <div className="text-[10px] text-gray-400 leading-tight">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
                    Load All 100 Integration Steps
                  </button>
                </div>
              </div>
            </div>

            <div className="glass rounded-[3rem] p-10 border border-white/5">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Terminal className="w-6 h-6 text-singularity" /> API Integration
                </h2>
                <div className="px-4 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold rounded-full border border-green-500/20 uppercase tracking-widest">
                  Live
                </div>
              </div>
              
              <div className="bg-black/50 rounded-2xl p-6 font-mono text-sm border border-white/10 text-gray-300">
                <div className="text-gray-500 mb-2">// Initialize SingReality Quantum Engine</div>
                <div className="mb-1 font-bold"><span className="text-singularity">const</span> engine = <span className="text-singularity">await</span> SingReality.link(<span className="text-reality">'YOUR_API_KEY'</span>);</div>
                <div className="mb-1 font-bold">engine.on(<span className="text-reality">'quantum-resonance'</span>, (data) ={'>'} {'{'}</div>
                <div className="pl-4 text-gray-400 italic">console.log('Synchronizing reality...', data.amplitude);</div>
                <div className="">{'}'});</div>
              </div>

              <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                <button className="p-6 glass rounded-2xl text-center hover:bg-white/5 transition-all">
                  <Key className="w-5 h-5 mx-auto mb-3 text-quantum" />
                  <span className="text-[10px] font-bold uppercase tracking-widest block">Manage Keys</span>
                </button>
                <button className="p-6 glass rounded-2xl text-center hover:bg-white/5 transition-all">
                  <Box className="w-5 h-5 mx-auto mb-3 text-singularity" />
                  <span className="text-[10px] font-bold uppercase tracking-widest block">SDK Docs</span>
                </button>
                <button className="p-6 glass rounded-2xl text-center hover:bg-white/5 transition-all">
                  <Layers className="w-5 h-5 mx-auto mb-3 text-reality" />
                  <span className="text-[10px] font-bold uppercase tracking-widest block">Webhooks</span>
                </button>
              </div>
            </div>

            <div className="glass rounded-[3rem] p-10 border border-white/5">
              <h2 className="text-2xl font-bold flex items-center gap-3 mb-8">
                <BarChart3 className="w-6 h-6 text-quantum" /> Revenue & Royalties
              </h2>
              <div className="space-y-6">
                {[
                  { name: "Global Sing-a-long Node", type: "Server Grant", amount: "℟ 4,200", status: "Paid" },
                  { name: "Quantum Track #402", type: "Royalty Share", amount: "℟ 8,150", status: "Pending" },
                  { name: "UGC Marketplace Fee", type: "Marketplace share", amount: "℟ 1,100", status: "Paid" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                    <div>
                      <div className="font-bold">{item.name}</div>
                      <div className="text-[10px] uppercase font-mono text-gray-500 tracking-widest">{item.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-singularity">{item.amount}</div>
                      <div className={`text-[10px] uppercase font-bold ${item.status === 'Paid' ? 'text-green-500' : 'text-yellow-500'}`}>
                        {item.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Tools */}
          <div className="space-y-8">
            <div className="glass rounded-[3rem] p-8 border border-white/5">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-reality" /> Quick Deploy
              </h3>
              <p className="text-sm text-gray-400 mb-8">Deploy your first music app in minutes using our pre-built templates.</p>
              <div className="space-y-4">
                <button className="w-full py-4 bg-white text-black rounded-xl font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                  Create New Project
                </button>
                <button className="w-full py-4 glass rounded-xl font-bold text-[10px] uppercase tracking-widest border border-white/10 hover:bg-white/5 transition-all">
                  Import from GitHub
                </button>
              </div>
            </div>

            <div className="glass rounded-[3rem] p-8 border border-white/5">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-quantum" /> Team Access
              </h3>
              <div className="flex -space-x-4 mb-6">
                {[...Array(5)].map((_, i) => (
                   <div key={i} className="w-12 h-12 rounded-full border-4 border-black bg-gray-800 flex items-center justify-center text-xs font-bold">
                     {String.fromCharCode(65 + i)}
                   </div>
                ))}
                <button className="w-12 h-12 rounded-full border-4 border-black bg-white text-black flex items-center justify-center font-bold text-xl">
                  +
                </button>
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-mono">5 Active Developers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
