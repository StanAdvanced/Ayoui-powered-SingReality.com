
import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, MeshDistortMaterial, Points, PointMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

// Human Digital Twin - Luna Avatar
export function AIDJAvatar({ isSpeaking, currentVibe }: { isSpeaking: boolean, currentVibe: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  
  // High-poly human model for "digital twin" projection
  // Using a representative human model
  const { nodes, materials } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/woman/model.gltf') as any;

  // Blueprint Shader Effect
  const blueprintMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#00ffff',
    emissive: '#00ffff',
    emissiveIntensity: 2,
    wireframe: true,
    transparent: true,
    opacity: 0.4,
  }), []);

  // Liquid/Skin Material for transition
  const liquidMaterial = useMemo(() => (
    <MeshDistortMaterial
      color="#ffffff"
      emissive="#00ffff"
      emissiveIntensity={isSpeaking ? 5 : 1}
      metalness={1}
      roughness={0}
      distort={0.4}
      speed={5}
      transparent
      opacity={0.3}
    />
  ), [isSpeaking]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
    }
    
    // Animate blueprint intensity
    if (coreRef.current) {
        const material = coreRef.current.material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = 2 + Math.sin(state.clock.getElapsedTime() * 5) * 1;
    }
  });

  return (
    <group ref={groupRef} position={[0, -2.5, 0]} scale={[2.5, 2.5, 2.5]}>
      {/* Holographic Projection Base */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1.2, 64]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* The Digital Twin Mesh */}
      <group>
        {Object.keys(nodes).map((key) => {
          const node = nodes[key];
          if (node.isMesh) {
            return (
              <mesh 
                key={key}
                geometry={node.geometry}
                rotation={node.rotation}
                position={node.position}
                scale={node.scale}
              >
                {/* Layer 1: Blueprint Wireframe */}
                <meshStandardMaterial 
                   {...blueprintMaterial} 
                   emissiveIntensity={isSpeaking ? 10 : 2}
                />
                
                {/* Layer 2: Liquid Skin (Inner Glow) */}
                <mesh scale={[1.01, 1.01, 1.01]}>
                    <sphereGeometry args={[0.01, 4, 4]} /> {/* Tiny mesh just to trigger shader logic in map if needed */}
                    {liquidMaterial}
                </mesh>
              </mesh>
            );
          }
          return null;
        })}
      </group>

      {/* Floating Data Particles */}
      <Points limit={1000}>
        <PointMaterial 
            transparent 
            vertexColors 
            size={0.05} 
            sizeAttenuation={true} 
            depthWrite={false} 
            color="#00ffff"
        />
        {useMemo(() => {
            const positions = new Float32Array(500 * 3);
            for (let i = 0; i < 500; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 2;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
            }
            return <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />;
        }, [])}
      </Points>
    </group>
  );
}

// Speak Functionality (Browser Speech API)
export function useAIDJVoice() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find a sophisticated female voice (American/Australian)
    // Priority: Google US English Female, Samantha, Karen (AU), etc.
    const femaleVoice = voices.find(v => 
        (v.name.includes('Female') || v.name.includes('Google US English') || v.name.includes('Samantha') || v.name.includes('Karen')) 
        && (v.lang.includes('en-US') || v.lang.includes('en-AU'))
    );

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    utterance.pitch = 1.1;
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
    
    return utterance;
  };

  return { speak };
}
