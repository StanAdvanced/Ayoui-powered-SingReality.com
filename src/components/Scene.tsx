import React, { useRef, useMemo, useState, useEffect } from 'react';
import { SafeCanvas } from './SafeCanvas';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Points, PointMaterial, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { GPUResourceManager } from '../core/gpuResourceManager';
import { DynamicLOD } from './DynamicLOD';

function FPSUpdater() {
  useFrame(() => {
    GPUResourceManager.getInstance().updateFPS();
  });
  return null;
}

function SingularityCore({ detailLevel }: { detailLevel: 'high' | 'medium' | 'low' }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { mouse } = useThree();

  const segments = useMemo(() => {
    if (detailLevel === 'high') return 64;
    if (detailLevel === 'medium') return 32;
    return 16;
  }, [detailLevel]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.2 + (mouse.y * 0.5);
      meshRef.current.rotation.y = time * 0.3 + (mouse.x * 0.5);
      
      // Subtle scale pulsing based on mouse position
      const targetScale = 1 + (Math.abs(mouse.x) + Math.abs(mouse.y)) * 0.1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  // Calculate resolution arrays
  const resHigh: [number, number, number] = [1, 64, 64];
  const resMed: [number, number, number] = [1, 32, 32];
  const resLow: [number, number, number] = [1, 16, 16];

  return (
    <Float speed={detailLevel === 'low' ? 0.5 : 2} rotationIntensity={1} floatIntensity={2}>
      <DynamicLOD distances={[0, 10, 20]}>
        <Sphere ref={meshRef} args={resHigh}>
          <MeshDistortMaterial
            transparent={true}
            color="#00f2ff"
            speed={3}
            distort={0.4}
            radius={1}
            emissive="#7000ff"
            emissiveIntensity={0.5}
            // Lower quality for high distances could be standard material
          />
        </Sphere>
        <Sphere args={resMed}>
          <meshStandardMaterial color="#00f2ff" emissive="#7000ff" transparent opacity={0.8} />
        </Sphere>
        <Sphere args={resLow}>
          <meshBasicMaterial color="#00f2ff" wireframe />
        </Sphere>
      </DynamicLOD>
    </Float>
  );
}

function QuantumParticles({ detailLevel }: { detailLevel: 'high' | 'medium' | 'low' }) {
  const count = useMemo(() => {
    if (detailLevel === 'high') return 2000;
    if (detailLevel === 'medium') return 800;
    return 200;
  }, [detailLevel]);

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
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.05 + (mouse.x * 0.2);
      pointsRef.current.rotation.x = (mouse.y * 0.2);
    }
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
  const [detailLevel, setDetailLevel] = useState<'high' | 'medium' | 'low'>('high');

  useEffect(() => {
    const gpuManager = GPUResourceManager.getInstance();
    gpuManager.optimizeFor(60);
    const unsubscribe = gpuManager.subscribe(setDetailLevel);
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-auto">
      <SafeCanvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <FPSUpdater />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00f2ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff007a" />
        <SingularityCore detailLevel={detailLevel} />
        <QuantumParticles detailLevel={detailLevel} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </SafeCanvas>
    </div>
  );
}
