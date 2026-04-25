import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { PositionalAudio, MeshDistortMaterial, Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';

export function SuperBrain({ biometricData, onClick }: { biometricData: any, onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const audioRef = useRef<THREE.PositionalAudio>(null);

  // Simulate spatial audio source
  useFrame((state) => {
    if (meshRef.current && biometricData) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.scale.setScalar(1 + (biometricData.alphaWave || 0) * 0.5);
    }
  });

  if (!biometricData) return null;

  return (
    <group onClick={onClick}>
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <MeshDistortMaterial
          color={biometricData.thetaWave > 0.5 ? '#A855F7' : '#3B82F6'}
          speed={(biometricData.alphaWave || 0) * 5}
          distort={(biometricData.thetaWave || 0) * 0.5}
        />
      </Sphere>
      <Text position={[0, 1.5, 0]} fontSize={0.3} color="white">
        Super Brain: {biometricData.heartRate?.toFixed(0) || '0'} BPM
      </Text>
      {/* Positional Audio Source */}
      <positionalAudio ref={audioRef} args={[new THREE.AudioListener()]} />
    </group>
  );
}
