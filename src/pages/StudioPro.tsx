import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, Eye, EyeOff, Trash2, Plus, ChevronUp, ChevronDown, 
  Upload, Maximize2, MousePointer2, MessageSquare, Send,
  Box as BoxIcon, Search, Image as ImageIcon, Briefcase, Frame
} from 'lucide-react';
import { SafeCanvas } from '../components/SafeCanvas';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, Grid, Box, TorusKnot } from '@react-three/drei';
import { XR, createXRStore } from '@react-three/xr';
import { useStore } from '../store/useStore';
import io, { Socket } from 'socket.io-client';

let xrStore: any = null;
try {
  // Only attempt to start XR store if we are in a capable environment
  xrStore = createXRStore();
} catch (e) {
  console.warn("WebXR not supported in this environment");
}

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  type: 'mesh' | 'light' | 'effect';
  url?: string;
  position?: [number, number, number];
}

interface UserCursor {
  userId: string;
  name: string;
  position: [number, number, number];
  color: string;
}

const ASSET_LIBRARY = [
  { id: '1', name: 'Cyberpunk Sofa', category: 'Furniture', type: 'model', icon: BoxIcon },
  { id: '2', name: 'Neon Plant', category: 'Decor', type: 'model', icon: BoxIcon },
  { id: '3', name: 'Holographic Pillar', category: 'Architectural Elements', type: 'model', icon: Frame },
  { id: '4', name: 'Quantum Flooring', category: 'Materials', type: 'texture', icon: ImageIcon },
  { id: '5', name: 'DJ Console', category: 'Furniture', type: 'model', icon: Briefcase },
];

function ModelViewer({ layers }: { layers: Layer[] }) {
  return (
    <>
      <fog attach="fog" args={['#000', 10, 20]} />
      <ambientLight intensity={0.5} />
      {layers.filter(l => l.visible).map((layer, i) => (
        <group key={layer.id} position={layer.position || [i * 1.5 - 2, 0, 0]}>
          {layer.type === 'mesh' ? (
             <mesh>
               <boxGeometry args={[1, 1, 1]} />
               <meshStandardMaterial color={layer.url ? "#ff007f" : "#00f0ff"} wireframe={!layer.url} />
             </mesh>
          ) : (
            <mesh>
              <torusKnotGeometry args={[0.5, 0.15, 64, 16]} />
              <meshStandardMaterial color="#7000ff" />
            </mesh>
          )}
        </group>
      ))}
    </>
  );
}

// Cursor Tracker to send 3D position
function CollabCursorTracker({ socket, sessionId, user }: { socket: Socket | null, sessionId: string, user: any }) {
  const { camera, pointer } = useThree();
  
  useFrame(() => {
    if (!socket || !user) return;
    // Simple projection logic for demo
    const x = pointer.x * 5;
    const y = pointer.y * 5;
    socket.emit("collab-cursor-move", {
      sessionId,
      userId: user.uid || 'anon',
      name: user.displayName || 'Guest',
      position: [x, y, 0],
      color: '#00f0ff'
    });
  });
  return null;
}

