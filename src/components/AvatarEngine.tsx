import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';
import { VRMLoaderPlugin, VRM } from '@pixiv/three-vrm';
import { MessageSquare, Mic, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// You can replace this URL with a high-fidelity fully photorealistic UE5-grade exported GLTF/VRM URL
// For demo purposes, we will use a fallback open-source VRM format model or basic geometry if it fails.
const VRM_URL = 'https://pixiv.github.io/three-vrm/packages/three-vrm/examples/models/VRM1_Constraint_Twist_Sample.vrm';

function AvatarModel() {
  const { scene, camera, pointer } = useThree();
  const vrmRef = useRef<VRM | null>(null);
  const [modelScene, setModelScene] = useState<THREE.Group | null>(null);

  useEffect(() => {
    let unmounted = false;
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));

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
      },
      (progress) => console.log('Loading Avatar...', 100.0 * (progress.loaded / progress.total), '%'),
      (error) => console.error('Error loading VRM Avatar:', error)
    );

    return () => {
      unmounted = true;
    };
  }, []);

  useFrame((state, delta) => {
    if (vrmRef.current) {
      vrmRef.current.update(delta);
      
      // Makes the avatar continuously look at the mouse cursor
      if (vrmRef.current.lookAt) {
        // Map pointer to 3D world coord roughly
        const targetX = pointer.x * 2;
        const targetY = pointer.y * 2 + 1.5; // Offset to head height
        
        // Simple lookAt interpolation
        if (vrmRef.current.humanoid) {
          const head = vrmRef.current.humanoid.getNormalizedBoneNode('head');
          const spine = vrmRef.current.humanoid.getNormalizedBoneNode('spine');
          if (head && spine) {
            // Apply slight rotation to follow cursor
             head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, -targetX * 0.5, 0.1);
             head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, targetY * 0.5, 0.1);
             
             spine.rotation.y = THREE.MathUtils.lerp(spine.rotation.y, -targetX * 0.2, 0.1);
          }
        }
      }
    }
  });

  if (!modelScene) return null;

  return (
    <primitive 
      object={modelScene} 
      position={[0, -1.5, 0]} 
      scale={[2.5, 2.5, 2.5]} 
      rotation={[0, Math.PI, 0]} 
    />
  );
}

export function AvatarEngine() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'ai'|'user', text: string}[]>([
    { role: 'ai', text: "Yo! Welcome to SingReality. I'm your God-Tier AI rep. I know every chord progression since Bach, and I'm ready to sell you the future. What's up?" }
  ]);
  const [input, setInput] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  // In a production build, this would hit WebLLM or a highly capable backend LLM (Gemini 3.1)
  const handleSend = async () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    const currentInput = input;
    setInput("");
    
    // Stub for God-Tier AI Response
    setTimeout(() => {
      const aiResponse = `Classic. You think you're ready for '${currentInput}'? Listen, in the 899th dimension, we process audio through quantum splatting. But on SingReality, you get it for free. Let me show you how to dominate the Nexus.`;
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
      speak(aiResponse);
    }, 1000);
  };

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // kill active speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    // Find a cool voice (e.g., Google UK English Male)
    const voices = window.speechSynthesis.getVoices();
    const coolVoice = voices.find(v => v.name.includes("UK English Male") || v.name.includes("Google") ) || voices[0];
    
    if (coolVoice) utterance.voice = coolVoice;
    utterance.pitch = 0.9; // deeper/cooler
    utterance.rate = 1.1; // fast talker
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  // Autoplay intro line when everything mounts
  useEffect(() => {
    setTimeout(() => {
      setChatOpen(true);
      speak(messages[0].text);
    }, 2000);
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
