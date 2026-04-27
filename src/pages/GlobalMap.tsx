import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Users, Activity, Globe2, Crown, Lock, Zap, Radio, BarChart3, Minimize2, Maximize2, Server, Filter, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Leaderboard } from '../components/Leaderboard';
import { QuantumGlobe } from '../components/QuantumGlobe';
import { GSpaceBackground } from '../components/GSpaceBackground';
import { GoogleMapsMasterpiece } from '../components/GoogleMapsMasterpiece';
import { sumFormulaEngine } from '../services/sumFormulaEngine';
import { useStore } from '../store/useStore';
import { useSound } from '../hooks/useSound';

// Generate 999 synced users for the "Quantum Singularity"
const generateUsers = () => {
  const users = [];
  const colors = ['#00f0ff', '#7000ff', '#ff003c', '#ff8c00'];
  for (let i = 0; i < 999; i++) {
    users.push({
      lat: (Math.random() - 0.5) * 160,
      lng: (Math.random() - 0.5) * 360,
      size: Math.random() * 0.4 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      name: `Entity_${Math.floor(Math.random() * 99999)}`,
      isVip: Math.random() > 0.95,
      frequency: Math.random() * 440 + 20
    });
  }
  return users;
};

const generateArcs = (users: any[]) => {
  const arcs = [];
  for (let i = 0; i < 150; i++) {
    const start = users[Math.floor(Math.random() * users.length)];
    const end = users[Math.floor(Math.random() * users.length)];
    arcs.push({
      startLat: start.lat,
      startLng: start.lng,
      endLat: end.lat,
      endLng: end.lng,
      color: [`rgba(0, 240, 255, 0.3)`, `rgba(112, 0, 255, 0.3)`][Math.floor(Math.random() * 2)]
    });
  }
  return arcs;
};