export function StudioPro() {
  const { user } = useStore();
  const [layers, setLayers] = useState<Layer[]>([
    { id: '1', name: 'Primary Base', visible: true, type: 'mesh', position: [0,0,0] },
  ]);
  const [messages, setMessages] = useState<{sender: string, message: string, time: string}[]>([]);
  const [inputText, setInputText] = useState('');
  
  const [cursors, setCursors] = useState<Record<string, UserCursor>>({});
  const [activeTab, setActiveTab] = useState<'layers' | 'assets'>('layers');
  const [searchQuery, setSearchQuery] = useState('');
  
  const socketRef = useRef<Socket | null>(null);
  const sessionId = "global-studio-1"; // Just hardcode one session for demo

  useEffect(() => {
    // Connect socket
    socketRef.current = io(); // Connects to the same host that serves the page
    
    socketRef.current.on('connect', () => {
      socketRef.current?.emit('join-collab', sessionId, { name: user?.displayName || 'Guest' });
    });

    socketRef.current.on('chat-update', (data) => {
      setMessages(prev => [...prev, data]);
    });

    socketRef.current.on('collab-cursor-update', (data: UserCursor) => {
      setCursors(prev => ({ ...prev, [data.userId]: data }));
    });

    socketRef.current.on('collab-cursor-remove', (userId: string) => {
      setCursors(prev => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
    });

    socketRef.current.on('scene-update', (newLayers: Layer[]) => {
      setLayers(newLayers);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave-collab', sessionId, { name: user?.displayName || 'Guest' });
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  const toggleVisibility = (id: string) => {
    const next = layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l);
    setLayers(next);
    socketRef.current?.emit('collab-scene-update', { sessionId, objects: next });
  };

  const removeLayer = (id: string) => {
    const next = layers.filter(l => l.id !== id);
    setLayers(next);
    socketRef.current?.emit('collab-scene-update', { sessionId, objects: next });
  };

  const addLayer = (name?: string, url?: string) => {
    const newLayer: Layer = {
      id: Math.random().toString(),
      name: name || `New Layer ${layers.length + 1}`,
      visible: true,
      type: 'mesh',
      url,
      position: [(Math.random()-0.5)*5, (Math.random()-0.5)*5, 0]
    };
    const next = [newLayer, ...layers];
    setLayers(next);
    socketRef.current?.emit('collab-scene-update', { sessionId, objects: next });
  };

  const sendMessage = () => {
    if (!inputText.trim() || !socketRef.current) return;
    socketRef.current.emit("collab-chat-message", {
      sessionId,
      sender: user?.displayName || 'Guest',
      message: inputText,
      time: new Date()
    });
    setInputText('');
  };

  const filteredAssets = ASSET_LIBRARY.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-80px)] bg-[#050505] overflow-hidden">
      {/* Left Panel */}
      <div className="w-80 bg-black border-r border-white/5 flex flex-col">
        <div className="flex border-b border-white/5">
          <button 
            onClick={() => setActiveTab('layers')}
            className={`flex-1 p-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'layers' ? 'text-singularity border-b-2 border-singularity bg-white/5' : 'text-gray-500 hover:bg-white/5'}`}
          >
            Layers
          </button>
          <button 
            onClick={() => setActiveTab('assets')}
            className={`flex-1 p-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'assets' ? 'text-quantum border-b-2 border-quantum bg-white/5' : 'text-gray-500 hover:bg-white/5'}`}
          >
            Asset Library
          </button>
        </div>

        {activeTab === 'layers' && (
          <>
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-gray-500 font-mono uppercase">Scene Hierarchy</span>
              <button onClick={() => addLayer()} className="p-2 hover:bg-white/5 rounded-lg transition-all text-gray-400">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              {layers.map((layer) => (
                <div key={layer.id} className={`p-4 rounded-2xl border border-white/5 flex flex-col gap-2 group transition-all ${layer.visible ? 'bg-white/5' : 'bg-transparent opacity-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-tight text-gray-300">{layer.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleVisibility(layer.id)} className="p-2 hover:text-white transition-colors">
                        {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-red-500" />}
                      </button>
                      <button onClick={() => removeLayer(layer.id)} className="p-2 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'assets' && (
          <>
            <div className="p-4 border-b border-white/5">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search assets, materials..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-quantum/50"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {filteredAssets.map(asset => {
                const Icon = asset.icon;
                return (
                  <div key={asset.id} className="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between cursor-pointer" onClick={() => addLayer(asset.name, 'asset')}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-black rounded-lg">
                        <Icon className="w-4 h-4 text-quantum" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{asset.name}</p>
                        <p className="text-[9px] uppercase tracking-widest text-gray-500">{asset.category}</p>
                      </div>
                    </div>
                    <Plus className="w-4 h-4 text-gray-400" />
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Main Viewport */}
      <div className="flex-1 relative flex flex-col">
         {/* Viewport Header */}
         <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-start pointer-events-none">
            <div className="pointer-events-auto flex flex-col gap-2">
               <div className="glass px-4 py-2 rounded-full border border-singularity/50 text-singularity text-[10px] font-black tracking-widest uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-singularity animate-pulse" />
                  Live Collab Mode
               </div>
               <h1 className="text-3xl font-display font-black italic tracking-tighter uppercase text-white">
                 SingReality <span className="text-gradient">Studio</span>
               </h1>
            </div>
            
            <div className="pointer-events-auto flex gap-2">
               {xrStore ? (
                  <>
                     <button onClick={() => xrStore?.enterAR()} className="px-4 py-2 glass rounded-full border border-white/10 hover:bg-white/5 transition-all text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                        <Maximize2 className="w-4 h-4" /> Enter AR
                     </button>
                     <button onClick={() => xrStore?.enterVR()} className="px-4 py-2 glass rounded-full border border-white/10 hover:bg-white/5 transition-all text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                        <Maximize2 className="w-4 h-4" /> Enter VR
                     </button>
                  </>
               ) : (
                  <div className="px-4 py-2 glass rounded-full border border-white/10 text-white/50 text-[10px] font-bold uppercase tracking-widest">
                     WebXR Not Supported
                  </div>
               )}
            </div>
         </div>

         {/* 3D Scene */}
         <div className="flex-1 bg-[radial-gradient(circle_at_50%_50%,#0a0a0a_0%,#000_100%)] relative">
            <SafeCanvas shadows gl={{ antialias: true, alpha: true }}>
               {xrStore ? (
                 <XR store={xrStore}>
                   <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
                   <color attach="background" args={['#000']} />
                   <CollabCursorTracker socket={socketRef.current} sessionId={sessionId} user={user} />
                   <Stage environment="night" intensity={0.5}>
                     <ModelViewer layers={layers} />
                   </Stage>
                   <Grid infiniteGrid fadeDistance={15} sectionColor="#111" cellColor="#050505" sectionSize={1} cellSize={1} />
                   <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} />
                 </XR>
               ) : (
                 <>
                   <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
                   <color attach="background" args={['#000']} />
                   <CollabCursorTracker socket={socketRef.current} sessionId={sessionId} user={user} />
                   <Stage environment="night" intensity={0.5}>
                     <ModelViewer layers={layers} />
                   </Stage>
                   <Grid infiniteGrid fadeDistance={15} sectionColor="#111" cellColor="#050505" sectionSize={1} cellSize={1} />
                   <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} />
                 </>
               )}
            </SafeCanvas>
            
            {/* Overlay Cursors */}
            {Object.values(cursors).map(cursor => (
              <motion.div 
                key={cursor.userId}
                className="absolute flex flex-col gap-1 pointer-events-none z-30"
                // Translate 3D position back to 2D for cursor
                animate={{ 
                  x: `${50 + (cursor.position[0] * 10)}%`, 
                  y: `${50 - (cursor.position[1] * 10)}%` 
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="flex items-center gap-2">
                   <MousePointer2 className="w-4 h-4 text-quantum" fill="currentColor" />
                   <div className="glass px-2 py-1 rounded-lg border border-quantum/50 text-[10px] font-bold text-white uppercase tracking-widest whitespace-nowrap">
                      {cursor.name}
                   </div>
                </div>
              </motion.div>
            ))}
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
                  <span className="text-[9px] font-black uppercase text-singularity">{msg.sender}</span>
                  <span className="text-[8px] font-mono text-gray-600">
                    {new Date(msg.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
               </div>
               <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-[11px] text-gray-300 leading-relaxed break-words">
                  {msg.message}
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
        </div>
      </div>
    </div>
  );
}
