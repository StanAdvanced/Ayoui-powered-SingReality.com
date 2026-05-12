import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import * as THREE from 'three';

function SplatCloud() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // Create thousands of billboarded particles to simulate Gaussian splatting look
  const count = 50000;
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colors = useMemo(() => new Float32Array(count * 3), [count]);
  
  useMemo(() => {
    const color = new THREE.Color();
    for (let i = 0; i < count; i++) {
       const x = (Math.random() - 0.5) * 100;
       const y = (Math.random() - 0.5) * 100;
       const z = (Math.random() - 0.5) * 100;
       
       // Center denser
       const dist = Math.sqrt(x*x + y*y + z*z);
       const factor = Math.max(0, 1 - dist / 50);
       
       // Map to some color palette (e.g. pink, blue, purple)
       color.setHSL(0.7 + Math.random() * 0.3, 1.0, 0.5 + factor * 0.5);
       color.toArray(colors, i * 3);
    }
  }, [count, colors]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
      let i = 0;
      for (let x = 0; x < count; x++) {
        const time = state.clock.getElapsedTime();
        const ax = (Math.random() - 0.5) * 100; // In reality, you'd retain positions
        
        // Dynamic oscillating motion for the fake splats
        // For performance, doing it this way in useFrame for 50k is heavy, 
        // so we just rotate the entire mesh.
      }
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[new THREE.PlaneGeometry(0.5, 0.5), new THREE.MeshBasicMaterial({ color: 'white', transparent: true, opacity: 0.8, depthWrite: false }), count]}>
      {Array.from({ length: count }).map((_, i) => {
        const x = (Math.random() - 0.5) * 100;
        const y = (Math.random() - 0.5) * 100;
        const z = (Math.random() - 0.5) * 100;
        dummy.position.set(x, y, z);
        
        // Random scale simulating gaussian covariance
        const sx = Math.random() * 2;
        const sy = Math.random() * 2;
        dummy.scale.set(sx, sy, 1);
        
        dummy.lookAt(0, 0, 0); // Always face camera generally
        dummy.updateMatrix();
        meshRef.current?.setMatrixAt(i, dummy.matrix);
        return null;
      })}
      <instancedBufferAttribute attach="instanceColor" args={[colors, 3]} />
    </instancedMesh>
  );
}

export function GaussianSplatMetaverse() {
  return (
    <div className="w-full h-screen bg-black relative">
      <div className="absolute top-0 left-0 w-full p-8 z-10 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <div>
          <h1 className="text-4xl font-bold diamond-crystal">SingReality Metaverse</h1>
          <p className="text-white/60 uppercase tracking-widest text-sm mt-2">Gaussian Splat Simulation Engine v9.0</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-6 py-2 bg-singularity text-white font-bold rounded-full hover:bg-singularity/80 border border-white/20">
            Enter Live Arena
          </button>
        </div>
      </div>
      
      <Canvas camera={{ position: [0, 0, 30], fov: 60 }} gl={{ alpha: false, antialias: true }}>
        <color attach="background" args={['#030305']} />
        <ambientLight intensity={0.5} />
        <SplatCloud />
        <OrbitControls autoRotate autoRotateSpeed={0.5} enableDamping />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
