import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, UploadCloud, Link as LinkIcon, DollarSign, CheckCircle2, Zap, TrendingUp, RefreshCw, Youtube, Instagram } from 'lucide-react';

export function ShortsRemixAgent() {
  const [activeTier, setActiveTier] = useState<'FREE' | 'PRO' | 'ENTERPRISE'>('PRO');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [productUrl, setProductUrl] = useState('');

  const handleTransact = () => {
      setIsProcessing(true);
      setTimeout(() => {
          setIsProcessing(false);
          setSuccess(true);
      }, 3000);
  };

  return (
    <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="h-full p-6 lg:p-12 overflow-y-auto w-full"
    >
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-red-500/20 to-purple-500/20 text-red-400 rounded-full border border-red-500/30 text-xs font-bold tracking-widest uppercase mb-4">
                    <Zap className="w-4 h-4" /> Monetization Engine Live
                </div>
                <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter uppercase mb-4">
                    YouTube Shorts <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-500">Auto-Remix</span>
                </h2>
                <p className="text-gray-400 max-w-2xl text-sm leading-relaxed font-mono">
                    Direct drop-ship conversion protocol via AI-generated short-form media. Automatically pull product vectors, synthesize high-conversion hooks, generate hyper-realistic B-roll, and deploy to social fleets simultaneously. Partnering Revenue Model via Google & SingReality.
                </p>
            </div>
            
            <div className="glass px-6 py-4 rounded-2xl border border-red-500/30 flex flex-col items-end">
                <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-1">Global Revenue Share</span>
                <span className="text-3xl font-mono text-white font-bold text-red-500">50/50</span>
            </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
            
            {/* The Asset Utility Interface */}
            <div className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Youtube className="w-48 h-48 text-red-500" /></div>
                
                <h3 className="font-heading font-bold text-xl uppercase tracking-widest mb-6 flex items-center gap-2">
                    <UploadCloud className="text-red-400" /> Viral Injection Protocol
                </h3>
                
                <div className="space-y-6 relative z-10 flex-1 flex flex-col">
                    <div className="space-y-4">
                        <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Target Dropship Product URL / ID</label>
                        <div className="flex bg-black/40 border border-white/10 rounded-xl overflow-hidden focus-within:border-red-500/50 transition-colors">
                            <div className="p-4 bg-white/5 border-r border-white/5"><LinkIcon className="w-5 h-5 text-gray-500" /></div>
                            <input 
                                type="text"
                                value={productUrl}
                                onChange={(e) => setProductUrl(e.target.value)}
                                placeholder="https://aliexpress.com/item/..." 
                                className="w-full bg-transparent px-4 py-3 outline-none text-sm font-mono text-white placeholder:text-gray-600"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Select Distribution Matrix</label>
                        <div className="grid grid-cols-3 gap-4">
                            {['YouTube Shorts', 'Instagram Reels', 'TikTok'].map((platform, i) => (
                                <button key={i} className="py-3 px-4 rounded-xl border border-white/10 bg-white/5 text-xs font-bold text-gray-400 hover:text-white hover:border-white/30 transition-all flex flex-col items-center gap-2">
                                    {i === 0 && <Youtube className="w-5 h-5 text-red-500" />}
                                    {i === 1 && <Instagram className="w-5 h-5 text-pink-500" />}
                                    {i === 2 && <TrendingUp className="w-5 h-5 text-[#00f2fe]" />}
                                    {platform}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 relative z-10 bg-black/40 p-4 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs text-gray-400 font-mono uppercase">EBITA Forecast / Campaign</span>
                        <span className="text-green-400 font-mono font-bold">+$14,200.00</span>
                    </div>
                    <button 
                        onClick={handleTransact}
                        disabled={isProcessing || success}
                        className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2
                            ${success ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 
                              isProcessing ? 'bg-red-500/50 text-white cursor-wait' : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:scale-[1.02]'}`}
                    >
                        {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : 
                         success ? <><CheckCircle2 className="w-5 h-5" /> Campaign Running</> : 
                         <><Play className="w-5 h-5 fill-current" /> Initialize Viral Fleet</>}
                    </button>
                    {success && <p className="text-center text-[10px] text-gray-500 mt-3 font-mono">Agent dispatched. Multi-modal assets rendering.</p>}
                </div>
            </div>

            {/* Subscriptions / Transaction Integration Tier */}
            <div className="space-y-6">
                <h3 className="font-heading font-bold text-xl uppercase tracking-widest mb-6 flex items-center gap-2">
                    <DollarSign className="text-green-400" /> Unlock The Asset
                </h3>
                
                <div className="grid gap-4">
                    {/* Free Tier */}
                    <div 
                        onClick={() => setActiveTier('FREE')}
                        className={`p-6 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${activeTier === 'FREE' ? 'bg-white/10 border-white/30' : 'bg-black/40 border-white/5 hover:border-white/20'}`}
                    >
                        <div>
                            <h4 className="font-bold text-lg text-white mb-1">Standard Node</h4>
                            <p className="text-xs text-gray-400 font-mono">1 Agent • Standard Render • 10% Rev Share</p>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-black block">$0</span>
                            <span className="text-[10px] text-gray-500 uppercase">/ month</span>
                        </div>
                    </div>

                    {/* Pro Tier - Recommended */}
                    <div 
                        onClick={() => setActiveTier('PRO')}
                        className={`p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${activeTier === 'PRO' ? 'bg-red-900/20 border-red-500 shadow-[0_0_30px_rgba(220,38,38,0.15)]' : 'bg-black/40 border-white/5 hover:border-white/20'}`}
                    >
                        <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-widest text-shadow">Flagship Default</div>
                        <div className="flex justify-between items-center relative z-10">
                            <div>
                                <h4 className="font-bold text-lg text-white mb-1 flex items-center gap-2">Nexus Pro <Zap className="w-4 h-4 text-red-500 fill-current" /></h4>
                                <p className="text-xs text-gray-400 font-mono max-w-[200px]">10 Agents • 4K AI Video • 35% Google Partnership Rev Share</p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-black block text-red-400">$299</span>
                                <span className="text-[10px] text-gray-500 uppercase">/ month</span>
                            </div>
                        </div>
                    </div>

                    {/* Enterprise Tier */}
                    <div 
                        onClick={() => setActiveTier('ENTERPRISE')}
                        className={`p-6 rounded-2xl border transition-all cursor-pointer ${activeTier === 'ENTERPRISE' ? 'bg-singularity/10 border-singularity/50' : 'bg-black/40 border-white/5 hover:border-white/20'}`}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-lg text-white mb-1">SingReality Monolith</h4>
                                <p className="text-xs text-gray-400 font-mono">Unlimited Agents • API Access • 50/50 Global Profit Cut</p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-black block text-singularity">$4,999</span>
                                <span className="text-[10px] text-gray-500 uppercase">/ month</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center p-6 bg-green-500/5 rounded-2xl border border-green-500/20">
                    <p className="text-xs text-green-400/80 font-mono leading-relaxed">
                        By integrating this transaction flow, we solidify the core financial covenants of the platform. Activating real-world EBITA generation loops autonomously through intelligent drop-ship to audience matching algorithms.
                    </p>
                </div>
            </div>

        </div>
      </div>
    </motion.div>
  );
}
