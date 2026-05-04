import React, { useState, Suspense, Component, ReactNode, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Play, Loader2, Share2, Activity, Zap, BrainCircuit, Mic2, Users, Wand2, Music as MusicIcon, Video, Download, Layers as LayersIcon } from 'lucide-react';
import { ChoreoLoadingAnimation } from '../components/ChoreoLoadingAnimation';
import { Avatar } from '../components/Avatar';
import { SafeCanvas } from '../components/SafeCanvas';
import { OrbitControls, Environment, Html } from '@react-three/drei';
import { EffectComposer, Bloom, Glitch, ToneMapping } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useSound } from '../hooks/useSound';
import { useStore } from '../store/useStore';
import { PsycheResonantConduit } from '../components/PsycheResonantConduit';
import { SynestheticTerrain } from '../components/SynestheticTerrain';
import { YouTubeBackground } from '../components/YouTubeBackground';
import { useActionNarrator } from '../hooks/useActionNarrator';
import { LiveCollaboration } from '../components/LiveCollaboration';
import { useSearchParams } from 'react-router-dom';

// Remove the local CanvasErrorBoundary as SafeCanvas includes one

import { LayerEditor } from '../components/LayerEditor';
import { ModelViewer } from '../components/ModelViewer';

export function Studio() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || 'studio-core';
  const [activeTab, setActiveTab] = useState<'create' | 'dance' | 'vr' | 'render'>('create');
  const [intent, setIntent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [ual, setUal] = useState<string | null>(null);
  
  // Choreography/Music State
  const [choreoText, setChoreoText] = useState('');
  type GenStatus = 'idle' | 'generating' | 'ready';
  const [choreoStatus, setChoreoStatus] = useState<GenStatus>('idle');
  const [musicStatus, setMusicStatus] = useState<GenStatus>('idle');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Choreography Parameters
  const [complexity, setComplexity] = useState(50);
  const [style, setStyle] = useState('fluid');
  const [emotionIntensity, setEmotionIntensity] = useState(50);

  const { playClick, playTransition } = useSound();
  const { addResonance } = useStore();
  const { narrateAction } = useActionNarrator();

  const handleGenerate = async () => {
    if (!intent) return;
    playClick();
    setIsGenerating(true);
    setUal(null);
    await new Promise(resolve => setTimeout(resolve, 3000));
    const newUal = `singreality.com/ual/${Math.random().toString(36).substring(2, 10)}`;
    setUal(newUal);
    setIsGenerating(false);
    playTransition();
    addResonance(Math.floor(Math.random() * 5000) + 1000);
    narrateAction('mint_creation');
  };

  const handleGenerateCombined = async () => {
    if (!choreoText) return;
    playClick();
    setChoreoStatus('generating');
    setMusicStatus('generating');
    narrateAction('generate_choreo_and_music');
    
    // Simulate generation
    await Promise.all([
      new Promise(resolve => setTimeout(resolve, 4000)),
      new Promise(resolve => setTimeout(resolve, 5000))
    ]);
    
    setChoreoStatus('ready');
    setMusicStatus('ready');
    playTransition();
  };

  return (
    <div className="min-h-screen relative bg-black">
      {/* Background layer */}
      <YouTubeBackground videoId="I_izvAbhExY" opacity={0.1} />

      <div className="max-w-[1600px] flex flex-col lg:flex-row gap-8 mx-auto px-6 py-12 relative z-10 min-h-screen">
        
        {/* Left Control Panel */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4 border border-white/10 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <BrainCircuit className="w-4 h-4 text-[#00f0ff]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#00f0ff]">AI Choreography & Creation Core</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-black tracking-tighter uppercase leading-[0.9]">
              KHORAL-FLOW <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#00f0ff]">STUDIO</span>
            </h1>
          </div>

          <div className="flex bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md overflow-x-auto no-scrollbar">
            {[
               { id: 'create', label: 'Psyche-Audio', icon: Mic2 },
               { id: 'dance', label: 'AI Choreography', icon: Users },
               { id: 'vr', label: 'VR Dance Sync', icon: Zap },
               { id: 'render', label: 'Layer Editor', icon: LayersIcon }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { playClick(); setActiveTab(tab.id as any); }}
                className={`flex-1 py-3 px-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === tab.id ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.5)]' : 'text-gray-400 hover:text-white'}`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'create' && (
              <motion.div key="create" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 glass-card p-6 rounded-[2rem] border border-white/10 relative overflow-hidden flex flex-col gap-4">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-singularity via-quantum to-reality" />
                <h2 className="text-xl font-display font-bold uppercase tracking-widest flex items-center gap-3">
                  <Activity className="w-5 h-5 text-singularity" /> Psyche-Input Vector
                </h2>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Describe emotional intent, a memory, or a concept. The Quantum Muse Core translates this into a full spatial audio composition.
                </p>
                <textarea 
                  value={intent}
                  onChange={(e) => setIntent(e.target.value)}
                  className="flex-1 bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:border-singularity outline-none transition-all resize-none font-mono"
                  placeholder="e.g., The feeling of a forgotten lullaby passing through neon rain..."
                />
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !intent}
                  className="w-full py-4 bg-gradient-to-r from-singularity to-quantum text-black rounded-xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                >
                  {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Synthesizing...</> : <><Sparkles className="w-4 h-4" /> Execute Genesis</>}
                </button>
              </motion.div>
            )}

            {activeTab === 'dance' && (
              <motion.div key="dance" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 glass-card p-6 rounded-[2rem] border border-white/10 relative overflow-hidden flex flex-col gap-4">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff00ff] to-[#00f0ff]" />
                 <h2 className="text-xl font-display font-bold uppercase tracking-widest flex items-center gap-3">
                  <Wand2 className="w-5 h-5 text-[#ff00ff]" /> Text-to-Dance Generation
                 </h2>
                 <p className="text-xs text-gray-400 leading-relaxed mb-2">
                   Powered by DiffDance & EDGE models. Input text, and AI generates full-body choreography synced to Opus-decoded beats.
                 </p>
                 
                 {choreoStatus === 'ready' && (
                   <div className="h-[300px] w-full rounded-2xl bg-black/40 border border-[#ff00ff]/30 relative overflow-hidden">
                     <Avatar isTalking={choreoStatus === 'ready'} />
                   </div>
                 )}
                 
                 <div className="flex flex-col gap-3 flex-1">
                   <div className="flex gap-2">
                      <button className="flex-1 py-2 bg-white/5 border border-white/10 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-white/10"><MusicIcon className="w-3 h-3"/> Upload Track</button>
                      <button className="flex-1 py-2 bg-white/5 border border-white/10 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-white/10"><Video className="w-3 h-3"/> Ref Video</button>
                   </div>
                   
                   <div className="space-y-1">
                     <div className="text-[8px] text-gray-500 uppercase tracking-widest">Complexity ({complexity})</div>
                     <input type="range" min="1" max="100" value={complexity} onChange={(e) => setComplexity(parseInt(e.target.value))} className="w-full accent-[#ff00ff] h-1 bg-white/10 rounded-lg appearance-none"/>
                   </div>

                   <div className="space-y-1">
                     <div className="text-[8px] text-gray-500 uppercase tracking-widest">Style</div>
                     <select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full bg-black/40 border border-[#ff00ff]/30 rounded-xl p-2 text-xs text-white">
                       <option value="fluid">Fluid Motion</option>
                       <option value="sharp">Sharp/Pop Style</option>
                       <option value="contemporary">Contemporary</option>
                     </select>
                   </div>

                   <div className="space-y-1">
                     <div className="text-[8px] text-gray-500 uppercase tracking-widest">Emotion Intensity ({emotionIntensity})</div>
                     <input type="range" min="1" max="100" value={emotionIntensity} onChange={(e) => setEmotionIntensity(parseInt(e.target.value))} className="w-full accent-[#ff00ff] h-1 bg-white/10 rounded-lg appearance-none"/>
                   </div>

                   <textarea 
                     value={choreoText}
                     onChange={(e) => setChoreoText(e.target.value)}
                     className="flex-1 min-h-[80px] bg-black/40 border border-[#ff00ff]/30 rounded-2xl p-4 text-sm focus:border-[#00f0ff] outline-none transition-all resize-none font-mono"
                     placeholder="e.g., A high-energy K-Pop routine transitioning into smooth contemporary fluid floorwork..."
                   />
                 </div>
                 
                     {choreoStatus === 'generating' || musicStatus === 'generating' ? (
                     <div className="w-full py-4 bg-black/50 border border-white/10 rounded-xl space-y-2">
                       <ChoreoLoadingAnimation complexity={complexity} style={style} emotionIntensity={emotionIntensity} />
                       {musicStatus === 'generating' && <div className="text-center text-[10px] text-gray-500 animate-pulse">Generating Music...</div>}
                     </div>
                   ) : (
                     <button 
                      onClick={handleGenerateCombined}
                      disabled={(choreoStatus as any) === 'generating' || (musicStatus as any) === 'generating' || !choreoText}
                      className="w-full py-4 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                    >
                      <Sparkles className="w-4 h-4" /> Generate Choreo & Music
                    </button>
                   )}
              </motion.div>
            )}
            
            {activeTab === 'render' && (
              <motion.div key="render" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 h-full min-h-[500px]">
                 <LayerEditor />
              </motion.div>
            )}

            {activeTab === 'vr' && (
              <motion.div key="vr" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 glass-card p-6 rounded-[2rem] border border-[#00f0ff]/30 bg-[#00f0ff]/5 relative overflow-hidden flex flex-col gap-4">
                 <div className="absolute top-0 left-0 w-full h-1 bg-[#00f0ff] shadow-[0_0_10px_#00f0ff]" />
                 <h2 className="text-xl font-display font-bold uppercase tracking-widest flex items-center gap-3">
                  <Activity className="w-5 h-5 text-[#00f0ff]" /> Live VR Telemetry
                 </h2>
                 <p className="text-xs text-[#00f0ff]/70 leading-relaxed mb-4">
                   WebXR enabled. Connecting to MediaPipe/ARKit streams. Ready for 10,000+ concurrent users via LiveKit SFU.
                 </p>
                 <div className="p-4 bg-black/60 border border-[#00f0ff]/20 rounded-xl font-mono text-xs text-[#00f0ff] space-y-2 mb-4 flex-1">
                   <div className="flex justify-between"><span>Pose Tracker:</span> <span className="text-green-400">ACTIVE</span></div>
                   <div className="flex justify-between"><span>Audio Sync:</span> <span className="text-green-400">0.2ms JITTER</span></div>
                   <div className="flex justify-between"><span>SUMF Engine:</span> <span className="text-purple-400">YIELDING PHASE</span></div>
                   <div className="flex justify-between"><span>WebXR Mode:</span> <span className="text-yellow-400">AWAITING HMD</span></div>
                   <div className="h-px bg-[#00f0ff]/20 my-2" />
                   <div className="text-[10px] text-gray-500">LiveKit Edge Node: us-central-dfw-3</div>
                 </div>
                 
                 <button onClick={() => { playClick(); narrateAction('vr_mode'); }} className="w-full py-4 bg-[#00f0ff] text-black rounded-xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,240,255,0.4)]">
                   <Zap className="w-4 h-4" /> Enter Immersive WebXR Mode
                 </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* UAL Mint Result */}
          {ual && activeTab === 'create' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 rounded-[2rem] border border-quantum/50 bg-quantum/10">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-2 text-quantum">Creation Minted</h3>
              <p className="text-[10px] text-gray-400 mb-4">Universal Action Link (UAL) generated.</p>
              <div className="flex items-center gap-3 bg-black/50 p-3 rounded-xl border border-white/10">
                <code className="text-[10px] text-singularity flex-1 truncate">{ual}</code>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Share"><Share2 className="w-4 h-4 text-white" /></button>
              </div>
            </motion.div>
          )}

          {choreoStatus === 'ready' && activeTab === 'dance' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 rounded-[2rem] border border-[#ff00ff]/50 bg-[#ff00ff]/10">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-2 text-[#ff00ff]">Choreography Rendered</h3>
              <p className="text-[10px] text-gray-400 mb-4">AI Motion data ready. Export format: .FBX / .GLTF / BVH</p>
              <div className="flex gap-2">
                <button className="flex-1 py-3 bg-black/50 border border-white/10 rounded-xl text-xs hover:bg-[#ff00ff]/20 transition-colors uppercase tracking-widest font-bold flex justify-center items-center gap-2">
                  <Download className="w-3 h-3"/> Download Rig
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Environment Window */}
        <div className="w-full lg:w-2/3 h-[60vh] lg:h-auto glass rounded-[3rem] border border-white/10 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {activeTab === 'render' ? (
            <ModelViewer />
          ) : (
            <>
              <LiveCollaboration projectId={projectId} />
              <div className="absolute top-6 left-6 z-10 px-4 py-2 glass rounded-full border border-white/10 flex items-center gap-2 backdrop-blur-xl">
                <Zap className={`w-4 h-4 ${activeTab === 'vr' ? 'text-[#00f0ff] animate-pulse' : 'text-reality'}`} />
                <span className="text-[10px] font-mono uppercase tracking-widest text-gray-300">
                  {activeTab === 'create' ? 'Live PRC Render' : activeTab === 'dance' ? 'AI Skeleton Preview Engine' : 'WebXR Arena Simulation'}
                </span>
              </div>
              
              <SafeCanvas camera={{ position: [0, 2, 8], fov: 45 }}>
                <color attach="background" args={['#020202']} />
                <ambientLight intensity={0.2} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color={activeTab === 'dance' ? '#ff00ff' : '#00f0ff'} />
                
                {activeTab === 'create' && (
                  <>
                    <SynestheticTerrain color={isGenerating ? '#ff003c' : ual ? '#00f0ff' : '#7000ff'} speed={isGenerating ? 3 : 1} />
                    <PsycheResonantConduit state={isGenerating ? 'creating' : ual ? 'active' : 'idle'} color={isGenerating ? '#ff003c' : ual ? '#00f0ff' : '#7000ff'} />
                  </>
                )}

                {activeTab === 'dance' && (
                  <mesh position={[0,0,0]} rotation={[0.2, 0, 0]}>
                    <icosahedronGeometry args={[2, 2]} />
                    <meshStandardMaterial color={choreoStatus === 'generating' ? '#ff003c' : '#ff00ff'} wireframe opacity={0.3} transparent />
                  </mesh>
                )}

                {activeTab === 'vr' && (
                  <mesh position={[0, -1, 0]}>
                    <torusKnotGeometry args={[1.5, 0.4, 128, 32]} />
                    <meshStandardMaterial color="#00f0ff" roughness={0.1} metalness={0.8} wireframe />
                  </mesh>
                )}
                
                <Environment preset="city" />
                <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2 + 0.1} minPolarAngle={Math.PI / 3} autoRotate={activeTab === 'vr'} autoRotateSpeed={2} />
                
                <EffectComposer>
                  <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} opacity={2} />
                  {choreoStatus === 'generating' && <Glitch active={true} delay={new THREE.Vector2(1.5, 3.5)} duration={new THREE.Vector2(0.5, 1.0)} strength={new THREE.Vector2(0.2, 0.4)} mode={1} />}
                </EffectComposer>
              </SafeCanvas>

              {/* SUMF Graphic Overlay when in VR tab */}
              <AnimatePresence>
                {activeTab === 'vr' && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute bottom-6 left-6 right-6 p-4 glass border border-[#00f0ff]/30 rounded-2xl flex items-end justify-between font-mono text-[#00f0ff] pointer-events-none"
                  >
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-widest mb-1">SUMF V2.8 Ext.</div>
                      <div className="text-xs flex items-center gap-2"><span className="w-2 h-2 bg-[#00f0ff] rounded-full animate-pulse"/> Quantum Resonance Halo: Linked</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs">OPUS_FEC_ON_PLC_DEEP</div>
                      <div className="text-[10px] opacity-70">195 COUNTRIES SYNCED</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
