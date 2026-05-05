import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Layers, Play, Search, ShieldCheck, Zap, Coins, Link2, Share2, ArrowRight, Download, Music, Mic2, Sparkles } from 'lucide-react';
import { CinematicBackscreen } from '../components/CinematicBackscreen';

const NFTS = [
  {
    id: 1,
    title: "AI Genesis Track #102",
    creator: "SingReality AI",
    price: "0.5 ETH",
    royalty: "15%",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    type: "Full Track",
  },
  {
    id: 2,
    title: "Neon Cyberpunk Stems",
    creator: "Nexus Beats",
    price: "0.2 ETH",
    royalty: "10%",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
    type: "Stem Pack",
  },
  {
    id: 3,
    title: "VR Festival Golden Ticket",
    creator: "SingReality Events",
    price: "2.0 ETH",
    royalty: "5%",
    image: "https://images.unsplash.com/photo-1470229722913-7c090b332da8?q=80&w=800&auto=format&fit=crop",
    type: "VIP Access",
  },
  {
    id: 4,
    title: "Quantum Dance Choreo A",
    creator: "MotionAI",
    price: "0.8 ETH",
    royalty: "20%",
    image: "https://images.unsplash.com/photo-1516280440502-a2fc994606cf?q=80&w=800&auto=format&fit=crop",
    type: "Choreography",
  }
];

export function NFTCollectibles() {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'mint'>('marketplace');

  return (
    <div className="relative min-h-screen pt-24 px-6 pb-20">
      <CinematicBackscreen opacity={1} pageType="nexus" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 border border-white/10 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <Layers className="w-4 h-4 text-singularity" />
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-singularity">Flagship Feature</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter leading-none mb-4">
              NFT <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">Collectibles</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl font-light">
              On-chain minting of tracks, stems, AI-generated songs, choreography routines, VR festival tickets, and avatar skins.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`px-6 py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all ${
                activeTab === 'marketplace' ? 'bg-singularity text-black' : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              Marketplace
            </button>
            <button
              onClick={() => setActiveTab('mint')}
              className={`px-6 py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all ${
                activeTab === 'mint' ? 'bg-quantum text-white' : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              Mint NFT
            </button>
          </div>
        </div>

        {activeTab === 'marketplace' ? (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {NFTS.map((nft) => (
                <motion.div
                  key={nft.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-[2rem] overflow-hidden border border-white/10 group flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img src={nft.image} alt={nft.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest border border-white/10">
                      {nft.type}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-2">{nft.title}</h3>
                    <div className="text-gray-400 text-sm mb-4">By {nft.creator}</div>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Price</div>
                        <div className="font-mono text-singularity font-bold">{nft.price}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Royalty</div>
                        <div className="font-mono text-quantum font-bold">{nft.royalty}</div>
                      </div>
                    </div>

                    <button className="w-full mt-6 py-3 bg-white/5 hover:bg-singularity hover:text-black rounded-xl font-bold uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2 border border-white/10">
                      <Coins className="w-4 h-4" /> Buy Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="glass-card p-10 rounded-[2rem] border border-quantum/30 bg-quantum/5 relative overflow-hidden">
              <div className="absolute -right-40 -top-40 w-96 h-96 bg-quantum/20 rounded-full blur-[100px] pointer-events-none" />
              
              <h2 className="text-3xl font-display font-black uppercase mb-8 flex items-center gap-4">
                <Sparkles className="w-8 h-8 text-quantum" />
                Mint New Collectible
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-400 uppercase tracking-widest mb-2">Asset Type</label>
                    <select className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none outline-none focus:border-quantum/50">
                      <option>AI Generated Track</option>
                      <option>Stem Pack</option>
                      <option>Choreography Routine</option>
                      <option>VR Festival Ticket</option>
                      <option>Avatar Skin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 uppercase tracking-widest mb-2">Title</label>
                    <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-quantum/50" placeholder="e.g. Neon Cyberpunk Beat" />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 uppercase tracking-widest mb-2">Royalty Split (%)</label>
                    <input type="number" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-quantum/50" placeholder="e.g. 15" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-400 uppercase tracking-widest mb-2">Upload Asset (SUMF Enhanced)</label>
                    <div className="border-2 border-dashed border-white/20 rounded-2xl h-32 flex flex-col items-center justify-center text-gray-500 hover:border-quantum/50 hover:text-quantum transition-colors cursor-pointer bg-black/30">
                      <Download className="w-8 h-8 mb-2" />
                      <span className="text-xs font-mono uppercase">Drop file or click to browse</span>
                    </div>
                  </div>

                  <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-singularity mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> Smart Contract Info
                    </h4>
                    <p className="text-sm text-gray-400 leading-relaxed mb-2">
                      Assets will be permanently stored on Arweave/IPFS. Royalties will be automatically split via Stripe/PayPal integration.
                    </p>
                    <div className="text-[10px] text-gray-500 font-mono break-all bg-black/50 p-2 rounded shrink-0">
                      0xSUMF_CONTRACT_09F8...B3E2
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-end">
                <button className="px-10 py-4 bg-gradient-to-r from-quantum to-singularity rounded-xl font-bold uppercase tracking-widest text-white shadow-[0_0_30px_rgba(255,0,255,0.4)] hover:scale-105 transition-all flex items-center gap-3">
                  Mint & Deploy on Chain <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
