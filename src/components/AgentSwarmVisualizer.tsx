import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Environment, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { random } from 'maath';
import { ErrorBoundary } from './ErrorBoundary';

function SwarmParticles() {
  const ref = useRef<THREE.Points>(null);
  const sphere = random.inSphere(new Float32Array(5001), { radius: 10 });

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere as Float32Array} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#00D4FF" size={0.05} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} />
      </Points>
    </group>
  );
}

export function AgentSwarmVisualizer() {
  return (
    <div className="w-full h-full">
      <ErrorBoundary>
        <Canvas camera={{ position: [0, 0, 15] }}>
          <ambientLight intensity={0.5} />
          <SwarmParticles />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
          <Environment preset="night" />
        </Canvas>
      </ErrorBoundary>
      <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-transparent to-[#020205] pointer-events-none"></div>
    </div>
  );
}
