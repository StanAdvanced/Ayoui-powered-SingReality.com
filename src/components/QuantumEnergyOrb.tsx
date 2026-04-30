import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';

export function QuantumEnergyOrb({ analyzerData }: { analyzerData?: Uint8Array }) {
  const materialRef = useRef<any>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (materialRef.current) {
      // Audio reactive distortion
      const avgAudio = analyzerData ? analyzerData.reduce((a, b) => a + b, 0) / analyzerData.length : 128;
      const intensity = Math.max(0.2, avgAudio / 255);
      
      materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, intensity * 0.8, 0.1);
      materialRef.current.speed = THREE.MathUtils.lerp(materialRef.current.speed, intensity * 5, 0.1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1.5, 64, 64]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          ref={materialRef}
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={2}
          wireframe
          distort={0.4}
          speed={2}
          roughness={0}
          metalness={1}
        />
      </Sphere>
      
      <pointLight color="#00f0ff" intensity={5} distance={10} />
    </Float>
  );
}
