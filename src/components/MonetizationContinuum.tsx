import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Activity, Database, LineChart, Cpu, Music2, Star } from 'lucide-react';

export function MonetizationContinuum() {
  const [revenue, setRevenue] = useState(145.50);
  const [activeDropships, setActiveDropships] = useState(12);
  const seoScore = 98;

  useEffect(() => {
    const interval = setInterval(() => {
      setRevenue(prev => prev + (Math.random() * 5));
      if (Math.random() > 0.8) setActiveDropships(prev => prev + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="h-full p-6 lg:p-12 overflow-y-auto"
    >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
                <h2 className="text-3xl font-heading font-black flex items-center gap-3 tracking-tighter uppercase"><Star className="text-yellow-400 w-8 h-8 fill-current" /> YOUR WEALTH ENGINE</h2>
                <p className="text-gray-400 mt-2 font-mono text-sm max-w-2xl leading-relaxed">
                    Watch your music convert into real-world value. SingReality autonomously manages your merch drops, streaming royalties, and brand partnerships, depositing yield directly to your nexus.
                </p>
            </div>
            
            <div className="flex gap-4">
               <div className="glass px-6 py-4 rounded-2xl border border-green-500/30 flex flex-col items-end whitespace-nowrap bg-green-500/5">
                  <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest mb-1 flex items-center gap-2">
                     <Activity className="w-3 h-3 text-green-400" /> Royalties & Merch YTD
                  </span>
                  <div className="text-4xl font-mono text-white font-bold flex items-baseline gap-1">
                      <span className="text-green-500 text-2xl">$</span>
                      {revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
               </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Panel 1 */}
            <div className="glass p-8 rounded-3xl border border-white/10 flex flex-col gap-6 transform hover:-translate-y-1 transition-transform relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none"><ShoppingCart className="w-32 h-32 text-singularity" /></div>
                <h3 className="font-bold text-lg font-mono uppercase tracking-widest flex items-center gap-2">
                    <Database className="w-5 h-5 text-singularity" /> Gen-AI Merch Sales
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/40 border border-white/5 p-4 rounded-xl relative z-10 transition-colors group-hover:border-singularity/30">
                        <span className="text-2xl font-black block">{activeDropships}</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">Live Products</span>
                    </div>
                    <div className="bg-black/40 border border-white/5 p-4 rounded-xl relative z-10 transition-colors group-hover:border-singularity/30">
                        <span className="text-2xl font-black block text-green-400">Auto</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">Fulfillment</span>
                    </div>
                </div>

                <div className="mt-4 space-y-3 relative z-10">
                   <p className="text-[10px] text-gray-400 mb-2 leading-relaxed">Agents automatically design merch based on your album covers and lyrics, deploying to global manufacturers on-demand.</p>
                    <div className="flex justify-between items-center text-xs font-mono text-gray-400 border-b border-white/5 pb-2">
                        <span>Print-on-Demand Sync</span><span className="text-green-400">ACTIVE</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-mono text-gray-300">
                        <span>Your Margin</span><span className="text-singularity font-bold">+70.0%</span>
                    </div>
                </div>
            </div>

            {/* Panel 2 */}
            <div className="glass p-8 rounded-3xl border border-white/10 flex flex-col gap-6 transform hover:-translate-y-1 transition-transform relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none"><Music2 className="w-32 h-32 text-purple-500" /></div>
                <h3 className="font-bold text-lg font-mono uppercase tracking-widest flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-purple-400" /> Streaming Algorithmic Push
                </h3>
                
                <div className="flex items-end gap-3 mt-4 relative z-10">
                    <span className="text-6xl font-black text-purple-400 leading-none">{seoScore}</span>
                    <span className="text-xs text-gray-400 uppercase tracking-widest mb-1">Viral Momentum</span>
                </div>

                <div className="mt-auto space-y-4 relative z-10">
                    <div className="w-full bg-black/40 rounded-lg p-3 border border-white/5 group-hover:border-purple-500/30 transition-colors">
                        <div className="flex justify-between text-[10px] font-mono mb-2 text-gray-400">
                            <span>Playlist Placment Success</span><span>94%</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 w-[94%]"></div>
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                        SingReality OS pitches your mastered tracks to 14,000+ AI-curated playlists globally. Ranking algorithms are prioritizing your recent generative release.
                    </p>
                </div>
            </div>

            {/* Panel 3 */}
            <div className="glass p-8 rounded-3xl border border-singularity/30 flex flex-col justify-center items-center gap-6 transform hover:-translate-y-1 transition-transform relative overflow-hidden bg-singularity/5 text-center cursor-pointer hover:bg-singularity/10">
                <Cpu className="w-16 h-16 text-singularity mb-2" />
                <h3 className="font-bold text-xl uppercase tracking-widest text-white">
                    Deploy Next Drop
                </h3>
                <p className="text-xs text-gray-400">
                    Launch the automated YouTube Shorts Remix Agent to aggressively push your brand to millions via short-form media.
                </p>
                <div className="absolute inset-0 bg-gradient-to-t from-singularity/20 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
            </div>
        </div>
    </motion.div>
  );
}
