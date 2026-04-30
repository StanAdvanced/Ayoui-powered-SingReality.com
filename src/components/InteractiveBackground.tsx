import React, { useRef, useMemo, useState, useEffect } from 'react';
import { SafeCanvas } from './SafeCanvas';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles, SpotLight } from '@react-three/drei';
import * as THREE from 'three';
import { BiometricSphere } from './BiometricSphere';
import { DynamicLOD } from './DynamicLOD';
import { useStore } from '../store/useStore';
import { isWebGLAvailable } from '../lib/webgl';

// Crowd
function Crowd() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 8000;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 60;
      const z = Math.random() * 40 + 2; // Keep them in front of the stage
      const y = -2;
      const speed = 4 + Math.random() * 8; // Jumping speed
      const offset = Math.random() * Math.PI * 2;
      temp.push({ x, y, z, speed, offset });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    particles.forEach((particle, i) => {
      // Jumping motion simulating a hyped crowd
      const jump = Math.max(0, Math.sin(time * particle.speed + particle.offset)) * 0.8;
      dummy.position.set(particle.x, particle.y + jump, particle.z);
      dummy.updateMatrix();
      if (meshRef.current) {
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
    });
    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <capsuleGeometry args={[0.15, 0.4, 4, 8]} />
      <meshStandardMaterial color="#111" roughness={0.9} metalness={0.1} />
    </instancedMesh>
  );
}

// Lasers
function Lasers() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.children.forEach((laser, i) => {
        laser.rotation.x = Math.sin(time * 3 + i) * 0.3 + Math.PI / 2;
        laser.rotation.z = Math.cos(time * 2 + i) * 0.5;
      });
    }
  });

  return (
    <group ref={groupRef} position={[0, 2, -8]}>
      {[...Array(16)].map((_, i) => (
        <mesh key={i} position={[(i - 8) * 1.5, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.1, 60, 8]} />
          <meshBasicMaterial 
            color={new THREE.Color().setHSL(i * 0.05 + 0.5, 1, 0.5)} 
            transparent 
            opacity={0.6} 
            blending={THREE.AdditiveBlending} 
          />
        </mesh>
      ))}
    </group>
  );
}

