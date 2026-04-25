import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float, Text, Sparkles } from '@react-three/drei';
import { useStore } from '../store/useStore';
import { useSound } from '../hooks/useSound';
import * as THREE from 'three';

export function BiometricSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { resonance, biometricSync } = useStore();
  const { playClick, playWhoosh } = useSound();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Calculate color based on biometric activity
    const activityFactor = biometricSync.active ? 1 : 0.3;
    const heartPulse = biometricSync.active ? Math.sin(time * (biometricSync.heartRate / 15)) * 0.5 + 0.5 : 0;
    
    // Transition colors based on stress level and activity 
    const baseColor = new THREE.Color(biometricSync.active ? '#00FF9F' : '#444444');
    const stressColor = new THREE.Color('#FF4E00'); // Warning color
    const syncColor = baseColor.clone().lerp(stressColor, biometricSync.stressLevel * activityFactor);
    
    if (meshRef.current) {
      const mat = meshRef.current.material as any;
      if (mat) {
        mat.color.lerp(syncColor, 0.1);
        mat.emissive.lerp(syncColor, 0.1);
        mat.emissiveIntensity = (0.5 + heartPulse * 0.5) * activityFactor + (hovered ? 0.5 : 0);
        
        if (mat.distort !== undefined) {
          mat.distort = 0.2 + (biometricSync.stressLevel * 0.6 * activityFactor) + (hovered ? 0.2 : 0);
        }
      }
      
      // Handle scaling
      const baseScale = hovered ? 1.5 : 1.2;
      const pulseScale = biometricSync.active ? 1 + heartPulse * 0.1 : 1;
      meshRef.current.scale.setScalar(baseScale * pulseScale);
      
      // Rotation speed based on stress/resonance
      const rotSpeed = 0.2 + (resonance % 10) * 0.05 + (biometricSync.stressLevel * 2 * activityFactor);
      meshRef.current.rotation.x += rotSpeed * 0.01;
      meshRef.current.rotation.y += rotSpeed * 0.015;
    }
  });

  return (
    <group position={[6, 4, -4]}>
      {/* Dynamic Background Halo when active */}
      {biometricSync.active && (
        <Sparkles count={50} scale={3} size={2} color={biometricSync.stressLevel > 0.7 ? "#FF4E00" : "#00FF9F"} />
      )}
      
      <Float
        speed={biometricSync.active ? 3 : 1} 
        rotationIntensity={biometricSync.active ? 2 : 0.5} 
        floatIntensity={biometricSync.active ? 2 : 0.5}
      >
        <Sphere
          ref={meshRef}
          args={[1.2, 64, 64]}
          onPointerOver={() => { playWhoosh(); setHovered(true); }}
          onPointerOut={() => setHovered(false)}
          onClick={() => {
            playClick();
            if (meshRef.current) {
              meshRef.current.scale.setScalar(2.5);
            }
          }}
        >
          <MeshDistortMaterial
            distort={0.45}
            speed={biometricSync.active ? 5 : 2}
            roughness={0.1}
            metalness={1}
            color="#444444"
            emissive="#444444"
            emissiveIntensity={0.1}
            transparent
            opacity={0.9}
          />
          <pointLight intensity={biometricSync.active ? 10 : 2} distance={15} color={biometricSync.active ? (biometricSync.stressLevel > 0.7 ? "#FF4E00" : "#00FF9F") : "#444444"} />
        </Sphere>
      </Float>
      
      {/* HUD Data Area */}
      <group position={[0, -2.2, 0]}>
        <Text
          fontSize={0.25}
          color="white"
          font="https://fonts.gstatic.com/s/jetbrainsmono/v18/t64vAd_S_K-xx-p-T5S2L9_5.woff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {!biometricSync.active ? "BIOMETRIC OFFLINE" : (biometricSync.stressLevel > 0.7 ? "CRITICAL BIOMETRIC SYNC" : "OPTIMAL BIOMETRIC SYNC")}
        </Text>
        
        {biometricSync.active && (
          <Text
            position={[0, -0.35, 0]}
            fontSize={0.18}
            color={biometricSync.stressLevel > 0.7 ? "#FF4E00" : "#00FF9F"}
            font="https://fonts.gstatic.com/s/jetbrainsmono/v18/t64vAd_S_K-xx-p-T5S2L9_5.woff"
            anchorX="center"
            anchorY="middle"
          >
            {`HR: ${biometricSync.heartRate} BPM | STRESS: ${(biometricSync.stressLevel * 100).toFixed(0)}%`}
          </Text>
        )}
        
        <Text
          position={[0, biometricSync.active ? -0.65 : -0.35, 0]}
          fontSize={0.12}
          color="rgba(255,255,255,0.4)"
          font="https://fonts.gstatic.com/s/jetbrainsmono/v18/t64vAd_S_K-xx-p-T5S2L9_5.woff"
          anchorX="center"
          anchorY="middle"
        >
          {`NEXUS ID: ${resonance.toString(16).toUpperCase()}-SYNC`}
        </Text>
      </group>
    </group>
  );
}
