import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SafeCanvas } from './SafeCanvas';
import { motion } from 'framer-motion';

function AudioReactiveParticles({ audioLevel, emotion }: { audioLevel: number, emotion: number }) {
  const pointsRef = useRef<THREE.Points>(null!);
  
  const particleCount = 4000;
  
  const [positions, initialPositions] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const initialPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
       const theta = Math.random() * 2 * Math.PI;
       const phi = Math.acos((Math.random() * 2) - 1);
       const r = 10 + Math.random() * 15;
       
       const x = r * Math.sin(phi) * Math.cos(theta);
       const y = r * Math.sin(phi) * Math.sin(theta);
       const z = r * Math.cos(phi);
       
       pos[i * 3] = x;
       pos[i * 3 + 1] = y;
       pos[i * 3 + 2] = z;
       
       initialPos[i * 3] = x;
       initialPos[i * 3 + 1] = y;
       initialPos[i * 3 + 2] = z;
    }
    return [pos, initialPos];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    const posAttribute = pointsRef.current.geometry.getAttribute('position');
    const pa = posAttribute.array as Float32Array;
    
    // React to mouse and "audioLevel"
    const mouseX = (state.mouse.x * 5);
    const mouseY = (state.mouse.y * 5);
    
    const reaction = 1 + (audioLevel * 5);

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const ix = initialPositions[i3];
        const iy = initialPositions[i3 + 1];
        const iz = initialPositions[i3 + 2];

        // Complex flow mechanics
        pa[i3] = ix + Math.sin(time * 0.5 + iy * 0.1) * reaction + mouseX * 0.5;
        pa[i3 + 1] = iy + Math.cos(time * 0.6 + ix * 0.1) * reaction + mouseY * 0.5;
        pa[i3 + 2] = iz + Math.sin(time * 0.4 + ix * 0.1 + iy * 0.1) * reaction * 2;
    }
    
    posAttribute.needsUpdate = true;
    pointsRef.current.rotation.y = time * 0.05 * emotion;
    pointsRef.current.rotation.x = time * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.08} 
        color="#00f0ff" 
        transparent 
        opacity={0.6} 
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export function InteractiveArenaBackground({ biometricData }: { biometricData: any }) {
    // derive some synthetic values from biometrics for visualization
    const audioLevel = (biometricData?.heartRate > 100) ? ((biometricData.heartRate - 100) / 100) : 0.1;
    const emotion = biometricData?.alphaWave || 0.5;

    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0014] to-[#000000]" />
            <SafeCanvas camera={{ position: [0, 0, 20], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <AudioReactiveParticles audioLevel={audioLevel} emotion={emotion} />
            </SafeCanvas>
            
            {/* Cinematic overlay effects */}
            <motion.div 
               className="absolute inset-0 mix-blend-overlay opacity-30"
               style={{
                   background: 'radial-gradient(circle at center, transparent 0%, #000000 100%)',
               }}
            />
        </div>
    );
}
