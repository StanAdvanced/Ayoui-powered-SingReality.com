import React, { useRef, useState, useEffect } from 'react';
import { SafeCanvas } from './SafeCanvas';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { useSound } from '../hooks/useSound';

function Humanoid({ isTalking }: { isTalking: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const { mouse, viewport } = useThree();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time) * 0.1;
    }

    if (headRef.current) {
      // Follow mouse cursor
      const targetX = (mouse.x * viewport.width) / 4;
      const targetY = (mouse.y * viewport.height) / 4;
      
      headRef.current.lookAt(targetX, targetY, 5);

      // Nodding when talking
      if (isTalking) {
        headRef.current.rotation.x += Math.sin(time * 10) * 0.1;
      }
    }

    if (leftArmRef.current && rightArmRef.current) {
      // Playing instrument motion
      leftArmRef.current.rotation.x = isTalking ? Math.sin(time * 8) * 0.5 : Math.sin(time) * 0.1;
      rightArmRef.current.rotation.x = isTalking ? Math.cos(time * 8) * 0.5 : Math.cos(time) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Head */}
      <mesh ref={headRef} position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color={isTalking ? "#00f0ff" : "#ffffff"} metalness={0.8} roughness={0.2} emissive={isTalking ? "#00f0ff" : "#000000"} emissiveIntensity={isTalking ? 1.5 : 0.5} />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0.8, 0]}>
        <capsuleGeometry args={[0.4, 1, 16, 16]} />
        <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Left Arm */}
      <mesh ref={leftArmRef} position={[-0.6, 1.2, 0]} rotation={[0, 0, 0.2]}>
        <capsuleGeometry args={[0.1, 0.8, 16, 16]} />
        <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.2} emissive="#000" emissiveIntensity={0} />
      </mesh>

      {/* Right Arm */}
      <mesh ref={rightArmRef} position={[0.6, 1.2, 0]} rotation={[0, 0, -0.2]}>
        <capsuleGeometry args={[0.1, 0.8, 16, 16]} />
        <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Instrument (Synthesizer/Guitar abstract) */}
      <mesh position={[0, 0.8, 0.4]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[1.2, 0.2, 0.4]} />
        <meshStandardMaterial color="#7000ff" metalness={0.5} roughness={0.2} emissive="#7000ff" emissiveIntensity={isTalking ? 1.8 : 0.4} />
      </mesh>
    </group>
  );
}

export function Avatar({ isTalking }: { isTalking: boolean }) {
  const { playWhoosh, playChime } = useSound();

  useEffect(() => {
    if (isTalking) {
      playChime();
    } else {
      playWhoosh();
    }
  }, [isTalking, playWhoosh, playChime]);

  return (
    <div className="w-full h-full absolute inset-0 pointer-events-none">
      <SafeCanvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={3} color="#00f0ff" />
        <spotLight position={[-10, 10, -10]} angle={0.15} penumbra={1} intensity={3} color="#ff00ff" />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <Humanoid isTalking={isTalking} />
        </Float>
        
        <Sparkles count={150} scale={6} size={2} speed={0.5} opacity={0.6} color={isTalking ? "#ff00ff" : "#00f0ff"} />

        <EffectComposer>
          <Bloom 
            luminanceThreshold={0.2} 
            luminanceSmoothing={0.9} 
            intensity={isTalking ? 2.5 : 1.0} 
            mipmapBlur 
          />
          <ChromaticAberration 
            blendFunction={BlendFunction.NORMAL} 
            offset={new THREE.Vector2(isTalking ? 0.005 : 0.001, isTalking ? 0.005 : 0.001)} 
            radialModulation={false}
            modulationOffset={0}
          />
          <Vignette eskil={false} offset={0.1} darkness={0.8} />
        </EffectComposer>
      </SafeCanvas>
    </div>
  );
}
