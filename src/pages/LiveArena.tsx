import React, { useEffect, useState, useRef, Suspense } from 'react';
import { io } from 'socket.io-client';
import { motion } from 'motion/react';
import { Mic, Users, Plus, MousePointer2, Box, Loader2, Brain, Zap } from 'lucide-react';
import { SafeCanvas } from '../components/SafeCanvas';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Text, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { AISongSincvEngine } from '../services/aisongSincvEngine';
import { SuperBrain } from '../components/SuperBrain';
import { CinematicBackscreen } from '../components/CinematicBackscreen';
import { ConcertEffects } from '../components/ConcertEffects';
import { BiometricPanel } from '../components/BiometricPanel';
import { DJVerseOverlay } from '../components/DJVerseOverlay';
import { djVerseService } from '../services/djVerseService';

const socket = io();

function RemoteCursor({ position, userId }: { position: [number, number, number], userId: string }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="cyan" emissive="cyan" emissiveIntensity={2} />
      <Text position={[0, 0.3, 0]} fontSize={0.1} color="white">
        {userId.slice(0, 4)}
      </Text>
    </mesh>
  );
}

function RemoteAvatar({ position, rotation, userId }: { position: [number, number, number], rotation: [number, number, number], userId: string }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[0.5, 1, 0.5]} />
        <meshStandardMaterial color="#A855F7" />
      </mesh>
      <Text position={[0, 1.2, 0]} fontSize={0.2} color="white">
        {userId.slice(0, 4)}
      </Text>
    </group>
  );
}

