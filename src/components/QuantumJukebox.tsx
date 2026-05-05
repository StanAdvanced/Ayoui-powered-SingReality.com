import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, ChevronUp, ChevronDown, Flame, Play, X, Zap, DollarSign, Crown, AlertTriangle, Database, Brain, Sparkles } from 'lucide-react';
import { SafeCanvas } from './SafeCanvas';
import { Float, OrbitControls, Environment, PointMaterial, Points, Stars, MeshDistortMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, Glitch, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Ultra-advanced "9D" Holographic visualizer
function IntenseHologram({ isPlaying, liquidPulse }: { isPlaying: boolean, liquidPulse: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const liquidRef = useRef(0);

  // Generate particle positions
  const particleCount = 2000;
  const positions = useMemo(() => {
    const coords = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
       const theta = Math.random() * Math.PI * 2;
       const phi = Math.acos((Math.random() * 2) - 1);
       const r = 3 + Math.random() * 2;
       coords[i * 3] = r * Math.sin(phi) * Math.cos(theta);
       coords[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
       coords[i * 3 + 2] = r * Math.cos(phi);
    }
    return coords;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    
    // Smoothly decay liquidPulse
    liquidRef.current = THREE.MathUtils.lerp(liquidRef.current, liquidPulse > Date.now() - 2000 ? 1 : 0, 0.05);

    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(t / 2) * 0.5;
      meshRef.current.rotation.y += delta * (isPlaying ? 1.5 : 0.2);
    }
    if (coreRef.current) {
      coreRef.current.rotation.x += delta;
      coreRef.current.rotation.y += delta * 1.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * (isPlaying ? 2 : 0.5);
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.1;
      if (isPlaying) {
         const scale = 1 + Math.sin(t * 8) * 0.1;
         particlesRef.current.scale.set(scale, scale, scale);
      } else {
         particlesRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <group>
      <Float speed={isPlaying ? 4 : 1} rotationIntensity={1} floatIntensity={2}>
        <mesh ref={meshRef}>
          <torusKnotGeometry args={[1.5, 0.4, 256, 32]} />
          <MeshDistortMaterial 
            color="#ff00ff"
            emissive="#ff00ff"
            emissiveIntensity={(isPlaying ? 2 : 0.5) + liquidRef.current * 4}
            metalness={0.9}
            roughness={0.1}
            distort={(isPlaying ? 0.6 : 0.2) + liquidRef.current * 1.5}
            speed={(isPlaying ? 5 : 1) + liquidRef.current * 10}
            opacity={0.8}
            transparent
          />
        </mesh>
        <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <torusKnotGeometry args={[2.5, 0.1, 128, 16, 3, 4]} />
          <meshStandardMaterial 
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={2}
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial 
            color="#00ffff" 
            emissive="#00ffff"
            emissiveIntensity={isPlaying ? 3 : 1}
            wireframe
          />
        </mesh>
        <group ref={ringRef}>
          {Array.from({ length: 3 }).map((_, i) => (
            <mesh key={i} rotation={[Math.PI / 2, 0, (i * Math.PI) / 3]}>
              <torusGeometry args={[2.5, 0.05, 16, 100]} />
              <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={2} />
            </mesh>
          ))}
        </group>
      </Float>

      <Points ref={particlesRef} positions={positions}>
        <PointMaterial transparent color="#ffff00" size={0.05} sizeAttenuation={true} depthWrite={false} emissive="#ffff00" emissiveIntensity={2} />
      </Points>
    </group>
  );
}


import { getJukeboxSuggestions } from '../services/aiJukebox';

export interface Song {
  id: string;
  title: string;
  artist: string;
  views: string;
}

interface QuantumJukeboxProps {
  topTracks: Song[];
  queue: Song[];
  onAdd: (song: Song) => void;
  onAddPriority: (song: Song) => void;
  onRemove: (index: number) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
  onPlayNow: (song: Song) => void;
  onClose: () => void;
  isPlaying: boolean;
}

export function QuantumJukebox({
  topTracks, queue, onAdd, onAddPriority, onRemove, onMove, onPlayNow, onClose, isPlaying
}: QuantumJukeboxProps) {
  const [inactivityTimer, setInactivityTimer] = useState(15);
  const [mexicanChangeActive, setMexicanChangeActive] = useState<{song: Song, votes: number, required: number} | null>(null);
  const [activeTab, setActiveTab] = useState<'hits' | 'bidding' | 'ai'>('hits');
  const [isPersistent, setIsPersistent] = useState(localStorage.getItem('jukebox_persist_optin') === 'true');
  const [biddingState, setBiddingState] = useState<{song: Song | null, amount: number, processing: boolean}>({song: null, amount: 50, processing: false});
  const [aiSuggestions, setAiSuggestions] = useState<Song[]>([]);
  const [isAILoading, setIsAILoading] = useState(false);
  const [liquidPulse, setLiquidPulse] = useState(0);

  const triggerLiquid = () => setLiquidPulse(Date.now());

  // Fetch AI suggestions when switching to 'ai' tab
  useEffect(() => {
    if (activeTab === 'ai' && aiSuggestions.length === 0 && !isAILoading) {
      const fetchSuggestions = async () => {
        setIsAILoading(true);
        const titles = queue.map(s => s.title);
        const results = await getJukeboxSuggestions(titles);
        // Map to Song type, giving dummy ids
        const newSongs: Song[] = results.map((r, i) => ({
          id: `ai-${Date.now()}-${i}`,
          title: r.title || 'Unknown Title',
          artist: r.artist || 'Unknown Artist',
          views: 'AI Suggested'
        }));
        setAiSuggestions(newSongs);
        setIsAILoading(false);
      };
      fetchSuggestions();
    }
  }, [activeTab, queue, aiSuggestions.length, isAILoading]);

  // Auto-close after 15 seconds of inactivity
  useEffect(() => {
    if (mexicanChangeActive || biddingState.song) return; // Don't auto-close during a vote or bid
    
    const interval = setInterval(() => {
      setInactivityTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onClose, mexicanChangeActive, biddingState.song]);

  const resetTimer = () => setInactivityTimer(15);

  const togglePersistence = () => {
    const val = !isPersistent;
    setIsPersistent(val);
    localStorage.setItem('jukebox_persist_optin', String(val));
    if(!val) {
      // Opt-out logic (falling back to Autonomous Youtube Engine)
      alert("Opted out. The queue will reset to the standard Autonomous YouTube Engine upon exit.");
    }
  };

  const handleMexicanChange = (song: Song) => {
    // Propose Mexican Change
    if (mexicanChangeActive) return;
    setMexicanChangeActive({ song, votes: 1, required: 50 }); // Simulate 50 users

    // Simulate community voting
    let currentVotes = 1;
    const voteInterval = setInterval(() => {
      currentVotes += Math.floor(Math.random() * 5); // random jump
      if (currentVotes >= 25) { // 50% of 50 users
        clearInterval(voteInterval);
        setMexicanChangeActive(prev => prev ? { ...prev, votes: 26 } : null);
        
        setTimeout(() => {
          onPlayNow(song); // Viral change successful
          setMexicanChangeActive(null);
        }, 1500);
      } else {
         setMexicanChangeActive(prev => prev ? { ...prev, votes: currentVotes } : null);
      }
    }, 400);

    // Fail safe
    setTimeout(() => {
       clearInterval(voteInterval);
       if (currentVotes < 25) {
         setMexicanChangeActive(null); // Failed vote
       }
    }, 6000);
  };

  const handleBidSubmit = () => {
     setBiddingState(p => ({...p, processing: true}));
     setTimeout(() => {
        if(biddingState.song) {
           onAddPriority(biddingState.song);
           triggerLiquid();
        }
        setBiddingState({song: null, amount: 50, processing: false});
     }, 2000);
  }

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0, rotateX: 20 }}
      animate={{ scale: 1, opacity: 1, rotateX: 0 }}
      exit={{ scale: 0.9, opacity: 0, rotateX: -20, y: 100 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      className="absolute inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[20px] bg-black/80 shadow-[inset_0_0_200px_rgba(255,0,255,0.1)]"
      onMouseMove={resetTimer}
      onClick={resetTimer}
    >
      <div className="w-full max-w-6xl h-[85vh] rounded-[2rem] border-[4px] border-white/10 bg-[#0a0a0a]/90 shadow-[0_0_100px_rgba(0,255,255,0.2)] relative flex flex-col md:flex-row overflow-hidden">
        
        {/* Holographic 3D Background */}
        <div className="absolute inset-0 pointer-events-none mix-blend-screen overflow-hidden rounded-[2rem]">
          <SafeCanvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ antialias: false, powerPreference: "high-performance" }}>
            <color attach="background" args={["#000"]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={4} color="#00ffff" />
            <pointLight position={[-10, -10, -10]} intensity={4} color="#ff00ff" />
            <IntenseHologram isPlaying={isPlaying} liquidPulse={liquidPulse} />
            <EffectComposer>
               <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={2} />
               <ChromaticAberration offset={new THREE.Vector2(0.002, 0.002)} blendFunction={BlendFunction.NORMAL} />
               <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer>
          </SafeCanvas>
        </div>

        {/* Header / Timer */}
        <div className="absolute top-4 right-6 z-20 flex gap-4 items-center">
           <button onClick={togglePersistence} className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase border transition-colors ${isPersistent ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' : 'bg-white/5 text-gray-500 border-white/10'}`}>
              <Database className="w-3 h-3" />
              {isPersistent ? 'Frontend Persistent Storage: ON' : 'Autonomous Engine 24/7 Mode'}
           </button>
           <div className="text-[10px] font-mono text-gray-400 bg-black/50 px-3 py-1 rounded-full uppercase">
              Auto-Close: <span className={inactivityTimer < 4 ? "text-red-500 animate-pulse font-bold" : "text-white"}>{inactivityTimer}s</span>
           </div>
           <button onClick={onClose} className="p-2 bg-red-500/20 hover:bg-red-500 text-white rounded-full transition-colors border border-red-500/50">
             <X className="w-4 h-4" />
           </button>
        </div>

        {/* Left Col: Hits & Voting */}
        <div className="flex-1 p-8 z-10 flex flex-col h-full overflow-hidden border-r border-white/10">
           <div className="flex justify-between items-end mb-6">
              <h2 className="text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 uppercase tracking-widest drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                  Global Jukebox
              </h2>
              <div className="flex gap-2 bg-black/50 p-1 rounded-full border border-white/10 flex-wrap">
                 <button onClick={() => setActiveTab('hits')} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'hits' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>Top 100</button>
                 <button onClick={() => setActiveTab('bidding')} className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'bidding' ? 'bg-yellow-400 text-black' : 'text-gray-500 hover:text-yellow-400'}`}>
                   <Crown className="w-3 h-3" /> Monetised Bids
                 </button>
                 <button onClick={() => setActiveTab('ai')} className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'ai' ? 'bg-purple-500 text-white' : 'text-gray-500 hover:text-purple-400'}`}>
                   <Brain className="w-3 h-3" /> AI DJ
                 </button>
              </div>
           </div>
           
           {mexicanChangeActive ? (
             <div className="flex-1 flex items-center justify-center">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-500 p-8 rounded-3xl text-center w-full max-w-md backdrop-blur-xl"
                >
                  <Flame className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Mexican Change!</h3>
                  <p className="text-sm text-gray-300 mb-6 font-mono">Attempting Viral Override for<br/><span className="text-white font-bold">{mexicanChangeActive.song.title}</span></p>
                  
                  <div className="w-full bg-black/50 h-6 rounded-full overflow-hidden border border-white/20 relative">
                     <motion.div 
                        className="h-full bg-gradient-to-r from-red-500 to-yellow-400"
                        animate={{ width: `${(mexicanChangeActive.votes / mexicanChangeActive.required) * 100}%` }}
                        transition={{ ease: "easeOut" }}
                     />
                     <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white mix-blend-difference uppercase">
                        {mexicanChangeActive.votes} / {mexicanChangeActive.required} Required (50%)
                     </div>
                  </div>
                  {mexicanChangeActive.votes >= 25 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 font-bold uppercase tracking-widest mt-4 text-sm pulse">
                      Override Successful!
                    </motion.div>
                  )}
                </motion.div>
             </div>
           ) : activeTab === 'bidding' ? (
              <div className="flex-1 flex flex-col pt-4">
                 <div className="bg-gradient-to-r from-yellow-500/20 to-red-500/20 border border-yellow-500/50 p-6 rounded-2xl mb-6 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                       <DollarSign className="w-32 h-32 text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-bold text-yellow-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                       <Crown className="w-6 h-6" /> Premium Queue Placement
                    </h3>
                    <p className="text-gray-300 text-sm max-w-lg font-mono">
                       Guarantee your track plays next. Authorized and captured securely via Stripe® / PayPal® models. Non-paying users can risk losing their spot to higher bids!
                    </p>
                 </div>

                 {biddingState.song ? (
                    <div className="flex-1 flex items-center justify-center">
                       <motion.div className="bg-black/60 p-8 border border-yellow-500/30 rounded-3xl w-full max-w-sm text-center">
                          <h4 className="text-yellow-400 font-bold mb-4 uppercase">Authorize Bid</h4>
                          <div className="text-white font-mono mb-2 truncate">Song: {biddingState.song.title}</div>
                          <div className="text-3xl font-black text-white mb-6">
                            $<input type="number" value={biddingState.amount} onChange={e => setBiddingState(p => ({...p, amount: Number(e.target.value)}))} className="bg-transparent border-b-2 border-white/20 w-24 text-center focus:outline-none focus:border-yellow-400" />
                          </div>
                          <button onClick={handleBidSubmit} disabled={biddingState.processing} className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                            {biddingState.processing ? <><motion.div animate={{rotate:360}} transition={{repeat: Infinity, ease: "linear", duration: 1}}><Zap className="w-5 h-5"/></motion.div> Processing...</> : 'Confirm Payment'}
                          </button>
                          <button onClick={() => setBiddingState(p => ({...p, song: null}))} className="mt-4 text-xs text-gray-500 hover:text-white uppercase font-mono">Cancel</button>
                       </motion.div>
                    </div>
                 ) : (
                    <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-4">
                      {topTracks.slice(0, 7).map((song, i) => (
                        <motion.div 
                          key={song.id}
                          className="flex justify-between items-center bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:border-yellow-500/50 group transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-4 truncate">
                            <span className="font-mono text-gray-500 group-hover:text-yellow-400 text-lg w-6">{i + 1}</span>
                            <div className="truncate">
                              <h4 className="font-bold text-white group-hover:text-yellow-50 text-md truncate">{song.title}</h4>
                              <p className="text-xs text-gray-400 font-mono truncate">{song.artist}</p>
                            </div>
                          </div>
                          
                          <button 
                             onClick={() => setBiddingState(p => ({...p, song}))}
                             className="px-4 py-2 bg-yellow-400/20 hover:bg-yellow-400 text-yellow-200 hover:text-black rounded-lg border border-yellow-400/50 text-xs font-bold uppercase flex items-center gap-1 transition-colors shrink-0"
                          >
                             Bid Now
                          </button>
                        </motion.div>
                      ))}
                    </div>
                 )}
              </div>
           ) : activeTab === 'ai' ? (
              <div className="flex-1 flex flex-col pt-4 overflow-hidden relative">
                 <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 p-6 rounded-2xl mb-6 backdrop-blur-md relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                       <Brain className="w-32 h-32 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                       <Sparkles className="w-6 h-6" /> AI DJ Suggestions
                    </h3>
                    <p className="text-gray-300 text-sm max-w-lg font-mono">
                       Intelligent track curation powered by Gemini 2.5 Flash, matching the current vibe of the room and queued songs.
                    </p>
                 </div>

                 <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-4">
                    {isAILoading ? (
                       <div className="flex flex-col items-center justify-center p-12 text-purple-400 text-sm font-mono uppercase tracking-widest">
                          <motion.div animate={{rotate:360}} transition={{repeat: Infinity, ease: "linear", duration: 2}} className="mb-4">
                             <Zap className="w-8 h-8" />
                          </motion.div>
                          Analyzing Vibe...
                       </div>
                    ) : aiSuggestions.length > 0 ? (
                       aiSuggestions.map((song, i) => (
                           <motion.div 
                           key={song.id}
                           className="flex justify-between items-center bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:border-purple-500/50 group transition-all"
                           >
                           <div className="flex items-center gap-4 truncate">
                              <span className="font-mono text-purple-500 group-hover:text-purple-400 text-lg w-6">AI</span>
                              <div className="truncate">
                                 <h4 className="font-bold text-white group-hover:text-purple-50 text-md truncate">{song.title}</h4>
                                 <p className="text-xs text-gray-400 font-mono truncate">{song.artist}</p>
                              </div>
                           </div>
                           
                           <button 
                              onClick={() => {
                                 onAdd(song);
                                 setAiSuggestions(prev => prev.filter(s => s.id !== song.id));
                                 triggerLiquid();
                              }}
                              className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500 text-purple-200 hover:text-white rounded-lg border border-purple-500/50 text-xs font-bold uppercase flex items-center gap-1 transition-colors shrink-0"
                           >
                              <Plus className="w-4 h-4" /> Add
                           </button>
                           </motion.div>
                       ))
                    ) : (
                       <div className="text-center text-gray-500 font-mono py-12">No recommendations available. Try adding some songs first!</div>
                    )}
                 </div>
              </div>
           ) : (
             <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-4">
               {!isPersistent && (
                  <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg mb-4 flex items-start gap-3">
                     <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                     <p className="text-xs text-red-200 font-mono">
                        You are currently in <strong>Autonomous Mode</strong>. Your queue will not be saved upon exit unless you opt-in to persistent storage using the toggle above! Playback may be overridden by Premium Bids.
                     </p>
                  </div>
               )}
               {topTracks.map((song, i) => (
                 <motion.div 
                   key={song.id}
                   whileHover={{ scale: 1.02 }}
                   className="flex justify-between items-center bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:border-cyan-500/50 group transition-all cursor-pointer"
                 >
                   <div className="flex items-center gap-4 truncate">
                     <span className="font-mono text-gray-500 group-hover:text-cyan-400 text-lg w-6">{i + 1}</span>
                     <div className="truncate">
                       <h4 className="font-bold text-white group-hover:text-cyan-50 text-md truncate">{song.title}</h4>
                       <p className="text-xs text-gray-400 font-mono truncate">{song.artist} • {song.views} views</p>
                     </div>
                   </div>
                   
                   <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                     <button 
                       onClick={(e) => { e.stopPropagation(); onAdd(song); }}
                       className="p-2 bg-white/5 hover:bg-white/20 text-white rounded-lg border border-white/10" title="Add to Queue"
                     >
                       <Plus className="w-4 h-4" />
                     </button>
                     <button 
                       onClick={(e) => { e.stopPropagation(); handleMexicanChange(song); }}
                       className="px-3 py-1 bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white rounded-lg border border-red-500/50 text-xs font-bold uppercase flex items-center gap-1"
                     >
                       <Flame className="w-3 h-3" /> Viral Change
                     </button>
                   </div>
                 </motion.div>
               ))}
             </div>
           )}
        </div>

        {/* Right Col: Queue Container */}
        <div className="w-full md:w-1/3 bg-black/60 p-6 z-10 flex flex-col h-full border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.8)]">
           <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" /> Live Queue
           </h3>

           <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {queue.length === 0 ? (
                 <div className="text-center py-10 text-gray-500 font-mono text-sm border border-dashed border-white/10 rounded-xl">
                   Queue is empty.<br/>Add a track to keep the party alive.
                 </div>
              ) : (
                 queue.map((song, i) => (
                    <motion.div 
                       layout
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, scale: 0.9 }}
                       key={`${song.id}-${i}`}
                       className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center gap-3 group"
                    >
                       <div className="flex flex-col gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => onMove(i, 'up')} disabled={i === 0} className="hover:bg-white/20 rounded disabled:opacity-30 p-0.5"><ChevronUp className="w-3 h-3 text-white" /></button>
                         <button onClick={() => onMove(i, 'down')} disabled={i === queue.length - 1} className="hover:bg-white/20 rounded disabled:opacity-30 p-0.5"><ChevronDown className="w-3 h-3 text-white" /></button>
                       </div>
                       
                       <div className="flex-1 truncate">
                         <div className="text-sm font-bold text-white truncate">{song.title}</div>
                         <div className="text-[10px] text-cyan-400 font-mono truncate">{song.artist}</div>
                       </div>
                       
                       {i === 0 ? (
                          <div className="text-[8px] uppercase font-bold text-yellow-500 border border-yellow-500/50 bg-yellow-500/10 px-1.5 py-0.5 rounded mr-1">Up Next</div>
                       ) : null}

                       <button onClick={() => onRemove(i)} className="p-2 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-lg transition">
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </motion.div>
                 ))
              )}
           </div>

           <div className="mt-4 pt-4 border-t border-white/10 text-center">
              <p className="text-[10px] uppercase font-mono text-gray-500 mb-2">Always rendering Real-Time 9D Graphics</p>
              <button onClick={onClose} className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-bold text-white uppercase tracking-widest shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:scale-105 transition-transform flex items-center justify-center gap-2">
                <Play className="w-4 h-4" /> Return to Room
              </button>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

