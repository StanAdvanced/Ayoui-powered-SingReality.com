import React, { Suspense, useEffect, useState, useRef, useMemo, Component, ReactNode } from 'react';
import { SafeCanvas } from './SafeCanvas';
import { useFrame, useLoader, extend } from '@react-three/fiber';
import { 
  OrbitControls, 
  Stage, 
  useGLTF, 
  Html,
  useProgress,
  ContactShadows,
  Environment,
  PerspectiveCamera,
  shaderMaterial
} from '@react-three/drei';
import { EffectComposer, Bloom, Scanline, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { OBJLoader } from 'three-stdlib';
import { Loader2, RotateCcw, Layers, MessageSquare, Send, User as UserIcon, Sun, Box, Plus, Trash2, ChevronUp, ChevronDown, Zap, Activity } from 'lucide-react';
import { useStore } from '../store/useStore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { doc, setDoc, onSnapshot, collection, query, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { monitoringService } from '../services/monitoringService';
import { soundService } from '../services/soundService';
import { AssetLibrary } from './AssetLibrary';
import { ASSETS, Asset } from '../constants/assets';

// Remove the local ModelViewerErrorBoundary as SafeCanvas includes one

// --- Shaders ---

const HolographicMaterialImpl = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#00f0ff'),
    uOpacity: 0.6,
    uScanlineIntensity: 0.5,
    uFlickerIntensity: 0.4,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    uniform float uTime;

    void main() {
      vUv = uv;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vNormal = normalize(normalMatrix * normal);
      vViewPosition = - (modelViewMatrix * vec4(position, 1.0)).xyz;
      
      // Increased vertex jitter for "unstable" hologram look
      vec3 pos = position;
      float jitter = sin(uTime * 20.0 + position.y * 10.0) * 0.005;
      pos.x += jitter;
      pos.z += cos(uTime * 15.0 + position.x * 8.0) * 0.003;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uOpacity;
    uniform float uScanlineIntensity;
    uniform float uFlickerIntensity;

    void main() {
      // Fresnel effect
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - dot(normal, viewDir), 3.0);
      
      // Subtle, high-density scanlines
      float scanline = sin(vUv.y * 800.0 + uTime * 10.0) * 0.1 + 0.9;
      scanline *= sin(vUv.y * 20.0 - uTime * 2.0) * 0.05 + 0.95; // Secondary wave
      scanline = mix(1.0, scanline, uScanlineIntensity);
      
      // Intense, unstable flicker
      float random = fract(sin(uTime * 12.9898) * 43758.5453123);
      float baseFlicker = sin(uTime * 60.0) * 0.5 + 0.5;
      float flicker = mix(1.0, mix(baseFlicker, random, 0.7), uFlickerIntensity * 2.5);
      
      // Color shift based on flicker: lerp between base color and desaturated color
      float luminance = dot(uColor, vec3(0.2126, 0.7152, 0.0722));
      vec3 desaturatedColor = vec3(luminance);
      vec3 colorShift = mix(uColor, desaturatedColor, flicker * uFlickerIntensity * 0.3);
      
      // Grid pattern
      float grid = (sin(vUv.x * 100.0) * 0.5 + 0.5) * (sin(vUv.y * 100.0) * 0.5 + 0.5);
      grid = mix(1.0, grid, 0.05);
      
      vec3 finalColor = colorShift * (fresnel + 0.3) * scanline * flicker * grid;
      float alpha = uOpacity * (fresnel + 0.1) * flicker;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
);

extend({ HolographicMaterialImpl });

// --- Components ---

function Model({ url, layer }: { url: string, layer: any }) {
  const extension = url.split('.').pop()?.toLowerCase();
  const holoMaterials = useRef<any[]>([]);
  const { materialProps = {}, isHologram = true } = layer;
  const modelRef = useRef<THREE.Object3D | null>(null);

  useFrame((state) => {
    holoMaterials.current.forEach(mat => {
      if (mat) mat.uTime = state.clock.elapsedTime;
    });

    // Autonomous material adjustment
    if (modelRef.current) {
      modelRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshPhysicalMaterial) {
          child.material.metalness = Math.sin(state.clock.elapsedTime * 0.5) * 0.4 + 0.5;
          child.material.roughness = Math.cos(state.clock.elapsedTime * 0.5) * 0.4 + 0.5;
        }
      });
    }
  });
  
  if (extension === 'obj') {
    const obj = useLoader(OBJLoader, url);
    const clonedObj = useMemo(() => obj.clone(), [obj]);
    
    useEffect(() => {
      modelRef.current = clonedObj;
      holoMaterials.current = [];
      clonedObj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (isHologram) {
            const mat = new HolographicMaterialImpl();
            mat.transparent = true;
            mat.side = THREE.DoubleSide;
            mat.depthWrite = false;
            mat.blending = THREE.AdditiveBlending;
            mat.uColor = new THREE.Color(layer.color || materialProps.color || '#00f0ff');
            mat.uOpacity = layer.opacity !== undefined ? layer.opacity : (materialProps.opacity || 0.6);
            mat.uScanlineIntensity = materialProps.scanlineIntensity || 0.3;
            mat.uFlickerIntensity = materialProps.flickerIntensity || 0.1;
            child.material = mat;
            holoMaterials.current.push(mat);
          } else {
            child.material = new THREE.MeshStandardMaterial({
              ...materialProps,
              color: layer.color || child.material.color,
              opacity: layer.opacity !== undefined ? layer.opacity : materialProps.opacity,
              transparent: (layer.opacity !== undefined && layer.opacity < 1) || materialProps.transparent
            });
          }
        }
      });
    }, [clonedObj, materialProps, isHologram]);
    
    return <primitive object={clonedObj} />;
  }

  // Default to GLTF
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    modelRef.current = clonedScene;
    holoMaterials.current = [];
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (isHologram) {
          const mat = new HolographicMaterialImpl();
          mat.transparent = true;
          mat.side = THREE.DoubleSide;
          mat.depthWrite = false;
          mat.blending = THREE.AdditiveBlending;
          mat.uColor = new THREE.Color(layer.color || materialProps.color || '#00f0ff');
          mat.uOpacity = layer.opacity !== undefined ? layer.opacity : (materialProps.opacity || 0.6);
          mat.uScanlineIntensity = materialProps.scanlineIntensity || 0.3;
          mat.uFlickerIntensity = materialProps.flickerIntensity || 0.1;
          child.material = mat;
          holoMaterials.current.push(mat);
        } else {
          child.material = new THREE.MeshPhysicalMaterial({
            color: layer.color || materialProps.color || child.material.color,
            opacity: layer.opacity !== undefined ? layer.opacity : materialProps.opacity,
            transparent: (layer.opacity !== undefined && layer.opacity < 1) || materialProps.transparent,
            metalness: materialProps.metalness,
            roughness: materialProps.roughness,
            transmission: materialProps.transmission || 0,
            thickness: materialProps.thickness || 0,
            ior: materialProps.ior || 1.5,
            clearcoat: materialProps.clearcoat || 0,
            emissive: new THREE.Color(materialProps.emissive || '#000000'),
            emissiveIntensity: materialProps.emissiveIntensity || 0,
            wireframe: materialProps.wireframe || false
          });
        }
      }
    });
  }, [clonedScene, materialProps, isHologram]);

  return <primitive object={clonedScene} />;
}

