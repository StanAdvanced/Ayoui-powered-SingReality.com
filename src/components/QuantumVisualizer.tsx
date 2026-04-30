import React, { useRef, useMemo } from 'react';
import { SafeCanvas } from './SafeCanvas';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SpatialCard } from './SpatialCard';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

// 7-Dimensional Data Visualization simulation
function AdvancedHarmonicVibrations({ isGenerating }: { isGenerating: boolean }) {
  const mesh = useRef<THREE.Points>(null!);
  
  const count = 3000;
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = Math.random() * Math.PI * 2;
      const r = Math.random() * 8;
      temp[i * 3] = Math.cos(t) * r;
      temp[i * 3 + 1] = Math.sin(t) * r;
      temp[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return temp;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * (isGenerating ? 3 : 1);
    mesh.current.rotation.x = t * 0.1;
    mesh.current.rotation.y = t * 0.2;
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      // Create complex toroid-like flow
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      positions[i * 3 + 2] = Math.sin(t + x * 0.5) * Math.cos(t + y * 0.5) * 2;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.03} 
        color={isGenerating ? "#ff00ff" : "#00f0ff"} 
        transparent 
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function QuantumVisualizer({ isGenerating = false }: { isGenerating?: boolean }) {
  return (
    <SpatialCard className="w-full h-full relative" glowColor={isGenerating ? "#ff00ff" : "#00f0ff"}>
      <SafeCanvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.5} />
        <AdvancedHarmonicVibrations isGenerating={isGenerating} />
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={2} />
        </EffectComposer>
      </SafeCanvas>
    </SpatialCard>
  );
}
