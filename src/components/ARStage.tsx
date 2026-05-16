import React, { useState, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Interactive, useXRHitTest, useXR } from '@react-three/xr';
import { useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Fallback simple avatar as box if no model
function AvatarModel({ position, rotation }: { position: THREE.Vector3, rotation: THREE.Euler }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Small floating animation to simulate live
      groupRef.current.position.y = position.y + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      groupRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <mesh position={[0, 0.8, 0]} castShadow>
        <capsuleGeometry args={[0.3, 1, 4, 16]} />
        <meshStandardMaterial color="#8b5cf6" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#ec4899" roughness={0.1} metalness={0.5} />
      </mesh>
      {/* Platform/stage */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.1, 64]} />
        <meshStandardMaterial color="#2dd4bf" emissive="#2dd4bf" emissiveIntensity={0.8} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Spotlight for the stage */}
      <spotLight
        position={[0, 5, 0]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        castShadow
        color="#ffffff"
      />
      {/* Aura/glow */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function ARStage() {
  const [avatarParams, setAvatarParams] = useState<{ position: THREE.Vector3, rotation: THREE.Euler } | null>(null);
  const reticleRef = useRef<THREE.Mesh>(null);

  // useXRHitTest will give us the intersection point with real-world planes
  useXRHitTest(
    (hitMatrix: THREE.Matrix4, hit: XRHitTestResult) => {
      if (reticleRef.current) {
        hitMatrix.decompose(
          reticleRef.current.position,
          reticleRef.current.quaternion,
          reticleRef.current.scale
        );
        // Only show reticle if we haven't placed the avatar yet
        reticleRef.current.visible = avatarParams === null;
      }
    }
  );

  const handlePlace = () => {
    if (reticleRef.current && reticleRef.current.visible) {
      setAvatarParams({
        position: reticleRef.current.position.clone(),
        rotation: new THREE.Euler().setFromQuaternion(reticleRef.current.quaternion),
      });
    }
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight castShadow position={[2.5, 8, 5]} intensity={1.5} shadow-mapSize={1024} />
      <Environment preset="city" />

      {/* Reticle for placement */}
      <Interactive onSelect={handlePlace}>
        <mesh ref={reticleRef} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[0.1, 0.25, 32]} />
          <meshBasicMaterial color="#ffffff" opacity={0.8} transparent />
        </mesh>
      </Interactive>

       {/* Placed Avatar */}
      {avatarParams && (
        <AvatarModel position={avatarParams.position} rotation={avatarParams.rotation} />
      )}
    </>
  );
}