export function GlobalMap() {
  const navigate = useNavigate();
  const { playClick } = useSound();
  const { resonance, addResonance, currency } = useStore();
  
  const [users, setUsers] = useState<any[]>([]);
  const [arcs, setArcs] = useState<any[]>([]);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [showVipOnly, setShowVipOnly] = useState(false);
  const [hasVipAccess, setHasVipAccess] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [sumData, setSumData] = useState({
    totalResonance: 0,
    sumF: 0,
    sumG: 0,
    sumO: 0,
    pulse: 0
  });

  useEffect(() => {
    const generatedUsers = generateUsers();
    setUsers(generatedUsers);
    setArcs(generateArcs(generatedUsers));

    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // SUM Formula Orchestration Loop
  useEffect(() => {
    const interval = setInterval(() => {
      const data = sumFormulaEngine.orchestrate({
        syncFactor: 0.9 + Math.random() * 0.1,
        userDensity: users.length / 1000,
        audioIntensity: 0.5 + Math.sin(Date.now() / 2000) * 0.5,
        quantumResonance: resonance / 1000000
      });
      setSumData(data);
    }, 100);
    return () => clearInterval(interval);
  }, [users, resonance]);

  const displayedUsers = useMemo(() => 
    showVipOnly ? users.filter(u => u.isVip) : users
  , [users, showVipOnly]);

  const handlePurchaseVip = () => {
    playClick();
    setHasVipAccess(true);
    setShowVipOnly(true);
    addResonance(5000); // Massive resonance gain for VIP access
  };

  return (
    <div className="relative w-full h-[calc(100vh-80px)] -mt-8 bg-[#030305] overflow-hidden rounded-[3rem] border border-white/10 shadow-2xl">
      <GSpaceBackground />
      
      {/* UI Controls Container */}
      <div className="absolute inset-0 z-20 pointer-events-none p-8 flex justify-between items-start">
        
        {/* Navigation & Status Rail */}
        <div className="flex flex-col gap-6 pointer-events-auto">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="p-5 glass rounded-2xl hover:bg-white/10 transition-all group"
          >
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </motion.button>

          <div className="glass-card p-6 rounded-3xl min-w-[300px] border-l-4 border-l-singularity">
             <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-3">
                 <Radio className="w-5 h-5 text-singularity animate-pulse" />
                 <span className="text-xs font-mono uppercase tracking-[0.2em] text-gray-400">Quantum Uplink</span>
               </div>
               <div className="flex items-center gap-2 px-2 py-1 bg-green-500/10 rounded-md border border-green-500/20">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-[10px] font-mono text-green-500 uppercase tracking-widest font-bold">Optimal</span>
               </div>
             </div>

             <h2 className="text-2xl font-display font-black tracking-tight mb-6">SINGULARITY MAP</h2>
             
             <div className="flex items-center gap-4 mb-8">
               <button 
                  onClick={() => {
                    const newNode = {
                      lat: (Math.random() - 0.5) * 160,
                      lng: (Math.random() - 0.5) * 360,
                      size: 0.8,
                      color: '#00f0ff',
                      name: 'User_Node_Uplink',
                      isVip: true,
                      frequency: 440
                    };
                    setUsers(prev => [...prev, newNode]);
                    playClick();
                  }}
                  className="px-6 py-3 bg-white/5 border border-white/10 hover:border-singularity/50 rounded-xl font-black text-[10px] uppercase tracking-[0.25em] flex items-center justify-center gap-3 transition-all group pointer-events-auto"
                >
                  <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" /> 
                  Broadcasting Personal Node
                </button>
             </div>
             
             <div className="space-y-4">
               {[
                 { label: "Active Nodes", value: displayedUsers.length, icon: Users, color: "text-singularity" },
                 { label: "Node Clusters", value: "1,240 Active", icon: Server, color: "text-quantum" },
                 { label: "Uplink Speed", value: "Hyper-Sync", icon: Zap, color: "text-reality" },
                 { label: "Sync Delta", value: "0.001ms", icon: Activity, color: "text-reality" }
               ].map((stat) => (
                 <div key={stat.label} className="flex justify-between items-center group cursor-default">
                    <div className="flex items-center gap-3">
                      <stat.icon className={`w-4 h-4 ${stat.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
                      <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">{stat.label}</span>
                    </div>
                    <span className="font-mono font-bold text-sm tracking-tighter">{stat.value}</span>
                 </div>
               ))}
             </div>

             <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                {!hasVipAccess ? (
                  <button 
                    onClick={handlePurchaseVip}
                    className="w-full py-4 bg-gradient-to-r from-singularity to-quantum rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(0,240,255,0.3)] group"
                  >
                    <Lock className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" /> 
                    Ascend to VIP (500 {currency})
                  </button>
                ) : (
                  <button 
                    onClick={() => { playClick(); setShowVipOnly(!showVipOnly); }}
                    className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] flex items-center justify-center gap-3 transition-all border ${showVipOnly ? 'bg-amber-500 text-black border-amber-400' : 'glass text-amber-500 border-amber-500/30 hover:bg-amber-500/10'}`}
                  >
                    <Crown className="w-3.5 h-3.5" /> 
                    {showVipOnly ? 'System Override' : 'VIP Matrix Only'}
                  </button>
                )}
             </div>
          </div>
        </div>

        {/* Dynamic Analysis Side Panel */}
        <div className="flex gap-6 pointer-events-auto h-full items-start">
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.95 }}
                className="w-[400px] flex flex-col gap-6"
              >
                {/* Advanced SUM Visualization */}
                <div className="glass-card p-8 rounded-3xl border border-white/10 overflow-hidden relative">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                     <BarChart3 className="w-16 h-16" />
                   </div>
                   <h3 className="text-xs font-mono text-singularity uppercase tracking-[0.3em] mb-6">Orchestration Analysis</h3>
                   
                   <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-mono text-gray-500">
                          <span>SUM-G (Gravitational)</span>
                          <span className="text-quantum">{Math.round(sumData.sumG * 100)}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-quantum"
                            initial={{ width: 0 }}
                            animate={{ width: `${sumData.sumG * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-mono text-gray-500">
                          <span>SUM-O (Oscillation)</span>
                          <span className="text-reality">{Math.round(sumData.sumO * 100)}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-reality"
                            initial={{ width: 0 }}
                            animate={{ width: `${sumData.sumO * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-mono text-gray-500">
                          <span>Computational Flux (Quantum GPU)</span>
                          <span className="text-singularity">{(resonance / 1000000).toFixed(6)} GH/s</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-singularity"
                            initial={{ width: 0 }}
                            animate={{ width: `${(resonance % 100) / 100}%` }}
                          />
                        </div>
                      </div>
                   </div>

                   <div className="mt-8 p-4 bg-white/[0.02] border border-white/5 rounded-xl font-mono text-[9px] leading-relaxed text-gray-500">
                      <span className="text-singularity font-bold tracking-widest">ABSENCE PROTOCOL:</span> 
                      <br />
                      Rendering perpetual code creation... 
                      <br />
                      Vector: {sumData.pulse.toFixed(8)} | Flux: stable
                   </div>
                </div>

                <div className="flex-1 overflow-hidden">
                  <Leaderboard />
                </div>
                
                {/* Tactical Geospatial Lens */}
                <motion.div 
                   layout
                   className="h-[250px] w-full glass-card rounded-3xl overflow-hidden border border-singularity/20 group"
                >
                  <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                     <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-singularity animate-pulse" />
                       <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase">Tactical Lens</span>
                     </div>
                     <span className="text-[8px] font-mono text-gray-500 uppercase">Live: Sector 7G</span>
                  </div>
                  <GoogleMapsMasterpiece />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-4 glass rounded-2xl h-fit hover:bg-white/10 transition-colors pointer-events-auto"
          >
            {isSidebarOpen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Main Quantum Globe Visualization */}
      <div className="absolute inset-0 z-10">
        <QuantumGlobe 
          width={dimensions.width}
          height={dimensions.height}
          resonance={sumData.totalResonance}
          users={displayedUsers}
          arcs={arcs}
        />
      </div>

      {/* VFX Filters */}
      <div className="absolute inset-0 pointer-events-none z-30">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-40" />
      </div>

    </div>
  );
}
