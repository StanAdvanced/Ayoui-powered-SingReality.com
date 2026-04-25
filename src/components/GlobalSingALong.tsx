import React, { useState } from 'react';
import { Globe, Languages, Users, Send } from 'lucide-react';

export function GlobalSingALong() {
  const [targetLang, setTargetLang] = useState('es');
  const [chatInput, setChatInput] = useState('');

  const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'ja', name: '日本語' },
    { code: 'zh', name: '中文' },
  ];

  return (
    <div className="glass-card p-6 rounded-[2rem] border border-white/10 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-singularity opacity-80" />
          <h3 className="font-bold text-sm tracking-widest uppercase text-white">Global Arena</h3>
        </div>
        <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full text-xs">
          <Users className="w-3 h-3 text-quantum" />
          <span className="text-gray-300 font-mono">1.2k</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Languages className="w-4 h-4 text-gray-400" />
        <select 
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          className="bg-black/50 border border-white/10 text-white text-xs rounded-xl px-3 py-2 w-full outline-none focus:border-singularity transition-colors"
        >
          {LANGUAGES.map(l => (
            <option key={l.code} value={l.code}>Translate to: {l.name}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 bg-black/30 rounded-2xl p-4 overflow-y-auto space-y-3 min-h-[150px]">
        {/* Mock Global Chat */}
        <div className="text-xs">
          <span className="text-pink-400 font-bold">@TokyoSinger:</span> <span className="text-white/80">Great vocals! (Translated)</span>
        </div>
        <div className="text-xs">
          <span className="text-cyan-400 font-bold">@ParisDJ:</span> <span className="text-white/80">Loving the energy! (Translated)</span>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); setChatInput(''); }} className="relative">
        <input 
          type="text"
          value={chatInput}
          onChange={e => setChatInput(e.target.value)}
          placeholder="Message the world..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-3 pr-10 py-2 text-xs text-white outline-none focus:border-singularity"
        />
        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-singularity hover:scale-110 transition-transform">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
