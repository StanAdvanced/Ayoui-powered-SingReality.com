import React, { useRef, useState, useEffect } from 'react';
import { SafeCanvas } from './SafeCanvas';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles, } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { useSound } from '../hooks/useSound';
import { narrationEngine } from '../services/narrationEngine';

function Humanoid({ isTalking, onInteract, isAnimating }: { isTalking: boolean, onInteract: () => void, isAnimating: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const { mouse, viewport, camera } = useThree();
  const [mode, setMode] = useState<'FIXED' | 'CURSOR'>('FIXED');
  const [hovered, setHovered] = useState(false);
  const lastMoveRef = useRef(Date.now());
  const [targetScale, setTargetScale] = useState(1.0);

  useEffect(() => {
    const handleAction = () => {
      lastMoveRef.current = Date.now();
      setMode('CURSOR');
    };
    window.addEventListener('mousemove', handleAction);
    window.addEventListener('keydown', handleAction);
    window.addEventListener('touchstart', handleAction);

    return () => {
      window.removeEventListener('mousemove', handleAction);
      window.removeEventListener('keydown', handleAction);
      window.removeEventListener('touchstart', handleAction);
    };
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    
    // Inactivity reset
    if (Date.now() - lastMoveRef.current > 10000 && mode === 'CURSOR') {
      setMode('FIXED');
    }

    // Scale logic
    const baseScale = mode === 'CURSOR' ? 0.1 : 1.0;
    const scale = baseScale * (hovered ? 1.05 : 1.0);
    setTargetScale(scale);
    if (groupRef.current) {
        groupRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
        
        // Position logic
        if (mode === 'CURSOR') {
            const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
            vector.unproject(camera);
            const dir = vector.sub(camera.position).normalize();
            const distance = -camera.position.z / dir.z;
            const pos = camera.position.clone().add(dir.multiplyScalar(distance));
            groupRef.current.position.lerp(pos, 0.2);
        } else {
            groupRef.current.position.lerp(new THREE.Vector3(0, -1, 0), 0.1);
        }

        // Click animation sequence (Spin and Jitter)
        if (isAnimating) {
            groupRef.current.rotation.y += delta * 15;
            groupRef.current.position.y += Math.sin(time * 30) * 0.1;
        }
    }

    if (headRef.current) {
      // Look at mouse
      headRef.current.lookAt(mouse.x * viewport.width, mouse.y * viewport.height, 5);
      if (isTalking) {
        headRef.current.rotation.x += Math.sin(time * 15) * 0.15;
        headRef.current.scale.setScalar(1 + Math.sin(time * 20) * 0.05);
      }
    }
  });

  return (
    <group 
      ref={groupRef} 
      onClick={(e) => { e.stopPropagation(); onInteract(); }} 
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      dispose={null}
    >
      {/* 70s Hologram Look (translucent + emissive) */}
      <mesh ref={headRef} position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial 
          color="#ff00ff"
          transparent
          opacity={0.7}
          emissive={hovered ? "#00ffff" : (isTalking ? "#ffff00" : "#ff00ff")}
          emissiveIntensity={isTalking ? 3 : (hovered ? 2.5 : 0.8)}
        />
        {/* Afro Suggestion (procedural spikes) */}
        <mesh position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.35, 16, 16]} />
            <meshStandardMaterial color="#331100" transparent opacity={0.6} />
        </mesh>
      </mesh>

      {/* Funky Flare Body - simplified cone flair */}
      <mesh position={[0, 0.8, 0]}>
        <coneGeometry args={[0.4, 1.2, 16]} />
        <meshStandardMaterial 
            color="#00ddff"
            transparent 
            opacity={0.8}
            emissive={hovered ? "#ffffff" : "#00ddff"}
            emissiveIntensity={hovered ? 1.5 : 0.5}
        />
      </mesh>
    </group>
  );
}

export function Avatar({ isTalking }: { isTalking: boolean }) {
  const { playWhoosh, playChime, playSuccess } = useSound();
  const [internalTalking, setInternalTalking] = useState(isTalking);
  const [animating, setAnimating] = useState(false);

  const handleInteraction = () => {
    if (animating) return;

    const responses = [
      "Greetings! SingReality host in the house. Funky vibes enabled. How can I assist?",
      "System check complete. Creative flow at maximum capacity. What are we creating?",
      "I feel the rhythm of the arena. Let's sync our neural networks. Ready when you are.",
      "Neural pathways integrated. The future of music is here, and you are the architect.",
      "Vibe shift detected. Optimizing acoustic environment for peak performance.",
      "Aha! A curious creator. My sensors detect high levels of inspiration in this vicinity.",
      "Transmitting digital harmony... Welcome to the edge of the Singularity.",
      "Reality check: verified. You are currently in the most advanced studio in the multiverse.",
      "I've been calculating new melodies for your next masterpiece. Shall we begin?",
      "My bio-digital nexus is buzzing with energy today. Let's make something legendary."
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    setAnimating(true);
    playSuccess();
    
    // Reset animation after sequence
    setTimeout(() => setAnimating(false), 800);

    setInternalTalking(true);
    narrationEngine.narrate(randomResponse, true).finally(() => {
      setInternalTalking(false);
    });
  };

  return (
    <div className="w-full h-full absolute inset-0 pointer-events-none">
        <div className="pointer-events-auto w-full h-full">
      <SafeCanvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[-5, -5, -5]} intensity={5} color="#ff007a" />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <Humanoid isTalking={internalTalking} onInteract={handleInteraction} isAnimating={animating} />
        </Float>
        
        <EffectComposer>
          <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} intensity={1.5} />
          <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={new THREE.Vector2(0.002, 0.002)} />
        </EffectComposer>
      </SafeCanvas>
      </div>
    </div>
  );
}
