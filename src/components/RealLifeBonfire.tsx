import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function RealLifeBonfire() {
  const fireRef = useRef<THREE.Group>(null);
  const particleCount = 100;

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < particleCount; i++) {
      temp.push({
        t: Math.random() * 10,
        speed: 0.2 + Math.random() * 0.5,
        radius: Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (fireRef.current) {
      fireRef.current.children.forEach((child, i) => {
        const p = particles[i];
        const life = (time * p.speed + p.t) % 5;
        const progress = life / 5;
        
        // Buoyancy and swirl
        child.position.y = progress * 3;
        child.position.x = Math.sin(progress * 10 + p.offset) * p.radius * (1 - progress);
        child.position.z = Math.cos(progress * 10 + p.offset) * p.radius * (1 - progress);
        
        // Size and color flicker
        const scale = (1 - progress) * 0.3;
        child.scale.set(scale, scale, scale);
        
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.opacity = (1 - progress) * 0.8;
          child.material.emissiveIntensity = 2 + Math.sin(time * 20 + i) * 1;
        }
      });
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Emissive logs */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.1, 0.3]}>
        <cylinderGeometry args={[0.1, 0.1, 1]} />
        <meshStandardMaterial color="#442211" roughness={1} />
      </mesh>
      <mesh rotation={[0, Math.PI / 3, Math.PI / 2]} position={[0, 0.1, -0.3]}>
        <cylinderGeometry args={[0.1, 0.1, 1]} />
        <meshStandardMaterial color="#442211" roughness={1} />
      </mesh>

      {/* Point light for flicker */}
      <pointLight 
        intensity={20} 
        distance={10} 
        color="#ff6600" 
        position={[0, 1, 0]} 
        onUpdate={(self) => {
          self.intensity = 15 + Math.sin(Date.now() * 0.02) * 5;
        }}
      />

      {/* Fire Particles */}
      <group ref={fireRef}>
        {particles.map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial 
              transparent 
              color={i % 2 === 0 ? "#ffcc00" : "#ff4400"} 
              emissive={i % 2 === 0 ? "#ffaa00" : "#ff2200"}
              emissiveIntensity={2}
            />
          </mesh>
        ))}
      </group>
      
      {/* Ground Glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial 
          color="#221100" 
          transparent 
          opacity={0.5} 
          roughness={1}
        />
      </mesh>
    </group>
  );
}
