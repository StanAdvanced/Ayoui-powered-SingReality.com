import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function SynestheticTerrain({ color = '#7000ff', speed = 1, height = 1.5 }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => new THREE.PlaneGeometry(50, 50, 32, 32), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime * speed;
    const positions = meshRef.current.geometry.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      
      // Complex wave function for "Khoral-Flow" terrain
      const z = Math.sin(x * 0.5 + time) * Math.cos(y * 0.5 + time) * height +
                Math.sin(x * 0.1 - time * 0.5) * height * 0.5;
                
      positions.setZ(i, z);
    }
    positions.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial 
        color={color} 
        wireframe 
        transparent 
        opacity={0.4} 
        emissive={color}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}
