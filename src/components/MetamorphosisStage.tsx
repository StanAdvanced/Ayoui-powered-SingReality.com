import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Camera, Sliders, Video, ScanFace } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, OrbitControls, useGLTF } from '@react-three/drei';

function MorphAvatar({ target }: { target: string }) {
    // Ideally this loads a MetaHuman via WebXR/CloudXR or a local generic model that we morph.
    // For this demo, we'll represent it using primitive compositions to simulate a morphing character.
    let color = '#ffffff';
    let scale = 1;
    let shape = 'default';

    switch(target) {
        case 'elvis': 
            color = '#FFD700'; // Gold lamé suit vibe
            scale = 1.1;
            shape = 'tall';
            break;
        case 'billie':
            color = '#10B981'; // Green highlights
            scale = 0.9;
            shape = 'slouch';
            break;
        case 'weeknd':
            color = '#F43F5E'; // Red jacket
            scale = 1;
            shape = 'default';
            break;
    }

    return (
        <group scale={scale} position={[0, -2, 0]}>
            {/* Body */}
            <mesh position={[0, 1.5, 0]} castShadow>
                <cylinderGeometry args={[0.5, 0.4, 1.5, 32]} />
                <meshStandardMaterial color={color} roughness={0.2} metalness={0.6} />
            </mesh>
            {/* Head */}
            <mesh position={[0, 2.7, 0]} castShadow>
                {shape === 'tall' ? <boxGeometry args={[0.7, 1, 0.7]} /> : <sphereGeometry args={[0.5, 32, 32]} />}
                <meshStandardMaterial color={color} roughness={0.4} />
            </mesh>
            {/* Morphing aura */}
            <mesh position={[0, 1.5, 0]}>
                <cylinderGeometry args={[0.8, 0.8, 3, 32]} />
                <meshBasicMaterial color={color} wireframe transparent opacity={0.1} />
            </mesh>
        </group>
    );
}

export function MetamorphosisStage() {
    const [targetMorph, setTargetMorph] = useState('default');
    const [isMorphing, setIsMorphing] = useState(false);
    
    const triggerMorph = (target: string) => {
        setIsMorphing(true);
        setTargetMorph(target);
        setTimeout(() => setIsMorphing(false), 2000); // Decart Lucy 2.0 integration delay
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24 px-6 relative overflow-hidden font-inter">
            {/* UI overlay */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 relative z-10 h-[calc(100vh-120px)]">
                
                {/* Control Panel */}
                <div className="w-80 glass p-6 rounded-3xl border border-white/10 flex flex-col gap-6">
                    <h2 className="text-2xl font-heading font-black flex items-center gap-2">
                        <ScanFace className="text-singularity" />
                        MetaMorphosis
                    </h2>
                    <p className="text-sm text-gray-400">
                        Select a target identity. Decart AI Lucy 2.1 will restyle the MetaHuman base mesh in real-time.
                    </p>

                    <div className="space-y-4">
                        <button 
                            onClick={() => triggerMorph('elvis')}
                            className={`w-full py-4 px-6 rounded-xl font-bold uppercase tracking-widest text-sm transition-all border ${targetMorph === 'elvis' ? 'bg-[#FFD700]/20 border-[#FFD700] text-[#FFD700]' : 'glass border-white/10 text-gray-400 hover:bg-white/5'}`}
                        >
                            The King
                        </button>
                        <button 
                            onClick={() => triggerMorph('billie')}
                            className={`w-full py-4 px-6 rounded-xl font-bold uppercase tracking-widest text-sm transition-all border ${targetMorph === 'billie' ? 'bg-[#10B981]/20 border-[#10B981] text-[#10B981]' : 'glass border-white/10 text-gray-400 hover:bg-white/5'}`}
                        >
                            B. Eilish
                        </button>
                        <button 
                            onClick={() => triggerMorph('weeknd')}
                            className={`w-full py-4 px-6 rounded-xl font-bold uppercase tracking-widest text-sm transition-all border ${targetMorph === 'weeknd' ? 'bg-[#F43F5E]/20 border-[#F43F5E] text-[#F43F5E]' : 'glass border-white/10 text-gray-400 hover:bg-white/5'}`}
                        >
                            Starboy
                        </button>
                        <button 
                            onClick={() => triggerMorph('default')}
                            className={`w-full py-4 px-6 rounded-xl font-bold uppercase tracking-widest text-sm transition-all border ${targetMorph === 'default' ? 'bg-white/20 border-white text-white' : 'glass border-white/10 text-gray-400 hover:bg-white/5'}`}
                        >
                            Base Ras Leon
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
                        <div className="flex items-center justify-between text-xs font-mono text-gray-500">
                            <span>Decart Status:</span>
                            <span className={isMorphing ? 'text-yellow-400 animate-pulse' : 'text-green-400'}>
                                {isMorphing ? 'Restyling...' : 'Connected'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-mono text-gray-500">
                            <span>Maxine AR Mesh:</span>
                            <span className="text-green-400">Tracking (14ms)</span>
                        </div>
                    </div>
                </div>

                {/* 3D Stage */}
                <div className="flex-1 rounded-3xl overflow-hidden relative border border-white/10 bg-gradient-to-t from-gray-900 to-black">
                    {/* Camera indicator */}
                    <div className="absolute top-4 left-4 z-10 flex items-center justify-center p-3 rounded-full bg-black/50 border border-white/10 backdrop-blur-md">
                        <Video className="w-5 h-5 text-red-500 animate-pulse" />
                    </div>
                    
                    <Canvas shadows camera={{ position: [0, 1, 8], fov: 45 }}>
                        <ambientLight intensity={0.5} />
                        <spotLight position={[5, 10, 5]} angle={0.2} penumbra={1} intensity={2} castShadow />
                        
                        {isMorphing && (
                            <group position={[0, 0, 0]}>
                                {/* Visualizer burst on morph */}
                                <mesh>
                                    <sphereGeometry args={[3, 32, 32]} />
                                    <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.2} />
                                </mesh>
                            </group>
                        )}
                        
                        <MorphAvatar target={targetMorph} />

                        <ContactShadows position={[0, -2, 0]} opacity={0.7} scale={15} blur={2} far={4} />
                        <Environment preset="studio" />
                        <OrbitControls autoRotate={!isMorphing} autoRotateSpeed={0.5} />
                    </Canvas>
                </div>
            </div>
        </div>
    );
}
