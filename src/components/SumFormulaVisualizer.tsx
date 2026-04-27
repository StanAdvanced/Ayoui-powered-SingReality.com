import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

function FormulaNode({ position, color, label, pulse }: { position: [number, number, number], color: string, label: string, pulse: number }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh position={position}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.5 + pulse} 
          transparent 
          opacity={0.8} 
        />
        <Text
          position={[0, 0.8, 0]}
          fontSize={0.2}
          color="white"
        >
          {label}
        </Text>
      </mesh>
    </Float>
  );
}

function ConnectionLine({ start, end, color, progress }: { start: [number, number, number], end: [number, number, number], color: string, progress: number }) {
  const linePoints = useMemo(() => {
    return [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  }, [start, end]);

  return (
    <line>
      <bufferGeometry attach="geometry" onUpdate={self => self.setFromPoints(linePoints)} />
      <lineBasicMaterial attach="material" color={color} transparent opacity={0.2 + progress * 0.5} />
    </line>
  );
}

function VisualizerContent() {
  const [pulse, setPulse] = useState(0);

  const nodes = useMemo(() => [
    { pos: [0, 2, 0] as [number, number, number], color: "#00f0ff", label: "Ψ Quantum Delta" },
    { pos: [-2, 0, 1] as [number, number, number], color: "#ff0055", label: "λ Reality Shift" },
    { pos: [2, 0, -1] as [number, number, number], color: "#7000ff", label: "Σ Mesh Convergence" },
    { pos: [0, -2, 0] as [number, number, number], color: "#ffcc00", label: "φ Neural Genesis" },
  ], []);

  useFrame((state) => {
    setPulse(Math.sin(state.clock.getElapsedTime() * 5) * 0.5 + 0.5);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      {nodes.map((node, i) => (
        <React.Fragment key={i}>
          <FormulaNode 
            position={node.pos} 
            color={node.color} 
            label={node.label} 
            pulse={pulse}
          />
          {nodes.map((target, j) => i !== j && (
            <ConnectionLine 
              key={`${i}-${j}`} 
              start={node.pos} 
              end={target.pos} 
              color={node.color}
              progress={pulse}
            />
          ))}
        </React.Fragment>
      ))}

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={200}
            array={new Float32Array(nodes.flatMap(() => [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]).concat([...Array(600)].map(() => (Math.random() - 0.5) * 15)))}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#00f0ff" transparent opacity={0.3} />
      </points>
    </>
  );
}

export function SumFormulaVisualizer() {
  return (
    <div className="h-full w-full bg-black/40 rounded-[3rem] border border-white/10 overflow-hidden relative group">
      <div className="absolute inset-0 pointer-events-none z-10 flex flex-col items-center justify-center">
         <div className="text-[10px] font-mono text-singularity uppercase tracking-[0.5em] mb-2 opacity-50">
           Executing SUM-F Protocol
         </div>
         <div className="text-4xl font-display font-black text-white italic opacity-20 select-none">
           S.U.M.F. v4.0
         </div>
      </div>

      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
        <VisualizerContent />
      </Canvas>
    </div>
  );
}
