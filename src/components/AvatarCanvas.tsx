import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Sparkles } from '@react-three/drei';
import { Avatar } from './Avatar';

export function AvatarCanvas() {
  return (
    <div className="w-full h-[500px] md:h-[600px] relative pointer-events-auto">
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <color attach="background" args={['transparent']} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        <Suspense fallback={null}>
          <Avatar position={[0, -1, 0]} />
          <Environment preset="city" />
          <ContactShadows position={[0, -1, 0]} opacity={0.5} scale={10} blur={2} far={4} />
          <Sparkles count={200} scale={5} size={2} speed={0.4} color="#00D4FF" />
        </Suspense>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          minPolarAngle={Math.PI / 2.5} 
          maxPolarAngle={Math.PI / 2.5} 
        />
      </Canvas>
    </div>
  );
}
