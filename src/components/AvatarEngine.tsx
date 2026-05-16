import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';
import { VRMLoaderPlugin, VRM } from '@pixiv/three-vrm';
import { MessageSquare, Mic, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { askGodTierAvatar } from '../services/godTierAvatarService';

// Fallback high-quality VRM model
const VRM_URL = 'https://pixiv.github.io/three-vrm/packages/three-vrm/examples/models/VRM1_Constraint_Twist_Sample.vrm';

function AvatarModel() {
  const { pointer } = useThree();
  const vrmRef = useRef<VRM | null>(null);
  const [modelScene, setModelScene] = useState<THREE.Group | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unmounted = false;
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser as any) as any);

    loader.load(
      VRM_URL,
      (gltf) => {
        if (unmounted) return;
        const vrm = gltf.userData.vrm;
        vrmRef.current = vrm;
        
        // Disable frustum culling for VRM
        vrm.scene.traverse((obj: THREE.Object3D) => {
          obj.frustumCulled = false;
          if ((obj as THREE.Mesh).isMesh) {
             obj.castShadow = true;
          }
        });
        
        setModelScene(vrm.scene);
        setLoading(false);
      },
      undefined,
      (error) => console.error('Error loading VRM Avatar:', error)
    );

    return () => {
      unmounted = true;
    };
  }, []);

  useFrame((state, delta) => {
    if (vrmRef.current) {
      vrmRef.current.update(delta);
      
      // Makes the avatar continuously look at the mouse cursor with smooth biomechanics
      if (vrmRef.current.humanoid) {
        const targetX = pointer.x * 3;
        const targetY = pointer.y * 3 + 1.5; 
        
        const head = vrmRef.current.humanoid.getNormalizedBoneNode('head');
        const spine = vrmRef.current.humanoid.getNormalizedBoneNode('spine');
        const rightArm = vrmRef.current.humanoid.getNormalizedBoneNode('rightUpperArm');
        const leftArm = vrmRef.current.humanoid.getNormalizedBoneNode('leftUpperArm');
        
        if (head && spine) {
           head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, -targetX * 0.5, 0.05);
           head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, targetY * 0.5, 0.05);
           spine.rotation.y = THREE.MathUtils.lerp(spine.rotation.y, -targetX * 0.2, 0.05);
        }
        
        // Simulate holding an instrument (guitar pose)
        if (rightArm && leftArm && !loading) {
           rightArm.rotation.z = THREE.MathUtils.lerp(rightArm.rotation.z, -1.2, 0.05);
           leftArm.rotation.z = THREE.MathUtils.lerp(leftArm.rotation.z, 0.8, 0.05);
           leftArm.rotation.x = THREE.MathUtils.lerp(leftArm.rotation.x, -0.5, 0.05);
        }
      }
    }
  });

  if (!modelScene) return null;

  return (
    <group>
      <primitive 
        object={modelScene} 
        position={[0, -1.5, 0]} 
        scale={[2.5, 2.5, 2.5]} 
        rotation={[0, Math.PI, 0]} 
      />
    </group>
  );
}

export function AvatarEngine() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'ai'|'user', text: string}[]>([
    { role: 'ai', text: "Hey! Welcome to the SingReality Nexus! I'm your God-Tier AI rep, fully equipped with a quantum brain, some sweet guitar riffs, and a mission to show you why this platform is the absolute pinnacle of convergent AI. Ask me anything!" }
  ]);
  const [input, setInput] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput("");
    setIsThinking(true);
    
    try {
      const history = messages.map(m => ({
         role: m.role === 'ai' ? 'model' : 'user',
         text: m.text
      }));
      
      const response = await askGodTierAvatar(userMessage, history);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
      speak(response);
    } catch (e) {
      console.error(e);
    } finally {
      setIsThinking(false);
    }
  };

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); 
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.name.includes("UK English") || v.name.includes("Google") ) || voices[0];
    
    if (voice) utterance.voice = voice;
    utterance.pitch = 0.95; 
    utterance.rate = 1.05; 
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setChatOpen(true);
      speak(messages[0].text);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* 3D Canvas explicitly overlaying */}
      <div className="absolute right-0 bottom-0 w-full md:w-[60vw] h-[80vh] pointer-events-none">
        <Canvas camera={{ position: [0, 1.5, -4], fov: 45 }} className="pointer-events-auto">
          <ambientLight intensity={1.2} />
          <directionalLight position={[2, 2, -2]} intensity={2.5} color="#fff" />
          <spotLight position={[-2, 2, -2]} intensity={3.5} color="#d0ff00" angle={0.5} penumbra={1} />
          <AvatarModel />
        </Canvas>
      </div>

      {/* Chat UI */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className="absolute bottom-12 right-12 w-96 glass-card rounded-[2rem] border border-white/10 overflow-hidden pointer-events-auto shadow-2xl shadow-singularity/20"
          >
            <div className="p-4 bg-singularity text-black font-black uppercase tracking-widest flex items-center justify-between">
              <span className="flex items-center gap-2"><Mic className={`w-4 h-4 ${isSpeaking ? 'animate-pulse' : ''}`} /> Synth God</span>
              <button onClick={() => setChatOpen(false)} className="hover:scale-110 transition-transform">×</button>
            </div>
            
            <div className="h-64 overflow-y-auto p-4 space-y-4 font-mono text-sm">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`p-3 rounded-2xl max-w-[85%] ${m.role === 'ai' ? 'bg-white/5 border border-white/10 text-gray-300' : 'bg-singularity/20 border border-singularity/50 text-white'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/5 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-singularity transition-colors"
              />
              <button 
                onClick={handleSend}
                className="p-3 bg-singularity text-black rounded-xl hover:scale-105 transition-transform"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Re-open Chat Bubble */}
      {!chatOpen && (
        <motion.button 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setChatOpen(true)}
          className="absolute bottom-12 right-12 p-5 bg-singularity text-black rounded-full pointer-events-auto hover:scale-110 transition-transform shadow-[0_0_30px_rgba(208,255,0,0.4)]"
        >
          <Volume2 className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  );
}
