import React, { useState } from 'react';
import { ModelViewer } from './ModelViewer';
import { Box, Layers, Globe, Zap, Plus, Search, Filter, Trash2, Settings2, ArrowRight, Undo2, Redo2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';

export function ThreeWorkspace() {
  const { layers, addLayer, removeLayer, toggleLayerVisibility, reorderLayers, undoLayerAction, redoLayerAction, layerHistoryIndex, layerHistory } = useStore();
  const [newLayerName, setNewLayerName] = useState('');

  const handleAddLayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLayerName.trim()) return;
    addLayer(newLayerName);
    setNewLayerName('');
  };

  const canUndo = layerHistoryIndex > 0;
  const canRedo = layerHistoryIndex < layerHistory.length - 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[700px]">
      {/* 3D Viewport */}
      <div className="lg:col-span-3 h-full">
        <ModelViewer />
      </div>

      {/* Control Panel */}
      <div className="lg:col-span-1 h-full flex flex-col gap-6">
        <div className="flex-1 glass rounded-[2.5rem] p-8 border border-white/5 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-quantum/20 flex items-center justify-center">
                <Layers className="w-4 h-4 text-quantum" />
              </div>
              <h2 className="text-xl font-bold uppercase tracking-widest">Layers</h2>
            </div>
            
            {/* Undo / Redo controls */}
            <div className="flex items-center gap-2">
              <button 
                onClick={undoLayerAction} 
                className={`p-2 rounded-lg transition-colors ${canUndo ? 'text-gray-300 hover:bg-white/10 hover:text-white' : 'text-gray-600 cursor-not-allowed'}`}
                disabled={!canUndo}
                title="Undo"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button 
                onClick={redoLayerAction} 
                className={`p-2 rounded-lg transition-colors ${canRedo ? 'text-gray-300 hover:bg-white/10 hover:text-white' : 'text-gray-600 cursor-not-allowed'}`}
                disabled={!canRedo}
                title="Redo"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Neural/Splat Toggle */}
          <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
             <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Render Neural/Splat</span>
             <button className="w-12 h-6 bg-singularity rounded-full relative">
                <motion.div className="w-5 h-5 bg-black rounded-full absolute top-0.5 right-0.5" animate={{ x: -24 }} />
             </button>
          </div>
 
          <form onSubmit={handleAddLayer} className="relative mb-6">

            <input 
              type="text" 
              value={newLayerName}
              onChange={e => setNewLayerName(e.target.value)}
              placeholder="New layer name..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-quantum transition-all pr-12"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-quantum hover:scale-110 transition-transform">
              <Plus className="w-4 h-4" />
            </button>
          </form>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
            {layers.map((layer, index) => (
              <div key={layer.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all group">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${layer.visible ? 'bg-quantum' : 'bg-gray-700'}`} />
                  <span className="text-sm font-medium text-gray-300">{layer.name}</span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex flex-col gap-1 mr-2">
                    <button 
                      onClick={() => reorderLayers(index, Math.max(0, index - 1))}
                      className="p-1 hover:bg-white/10 rounded transition-colors text-gray-500 hover:text-white"
                      disabled={index === 0}
                    >
                      <ArrowRight className="w-3 h-3 -rotate-90" />
                    </button>
                    <button 
                      onClick={() => reorderLayers(index, Math.min(layers.length - 1, index + 1))}
                      className="p-1 hover:bg-white/10 rounded transition-colors text-gray-500 hover:text-white"
                      disabled={index === layers.length - 1}
                    >
                      <ArrowRight className="w-3 h-3 rotate-90" />
                    </button>
                  </div>
                  <button 
                    onClick={() => toggleLayerVisibility(layer.id)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                  >
                    <Globe className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => removeLayer(layer.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{layers.length} Total</span>
          </div>
        </div>

        {/* Material Inspection / Properties */}
        <div className="glass rounded-[2.5rem] p-8 border border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-singularity/20 flex items-center justify-center">
              <Settings2 className="w-4 h-4 text-singularity" />
            </div>
            <h2 className="text-xl font-bold uppercase tracking-widest">Properties</h2>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-gray-500">Roughness</label>
                <input type="range" className="w-full h-1 bg-white/10 rounded-full accent-singularity" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-gray-500">Metalness</label>
                <input type="range" className="w-full h-1 bg-white/10 rounded-full accent-singularity" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-gray-500">Emissive Color</label>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-singularity border border-white/20" />
                <span className="text-xs font-mono text-gray-400">#00F0FF</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