function Loader() {
  const { progress, total, loaded } = useProgress();
  const estimatedTimeSeconds = useMemo(() => {
    if (total === 0 || loaded === 0) return 0;
    const remainingBytes = total - loaded;
    const speedBytesPerSecond = 625000; // Assuming 5 Mbps ~ 625 KB/s
    return Math.max(0, remainingBytes / speedBytesPerSecond).toFixed(1);
  }, [total, loaded]);

  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 glass p-6 rounded-2xl w-64 border border-white/10 shadow-xl">
        <Loader2 className="w-8 h-8 text-singularity animate-spin" />
        <span className="text-white font-mono text-sm">{progress.toFixed(0)}%</span>
        <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
            <div className="bg-singularity h-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <div className="text-[10px] font-mono text-gray-400">
            {(total / 1024 / 1024).toFixed(2)} MB • {estimatedTimeSeconds}s left
        </div>
      </div>
    </Html>
  );
}

function RemoteCursor({ position, color, name }: { position: [number, number, number], color: string, name: string }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
      <Html distanceFactor={10}>
        <div className="px-2 py-1 rounded bg-black/80 border border-white/10 whitespace-nowrap">
          <span className="text-[8px] font-bold uppercase tracking-widest" style={{ color }}>{name}</span>
        </div>
      </Html>
    </group>
  );
}

