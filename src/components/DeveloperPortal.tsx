import React from 'react';
import { Link } from 'react-router-dom';
import { Code, DollarSign, Activity, Key, Box, ArrowLeft, Bot } from 'lucide-react';
import { useStore } from '../store/useStore';
import { AyouiAgentBuilder } from './AyouiAgentBuilder';

export default function DeveloperPortal() {
  const { currency } = useStore();
  return (
    <div className="min-h-screen bg-black text-white p-8 max-w-7xl mx-auto pt-24">
      <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to SingReality
      </Link>
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-2">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Portal Menu</div>
          <button className="w-full text-left px-4 py-3 bg-white/10 rounded-xl font-medium flex items-center gap-3"><Activity className="w-4 h-4"/> Dashboard</button>
          <button className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-xl font-medium flex items-center gap-3 text-gray-400"><Key className="w-4 h-4"/> API Keys</button>
          <button className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-xl font-medium flex items-center gap-3 text-gray-400"><DollarSign className="w-4 h-4"/> Royalties & Splits</button>
          <button className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-xl font-medium flex items-center gap-3 text-gray-400"><Box className="w-4 h-4"/> Hologram SDK</button>
          <button className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-xl font-medium flex items-center gap-3 text-singularity"><Bot className="w-4 h-4"/> Ayoui Agents</button>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">Developer Portal</h1>
            <p className="text-gray-400">Manage your SingReality integrations, smart contracts, and API access.</p>
          </div>
          
          <div className="flex overflow-x-auto pb-8 -mx-6 px-6 md:grid md:grid-cols-3 gap-6 snap-x snap-mandatory hide-scrollbar">
            <div className="glass p-6 rounded-3xl min-w-[260px] md:min-w-0 snap-center">
              <div className="text-gray-400 text-sm mb-2">Total API Calls</div>
              <div className="text-3xl font-bold text-singularity">1.2M</div>
              <div className="text-xs text-green-500 mt-2">+14% this week</div>
            </div>
            <div className="glass p-6 rounded-3xl min-w-[260px] md:min-w-0 snap-center">
              <div className="text-gray-400 text-sm mb-2">Active Webhooks</div>
              <div className="text-3xl font-bold text-quantum">24</div>
              <div className="text-xs text-gray-500 mt-2">All systems operational</div>
            </div>
            <div className="glass p-6 rounded-3xl min-w-[260px] md:min-w-0 snap-center">
              <div className="text-gray-400 text-sm mb-2">Pending Royalties</div>
              <div className="text-3xl font-bold text-reality">4,250 {currency}</div>
              <div className="text-xs text-gray-500 mt-2">Next payout in 2 days</div>
            </div>
          </div>

          {/* Ayoui Agent Builder Integration */}
          <AyouiAgentBuilder />

          <div className="glass p-8 rounded-3xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Code className="w-6 h-6 text-singularity"/> Quick Start: Real-time Duets API</h2>
            <pre className="bg-black/50 p-6 rounded-2xl overflow-x-auto text-sm font-mono text-gray-300 border border-white/10">
              <code>{`import { SingReality } from '@singreality/sdk';

// Initialize the Quantum Sync Engine
const sr = new SingReality({
  apiKey: 'sr_live_quantum_...',
  environment: 'production'
});

// Create a real-time holographic duet session
const session = await sr.sessions.create({
  type: 'holographic_duet',
  participants: 2,
  latencyOptimization: 'quantum',
  royaltySplit: {
    creator: 0.70,
    platform: 0.20,
    aiPool: 0.10
  }
});

console.log('Arena ready:', session.arenaUrl);`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

