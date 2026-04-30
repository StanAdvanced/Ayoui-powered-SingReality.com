import React, { useState, useEffect } from 'react';
import { Database, Search, Shield, Zap, Globe2, Network } from 'lucide-react';
import { useStore } from '../store/useStore';

export function NumtrixianDatabase() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  return (
    <div className="absolute inset-x-0 bottom-20 p-8 glass mx-8 rounded-3xl border border-blue-500/30">
      <div className="flex items-center gap-4 mb-6">
        <Database className="w-8 h-8 text-blue-400" />
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Vast Numtrixian Database
        </h2>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-4 top-4 text-white/50" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Codex, Repositories, Phoenixian Trials..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Sacred Frequencies", desc: "528 Hz (Creation), 444 Hz (Protection)", icon: Zap },
          { title: "Intergalactic Communications", desc: "Open API & Neural Keys", icon: Network },
          { title: "Phoenixian Lifestone", desc: "12 Sacred Shards Tracking", icon: Shield }
        ].map((item, idx) => (
          <div key={idx} className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-blue-400/50 transition-colors group cursor-pointer">
            <item.icon className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
            <p className="text-white/60">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