function Scene({ arenaId, onCursorMove, biometricData }: { arenaId: string, onCursorMove: (pos: [number, number, number]) => void, biometricData: any }) {
  const { viewport, mouse } = useThree();
  const [remoteCursors, setRemoteCursors] = useState<Record<string, [number, number, number]>>({});
  const [remoteAvatars, setRemoteAvatars] = useState<Record<string, { position: [number, number, number], rotation: [number, number, number] }>>({});

  useEffect(() => {
    socket.on('cursor-update', (data) => {
      setRemoteCursors(prev => ({ ...prev, [data.userId]: data.position }));
    });
    socket.on('avatar-update', (data) => {
      setRemoteAvatars(prev => ({ ...prev, [data.userId]: { position: data.position, rotation: data.rotation } }));
    });
    return () => {
      socket.off('cursor-update');
      socket.off('avatar-update');
    };
  }, []);

  useFrame((state) => {
    const x = (state.mouse.x * viewport.width) / 2;
    const y = (state.mouse.y * viewport.height) / 2;
    onCursorMove([x, y, 0]);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <SuperBrain biometricData={biometricData} onClick={() => console.log('Brain clicked!')} />

      {Object.entries(remoteCursors).map(([id, pos]) => (
        <RemoteCursor key={id} userId={id} position={pos} />
      ))}

      {Object.entries(remoteAvatars).map(([id, data]) => (
        <RemoteAvatar key={id} userId={id} position={data.position} rotation={data.rotation} />
      ))}

      <OrbitControls enablePan={false} />
    </>
  );
}

export function LiveArena() {
  const [arenaId, setArenaId] = useState('global-arena');
  const [joined, setJoined] = useState(false);
  const [queue, setQueue] = useState<string[]>([]);
  const [currentLyrics, setCurrentLyrics] = useState('');
  const [song, setSong] = useState('');
  const [biometricSync, setBiometricSync] = useState(false);
  const [biometricData, setBiometricData] = useState({
    heartRate: 70,
    alphaWave: 0.5,
    thetaWave: 0.5,
    timestamp: Date.now()
  });

  useEffect(() => {
    let interval: any;
    if (biometricSync) {
      interval = setInterval(async () => {
        setBiometricData(prev => {
          const newData = {
            heartRate: Math.max(60, Math.min(180, prev.heartRate + (Math.random() - 0.5) * 4)),
            alphaWave: Math.max(0, Math.min(1, prev.alphaWave + (Math.random() - 0.5) * 0.1)),
            thetaWave: Math.max(0, Math.min(1, prev.thetaWave + (Math.random() - 0.5) * 0.1)),
            timestamp: Date.now()
          };
          
          const engine = AISongSincvEngine.getInstance();
          engine.synthesize(newData).catch(console.error);
          
          return newData;
        });
      }, 500); // Faster updates for smoother simulation
    } else {
      const engine = AISongSincvEngine.getInstance();
      engine.stopSynthesis();
    }
    return () => {
      if (interval) clearInterval(interval);
      const engine = AISongSincvEngine.getInstance();
      engine.stopSynthesis();
    };
  }, [biometricSync]);

  useEffect(() => {
    if (biometricSync && biometricData.heartRate > 120) {
      djVerseService.generateActivityCommentary(`Heart rate spike detected at ${Math.round(biometricData.heartRate)} BPM! The crowd is going wild! Current lyrics vibe: ${currentLyrics.slice(0, 50)}`);
    } else if (biometricSync && biometricData.heartRate < 70) {
       djVerseService.generateActivityCommentary(`Heart rate at ${Math.round(biometricData.heartRate)} BPM. Time for some melodic transition.`);
    }
  }, [biometricData.heartRate, biometricSync, currentLyrics]);

  const [messages, setMessages] = useState<{ userId: string, text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    socket.on('queue-update', (data) => {
      setQueue(prev => [...prev, data.song]);
    });
    socket.on('lyrics-update', (data) => {
      setCurrentLyrics(data.lyrics);
    });
    socket.on('chat-message', (data) => {
      setMessages(prev => [...prev, data]);
    });

    return () => {
      socket.off('queue-update');
      socket.off('lyrics-update');
      socket.off('chat-message');
    };
  }, []);

  const sendChatMessage = () => {
    if (chatInput.trim()) {
      socket.emit('send-chat-message', { arenaId, text: chatInput });
      setChatInput('');
    }
  };

  const addToQueue = () => {
    socket.emit('add-to-queue', { arenaId, song });
    setSong('');
  };

  const syncLyrics = (lyrics: string) => {
    socket.emit('sync-lyrics', { arenaId, lyrics });
  };

  const handleCursorMove = (position: [number, number, number]) => {
    socket.emit('cursor-move', { arenaId, position });
  };

  return (
    <div className="min-h-screen relative">
      <CinematicBackscreen opacity={1} pageType="djverse" />
      <ConcertEffects />
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-black uppercase tracking-tighter">LIVE <span className="text-gradient">ARENA</span></h1>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setBiometricSync(!biometricSync)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${biometricSync ? 'bg-quantum text-black' : 'glass text-gray-400'}`}
          >
            <Brain className="w-4 h-4" /> {biometricSync ? 'BIOMETRIC SYNC ACTIVE' : 'ENABLE BIO-SYNC'}
          </button>
          <div className="flex items-center gap-2 px-4 py-2 glass rounded-full text-xs font-bold text-singularity">
            <Users className="w-4 h-4" /> 1,240 ONLINE
          </div>
        </div>
      </div>

      {!joined ? (
        <div className="h-[600px] glass rounded-[3rem] flex flex-col items-center justify-center border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <SafeCanvas>
              <Stars />
            </SafeCanvas>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 text-center"
          >
            <Mic className="w-16 h-16 text-singularity mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl font-bold mb-4 uppercase tracking-widest">Ready to perform?</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">Join the global stage and collaborate with artists from 195 countries in real-time.</p>
            <button 
              onClick={() => { socket.emit('join-arena', arenaId); setJoined(true); }} 
              className="bg-white text-black px-12 py-4 rounded-2xl font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              Enter Arena
            </button>
          </motion.div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            {/* 3D Scene */}
            <div className="h-[600px] glass rounded-[3rem] border border-white/10 relative overflow-hidden">
              <Suspense fallback={<div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
                <SafeCanvas camera={{ position: [0, 0, 10], fov: 50 }}>
                  <audioListener />
                  <Scene arenaId={arenaId} onCursorMove={handleCursorMove} biometricData={biometricData} />
                </SafeCanvas>
              </Suspense>
              
              {/* Biometric Data Overlay */}
              <div className="absolute top-6 right-6 z-20">
                <BiometricPanel data={biometricData} isActive={biometricSync} />
              </div>
              
              {/* Lyrics Overlay */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 pointer-events-none">
                <motion.div 
                  key={currentLyrics}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass p-8 rounded-3xl text-center text-2xl md:text-4xl font-bold tracking-tight bg-black/40 backdrop-blur-xl border border-white/10"
                >
                  {currentLyrics || 'Waiting for vocals...'}
                </motion.div>
              </div>
            </div>

            {/* Vocal Input */}
            <div className="glass p-8 rounded-[2.5rem] border border-white/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-singularity/20 flex items-center justify-center">
                  <Mic className="w-5 h-5 text-singularity" />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-widest">Vocal Sync</h3>
              </div>
              <textarea 
                onChange={(e) => syncLyrics(e.target.value)} 
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-lg focus:border-singularity outline-none transition-all min-h-[120px]" 
                placeholder="Type your lyrics here to synchronize with the global arena..." 
              />
            </div>
          </div>

          <div className="space-y-8">
            {/* Queue */}
            <div className="glass p-8 rounded-[2.5rem] border border-white/10">
              <h2 className="text-xl font-bold mb-6 uppercase tracking-widest flex items-center gap-3">
                <Plus className="w-5 h-5 text-quantum" /> Arena Queue
              </h2>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {queue.length > 0 ? queue.map((s, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 glass rounded-2xl border border-white/5">
                    <span className="text-xs font-mono text-gray-500">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-sm font-bold truncate">{s}</span>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-500 text-xs uppercase tracking-widest">Queue is empty</div>
                )}
              </div>
              <div className="mt-8 space-y-4">
                <input 
                  value={song} 
                  onChange={(e) => setSong(e.target.value)} 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-singularity" 
                  placeholder="Add song to queue..." 
                />
                <button 
                  onClick={addToQueue} 
                  className="w-full py-4 bg-singularity text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all"
                >
                  Add Song
                </button>
              </div>
            </div>

            {/* Online Users */}
            <div className="glass p-8 rounded-[2.5rem] border border-white/10">
              <h2 className="text-xl font-bold mb-6 uppercase tracking-widest flex items-center gap-3">
                <Users className="w-5 h-5 text-reality" /> Participants
              </h2>
              <div className="flex flex-wrap gap-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white/10 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-[10px] font-bold text-gray-500">
                  +1.2k
                </div>
              </div>
            </div>

            {/* Chat */}
            <div className="glass p-8 rounded-[2.5rem] border border-white/10 flex flex-col h-[500px]">
              <h2 className="text-xl font-bold mb-6 uppercase tracking-widest flex items-center gap-3">
                <Zap className="w-5 h-5 text-singularity" /> Arena Chat
              </h2>
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 custom-scrollbar" ref={chatContainerRef}>
                {messages.map((m, i) => (
                  <div key={i} className="text-sm p-3 glass rounded-xl border border-white/5">
                    <span className="font-bold text-singularity">{m.userId.slice(0, 4)}: </span>
                    <span className="text-gray-300">{m.text}</span>
                  </div>
                ))}
              </div>

              {/* Emoji Reactions */}
              <div className="flex flex-wrap gap-2 mb-4">
                {['🔥', '❤️', '👏', '🙌', '🎸', '🎤', '🌟', '💯'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      socket.emit('send-chat-message', { arenaId, text: emoji });
                    }}
                    className="w-8 h-8 flex items-center justify-center glass rounded-lg hover:bg-white/10 transition-all text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input 
                  value={chatInput} 
                  onChange={(e) => setChatInput(e.target.value)} 
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-singularity" 
                  placeholder="Message..." 
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                />
                <button 
                  onClick={sendChatMessage} 
                  className="px-4 py-3 bg-singularity text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <DJVerseOverlay />
      </div>
    </div>
  );
}
