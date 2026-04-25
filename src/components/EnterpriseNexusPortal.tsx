import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Network, Server, Key, Cpu, Zap, Activity, ShieldCheck, Binary, Globe2, FileJson, ArrowUpRight, Copy } from 'lucide-react';
import { useStore } from '../store/useStore';
import { InteractiveBackground } from './InteractiveBackground';

export function EnterpriseNexusPortal() {
  const { isEnterprisePortalOpen, setEnterprisePortalOpen } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'api-keys' | 'telemetry'>('overview');
  const [metrics, setMetrics] = useState({ requests: 4509123, nodes: 1432, latency: 1.2 });

  useEffect(() => {
    if(!isEnterprisePortalOpen) return;
    const interval = setInterval(() => {
      setMetrics(prev => ({
        requests: prev.requests + Math.floor(Math.random() * 100),
        nodes: prev.nodes + (Math.random() > 0.8 ? 1 : 0),
        latency: 1.0 + Math.random() * 0.5
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [isEnterprisePortalOpen]);

  if (!isEnterprisePortalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-3xl"
      >
        <InteractiveBackground />
        
        <div className="absolute inset-0 bg-gradient-to-tr from-singularity/5 to-transparent pointer-events-none" />

        <div className="w-full max-w-7xl h-[90vh] glass-card rounded-[2.5rem] border border-white/20 shadow-[0_0_100px_rgba(0,240,255,0.1)] flex flex-col overflow-hidden relative z-10 bg-black/50">
          
          {/* Header */}
          <div className="flex justify-between items-center px-10 py-8 border-b border-white/10 bg-black/40">
            <div className="flex flex-col">
              <div className="flex items-center gap-4">
                <Zap className="w-8 h-8 text-singularity" />
                <h1 className="text-3xl font-display font-black tracking-widest uppercase">
                  Nexus <span className="text-transparent bg-clip-text bg-gradient-to-r from-singularity to-quantum">Enterprise</span>
                </h1>
              </div>
              <p className="text-gray-400 font-mono text-sm mt-2 flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-green-500" /> API Gateway Secure Connection Established
              </p>
            </div>
            
            <button 
              onClick={() => setEnterprisePortalOpen(false)}
              className="p-4 glass rounded-full hover:bg-white/10 transition-colors group"
            >
              <X className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
            </button>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar menu */}
            <div className="w-64 border-r border-white/10 p-6 flex flex-col gap-2 bg-black/20">
              {[
                { id: 'overview', icon: Globe2, label: 'Global Overview' },
                { id: 'api-keys', icon: Key, label: 'API Keys & Auth' },
                { id: 'telemetry', icon: Activity, label: 'Live Telemetry' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${
                    activeTab === tab.id 
                    ? 'bg-singularity/20 text-singularity border border-singularity/30' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-10 overflow-y-auto no-scrollbar">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="glass p-8 rounded-3xl border border-singularity/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform"><Network className="w-16 h-16 text-singularity" /></div>
                        <div className="text-sm font-mono text-gray-400 mb-2 uppercase tracking-widest">Neural Requests</div>
                        <div className="text-4xl font-display font-black text-white">{metrics.requests.toLocaleString()}</div>
                      </div>
                      <div className="glass p-8 rounded-3xl border border-quantum/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform"><Server className="w-16 h-16 text-quantum" /></div>
                        <div className="text-sm font-mono text-gray-400 mb-2 uppercase tracking-widest">Active B2B Nodes</div>
                        <div className="text-4xl font-display font-black text-white">{metrics.nodes.toLocaleString()}</div>
                      </div>
                      <div className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform"><Activity className="w-16 h-16 text-green-500" /></div>
                         <div className="text-sm font-mono text-gray-400 mb-2 uppercase tracking-widest">Average Latency</div>
                         <div className="text-4xl font-display font-black text-white">{metrics.latency.toFixed(2)}ms</div>
                      </div>
                    </div>

                    <div className="glass p-8 rounded-3xl border border-white/10">
                      <h3 className="text-xl font-bold uppercase tracking-widest mb-6 flex items-center gap-3"><Binary className="w-6 h-6 text-singularity" /> Trillion-Dollar Stem SDK</h3>
                      <p className="text-gray-400 leading-relaxed mb-6">
                        Access raw multidimensional audiovisual buffers generated by SingReality models. Seamlessly integrate our Neural Stem Extraction and Global WebRTC routing into your proprietary hardware, game engines, or global media platforms.
                      </p>
                      
                      <div className="bg-black border border-white/10 p-6 rounded-2xl font-mono text-sm text-gray-300 relative">
                        <button className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"><FileJson className="w-4 h-4" /></button>
                        <span className="text-pink-500">import</span> {'{'} SingReality {'}'} <span className="text-pink-500">from</span> <span className="text-green-400">'@singreality/sdk'</span>;<br/><br/>
                        <span className="text-blue-400">const</span> nexus = <span className="text-pink-500">new</span> SingReality({'{'}<br/>
                        &nbsp;&nbsp;apiKey: process.env.SINGREALITY_B2B_KEY,<br/>
                        &nbsp;&nbsp;models: [<span className="text-green-400">'neural-stem-v3'</span>, <span className="text-green-400">'live-transcription-quantum'</span>]<br/>
                        {'}'});<br/><br/>
                        <span className="text-gray-500">// Connect to massive global synchronization</span><br/>
                        <span className="text-blue-400">await</span> nexus.connectGlobalConduit();
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'api-keys' && (
                  <motion.div
                    key="api-keys"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold uppercase tracking-widest flex items-center gap-3"><Key className="w-6 h-6 text-quantum" /> API Management</h3>
                      <button className="px-6 py-3 bg-singularity text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                        Generate Token
                      </button>
                    </div>

                    <div className="space-y-4">
                       <div className="glass p-6 rounded-2xl border border-white/10 flex justify-between items-center">
                          <div>
                            <div className="font-bold flex items-center gap-2 mb-1">Production Key <span className="px-2 py-0.5 rounded-md bg-green-500/20 text-green-500 text-[10px] uppercase">Active</span></div>
                            <div className="text-xs font-mono text-gray-500">Created: 24hrs ago • Last Used: Just now</div>
                          </div>
                          <div className="flex items-center gap-3 bg-black border border-white/10 px-4 py-2 rounded-xl text-sm font-mono">
                             <span className="opacity-50">sk_live_qR9</span>•••••••••••••••••••••
                             <button className="opacity-50 hover:opacity-100 hover:text-singularity transition-colors ml-4"><Copy className="w-4 h-4" /></button>
                          </div>
                       </div>
                       
                       <div className="glass p-6 rounded-2xl border border-white/10 flex justify-between items-center opacity-60">
                          <div>
                            <div className="font-bold flex items-center gap-2 mb-1">Test Sandbox Key <span className="px-2 py-0.5 rounded-md bg-white/10 text-gray-400 text-[10px] uppercase">Inactive</span></div>
                            <div className="text-xs font-mono text-gray-500">Created: 2 days ago • Never Used</div>
                          </div>
                          <div className="flex items-center gap-3 bg-black border border-white/10 px-4 py-2 rounded-xl text-sm font-mono">
                             <span className="opacity-50">sk_test_Lz2</span>•••••••••••••••••••••
                             <button className="opacity-50 hover:opacity-100 hover:text-singularity transition-colors ml-4"><Copy className="w-4 h-4" /></button>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )}
                
                {activeTab === 'telemetry' && (
                  <motion.div
                    key="telemetry"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="h-full flex flex-col justify-center items-center text-center space-y-6"
                  >
                    <Cpu className="w-24 h-24 text-singularity opacity-20" />
                    <h3 className="text-2xl font-bold uppercase tracking-widest">Connect Telemetry Pipe</h3>
                    <p className="text-gray-400 max-w-lg">
                      Visualizing the sub-millisecond global WebRTC streams requires WebGL 2.0 compute access.
                    </p>
                    <button className="px-8 py-4 glass rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center gap-2">
                      Initialize Websocket <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
