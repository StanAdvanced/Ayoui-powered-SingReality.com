import React, { useState } from 'react';
import { ASSETS, Asset } from '../constants/assets';
import { Box, Layers, Search } from 'lucide-react';

export function AssetLibrary({ onSelect }: { onSelect: (asset: Asset) => void }) {
  const [category, setCategory] = useState<Asset['category'] | 'all'>('all');

  const filteredAssets = category === 'all' ? ASSETS : ASSETS.filter(a => a.category === category);

  return (
    <div className="absolute top-8 left-8 w-80 glass rounded-[2rem] p-8 border border-white/10 animate-in fade-in slide-in-from-left-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
      <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
        <Box className="w-4 h-4 text-singularity" /> Asset Library
      </h3>
      
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
        {['all', 'furniture', 'architecture', 'characters', 'materials'].map(cat => (
          <button 
            key={cat}
            onClick={() => setCategory(cat as any)}
            className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase transition-all ${category === cat ? 'bg-singularity text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredAssets.map(asset => (
          <button 
            key={asset.id}
            onClick={() => onSelect(asset)}
            className="group p-2 rounded-xl bg-white/5 border border-white/10 hover:border-singularity transition-all"
          >
            <div className="aspect-square bg-black/50 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
              <span className="text-[10px] text-gray-500">Preview</span>
            </div>
            <span className="text-[10px] font-mono text-gray-300 group-hover:text-white">{asset.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
