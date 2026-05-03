import React, { useRef, useMemo } from 'react';
import { SafeCanvas } from './SafeCanvas';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Atmospheric / Immersive Media Visualizer
function HarmonicVibrations() {
  const mesh = useRef<THREE.Mesh>(null!);
  
  // 11-dimensional string vibration simulation (simplified)
  const count = 1000;
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = Math.random() * Math.PI * 2;
      const r = Math.random() * 5;
      temp[i * 3] = Math.cos(t) * r;
      temp[i * 3 + 1] = Math.sin(t) * r;
      temp[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return temp;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    mesh.current.rotation.x = t * 0.1;
    mesh.current.rotation.y = t * 0.2;
    // Animate particles based on harmonic vibrations
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 2] = Math.sin(t + i * 0.1) * 0.5;
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
      <pointsMaterial size={0.05} color="#00FF9D" transparent opacity={0.6} />
    </points>
  );
}

export function QuantumVisualizer() {
  return (
    <div className="w-full h-[500px] glass-card rounded-[3rem] overflow-hidden">
      <SafeCanvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <HarmonicVibrations />
      </SafeCanvas>
      <div className="absolute bottom-8 left-8 text-white">
        <h3 className="text-2xl font-display font-bold">Quantum Harmonic Field</h3>
        <p className="text-gray-400">Real-time mapping of 11D string vibrations.</p>
      </div>
    </div>
  );
}
