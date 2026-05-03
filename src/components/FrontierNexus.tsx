import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe2, TerminalSquare, Video, Sparkles, Mic2, Headphones, TrendingUp } from 'lucide-react';
import { AgentSwarmVisualizer } from './AgentSwarmVisualizer';
import { MonetizationContinuum } from './MonetizationContinuum';
import { ProductionPipeline } from './ProductionPipeline';
import { GeoSpatialHub } from './GeoSpatialHub';
import { ShortsRemixAgent } from './ShortsRemixAgent';
import { AvatarCanvas } from './AvatarCanvas';
import { AIDialogue } from './AIDialogue';

type ViewMode = 'LANDING' | 'OVERVIEW' | 'PRODUCTION' | 'MARKETING' | 'GEOSPATIAL' | 'SHORTS_REMIX';

export function FrontierNexus() {
  const [activeView, setActiveView] = useState<ViewMode>('LANDING');

  return (
    <div className="min-h-screen bg-[#020205] text-white flex overflow-hidden font-inter selection:bg-singularity/30 selection:text-white relative">
      {/* Absolute 3D Agent Swarm Background for OVERVIEW */}
      <div className="absolute inset-0 pointer-events-none z-0">
         <AgentSwarmVisualizer />
      </div>

      <AnimatePresence mode="wait">
        {activeView === 'LANDING' ? (
            <motion.div 
                key="landing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center"
            >
                {/* 3D AVATAR HERO */}
                <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center opacity-70">
                    <AvatarCanvas />
                </div>
                
                {/* AI Chat Interface */}
                <AIDialogue />

                <div className="max-w-4xl mx-auto space-y-8 relative z-10 glass p-10 md:p-16 rounded-[3rem] border border-white/10 bg-black/40 backdrop-blur-2xl shadow-[0_0_100px_rgba(0,212,255,0.1)] mt-32 xl:mr-96 pointer-events-auto">
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-singularity uppercase tracking-widest text-xs font-bold mb-4"
                    >
                        <Sparkles className="w-4 h-4" /> Welcome to SingReality
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-5xl md:text-7xl font-heading font-black tracking-tighter uppercase leading-[0.9]"
                    >
                        From <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-300">Dreams</span><br/>
                        To The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#6C3CE1] drop-shadow-[0_0_20px_rgba(0,212,255,0.5)]">Red Carpet</span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed"
                    >
                        Your universal access point for music. Whether you want to discover the frequencies of the future or forge your own path to global stardom. AI creates the bridge. You bring the soul.
                    </motion.p>
                    
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="flex flex-col sm:flex-row gap-6 justify-center mt-12"
                    >
                        <button 
                            onClick={() => setActiveView('PRODUCTION')}
                            className="bg-gradient-to-r from-singularity to-blue-600 hover:scale-105 transition-all text-white px-8 py-5 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,212,255,0.4)] group"
                        >
                            <Mic2 className="w-5 h-5 group-hover:animate-pulse" /> Create For Free
                        </button>
                        <button 
                            onClick={() => setActiveView('MARKETING')}
                            className="glass border border-white/20 hover:bg-white/10 transition-all text-white px-8 py-5 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 group"
                        >
                            <Headphones className="w-5 h-5 group-hover:scale-110 transition-transform" /> Listen & Discover
                        </button>
                    </motion.div>
                </div>
            </motion.div>
        ) : (
            <motion.div 
                key="app"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex w-full h-full relative z-20"
            >
      {/* Elite Sidebar */}
      <aside className="w-20 md:w-64 glass border-r border-white/5 h-screen flex flex-col items-center md:items-start py-8 px-4 relative z-20 backdrop-blur-3xl shrink-0 bg-black/20">
         <div className="flex items-center gap-3 mb-16 px-2 cursor-pointer" onClick={() => setActiveView('LANDING')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-singularity to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.4)]">
                <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-heading font-black tracking-tighter uppercase hidden md:block leading-none">
                SingReality<br/><span className="text-singularity text-[9px] tracking-widest block mt-1">CREATOR NEXUS</span>
            </h1>
         </div>

         <nav className="flex flex-col gap-4 w-full">
            <SidebarButton active={activeView === 'PRODUCTION'} onClick={() => setActiveView('PRODUCTION')} icon={<Mic2 className="w-5 h-5" />} label="1. The Studio" />
            <SidebarButton active={activeView === 'SHORTS_REMIX'} onClick={() => setActiveView('SHORTS_REMIX')} icon={<Video className="w-5 h-5" />} label="2. Viral Distro" />
            <SidebarButton active={activeView === 'MARKETING'} onClick={() => setActiveView('MARKETING')} icon={<TrendingUp className="w-5 h-5" />} label="3. Wealth Engine" />
            <SidebarButton active={activeView === 'GEOSPATIAL'} onClick={() => setActiveView('GEOSPATIAL')} icon={<Globe2 className="w-5 h-5" />} label="4. Global Stage" />
         </nav>

         <div className="mt-auto w-full px-2">
            <div className="p-4 bg-black/40 rounded-xl border border-white/5 hidden md:block">
               <div className="flex items-center gap-2 mb-2 text-[10px] text-gray-500 uppercase tracking-widest font-mono">
                  <TerminalSquare className="w-3 h-3 text-singularity" /> System Status
               </div>
               <div className="text-green-400 text-xs font-mono font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> ALL SYSTEMS NOMINAL
               </div>
            </div>
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 h-screen overflow-y-auto w-full">
         <AnimatePresence mode="wait">
            {activeView === 'PRODUCTION' && <ProductionPipeline key="production" />}
            {activeView === 'MARKETING' && <MonetizationContinuum key="marketing" />}
            {activeView === 'GEOSPATIAL' && <GeoSpatialHub key="geospatial" />}
            {activeView === 'SHORTS_REMIX' && <ShortsRemixAgent key="shorts-remix" />}
         </AnimatePresence>
      </main>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 w-full group relative overflow-hidden
                ${active ? 'bg-singularity/10 border-white/10 text-white shadow-[inset_0_0_20px_rgba(0,212,255,0.1)]' : 'hover:bg-white/5 text-gray-500 hover:text-gray-200 border-transparent'} border`}
        >
            <div className={`transition-transform duration-300 ${active ? 'scale-110 text-singularity' : 'group-hover:scale-110'}`}>
                {icon}
            </div>
            <span className="font-bold text-xs uppercase tracking-widest hidden md:block">{label}</span>
            {active && (
                <motion.div layoutId="sidebar-indicator" className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-singularity rounded-r-md shadow-[0_0_10px_#00D4FF]" />
            )}
        </button>
    )
}
