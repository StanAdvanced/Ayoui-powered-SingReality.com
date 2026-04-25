import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface PRCProps {
  state?: 'idle' | 'active' | 'creating';
  color?: string;
  scale?: number;
}

export function PsycheResonantConduit({ state = 'idle', color = '#00f0ff', scale = 1.5 }: PRCProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((rootState) => {
    if (meshRef.current) {
      const speed = state === 'creating' ? 0.8 : 0.2;
      meshRef.current.rotation.x = rootState.clock.elapsedTime * speed;
      meshRef.current.rotation.y = rootState.clock.elapsedTime * (speed * 1.5);
    }
  });

  const distortAmount = state === 'creating' ? 0.8 : state === 'active' ? 0.5 : 0.2;
  const speedAmount = state === 'creating' ? 6 : state === 'active' ? 3 : 1;

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[scale, 32, 32]}>
        <MeshDistortMaterial
          color={color}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.9}
          roughness={0.1}
          distort={distortAmount}
          speed={speedAmount}
        />
      </Sphere>
      <Sparkles 
        count={state === 'creating' ? 500 : 200} 
        scale={scale * 3} 
        size={state === 'creating' ? 4 : 2} 
        speed={state === 'creating' ? 0.8 : 0.4} 
        opacity={0.5} 
        color={color} 
      />
    </Float>
  );
}
