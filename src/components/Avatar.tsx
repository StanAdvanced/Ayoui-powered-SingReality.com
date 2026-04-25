import React, { useRef, useState, useEffect } from 'react';
import { SafeCanvas } from './SafeCanvas';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { useSound } from '../hooks/useSound';
import { narrationEngine } from '../services/narrationEngine';

function Humanoid({ isTalking, onInteract }: { isTalking: boolean, onInteract: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const { mouse, viewport } = useThree();
  
  const [hovered, setHovered] = useState(false);
  const [spinPhase, setSpinPhase] = useState(0);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered]);

  const handleClick = (e: any) => {
    e.stopPropagation();
    onInteract();
    // Trigger spin animation
    setSpinPhase(Math.PI * 2);
  };

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    
    // Smoothly decay spin phase
    if (spinPhase > 0) {
      setSpinPhase(Math.max(0, spinPhase - delta * 5));
    }
    
    // Simulated audio pulse/rhythm
    const pulse = isTalking ? Math.abs(Math.sin(time * 12)) * 0.15 : 0;
    const rhythm = Math.sin(time * 8) * 0.05;

    if (groupRef.current) {
      // Base hover motion + interaction spin
      groupRef.current.position.y = Math.sin(time) * 0.1;
      groupRef.current.rotation.y = spinPhase + (hovered ? Math.sin(time * 2) * 0.1 : 0);
      
      // Scaling on hover
      const targetScale = hovered ? 1.1 : 1;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }

    if (headRef.current) {
      // Follow mouse cursor
      const targetX = (mouse.x * viewport.width) / 4;
      const targetY = (mouse.y * viewport.height) / 4;
      
      // If hovered, look strictly at cursor, else slight sway
      if (hovered) {
        headRef.current.lookAt(targetX, targetY, 5);
      } else {
        headRef.current.rotation.y = Math.sin(time * 0.5) * 0.2;
      }

      // Nodding when talking - intensified by pulse
      if (isTalking) {
        headRef.current.rotation.x = - (Math.abs(Math.sin(time * 10)) * 0.1) - pulse * 0.5;
      } else if (!hovered) {
        headRef.current.rotation.x = 0;
      }
    }

    if (bodyRef.current) {
      // Body scaling with rhythm
      const baseScale = 1;
      const scaleMultiplier = baseScale + (isTalking ? pulse : rhythm);
      bodyRef.current.scale.set(scaleMultiplier, scaleMultiplier, scaleMultiplier);
    }

    if (leftArmRef.current && rightArmRef.current) {
      // Playing instrument motion or greeting
      if (hovered && !isTalking) {
        // Waving motion context
        leftArmRef.current.rotation.z = Math.sin(time * 6) * 0.3 + 0.5;
        rightArmRef.current.rotation.x = Math.sin(time * 2) * 0.1;
      } else {
        const armFreq = isTalking ? 10 : 2;
        const armAmp = isTalking ? 0.3 : 0.05;
        leftArmRef.current.rotation.x = Math.sin(time * armFreq) * armAmp;
        rightArmRef.current.rotation.x = Math.cos(time * armFreq) * armAmp;
        leftArmRef.current.rotation.z = 0;
      }
    }
  });

  return (
    <group 
      ref={groupRef} 
      position={[0, -1, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Head */}
      <mesh ref={headRef} position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial 
          color={(isTalking || hovered) ? "#00f0ff" : "#ffffff"} 
          metalness={0.8} 
          roughness={0.2} 
          emissive={(isTalking || hovered) ? "#00f0ff" : "#000000"} 
          emissiveIntensity={isTalking ? 1.5 : (hovered ? 0.8 : 0.5)} 
        />
      </mesh>

      {/* Body */}
      <mesh ref={bodyRef} position={[0, 0.8, 0]}>
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
        <meshStandardMaterial 
          color="#7000ff" 
          metalness={0.5} 
          roughness={0.2} 
          emissive="#7000ff" 
          emissiveIntensity={isTalking ? 1.8 : (hovered ? 1.0 : 0.4)} 
        />
      </mesh>
    </group>
  );
}

export function Avatar({ isTalking }: { isTalking: boolean }) {
  const { playWhoosh, playChime, playSuccess } = useSound();
  const [internalTalking, setInternalTalking] = useState(isTalking);

  useEffect(() => {
    setInternalTalking(isTalking);
    if (isTalking) {
      playChime();
    } else {
      playWhoosh();
    }
  }, [isTalking, playWhoosh, playChime]);

  const handleInteraction = () => {
    playSuccess();
    setInternalTalking(true);
    const feedbackMessages = [
      "Neural pathways synchronized.",
      "Awaiting your melodic sequence.",
      "Ready to generate the next dimensional beat.",
      "Systems optimized for peak resonance."
    ];
    const speechText = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
    narrationEngine.narrate(speechText, true).finally(() => {
      setInternalTalking(isTalking); // Revert to prop state once done
    });
  };

  return (
    <div className="w-full h-full absolute inset-0">
      <SafeCanvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={3} color="#00f0ff" />
        <spotLight position={[-10, 10, -10]} angle={0.15} penumbra={1} intensity={3} color="#ff00ff" />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <Humanoid isTalking={internalTalking} onInteract={handleInteraction} />
        </Float>
        
        <Sparkles 
          count={150} 
          scale={6} 
          size={2} 
          speed={0.5} 
          opacity={0.6} 
          color={internalTalking ? "#ff00ff" : "#00f0ff"} 
        />

        <EffectComposer>
          <Bloom 
            luminanceThreshold={0.2} 
            luminanceSmoothing={0.9} 
            intensity={internalTalking ? 2.5 : 1.0} 
            mipmapBlur 
          />
          <ChromaticAberration 
            blendFunction={BlendFunction.NORMAL} 
            offset={new THREE.Vector2(internalTalking ? 0.005 : 0.001, internalTalking ? 0.005 : 0.001)} 
            radialModulation={false}
            modulationOffset={0}
          />
          <Vignette eskil={false} offset={0.1} darkness={0.8} />
        </EffectComposer>
      </SafeCanvas>
    </div>
  );
}
