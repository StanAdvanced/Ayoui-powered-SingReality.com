import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Trash2, 
  Plus, 
  ChevronUp, 
  ChevronDown, 
  Box as BoxIcon, 
  Upload,
  Maximize2,
  MousePointer2,
  MessageSquare,
  Send,
  Zap,
  Sparkles
} from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, Grid, useGLTF, Box } from '@react-three/drei';
import { useStore } from '../store/useStore';

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  type: 'mesh' | 'light' | 'effect';
}

function ModelViewer({ url }: { url: string | null }) {
  // If we had a real URL, we'd use useGLTF(url)
  // For demo, we use a placeholder box if no model
  return (
    <>
      {url ? (
         <Box args={[1, 1, 1]}>
           <meshStandardMaterial color="#00f0ff" wireframe />
         </Box>
      ) : (
        <mesh>
          <torusKnotGeometry args={[1, 0.3, 128, 16]} />
          <meshStandardMaterial color="#7000ff" metalness={0.8} roughness={0.2} />
        </mesh>
      )}
    </>
  );
}

export function StudioPro() {
  const { user } = useStore();
  const [layers, setLayers] = useState<Layer[]>([
    { id: '1', name: 'Primary Mesh', visible: true, type: 'mesh' },
    { id: '2', name: 'Volumetric Lighting', visible: true, type: 'light' },
    { id: '3', name: 'Particle Field', visible: false, type: 'effect' },
  ]);
  const [messages, setMessages] = useState<{user: string, text: string}[]>([]);
  const [inputText, setInputText] = useState('');
  const [isCollaborating, setIsCollaborating] = useState(true);

  const toggleVisibility = (id: string) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
  };

  const removeLayer = (id: string) => {
    setLayers(prev => prev.filter(l => l.id !== id));
  };

  const addLayer = () => {
    const newLayer: Layer = {
      id: Math.random().toString(),
      name: `New Layer ${layers.length + 1}`,
      visible: true,
      type: 'mesh'
    };
    setLayers([newLayer, ...layers]);
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;
    setMessages([...messages, { user: user?.displayName || 'Anonymous', text: inputText }]);
    setInputText('');
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-[#050505] overflow-hidden">
      {/* Layer Panel */}
      <div className="w-80 bg-black border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Layers className="w-5 h-5 text-singularity" />
             <h2 className="text-sm font-black uppercase tracking-widest text-white">Project Layers</h2>
          </div>
          <button onClick={addLayer} className="p-2 hover:bg-white/5 rounded-lg transition-all text-gray-400">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {layers.map((layer, index) => (
            <div 
              key={layer.id}
              className={`p-4 rounded-2xl border border-white/5 flex items-center justify-between group transition-all ${layer.visible ? 'bg-white/5' : 'bg-transparent opacity-50'}`}
            >
              <div className="flex items-center gap-3">
                 <div className="flex flex-col gap-1">
                    <button className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity"><ChevronUp className="w-3 h-3" /></button>
                    <button className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity"><ChevronDown className="w-3 h-3" /></button>
                 </div>
                 <span className="text-[10px] font-bold uppercase tracking-tight text-gray-300">{layer.name}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => toggleVisibility(layer.id)}
                  className="p-2 hover:text-white transition-colors"
                >
                  {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-red-500" />}
                </button>
                <button 
                  onClick={() => removeLayer(layer.id)}
                  className="p-2 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 relative flex flex-col">
         {/* Viewport Header */}
         <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-start pointer-events-none">
            <div className="pointer-events-auto flex flex-col gap-2">
               <div className="glass px-4 py-2 rounded-full border border-singularity/50 text-singularity text-[10px] font-black tracking-widest uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-singularity animate-pulse" />
                  Live Session: Deep Mapping Mode
               </div>
               <h1 className="text-3xl font-display font-black italic tracking-tighter uppercase text-white">
                 SingReality <span className="text-gradient">Studio Pro</span>
               </h1>
            </div>

            <div className="pointer-events-auto flex gap-2">
               <button className="px-6 py-3 glass rounded-full border border-white/10 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-white/5 transition-all text-white">
                  <Upload className="w-4 h-4" /> Import glTF/OBJ
               </button>
               <button className="p-3 glass rounded-full border border-white/10 hover:bg-white/5 transition-all text-white">
                  <Maximize2 className="w-5 h-5" />
               </button>
            </div>
         </div>

         {/* 3D Scene */}
         <div className="flex-1 bg-[radial-gradient(circle_at_50%_50%,#0a0a0a_0%,#000_100%)]">
            <Canvas shadows gl={{ antialias: true }}>
               <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50} />
               <color attach="background" args={['#000']} />
               <fog attach="fog" args={['#000', 10, 20]} />
               
               <Stage environment="night" intensity={0.5}>
                 <ModelViewer url={null} />
               </Stage>

               <Grid 
                 infiniteGrid 
                 fadeDistance={15} 
                 sectionColor="#111" 
                 cellColor="#050505" 
                 sectionSize={1} 
                 cellSize={1} 
               />
               
               <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} />
            </Canvas>
         </div>

         {/* Collaboration Cursors Overlay (Visual only for now) */}
         <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div 
              className="absolute top-1/3 left-1/4 flex flex-col gap-2 pointer-events-none"
              animate={{ x: [0, 50, -50, 0], y: [0, -30, 30, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
            >
              <div className="flex items-center gap-2">
                 <MousePointer2 className="w-4 h-4 text-quantum" fill="currentColor" />
                 <div className="glass px-2 py-1 rounded-lg border border-quantum/50 text-[8px] font-bold text-white uppercase tracking-widest">
                    QuantumDev_01
                 </div>
              </div>
            </motion.div>
         </div>
      </div>

      {/* Collaboration Chat */}
      <div className="w-80 bg-black border-l border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-quantum" />
          <h2 className="text-sm font-black uppercase tracking-widest text-white">Global Uplink</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
           {messages.length === 0 && (
             <p className="text-[10px] text-gray-500 font-mono text-center py-12 uppercase tracking-widest opacity-50">
               Secure Channel Established
             </p>
           )}
           {messages.map((msg, i) => (
             <div key={i} className="flex flex-col gap-1">
               <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase text-singularity">{msg.user}</span>
                  <span className="text-[8px] font-mono text-gray-600">10:52 AM</span>
               </div>
               <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-[11px] text-gray-300 leading-relaxed">
                  {msg.text}
               </div>
             </div>
           ))}
        </div>

        <div className="p-6 border-t border-white/5 space-y-4">
           <div className="relative">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Synchronize with team..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-singularity/50 transition-all font-mono"
              />
              <button 
                onClick={sendMessage}
                className="absolute top-1/2 -translate-y-1/2 right-4 p-2 text-singularity hover:scale-110 transition-all"
              >
                 <Send className="w-4 h-4" />
              </button>
           </div>
           
           <div className="flex items-center justify-between text-[8px] font-mono font-bold uppercase tracking-widest">
              <div className="flex items-center gap-1 text-green-500">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                 Low Latency Sync
              </div>
              <div className="text-gray-500">
                 Encryption: Quantum AES
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
