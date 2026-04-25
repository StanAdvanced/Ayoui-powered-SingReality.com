import React, { useRef, useMemo } from 'react';
import { SafeCanvas } from './SafeCanvas';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

function Starfield() {
  const ref = useRef<THREE.Points>(null);
  
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(5000 * 3);
    const cols = new Float32Array(5000 * 3);
    const colorPalette = [
      new THREE.Color('#00f0ff'), // Singularity Blue
      new THREE.Color('#7000ff'), // Quantum Purple
      new THREE.Color('#ff003c'), // Reality Red
      new THREE.Color('#ffffff')  // Pure Light
    ];

    for (let i = 0; i < 5000; i++) {
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 50 + Math.random() * 50;
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    return [pos, cols];
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.0001;
      ref.current.rotation.x += 0.00005;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          vertexColors
          size={0.15}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

function Nebula() {
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
       <mesh position={[10, -5, -20]}>
         <sphereGeometry args={[15, 32, 32]} />
         <meshBasicMaterial 
           color="#7000ff" 
           transparent 
           opacity={0.05} 
           side={THREE.BackSide}
         />
       </mesh>
       <mesh position={[-15, 10, -30]}>
         <sphereGeometry args={[20, 32, 32]} />
         <meshBasicMaterial 
           color="#00f0ff" 
           transparent 
           opacity={0.03} 
           side={THREE.BackSide}
         />
       </mesh>
    </Float>
  );
}

export function GSpaceBackground() {
  return (
    <div className="absolute inset-0 z-0 bg-[#030305]">
      <SafeCanvas camera={{ position: [0, 0, 1] }}>
        <Starfield />
        <Nebula />
        <fog attach="fog" args={['#030305', 10, 100]} />
      </SafeCanvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
    </div>
  );
}