// Stage & Singer
function Stage() {
  const singerRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (singerRef.current) {
      singerRef.current.position.x = Math.sin(time * 2) * 2; // Singer moving across stage
      singerRef.current.rotation.y = Math.sin(time * 4) * 0.5;
    }
  });

  return (
    <group position={[0, -1, -5]}>
      {/* Stage Platform */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[30, 1, 10]} />
        <meshStandardMaterial color="#050505" roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* Singer */}
      <Float speed={4} rotationIntensity={0.5} floatIntensity={1}>
        <group ref={singerRef} position={[0, 1, 2]}>
          <DynamicLOD distances={[0, 15, 30]}>
            <group>
              {/* Head */}
              <mesh position={[0, 1.8, 0]}>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshStandardMaterial color="#ffccaa" roughness={0.4} />
              </mesh>
              {/* Body */}
              <mesh position={[0, 0.8, 0]}>
                <capsuleGeometry args={[0.4, 1, 16, 16]} />
                <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
              </mesh>
              {/* Arms */}
              <mesh position={[-0.6, 1.2, 0]} rotation={[0, 0, 0.2]}>
                <capsuleGeometry args={[0.1, 0.8, 16, 16]} />
                <meshStandardMaterial color="#222" />
              </mesh>
              <mesh position={[0.6, 1.2, 0]} rotation={[0, 0, -0.2]}>
                <capsuleGeometry args={[0.1, 0.8, 16, 16]} />
                <meshStandardMaterial color="#222" />
              </mesh>
              {/* Microphone */}
              <mesh position={[0, 1.5, 0.4]} rotation={[0.5, 0, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.4]} />
                <meshStandardMaterial color="#888" metalness={1} />
              </mesh>
            </group>
            
            <group>
              {/* Head */}
              <mesh position={[0, 1.8, 0]}>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial color="#ffccaa" roughness={0.4} />
              </mesh>
              {/* Body */}
              <mesh position={[0, 0.8, 0]}>
                <capsuleGeometry args={[0.4, 1, 8, 8]} />
                <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
              </mesh>
              {/* Arms */}
              <mesh position={[-0.6, 1.2, 0]} rotation={[0, 0, 0.2]}>
                <capsuleGeometry args={[0.1, 0.8, 8, 8]} />
                <meshStandardMaterial color="#222" />
              </mesh>
              <mesh position={[0.6, 1.2, 0]} rotation={[0, 0, -0.2]}>
                <capsuleGeometry args={[0.1, 0.8, 8, 8]} />
                <meshStandardMaterial color="#222" />
              </mesh>
              {/* Microphone */}
              <mesh position={[0, 1.5, 0.4]} rotation={[0.5, 0, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.4]} />
                <meshStandardMaterial color="#888" metalness={1} />
              </mesh>
            </group>

            <group>
              {/* Head */}
              <mesh position={[0, 1.8, 0]}>
                <sphereGeometry args={[0.3, 8, 8]} />
                <meshStandardMaterial color="#ffccaa" roughness={0.4} />
              </mesh>
              {/* Body */}
              <mesh position={[0, 0.8, 0]}>
                <capsuleGeometry args={[0.4, 1, 4, 4]} />
                <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
              </mesh>
              {/* Arms */}
              <mesh position={[-0.6, 1.2, 0]} rotation={[0, 0, 0.2]}>
                <capsuleGeometry args={[0.1, 0.8, 4, 4]} />
                <meshStandardMaterial color="#222" />
              </mesh>
              <mesh position={[0.6, 1.2, 0]} rotation={[0, 0, -0.2]}>
                <capsuleGeometry args={[0.1, 0.8, 4, 4]} />
                <meshStandardMaterial color="#222" />
              </mesh>
            </group>
          </DynamicLOD>
        </group>
      </Float>

      {/* Stage Lights */}
      <SpotLight position={[-10, 0, 2]} angle={0.3} penumbra={0.5} intensity={10} color="#ff00ff" />
      <SpotLight position={[10, 0, 2]} angle={0.3} penumbra={0.5} intensity={10} color="#00ffff" />
    </group>
  );
}

// Main Scene
function ConcertScene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const { mouse } = state;
    if (groupRef.current) {
      // Camera/Scene responds to mouse movement
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, (mouse.x * Math.PI) / 10, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, (-mouse.y * Math.PI) / 20, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.1} />
      
      {/* Main Stadium Lights */}
      <SpotLight position={[0, 20, 10]} angle={0.8} penumbra={1} intensity={2} color="#ffffff" />
      <SpotLight position={[-20, 15, -10]} angle={0.5} penumbra={1} intensity={5} color="#7000ff" />
      <SpotLight position={[20, 15, -10]} angle={0.5} penumbra={1} intensity={5} color="#00f0ff" />
      
      <Stage />
      <Crowd />
      <Lasers />
      <BiometricSphere />
      
      {/* Smoke/Particles */}
      <Sparkles count={3000} scale={50} size={15} speed={0.5} opacity={0.15} color="#ffffff" />
      <Sparkles count={1000} scale={30} size={25} speed={0.8} opacity={0.2} color="#00f0ff" />
      <Sparkles count={1000} scale={30} size={25} speed={0.8} opacity={0.2} color="#ff00ff" />
      
      <fog attach="fog" args={['#000000', 5, 50]} />
    </group>
  );
}

export function InteractiveBackground() {
  const { bgEnabled } = useStore();
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    setWebGLSupported(isWebGLAvailable());
  }, []);

  if (!webGLSupported || !bgEnabled) {
    return <div className="fixed inset-0 z-0 bg-black opacity-40" />;
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-auto opacity-60">
      <SafeCanvas camera={{ position: [0, 2, 15], fov: 60 }}>
        <ConcertScene />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          enableRotate={false}
        />
      </SafeCanvas>
    </div>
  );
}
