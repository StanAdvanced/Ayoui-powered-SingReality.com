import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Avatar(props: any) {
  // Using a placeholder avatar from Ready Player Me or Mixamo can work, but we'll use a primitive or a generic public one if not available.
  // We'll create a stylized procedural avatar composed of primitives mapped with advanced shaders since we don't have a reliable URL for a rigged human in this sandboxed environment without external CDNs sometimes failing.
  // Actually, wait, let's use a generic humanoid group built from primitives for guaranteed availability, OR we can try loading a known free glb.
  // Given we want "God-tier graphics", let's build a glowing quantum/light being proxy avatar that looks visually stunning using shaders and glowing particles.
  
  const group = useRef<THREE.Group>(null);
  
  // Floating animation
  useFrame((state, delta) => {
    if (group.current) {
      group.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
      group.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.5, 64, 64]} />
        <meshStandardMaterial 
          color="#00D4FF" 
          emissive="#00D4FF" 
          emissiveIntensity={2} 
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.4, 2, 64]} />
        <meshPhysicalMaterial 
          color="#6C3CE1" 
          emissive="#3a1b80"
          emissiveIntensity={1}
          transmission={0.9}
          opacity={1}
          roughness={0}
          metalness={0.1}
          ior={1.5}
        />
      </mesh>
      
      {/* Particle orbit */}
      <mesh position={[0, 0, 0]}>
         <torusGeometry args={[1.5, 0.02, 16, 100]} />
         <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}
