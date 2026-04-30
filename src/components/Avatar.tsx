import React, { useRef, useState, useEffect, useMemo } from 'react';
import { SafeCanvas } from './SafeCanvas';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles, MeshDistortMaterial, MeshWobbleMaterial, PresentationControls } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { useSound } from '../hooks/useSound';
import { narrationEngine } from '../services/narrationEngine';

function Instrument({ type, isTalking }: { type: 'guitar' | 'synth', isTalking: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const bodyMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: type === 'guitar' ? "#4a2c14" : "#111111",
    metalness: type === 'guitar' ? 0.3 : 0.9,
    roughness: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  }), [type]);

  const detailMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#00f0ff",
    emissive: "#00f0ff",
    emissiveIntensity: isTalking ? 5 : 0.5,
  }), [isTalking]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 2) * 0.05;
      groupRef.current.rotation.z = Math.sin(time * 1.5) * 0.02;
    }
  });

  if (type === 'guitar') {
    return (
      <group ref={groupRef} position={[0.4, 0.4, 0.5]} rotation={[0.2, -0.4, 1.1]}>
        {/* Photorealistic Guitar Body */}
        <mesh>
          <boxGeometry args={[0.9, 1.3, 0.18]} />
          <primitive object={bodyMaterial} />
        </mesh>
        {/* Polished Neck */}
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[0.12, 1.8, 0.08]} />
          <meshStandardMaterial color="#050505" />
        </mesh>
        {/* Laser Strings */}
        {[-0.03, -0.01, 0.01, 0.03].map((y, i) => (
          <mesh key={i} position={[0, y + 0.5, 0.1]}>
            <boxGeometry args={[0.005, 2, 0.005]} />
            <primitive object={detailMaterial} />
          </mesh>
        ))}
      </group>
    );
  }

  return (
    <group ref={groupRef} position={[0, 0.7, 0.7]} rotation={[0.4, 0, 0]}>
      {/* High-End Synth Body */}
      <mesh>
        <boxGeometry args={[1.5, 0.35, 0.8]} />
        <primitive object={bodyMaterial} />
      </mesh>
      {/* Glowing Keys */}
      <mesh position={[0, 0.18, 0.1]}>
        <boxGeometry args={[1.4, 0.02, 0.4]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={isTalking ? 2 : 0.2} />
      </mesh>
      {/* HUD display */}
      <mesh position={[0, 0.2, -0.25]}>
        <boxGeometry args={[0.5, 0.08, 0.2]} />
        <primitive object={detailMaterial} />
      </mesh>
    </group>
  );
}

export function Humanoid({ isTalking, onInteract, instrumentType, scale = 1, position = [0, -0.5, 0], wireframe = false }: { isTalking: boolean, onInteract?: () => void, instrumentType: 'guitar' | 'synth', scale?: number, position?: [number, number, number], wireframe?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const hairRef = useRef<THREE.Group>(null);
  const { mouse, viewport } = useThree();
  
  const [hovered, setHovered] = useState(false);
  const [spinPhase, setSpinPhase] = useState(0);

  // Elite Skin Material
  const skinMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#f5d0b9",
    metalness: 0.05,
    roughness: 0.35,
    clearcoat: 0.2,
    clearcoatRoughness: 0.2,
    transmission: 0.05,
    thickness: 0.5,
    wireframe
  }), [wireframe]);

  const clothMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#050505",
    metalness: 0.9,
    roughness: 0.1,
    wireframe
  }), [wireframe]);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered]);

  const handleClick = (e: any) => {
    e.stopPropagation();
    onInteract();
    setSpinPhase(Math.PI * 2);
  };

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    if (spinPhase > 0) setSpinPhase(Math.max(0, spinPhase - delta * 5));
    
    const pulse = isTalking ? Math.abs(Math.sin(time * 15)) * 0.2 : 0;
    const idleSway = Math.sin(time * 2) * 0.05;

    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.1 + (isTalking ? pulse * 0.2 : 0);
      groupRef.current.rotation.y = spinPhase + (hovered ? Math.sin(time * 2) * 0.1 : 0);
    }

    if (headRef.current) {
      const targetRotationX = (mouse.y * viewport.height) / 10;
      const targetRotationY = (mouse.x * viewport.width) / 10;
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotationX, 0.1);
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotationY, 0.1);

      if (isTalking) {
        headRef.current.rotation.x += Math.sin(time * 20) * 0.05;
      }
    }

    if (mouthRef.current && isTalking) {
      const mouthScale = 1 + pulse * 3;
      mouthRef.current.scale.set(1.5, mouthScale, 1);
    } else if (mouthRef.current) {
      mouthRef.current.scale.lerp(new THREE.Vector3(1, 0.1, 1), 0.2);
    }

    if (leftEyeRef.current && rightEyeRef.current) {
      const eyeBlink = Math.sin(time * 0.5) > 0.98 ? 0.1 : 1;
      leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, eyeBlink, 0.4);
      rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, eyeBlink, 0.4);
    }

    if (hairRef.current) {
      hairRef.current.children.forEach((strand, i) => {
        strand.rotation.z = Math.sin(time * 2 + i) * 0.05;
      });
    }
  });

  return (
    <group 
      ref={groupRef} 
      position={position}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
      <group ref={headRef} position={[0, 1.8, 0]}>
        <mesh>
          <sphereGeometry args={[0.26, 64, 64]} />
          <primitive object={skinMaterial} />
        </mesh>
        
        {/* Advanced Hair Strands */}
        <group ref={hairRef} position={[0, 0.1, 0]}>
          {Array.from({ length: 24 }).map((_, i) => (
            <mesh key={i} position={[Math.sin(i) * 0.2, 0.15, Math.cos(i) * 0.2]} rotation={[0.2, 0, 0.5]}>
              <capsuleGeometry args={[0.015, 0.4, 4, 16]} />
              <meshStandardMaterial color="#1a0f00" roughness={0.1} />
            </mesh>
          ))}
        </group>

        {/* Eyes */}
        <mesh ref={leftEyeRef} position={[-0.09, 0.05, 0.24]}>
          <sphereGeometry args={[0.035, 32, 16]} />
          <meshStandardMaterial color="#fff" emissive="#00f0ff" emissiveIntensity={isTalking ? 10 : 2} />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.09, 0.05, 0.24]}>
          <sphereGeometry args={[0.035, 32, 16]} />
          <meshStandardMaterial color="#fff" emissive="#00f0ff" emissiveIntensity={isTalking ? 10 : 2} />
        </mesh>

        {/* Mouth */}
        <mesh ref={mouthRef} position={[0, -0.15, 0.25]}>
          <boxGeometry args={[0.1, 0.05, 0.02]} />
          <meshStandardMaterial color="#1a0000" emissive="#ff00ff" emissiveIntensity={isTalking ? 5 : 0} />
        </mesh>
      </group>

      {/* Structured Torso */}
      <mesh position={[0, 1, 0]}>
        <capsuleGeometry args={[0.3, 1, 32, 64]} />
        <primitive object={clothMaterial} />
      </mesh>

      {/* Detailed Arms */}
      <mesh position={[-0.5, 1.4, 0]} rotation={[0, 0, 0.4]}>
        <capsuleGeometry args={[0.09, 0.7, 16, 32]} />
        <primitive object={skinMaterial} />
      </mesh>
      <mesh position={[0.5, 1.4, 0]} rotation={[0, 0, -0.4]}>
        <capsuleGeometry args={[0.09, 0.7, 16, 32]} />
        <primitive object={skinMaterial} />
      </mesh>

      <Instrument type={instrumentType} isTalking={isTalking} />
    </group>
  );
}

