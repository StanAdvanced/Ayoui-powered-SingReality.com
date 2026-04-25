import React, { useState } from 'react';
import { ShoppingCart, Heart, Search, Filter } from 'lucide-react';
import { YouTubeSearch } from './YouTubeSearch';

export function Marketplace() {
  const [filter, setFilter] = useState('all');
  
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Marketplace</h2>
      
      <YouTubeSearch />

      <div className="flex gap-4 mb-6 mt-8">
        <button onClick={() => setFilter('all')} className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20">All</button>
        <button onClick={() => setFilter('3d')} className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20">3D Models</button>
        <button onClick={() => setFilter('texture')} className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20">Textures</button>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {/* Marketplace items will be mapped here */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="font-bold">Item Name</h3>
          <p className="text-sm text-gray-400">Description</p>
          <button className="mt-4 w-full py-2 bg-singularity text-black rounded-xl">Buy Now</button>
        </div>
      </div>
    </div>
  );
}