const HOLOGRAPHIC_PRESETS = {
  'Neon Pink': { color: '#ff00ff', opacity: 0.6, scanlineIntensity: 0.5, flickerIntensity: 0.5 },
  'Quantum Blue': { color: '#00f0ff', opacity: 0.7, scanlineIntensity: 0.4, flickerIntensity: 0.4 },
  'Spectral Green': { color: '#00ff40', opacity: 0.5, scanlineIntensity: 0.6, flickerIntensity: 0.6 },
};

const MATERIAL_LIBRARY = [
  { name: 'Default', props: { color: '#ffffff', metalness: 0.5, roughness: 0.5, transmission: 0, clearcoat: 0, emissive: '#000000', emissiveIntensity: 0 } },
  { name: 'Gold', props: { color: '#ffd700', metalness: 1, roughness: 0.1, transmission: 0, clearcoat: 0, emissive: '#000000', emissiveIntensity: 0 } },
  { name: 'Glass', props: { color: '#ffffff', metalness: 0.1, roughness: 0.1, transmission: 1, thickness: 0.5, ior: 1.5, clearcoat: 1, emissive: '#000000', emissiveIntensity: 0 } },
  { name: 'Neon Pink', props: { color: '#ff00ff', metalness: 0, roughness: 1, transmission: 0, clearcoat: 0, emissive: '#ff00ff', emissiveIntensity: 2 } },
  { name: 'Matte Black', props: { color: '#111111', metalness: 0, roughness: 0.9, transmission: 0, clearcoat: 0, emissive: '#000000', emissiveIntensity: 0 } },
];

import { io } from 'socket.io-client';

const socket = io();

// --- Main Component ---

