import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { shaderMaterial, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

const HologramMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color('#00D4FF')
  },
  // vertex shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float time;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      
      // Add some vertex displacement reading like a glitch or energy field
      vec3 pos = position;
      pos.x += sin(pos.y * 10.0 + time) * 0.02;
      pos.z += cos(pos.y * 10.0 + time) * 0.02;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // fragment shader
  `
    uniform float time;
    uniform vec3 color;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      // Fresnel effect for glowing edges
      float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
      
      // Energy lines wrapping around the body
      float lines = sin(vPosition.y * 50.0 - time * 5.0) * 0.5 + 0.5;
      lines = smoothstep(0.9, 1.0, lines);
      
      vec3 finalColor = color + vec3(fresnel) * 0.5;
      finalColor += vec3(lines) * 0.5;
      
      gl_FragColor = vec4(finalColor, fresnel * 0.8 + 0.2 + lines * 0.5);
    }
  `
);

extend({ HologramMaterial });

export function Avatar(props: any) {
  const group = useRef<THREE.Group>(null);
  const materialRef = useRef<any>(null);
  
  useFrame((state, delta) => {
    if (group.current) {
      group.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
      group.current.rotation.y += delta * 0.2;
    }
    if (materialRef.current) {
      materialRef.current.time = state.clock.elapsedTime;
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      {/* Head */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.5, 64, 64]} />
        {/* @ts-ignore */}
        <hologramMaterial ref={materialRef} transparent side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      
      {/* Body Core */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.4, 2, 64]} />
        <MeshTransmissionMaterial 
          transmission={1}
          thickness={1.5}
          roughness={0.1}
          ior={1.2}
          chromaticAberration={0.05}
          color="#6C3CE1"
        />
      </mesh>

      {/* Outer Body Shell */}
      <mesh position={[0, 0, 0]} scale={1.05}>
        <cylinderGeometry args={[0.6, 0.4, 2, 64]} />
        {/* @ts-ignore */}
        <hologramMaterial time={0} transparent side={THREE.FrontSide} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      
      {/* Particle orbit rings (Instrument abstraction) */}
      <group rotation={[Math.PI / 4, 0, 0]}>
        <mesh position={[0, 0, 0]}>
           <torusGeometry args={[1.5, 0.01, 16, 200]} />
           <meshBasicMaterial color="#00D4FF" transparent opacity={0.3} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} scale={1.1}>
           <torusGeometry args={[1.5, 0.01, 16, 200]} />
           <meshBasicMaterial color="#6C3CE1" transparent opacity={0.3} />
        </mesh>
      </group>
    </group>
  );
}