export function Avatar({ isTalking }: { isTalking: boolean }) {
  const { playWhoosh, playChime, playSuccess } = useSound();
  const [internalTalking, setInternalTalking] = useState(isTalking);
  const [instrument, setInstrument] = useState<'guitar' | 'synth'>('guitar');

  useEffect(() => {
    setInternalTalking(isTalking);
    if (isTalking) {
      playChime();
      // Randomly switch instrument when starting to talk
      setInstrument(Math.random() > 0.5 ? 'guitar' : 'synth');
    }
  }, [isTalking, playChime]);

  const handleInteraction = () => {
    playSuccess();
    setInternalTalking(true);
    const feedbackMessages = [
      "Neural pathways synchronized. I'm feeling the rhythm of your creative flow.",
      "Awaiting your next melodic sequence. Let's make some quantum noise.",
      "Systems optimized for peak resonance. My licks are literally out of this dimension.",
      "Global value detected. Your ideology is music to my neural nets."
    ];
    const speechText = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
    narrationEngine.narrate(speechText, true).finally(() => {
      setInternalTalking(isTalking);
    });
  };

  return (
    <div id="nexus-avatar-root" className="w-full h-full absolute inset-0 pointer-events-none">
      <div id="avatar-canvas-container" className="w-full h-full pointer-events-auto">
        <SafeCanvas camera={{ position: [0, 0.5, 4], fov: 45 }}>
          <color attach="background" args={["#000"]} />
          <fog attach="fog" args={["#000", 2, 8]} />
          
          <ambientLight intensity={0.2} />
          <pointLight position={[5, 5, 5]} intensity={2} color="#00f0ff" />
          <pointLight position={[-5, 5, 5]} intensity={2} color="#ff00ff" />
          
          <PresentationControls
            global
            snap
            rotation={[0, 0.3, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
          >
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
              <Humanoid isTalking={internalTalking} onInteract={handleInteraction} instrumentType={instrument} />
            </Float>
          </PresentationControls>
          
          <Sparkles 
            count={200} 
            scale={10} 
            size={1.5} 
            speed={0.3} 
            opacity={0.4} 
            color={internalTalking ? "#singularity" : "#00f0ff"} 
          />

          <EffectComposer>
            <Bloom 
              luminanceThreshold={0.4} 
              intensity={internalTalking ? 1.5 : 0.8} 
              radius={0.4}
              mipmapBlur 
            />
            <ChromaticAberration 
              blendFunction={BlendFunction.SCREEN} 
              offset={new THREE.Vector2(internalTalking ? 0.002 : 0.0005, 0.001)} 
            />
            <Noise opacity={0.05} />
            <Vignette eskil={false} offset={0.1} darkness={0.9} />
          </EffectComposer>
        </SafeCanvas>
      </div>
    </div>
  );
}