export function ModelViewer() {
  const { layers, setLayers, addLayer, removeLayer, toggleLayerVisibility, reorderLayers, user } = useStore();
  const [autoRotate, setAutoRotate] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showMaterials, setShowMaterials] = useState(false);
  const [showAssets, setShowAssets] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [remoteUsers, setRemoteUsers] = useState<Record<string, any>>({});
  const [isHologram, setIsHologram] = useState(true);
  const [newLayerName, setNewLayerName] = useState('');
  
  // Material & Lighting State
  const [materialProps, setMaterialProps] = useState({
    roughness: 0.5,
    metalness: 0.5,
    emissiveIntensity: 0,
    wireframe: false,
    transmission: 0,
    thickness: 0,
    ior: 1.5,
    clearcoat: 0,
    emissive: '#000000',
    color: '#ffffff'
  });
  const [ambientIntensity, setAmbientIntensity] = useState(0.5);
  
  const viewportRef = useRef<HTMLDivElement>(null);

  // Sync Project State (Layers & Materials)
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'projects', 'default'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.layers) setLayers(data.layers);
        if (data.materialProps) setMaterialProps(data.materialProps);
        if (data.ambientIntensity !== undefined) setAmbientIntensity(data.ambientIntensity);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'projects/default');
    });
    return unsub;
  }, [setLayers]);

  // Socket.io for Real-time Collaboration
  useEffect(() => {
    socket.emit('join-project', 'default');

    socket.on('project-cursor-update', (data) => {
      setRemoteUsers(prev => ({
        ...prev,
        [data.uid]: { ...data }
      }));
    });

    return () => {
      socket.off('project-cursor-update');
    };
  }, []);

  const handlePointerMove = (e: any) => {
    if (!user) return;
    // Normalize pointer coordinates
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    
    socket.emit('project-cursor-move', {
      projectId: 'default',
      position: { x, y },
      color: '#00F0FF',
      name: user.displayName || 'Anonymous'
    });
  };

  // Debounced update to Firebase
  const updateProjectState = useMemo(() => {
    let timeout: NodeJS.Timeout;
    return (newLayers: any, newMaterials: any, newAmbient: number) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setDoc(doc(db, 'projects', 'default'), {
          layers: newLayers,
          materialProps: newMaterials,
          ambientIntensity: newAmbient,
          lastUpdated: serverTimestamp()
        }, { merge: true }).catch(err => monitoringService.error('Project sync failed', err));
      }, 500);
    };
  }, []);

  const handleMaterialChange = (updates: Partial<typeof materialProps>, isHologramMode?: boolean) => {
    const newProps = { ...materialProps, ...updates };
    setMaterialProps(newProps);
    
    // Update all layers with the new material properties
    const newLayers = layers.map(l => ({
      ...l,
      materialProps: { ...l.materialProps, ...updates },
      isHologram: isHologramMode !== undefined ? isHologramMode : l.isHologram
    }));
    setLayers(newLayers);
    updateProjectState(newLayers, newProps, ambientIntensity);
  };

  const handleAmbientChange = (val: number) => {
    setAmbientIntensity(val);
    updateProjectState(layers, materialProps, val);
  };

  const handleToggleLayer = (id: string) => {
    soundService.playClick();
    const newLayers = layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l);
    setLayers(newLayers);
    updateProjectState(newLayers, materialProps, ambientIntensity);
  };

  const handleRemoveLayer = (id: string) => {
    soundService.playClick();
    const newLayers = layers.filter(l => l.id !== id);
    setLayers(newLayers);
    updateProjectState(newLayers, materialProps, ambientIntensity);
  };

  const handleReorderLayers = (startIndex: number, endIndex: number) => {
    soundService.playClick();
    const result = Array.from(layers);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setLayers(result);
    updateProjectState(result, materialProps, ambientIntensity);
  };

  // Sync Cursor Position
  useEffect(() => {
    if (!user) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!viewportRef.current) return;
      const rect = viewportRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Update Firestore with cursor position
      setDoc(doc(db, 'presence', user.uid), {
        uid: user.uid,
        name: user.displayName || 'Anonymous Node',
        cursor: { x, y, z: 0 },
        lastSeen: serverTimestamp(),
        color: '#' + Math.floor(Math.random()*16777215).toString(16)
      }, { merge: true }).catch(err => monitoringService.error('Presence sync failed', err));
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [user]);

  // Listen for Remote Users
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'presence'), (snapshot) => {
      const users: Record<string, any> = {};
      snapshot.forEach(doc => {
        if (user && doc.id !== user.uid) {
          users[doc.id] = doc.data();
        }
      });
      setRemoteUsers(users);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'presence');
    });
    return unsub;
  }, [user]);

  // Listen for Chat Messages
  useEffect(() => {
    const q = query(collection(db, 'nexus_chat'), orderBy('timestamp', 'desc'), limit(50));
    const unsub = onSnapshot(q, (snapshot) => {
      const msgs: any[] = [];
      snapshot.forEach(doc => msgs.push({ id: doc.id, ...doc.data() }));
      setMessages(msgs.reverse());
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'nexus_chat');
    });
    return unsub;
  }, []);

  const sendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !user) return;

    try {
      soundService.playClick();
      await addDoc(collection(db, 'nexus_chat'), {
        text: chatMessage,
        uid: user.uid,
        name: user.displayName || 'Anonymous',
        timestamp: serverTimestamp()
      });
      setChatMessage('');
    } catch (err) {
      monitoringService.error('Chat failed', err as Error);
      soundService.playError();
    }
  };

  const handleAddLayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLayerName.trim()) {
      soundService.playClick();
      addLayer(newLayerName.trim());
      setNewLayerName('');
    }
  };

  const handleInvite = () => {
    const inviteLink = `${window.location.origin}/project/default`;
    navigator.clipboard.writeText(inviteLink);
    alert('Invite link copied to clipboard!');
  };

  const handleAddAsset = (asset: Asset) => {
    // Add asset to the active layer
    const newLayers = layers.map((l, i) => i === 0 ? { ...l, objects: [...l.objects, asset.id] } : l);
    setLayers(newLayers);
    updateProjectState(newLayers, materialProps, ambientIntensity);
  };

  return (
    <div ref={viewportRef} onPointerMove={handlePointerMove} className="relative w-full h-full bg-[#050505] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl group">
      <SafeCanvas shadows dpr={[1, 2]} camera={{ position: [5, 5, 5], fov: 45 }}>
        <ambientLight intensity={ambientIntensity} />
        <Suspense fallback={<Html center><Loader2 className="w-8 h-8 animate-spin text-singularity" /></Html>}>
          <Stage intensity={0.5} environment="city" shadows="contact" adjustCamera={true}>
            {layers.filter(l => l.visible).map(layer => (
              <group key={layer.id}>
                {layer.url && (
                  <Model 
                    url={layer.url} 
                    layer={layer}
                  />
                )}
              </group>
            ))}
          </Stage>
          
          {/* Remote Cursors */}
          {Object.values(remoteUsers).map(u => (
            <RemoteCursor 
              key={u.uid} 
              position={[u.cursor.x * 5, u.cursor.y * 5, 0]} 
              color={u.color || '#00F0FF'} 
              name={u.name} 
            />
          ))}

          {/* Post Processing for Hologram */}
          {isHologram && (
            <EffectComposer>
              <Bloom 
                intensity={1.5} 
                luminanceThreshold={0.1} 
                luminanceSmoothing={0.9} 
                blendFunction={BlendFunction.SCREEN} 
              />
              <Scanline density={2.0} opacity={0.1} />
              <Noise opacity={0.05} />
              <ChromaticAberration offset={new THREE.Vector2(0.002, 0.002)} />
              <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer>
          )}
        </Suspense>
        <OrbitControls makeDefault autoRotate={autoRotate} />
        <Environment preset="city" />
      </SafeCanvas>

      {/* UI Overlays */}
      <div className="absolute top-8 right-8 flex flex-col gap-4">
        <button 
          onClick={handleInvite}
          className="p-4 rounded-2xl backdrop-blur-2xl border border-white/10 transition-all bg-white/5 text-white hover:bg-white/10"
          title="Invite Collaborators"
        >
          <Send className="w-6 h-6" />
        </button>
        <button 
          onClick={() => { soundService.playClick(); setIsHologram(!isHologram); }}
          className={`p-4 rounded-2xl backdrop-blur-2xl border border-white/10 transition-all ${isHologram ? 'bg-singularity text-black shadow-[0_0_20px_rgba(0,240,255,0.5)]' : 'bg-white/5 text-white hover:bg-white/10'}`}
          title="Toggle Hologram Mode"
        >
          <Zap className={`w-6 h-6 ${isHologram ? 'animate-pulse' : ''}`} />
        </button>
        <button 
          onClick={() => { soundService.playClick(); setAutoRotate(!autoRotate); }}
          className={`p-4 rounded-2xl backdrop-blur-2xl border border-white/10 transition-all ${autoRotate ? 'bg-singularity text-black' : 'bg-white/5 text-white hover:bg-white/10'}`}
        >
          <RotateCcw className={`w-6 h-6 ${autoRotate ? 'animate-spin-slow' : ''}`} />
        </button>
        <button 
          onClick={() => { soundService.playClick(); setShowLayers(!showLayers); setShowMaterials(false); setShowChat(false); setShowAssets(false); }}
          className={`p-4 rounded-2xl backdrop-blur-2xl border border-white/10 transition-all ${showLayers ? 'bg-quantum text-black' : 'bg-white/5 text-white hover:bg-white/10'}`}
        >
          <Layers className="w-6 h-6" />
        </button>
        <button 
          onClick={() => { soundService.playClick(); setShowMaterials(!showMaterials); setShowLayers(false); setShowChat(false); setShowAssets(false); }}
          className={`p-4 rounded-2xl backdrop-blur-2xl border border-white/10 transition-all ${showMaterials ? 'bg-singularity text-black' : 'bg-white/5 text-white hover:bg-white/10'}`}
        >
          <Box className="w-6 h-6" />
        </button>
        <button 
          onClick={() => { soundService.playClick(); setShowAssets(!showAssets); setShowLayers(false); setShowMaterials(false); setShowChat(false); }}
          className={`p-4 rounded-2xl backdrop-blur-2xl border border-white/10 transition-all ${showAssets ? 'bg-singularity text-black' : 'bg-white/5 text-white hover:bg-white/10'}`}
        >
          <Box className="w-6 h-6" />
        </button>
        <button 
          onClick={() => { soundService.playClick(); setShowChat(!showChat); setShowLayers(false); setShowMaterials(false); setShowAssets(false); }}
          className={`p-4 rounded-2xl backdrop-blur-2xl border border-white/10 transition-all ${showChat ? 'bg-reality text-black' : 'bg-white/5 text-white hover:bg-white/10'}`}
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      </div>

      {showAssets && <AssetLibrary onSelect={handleAddAsset} />}

      {/* Material Controls Panel */}
      {showMaterials && (
        <div className="absolute top-8 left-8 w-80 glass rounded-[2rem] p-8 border border-white/10 animate-in fade-in slide-in-from-left-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <Box className="w-4 h-4 text-singularity" /> Material Config
          </h3>
          
          <div className="mb-8">
            <h4 className="text-[10px] font-mono uppercase text-gray-500 mb-3">
              {isHologram ? 'Holographic Presets' : 'Material Library'}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {isHologram 
                ? Object.entries(HOLOGRAPHIC_PRESETS).map(([name, props]) => (
                    <button
                      key={name}
                      onClick={() => { soundService.playClick(); handleMaterialChange(props, true); setIsHologram(true); }}
                      className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-singularity transition-all text-xs text-left flex items-center gap-2"
                    >
                      <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: props.color }} />
                      {name}
                    </button>
                  ))
                : MATERIAL_LIBRARY.map((mat) => (
                    <button
                      key={mat.name}
                      onClick={() => { soundService.playClick(); handleMaterialChange(mat.props, false); setIsHologram(false); }}
                      className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-singularity transition-all text-xs text-left flex items-center gap-2"
                    >
                      <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: mat.props.color || '#fff' }} />
                      {mat.name}
                    </button>
                  ))
              }
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-[10px] font-mono uppercase text-gray-500">Roughness</label>
                <span className="text-[10px] font-mono text-singularity">{materialProps.roughness.toFixed(2)}</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.01" 
                value={materialProps.roughness}
                onChange={e => handleMaterialChange({ roughness: parseFloat(e.target.value) })}
                className="w-full h-1 bg-white/10 rounded-full accent-singularity" 
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-[10px] font-mono uppercase text-gray-500">Metalness</label>
                <span className="text-[10px] font-mono text-singularity">{materialProps.metalness.toFixed(2)}</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.01" 
                value={materialProps.metalness}
                onChange={e => handleMaterialChange({ metalness: parseFloat(e.target.value) })}
                className="w-full h-1 bg-white/10 rounded-full accent-singularity" 
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-[10px] font-mono uppercase text-gray-500">Transmission (Glass)</label>
                <span className="text-[10px] font-mono text-singularity">{(materialProps.transmission || 0).toFixed(2)}</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.01" 
                value={materialProps.transmission || 0}
                onChange={e => handleMaterialChange({ transmission: parseFloat(e.target.value) })}
                className="w-full h-1 bg-white/10 rounded-full accent-singularity" 
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-[10px] font-mono uppercase text-gray-500">Ambient Light</label>
                <span className="text-[10px] font-mono text-singularity">{ambientIntensity.toFixed(2)}</span>
              </div>
              <input 
                type="range" min="0.1" max="2.0" step="0.1" 
                value={ambientIntensity}
                onChange={e => handleAmbientChange(parseFloat(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-full accent-singularity" 
              />
            </div>
            <button 
              onClick={() => { soundService.playClick(); handleMaterialChange({ wireframe: !materialProps.wireframe }); }}
              className={`w-full py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${materialProps.wireframe ? 'bg-singularity/20 border-singularity text-white' : 'bg-white/5 border-white/10 text-gray-400'}`}
            >
              Wireframe Mode: {materialProps.wireframe ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      )}

      {/* Layer Panel */}
      {showLayers && (
        <div className="absolute top-8 left-8 w-80 glass rounded-[2rem] p-8 border border-white/10 animate-in fade-in slide-in-from-left-8 flex flex-col max-h-[80vh]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-2">
              <Layers className="w-4 h-4 text-quantum" /> Layer Stack
            </h3>
          </div>
          
          <form onSubmit={handleAddLayer} className="flex gap-2 mb-4">
            <input 
              type="text" 
              value={newLayerName}
              onChange={e => setNewLayerName(e.target.value)}
              placeholder="New layer name..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs outline-none focus:border-quantum/50 transition-all"
            />
            <button type="submit" className="p-2 bg-quantum text-black rounded-xl hover:scale-105 transition-transform">
              <Plus className="w-4 h-4" />
            </button>
          </form>

          <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar">
            {layers.map((layer, index) => (
              <div key={layer.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all group/item">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                    <button onClick={() => { if (index > 0) handleReorderLayers(index, index - 1); }} className="hover:text-quantum"><ChevronUp className="w-3 h-3" /></button>
                    <button onClick={() => { if (index < layers.length - 1) handleReorderLayers(index, index + 1); }} className="hover:text-quantum"><ChevronDown className="w-3 h-3" /></button>
                  </div>
                  <span className="text-xs font-mono text-gray-300">{layer.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      soundService.playClick();
                      const newLayers = layers.map(l => l.id === layer.id ? { ...l, materialProps: { ...l.materialProps, wireframe: !l.materialProps?.wireframe } } : l);
                      setLayers(newLayers);
                      updateProjectState(newLayers, materialProps, ambientIntensity);
                    }}
                    className={`p-1 rounded-lg transition-colors ${layer.materialProps?.wireframe ? 'bg-singularity text-black' : 'text-gray-500 hover:text-white'}`}
                    title="Toggle Wireframe"
                  >
                    <Box className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => handleToggleLayer(layer.id)}
                    className={`w-8 h-4 rounded-full transition-all relative ${layer.visible ? 'bg-quantum' : 'bg-gray-800'}`}
                  >
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${layer.visible ? 'right-0.5' : 'left-0.5'}`} />
                  </button>
                  <button onClick={() => handleRemoveLayer(layer.id)} className="p-1 text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover/item:opacity-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Panel */}
      {showChat && (
        <div className="absolute bottom-8 left-8 w-96 glass rounded-[2rem] p-8 border border-white/10 animate-in fade-in slide-in-from-bottom-8">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-reality" /> Nexus Comms
          </h3>
          <div className="h-64 overflow-y-auto mb-6 space-y-4 pr-4 scrollbar-hide">
            {messages.map(msg => (
              <div key={msg.id} className={`flex flex-col gap-1 ${msg.uid === user?.uid ? 'items-end' : 'items-start'}`}>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{msg.name}</span>
                <p className={`text-xs p-3 rounded-2xl max-w-[80%] ${msg.uid === user?.uid ? 'bg-reality text-white rounded-tr-none' : 'bg-white/5 text-gray-300 rounded-tl-none'}`}>
                  {msg.text}
                </p>
              </div>
            ))}
          </div>
          <form onSubmit={sendChat} className="relative">
            <input 
              type="text" 
              value={chatMessage}
              onChange={e => setChatMessage(e.target.value)}
              placeholder="Transmit to nexus..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs outline-none focus:border-reality/50 transition-all pr-14"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-reality hover:scale-110 transition-transform">
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* Nexus Status */}
      <div className="absolute bottom-8 right-8 flex items-center gap-4 glass px-6 py-3 rounded-full border border-white/10">
        <div className="flex -space-x-3">
          {Object.values(remoteUsers).slice(0, 3).map((u: any) => (
            <div key={u.uid} className="w-8 h-8 rounded-full border-2 border-black overflow-hidden bg-gray-800">
              <div className="w-full h-full flex items-center justify-center text-[10px] font-bold" style={{ color: u.color }}>
                {u.name.charAt(0)}
              </div>
            </div>
          ))}
          {user && (
            <div className="w-8 h-8 rounded-full border-2 border-black bg-singularity flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-black" />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-white uppercase tracking-widest leading-none mb-1">Nexus Active</span>
          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest leading-none">
            {Object.keys(remoteUsers).length + (user ? 1 : 0)} Nodes Connected
          </span>
        </div>
      </div>
    </div>
  );
}
