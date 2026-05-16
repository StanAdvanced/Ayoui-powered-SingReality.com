import React, { useState } from 'react';
import { Search, Package, Box, User, Trees, Plus, Layout } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion } from 'motion/react';
import { Asset, ASSETS as GLOBAL_ASSETS } from '../constants/assets';

const LOCAL_ASSETS: Asset[] = [
  // Furniture
  { id: 'f1', name: 'Futuristic Sofa', category: 'furniture', url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF-Binary/SheenChair.glb', thumbnail: 'https://placehold.co/400x300/111/00f0ff?text=Sofa' },
  { id: 'f2', name: 'Cyber Table', category: 'furniture', url: 'https://raw.githubusercontent.com/pmndrs/drei-assets/master/truck.gltf', thumbnail: 'https://placehold.co/400x300/111/00f0ff?text=Table' },
  
  // Architecture
  { id: 'a1', name: 'Neo-Tokyo Spire', category: 'architecture', url: 'https://raw.githubusercontent.com/pmndrs/drei-assets/master/stacy.glb', thumbnail: 'https://placehold.co/400x300/111/00f0ff?text=Spire' },
  
  // Characters
  { id: 'c1', name: 'Hologram Idol', category: 'characters', url: 'https://raw.githubusercontent.com/pmndrs/drei-assets/master/stacy.glb', thumbnail: 'https://placehold.co/400x300/111/00f0ff?text=Idol' },
];

const ALL_ASSETS = [...GLOBAL_ASSETS, ...LOCAL_ASSETS];

export function AssetLibrary({ onSelect }: { onSelect?: (asset: Asset) => void }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');
  const addLayer = useStore(state => state.addLayer);

  const filteredAssets = ALL_ASSETS.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || asset.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAdd = (asset: Asset) => {
    if (onSelect) {
      onSelect(asset);
    } else {
      addLayer(asset.name, asset.url);
    }
  };

  const categories = [
    { id: 'all', label: 'All', icon: Box },
    { id: 'furniture', label: 'Furniture', icon: Package },
    { id: 'architecture', label: 'Architecture', icon: Layout },
    { id: 'characters', label: 'Characters', icon: User },
    { id: 'materials', label: 'Materials', icon: Box },
  ];

  return (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <Package className="w-5 h-5 text-singularity" />
          <h2 className="text-xl font-display font-bold uppercase tracking-widest text-white">Quantum Asset Forge</h2>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search the metadata lattice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs font-mono text-white outline-none focus:border-singularity transition-colors"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                activeCategory === cat.id 
                  ? 'bg-singularity text-black shadow-[0_0_15px_rgba(0,240,255,0.3)]' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <cat.icon className="w-3 h-3" />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
        <div className="grid grid-cols-2 gap-4">
          {filteredAssets.map(asset => (
            <motion.div
              key={asset.id}
              whileHover={{ scale: 1.02 }}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 bg-white/5"
            >
              <img 
                src={asset.thumbnail} 
                alt={asset.name} 
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
              />
              
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                <div className="text-[10px] font-bold uppercase tracking-tighter text-white truncate mb-1">{asset.name}</div>
                <div className="text-[8px] text-gray-500 uppercase tracking-widest">{asset.category}</div>
              </div>

              <div className="absolute inset-0 bg-singularity/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handleAdd(asset)}
                  className="w-10 h-10 rounded-full bg-singularity text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
