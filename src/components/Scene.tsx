import React, { useRef, useMemo } from 'react';
import { SafeCanvas } from './SafeCanvas';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Points, PointMaterial, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function SingularityCore() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { mouse } = useThree();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = time * 0.2 + (mouse.y * 0.5);
    meshRef.current.rotation.y = time * 0.3 + (mouse.x * 0.5);
    
    // Subtle scale pulsing based on mouse position
    const targetScale = 1 + (Math.abs(mouse.x) + Math.abs(mouse.y)) * 0.1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <MeshDistortMaterial
          transparent={true}
          color="#00f2ff"
          speed={3}
          distort={0.4}
          radius={1}
          emissive="#7000ff"
          emissiveIntensity={0.5}
        />
      </Sphere>
    </Float>
  );
}

function QuantumParticles({ count = 2000 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return p;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null!);
  const { mouse } = useThree();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = time * 0.05 + (mouse.x * 0.2);
    pointsRef.current.rotation.x = (mouse.y * 0.2);
  });

  return (
    <Points ref={pointsRef} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function Scene() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-auto">
      <SafeCanvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00f2ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff007a" />
        <SingularityCore />
        <QuantumParticles />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </SafeCanvas>
    </div>
  );
}
