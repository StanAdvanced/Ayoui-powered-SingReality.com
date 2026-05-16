import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { 
  Float, 
  MeshDistortMaterial, 
  MeshWobbleMaterial, 
  Points, 
  PointMaterial, 
  Instance, 
  Instances,
  Environment,
  Sparkles,
  MeshTransmissionMaterial
} from '@react-three/drei';
import * as THREE from 'three';
import { useLocation } from 'react-router-dom';

// Quantum Noise Displacement Shader
const QuantumNoiseMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#00f0ff') },
    uResonance: { value: 1.0 }
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float uTime;
    uniform float uResonance;

    void main() {
      vUv = uv;
      vec3 pos = position;
      float noise = sin(pos.x * 10. + uTime) * sin(pos.y * 10. + uTime) * 0.1 * uResonance;
      pos += normal * noise;
      vPosition = pos;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform vec3 uColor;
    
    void main() {
      float edge = 1.0 - abs(dot(normalize(vPosition), vec3(0,0,1)));
      gl_FragColor = vec4(uColor * pow(edge, 3.0), 0.5);
    }
  `
};

function VolumetricLasers() {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={group}>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} rotation={[0, 0, (i / 12) * Math.PI * 2]}>
          <boxGeometry args={[0.02, 20, 0.02]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
}

function DroneSwarm() {
  const points = useRef<THREE.Points>(null);
  const count = 50;
  
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10 + 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    return [pos, vel];
  }, []);

  useFrame(() => {
    if (!points.current) return;
    const attr = points.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      attr.setX(i, attr.getX(i) + velocities[i * 3]);
      attr.setY(i, attr.getY(i) + velocities[i * 3 + 1]);
      attr.setZ(i, attr.getZ(i) + velocities[i * 3 + 2]);
      
      // Boundary check
      if (Math.abs(attr.getX(i)) > 10) velocities[i * 3] *= -1;
      if (Math.abs(attr.getY(i)) > 10) velocities[i * 3 + 1] *= -1;
      if (Math.abs(attr.getZ(i)) > 10) velocities[i * 3 + 2] *= -1;
    }
    attr.needsUpdate = true;
  });

  return (
    <Points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <PointMaterial size={0.1} color="#00f0ff" transparent opacity={0.8} />
    </Points>
  );
}

function LiquidGeometry() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={2}>
      <mesh ref={mesh}>
        <torusKnotGeometry args={[1, 0.4, 128, 32]} />
        <MeshDistortMaterial
          color="#ff007a"
          speed={5}
          distort={0.4}
          radius={1}
        />
      </mesh>
    </Float>
  );
}

function DiamondRefractions() {
  return (
    <Float speed={1} rotationIntensity={1} floatIntensity={1}>
      <mesh>
        <octahedronGeometry args={[1.5, 0]} />
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={1}
          roughness={0}
          transmission={1}
          thickness={2}
          envMapIntensity={2}
        />
      </mesh>
    </Float>
  );
}

function GaussianSplatFX() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const count = 300;
  
  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.elapsedTime;
    const matrix = new THREE.Matrix4();
    for (let i = 0; i < count; i++) {
       const x = Math.sin(time * 0.5 + i) * 5;
       const y = Math.cos(time * 0.3 + i * 0.5) * 5;
       const z = Math.sin(time * 0.2 + i * 2) * 5;
       matrix.setPosition(x, y, z);
       mesh.current.setMatrixAt(i, matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.2, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
    </instancedMesh>
  );
}

function BioLuminescentCrowd() {
  return (
    <group position={[0, -4, 0]}>
       {Array.from({ length: 50 }).map((_, i) => (
         <Float key={i} speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
           <mesh position={[(Math.random() - 0.5) * 15, 0, (Math.random() - 0.5) * 15]}>
             <sphereGeometry args={[0.1, 16, 16]} />
             <meshBasicMaterial color={i % 2 === 0 ? "#00f0ff" : "#ff007a"} transparent opacity={0.6} />
           </mesh>
         </Float>
       ))}
    </group>
  );
}

function GaussianSplatLiquid() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.1;
      mesh.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5;
    }
  });

  return (
    <group>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={mesh}>
          <torusKnotGeometry args={[2, 0.6, 256, 64]} />
          <MeshTransmissionMaterial
            backside
            samples={16}
            resolution={256}
            transmission={1}
            roughness={0}
            thickness={2}
            ior={1.5}
            chromaticAberration={0.1}
            anisotropy={0.1}
            distortion={0.5}
            distortionScale={0.5}
            temporalDistortion={0.5}
            color="#ffffff"
          />
        </mesh>
      </Float>
      {/* 8K Liquid display Particles */}
      {Array.from({ length: 40 }).map((_, i) => (
        <Float key={i} speed={2} rotationIntensity={1} floatIntensity={1}>
          <mesh position={[(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color="#00f0ff" transparent opacity={0.4} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export function EnvironmentalOrchestrator() {
  const location = useLocation();
  const path = location.pathname;

  // Map path to visual capability
  const getStage = () => {
    if (path.includes('studio')) return 'Creation';
    if (path.includes('marketplace')) return 'Value';
    if (path.includes('metaverse')) return 'Crowd';
    if (path.includes('arenas') || path.includes('karaoke')) return 'Projection';
    if (path.includes('quantum-lab')) return 'Noise';
    return 'Nexus';
  };

  const stage = getStage();

  return (
    <group>
      {/* Universal Sparkles - Biometric Crowd Response simulation */}
      <Sparkles count={50} scale={20} size={2} speed={0.4} color="#00f0ff" opacity={0.2} />

      {stage === 'Creation' && (
        <group>
          <LiquidGeometry />
          {/* Neural Texture Synthesis simulation via light shadows */}
          <pointLight position={[5, 5, 5]} intensity={10} color="#ff007a" castShadow />
        </group>
      )}

      {stage === 'Value' && (
        <group>
          <DiamondRefractions />
          <Environment preset="city" />
        </group>
      )}

      {stage === 'Projection' && (
        <group>
          <VolumetricLasers />
          {/* Real-time Volumetric Projection feel */}
          <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[20, 20]} />
            <meshBasicMaterial color="#00f0ff" transparent opacity={0.05} />
          </mesh>
        </group>
      )}

      {stage === 'Crowd' && (
        <group>
          <GaussianSplatFX />
          <BioLuminescentCrowd />
        </group>
      )}

      {stage === 'Noise' && (
        <mesh>
          <sphereGeometry args={[2, 64, 64]} />
          <shaderMaterial
            {...QuantumNoiseMaterial}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {stage === 'Nexus' && (
        <group>
          <GaussianSplatLiquid />
          <DroneSwarm />
          {/* Atmospheric Particle Refraction feel */}
          <Sparkles count={100} scale={15} size={1} speed={0.2} color="#ffffff" />
        </group>
      )}
      <mesh scale={20}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#000000" side={THREE.BackSide} />
      </mesh>
    </group>
  );
}
