import React from 'react';
import { Code, DollarSign, Activity, ShieldCheck, Box, FileText } from 'lucide-react';
import { useStore } from '../store/useStore';
import { GoogleMapBackground } from '../components/GoogleMapBackground';

export function Portal() {
  const { currency } = useStore();
  return (
    <div className="min-h-screen relative">
      <GoogleMapBackground />
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter mb-4">DEVELOPER <span className="text-gradient">PORTAL</span></h1>
        <p className="text-gray-400">Manage API keys, smart contracts, and royalty splits.</p>
      </div>

      <div className="flex overflow-x-auto pb-8 -mx-6 px-6 md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 snap-x snap-mandatory hide-scrollbar">
        {[
          { label: "Total API Calls", value: "12.4M", icon: Activity, color: "text-singularity" },
          { label: "Pending Royalties", value: `4,250 ${currency}`, icon: DollarSign, color: "text-green-500" },
          { label: "Active Webhooks", value: "24", icon: Code, color: "text-quantum" },
          { label: "Audit Score", value: "10000/10000", icon: ShieldCheck, color: "text-reality" }
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-[2rem] min-w-[240px] md:min-w-0 snap-center">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm font-medium">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-3xl font-display font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="flex overflow-x-auto pb-8 -mx-6 px-6 lg:grid lg:grid-cols-2 gap-8 snap-x snap-mandatory hide-scrollbar">
        <div className="glass p-8 rounded-[2rem] min-w-[320px] lg:min-w-0 snap-center">
          <h2 className="text-2xl font-bold mb-6">API Quickstart</h2>
          <pre className="bg-black/50 p-6 rounded-xl overflow-x-auto text-sm font-mono text-gray-300 border border-white/10">
            <code>{`import { SingReality } from '@singreality/sdk';

// Initialize the Quantum Sync Engine
const sr = new SingReality({
  apiKey: process.env.SR_API_KEY,
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

        <div className="glass p-8 rounded-[2rem] min-w-[320px] lg:min-w-0 snap-center">
          <h2 className="text-2xl font-bold mb-6">Smart Contract Splits</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Creator Payout</span>
                <span className="font-mono text-singularity">70%</span>
              </div>
              <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                <div className="w-[70%] h-full bg-singularity" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Platform Fee</span>
                <span className="font-mono text-gray-400">20%</span>
              </div>
              <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                <div className="w-[20%] h-full bg-gray-500" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>AI Training Pool (Residuals)</span>
                <span className="font-mono text-quantum">10%</span>
              </div>
              <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                <div className="w-[10%] h-full bg-quantum" />
              </div>
            </div>
            <div className="pt-6 border-t border-white/10">
              <button className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
                CONFIGURE STRIPE CONNECT
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 glass p-8 rounded-[2rem]">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Box className="w-6 h-6 text-singularity" /> Hologram SDK Integration
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <p className="text-gray-400 text-sm">
              Embed fully interactive, photorealistic 3D avatars into your own web or mobile applications using the SingReality Hologram SDK.
            </p>
            <div className="space-y-3">
              <a href="#" className="flex items-center gap-2 text-sm text-singularity hover:text-white transition-colors">
                <FileText className="w-4 h-4" /> Read Full Documentation
              </a>
              <a href="#" className="flex items-center gap-2 text-sm text-singularity hover:text-white transition-colors">
                <Box className="w-4 h-4" /> 3D Model Guidelines
              </a>
              <a href="#" className="flex items-center gap-2 text-sm text-singularity hover:text-white transition-colors">
                <Code className="w-4 h-4" /> API Reference
              </a>
            </div>
          </div>
          <div className="lg:col-span-2">
            <pre className="bg-black/50 p-6 rounded-xl overflow-x-auto text-sm font-mono text-gray-300 border border-white/10">
              <code>{`import { HologramEngine } from '@singreality/hologram-sdk';

// Initialize the Hologram Engine
const engine = new HologramEngine({
  container: document.getElementById('hologram-container'),
  apiKey: process.env.SR_API_KEY,
  quality: 'ultra', // 'low', 'medium', 'high', 'ultra'
});

// Load a specific Neural Clone avatar
await engine.loadAvatar('clone_nexus_v4');

// Trigger an animation and speech
engine.playAnimation('guitar_solo_1');
engine.speak("Welcome to the next dimension of music!");

// Listen for user interactions
engine.on('click', (event) => {
  console.log('Avatar clicked at:', event.intersectPoint);
});`}</code>
            </pre>
          </div>
        </div>
      </div>

      </div>
    </div>
  );
}
