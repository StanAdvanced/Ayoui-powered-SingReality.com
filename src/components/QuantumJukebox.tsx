import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, ChevronUp, ChevronDown, Flame, Play, X, Zap } from 'lucide-react';
import { SafeCanvas } from './SafeCanvas';
import { Float, OrbitControls, Environment, useGLTF, Text3D } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D Visualizer element
function HolographicRecord({ isPlaying }: { isPlaying: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      if (isPlaying) {
        meshRef.current.rotation.y += delta * 2;
        meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.1;
      }
    }
  });

  return (
    <group>
      <mesh ref={meshRef} rotation={[Math.PI / 4, 0, 0]}>
        <cylinderGeometry args={[2, 2, 0.1, 64]} />
        <meshStandardMaterial 
          color="#111" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#ff00ff"
          emissiveIntensity={0.2}
        />
        {/* Grooves */}
        <mesh position={[0, 0.06, 0]}>
          <ringGeometry args={[0.5, 1.9, 64]} />
          <meshStandardMaterial color="#050505" side={THREE.DoubleSide} />
        </mesh>
        {/* Label */}
        <mesh position={[0, 0.07, 0]}>
          <circleGeometry args={[0.45, 32]} />
          <meshStandardMaterial color="#ffff00" transparent opacity={0.8} />
        </mesh>
      </mesh>
    </group>
  );
}


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
  onRemove: (index: number) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
  onPlayNow: (song: Song) => void;
  onClose: () => void;
  isPlaying: boolean;
}

export function QuantumJukebox({
  topTracks, queue, onAdd, onRemove, onMove, onPlayNow, onClose, isPlaying
}: QuantumJukeboxProps) {
  const [inactivityTimer, setInactivityTimer] = useState(10);
  const [mexicanChangeActive, setMexicanChangeActive] = useState<{song: Song, votes: number, required: number} | null>(null);

  // Auto-close after 10 seconds of inactivity
  useEffect(() => {
    if (mexicanChangeActive) return; // Don't auto-close during a vote
    
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
  }, [onClose, mexicanChangeActive]);

  const resetTimer = () => setInactivityTimer(10);

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
        <div className="absolute inset-0 opacity-30 pointer-events-none mix-blend-screen">
          <SafeCanvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#00ffff" />
            <pointLight position={[-10, -10, -10]} intensity={2} color="#ff00ff" />
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
               <HolographicRecord isPlaying={isPlaying} />
            </Float>
          </SafeCanvas>
        </div>

        {/* Header / Timer */}
        <div className="absolute top-4 right-6 z-20 flex gap-4 items-center">
           <div className="text-[10px] font-mono text-gray-400 bg-black/50 px-3 py-1 rounded-full uppercase">
              Auto-Close: <span className={inactivityTimer < 4 ? "text-red-500 animate-pulse font-bold" : "text-white"}>{inactivityTimer}s</span>
           </div>
           <button onClick={onClose} className="p-2 bg-red-500/20 hover:bg-red-500 text-white rounded-full transition-colors border border-red-500/50">
             <X className="w-4 h-4" />
           </button>
        </div>

        {/* Left Col: Hits & Voting */}
        <div className="flex-1 p-8 z-10 flex flex-col h-full overflow-hidden border-r border-white/10">
           <h2 className="text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 uppercase tracking-widest drop-shadow-[0_0_15px_rgba(0,255,255,0.5)] mb-6">
              Global Jukebox
           </h2>
           
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
           ) : (
             <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-4">
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
                       
                       <button onClick={() => onRemove(i)} className="p-2 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-lg transition">
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </motion.div>
                 ))
              )}
           </div>

           <div className="mt-4 pt-4 border-t border-white/10 text-center">
              <p className="text-[10px] uppercase font-mono text-gray-500 mb-2">Always rendering Real-Time 9D Graphics</p>
              <button onClick={onClose} className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-bold text-white uppercase tracking-widest shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:scale-105 transition-transform">
                Return to Room
              </button>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
