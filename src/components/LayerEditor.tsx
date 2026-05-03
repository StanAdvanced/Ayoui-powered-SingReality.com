import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { 
  Layers as LayersIcon, 
  Eye as EyeIcon, 
  EyeOff as EyeOffIcon, 
  Trash2 as TrashIcon, 
  Plus as PlusIcon, 
  Settings2 as SettingsIcon, 
  GripVertical,
  Upload as UploadIcon,
  Palette as PaletteIcon,
  Box as BoxIcon,
  Type
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useSound } from '../hooks/useSound';

export function LayerEditor() {
  const { layers, setLayers, addLayer, removeLayer, toggleLayerVisibility, reorderLayers } = useStore();
  const { playClick } = useSound();
  const [newLayerName, setNewLayerName] = useState('');
  const [expandedLayer, setExpandedLayer] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLayerName.trim()) return;
    playClick();
    addLayer(newLayerName, 'https://raw.githubusercontent.com/pmndrs/drei-assets/master/truck.gltf');
    setNewLayerName('');
  };

  const updateLayer = (id: string, updates: any) => {
    const newLayers = layers.map(l => l.id === id ? { ...l, ...updates } : l);
    setLayers(newLayers);
  };

  return (
    <div className="flex flex-col h-full glass rounded-[2.5rem] border border-white/10 overflow-hidden bg-black/20 backdrop-blur-3xl">
      <div className="p-8 border-b border-white/5">
        <h3 className="text-sm font-bold uppercase tracking-[0.3em] flex items-center gap-3 mb-6">
          <LayersIcon className="w-5 h-5 text-singularity" /> Layer Stack Architecture
        </h3>
        
        <form onSubmit={handleAdd} className="flex gap-2">
          <div className="relative flex-1">
            <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              value={newLayerName}
              onChange={(e) => setNewLayerName(e.target.value)}
              placeholder="Deploy new layer..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:border-singularity outline-none transition-all placeholder:text-gray-600 font-mono"
            />
          </div>
          <button 
            type="submit"
            className="p-4 bg-singularity text-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)]"
          >
            <PlusIcon className="w-6 h-6" />
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        <Reorder.Group axis="y" values={layers} onReorder={setLayers} className="space-y-4">
          {layers.map((layer) => (
            <Reorder.Item 
              key={layer.id} 
              value={layer}
              className="relative group"
            >
              <div className={`glass rounded-3xl border transition-all ${expandedLayer === layer.id ? 'border-singularity/40 bg-singularity/5' : 'border-white/5 hover:border-white/20 bg-white/2 hover:bg-white/5'}`}>
                {/* Layer Header */}
                <div className="flex items-center gap-4 p-4">
                  <div className="cursor-grab active:cursor-grabbing p-2 text-gray-600 hover:text-white transition-colors">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  
                  <button 
                    onClick={() => { playClick(); toggleLayerVisibility(layer.id); }}
                    className={`p-3 rounded-2xl transition-all ${layer.visible ? 'bg-singularity text-black' : 'bg-white/5 text-gray-500 hover:text-white'}`}
                  >
                    {layer.visible ? <EyeIcon className="w-4 h-4" /> : <EyeOffIcon className="w-4 h-4" />}
                  </button>

                  <div className="flex-1 flex flex-col min-w-0">
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest leading-none mb-1">Index: {layers.indexOf(layer)}</span>
                    <span className="text-sm font-bold text-white truncate uppercase tracking-tight">{layer.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => { playClick(); setExpandedLayer(expandedLayer === layer.id ? null : layer.id); }}
                      className={`p-3 rounded-2xl backdrop-blur-xl border border-white/10 transition-all ${expandedLayer === layer.id ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                      <SettingsIcon className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => { playClick(); removeLayer(layer.id); }}
                      className="p-3 rounded-2xl bg-white/5 text-gray-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Layer Settings Content */}
                <AnimatePresence>
                  {expandedLayer === layer.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-white/5"
                    >
                      <div className="p-6 space-y-6">
                        {/* 3D Model URL */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono uppercase text-gray-500 tracking-widest flex items-center gap-2">
                            <BoxIcon className="w-3 h-3" /> Source Model URL
                          </label>
                          <div className="relative">
                            <input 
                              type="text" 
                              value={layer.url || ''}
                              onChange={(e) => updateLayer(layer.id, { url: e.target.value })}
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-quantum font-mono outline-none focus:border-quantum/50"
                              placeholder="https://..."
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <UploadIcon className="w-3 h-3 text-gray-600" />
                            </div>
                          </div>
                        </div>

                        {/* Adjustments */}
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <label className="text-[10px] font-mono uppercase text-gray-500 tracking-widest flex items-center gap-2">
                              <PaletteIcon className="w-3 h-3" /> Chromaticity
                            </label>
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-10 h-10 rounded-xl border border-white/20 shadow-inner"
                                style={{ backgroundColor: layer.color || '#ffffff' }}
                              />
                              <input 
                                type="color" 
                                value={layer.color || '#ffffff'}
                                onChange={(e) => updateLayer(layer.id, { color: e.target.value })}
                                className="opacity-0 absolute w-0 h-0"
                                id={`color-${layer.id}`}
                              />
                              <label 
                                htmlFor={`color-${layer.id}`}
                                className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-center cursor-pointer hover:bg-white/10 transition-colors uppercase"
                              >
                                {layer.color || '#ffffff'}
                              </label>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <label className="text-[10px] font-mono uppercase text-gray-500 tracking-widest">Transparency</label>
                              <span className="text-[10px] font-mono text-singularity">{Math.round((layer.opacity || 1) * 100)}%</span>
                            </div>
                            <input 
                              type="range" 
                              min="0" 
                              max="1" 
                              step="0.01"
                              value={layer.opacity || 1}
                              onChange={(e) => updateLayer(layer.id, { opacity: parseFloat(e.target.value) })}
                              className="w-full h-1 bg-white/10 rounded-full appearance-none accent-singularity"
                            />
                          </div>
                        </div>

                        {/* Toggles */}
                        <div className="flex items-center gap-4">
                           <button 
                             onClick={() => updateLayer(layer.id, { isHologram: !layer.isHologram })}
                             className={`flex-1 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${layer.isHologram ? 'bg-quantum/20 border-quantum text-quantum' : 'bg-white/5 border-white/10 text-gray-500'}`}
                           >
                             Hologram Mode
                           </button>
                           <button 
                             className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors"
                           >
                             Save Preset
                           </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>

      <div className="p-8 border-t border-white/5 bg-white/2">
        <button className="w-full py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]">
          Bake Creation Vector
        </button>
      </div>
    </div>
  );
}
