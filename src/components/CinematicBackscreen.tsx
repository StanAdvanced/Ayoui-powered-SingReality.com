import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise, DepthOfField } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { useMusicEngine } from '../services/musicEngine';
import { Environment, MeshDistortMaterial, Sphere, Plane, Float, Html } from '@react-three/drei';

/**
 * GROK API MOOD ANALYSIS STUB
 * Implements real-time extraction of track mood (BPM, Energy, Emotion).
 * In a production setting, this sends the spectral arrays to Grok for continuous streaming analysis.
 */
async function fetchGrokMoodAnalysis(audioData: Uint8Array): Promise<{ energy: number, mood: string }> {
  // Mock Grok API response
  // e.g. await fetch('https://api.grok.ai/v1/analyze_audio', { ... })
  return { energy: Math.random(), mood: 'euphoric' };
}

/**
 * YOUTUBE API TEXTURE INTEGRATION STUB
 * Pulls holographic assets/videos from YouTube mapping them onto Three.js textures.
 */
function createYouTubeVideoTexture(videoId: string): THREE.VideoTexture | null {
  // Standard implementation requires an invisible iframe or direct video stream parsing (via proxy).
  // For the Anyma style, these video textures are wrapped onto giant holographic planes.
  return null;
}


const AnymaShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uAudioFrequency: { value: 0 },
    uColorBase: { value: new THREE.Color('#030303') },
    uColorGlow: { value: new THREE.Color('#d0ff00') }, // Singularity yellow-green
    uColorAccent: { value: new THREE.Color('#ff007a') }, // Reality pink
  },
  vertexShader: `
    varying vec2 vUv;
    varying float vElevation;
    varying vec3 vPosition;
    uniform float uTime;
    uniform float uAudioFrequency;

    // Simplex Noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute( permute( permute( 
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 0.142857142857;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      vUv = uv;
      vPosition = position;
      
      float noiseFreq = 1.5;
      float noiseAmp = 0.8 + (uAudioFrequency * 2.0);
      vec3 noisePos = vec3(position.x * noiseFreq + uTime, position.y * noiseFreq, position.z);
      
      float noise = snoise(noisePos) * noiseAmp;
      vElevation = noise;
      
      vec3 newPosition = position + normal * noise * 0.5;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying float vElevation;
    varying vec3 vPosition;
    uniform vec3 uColorBase;
    uniform vec3 uColorGlow;
    uniform vec3 uColorAccent;
    uniform float uTime;
    uniform float uAudioFrequency;

    void main() {
      float intensity = smoothstep(-1.0, 1.0, vElevation);
      
      // Cyber wireframe/scanline effect
      float grid = step(0.98, fract(vUv.x * 40.0 + uTime * 0.2)) + step(0.98, fract(vUv.y * 40.0 - uTime * 0.1));
      
      vec3 color = mix(uColorBase, uColorGlow, intensity * uAudioFrequency);
      color = mix(color, uColorAccent, (1.0 - intensity) * 0.5 * uAudioFrequency);
      
      // Add metallic edges
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      float fresnel = dot(viewDirection, vec3(0.0, 0.0, 1.0));
      fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
      fresnel = pow(fresnel, 3.0);
      
      color += uColorGlow * fresnel * 2.0 * uAudioFrequency;
      color += grid * uColorAccent * 0.3 * clamp(uAudioFrequency, 0.2, 1.0);

      gl_FragColor = vec4(color, 0.9);
    }
  `
};

function QuantumHyperobject({ isActive }: { isActive: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { isPlaying, audioElement } = useMusicEngine();

  // Web Audio Context setup for real-time reactivity
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    // Attempt real-time audio hooking
    if (audioElement && !analyzerRef.current) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyzer = audioCtx.createAnalyser();
        analyzer.fftSize = 256;
        
        // We only create this if we aren't running afoul of CORS
        // For production, the audio source MUST have crossOrigin="anonymous"
        const source = audioCtx.createMediaElementSource(audioElement);
        source.connect(analyzer);
        analyzer.connect(audioCtx.destination);
        
        analyzerRef.current = analyzer;
        dataArrayRef.current = new Uint8Array(analyzer.frequencyBinCount);
      } catch (err) {
        console.warn("Web Audio API node could not be created (CORS or initialization issue):", err);
      }
    }
  }, [audioElement]);

  // Real-time animation mapped to Audio
  useFrame((state) => {
    let audioReactive = 0;

    if (isActive) {
      if (analyzerRef.current && dataArrayRef.current) {
        // Use true Web Audio API FFT analysis
        analyzerRef.current.getByteFrequencyData(dataArrayRef.current);
        // Average the lower frequencies (Bass)
        let sum = 0;
        for (let i = 0; i < 10; i++) {
          sum += dataArrayRef.current[i];
        }
        audioReactive = (sum / 10) / 255.0; // Normalized 0.0 to 1.0
      } else {
        // Fallback: Simulate beat pulsing if real analyser isn't hooked yet
        const bpm = 125;
        const beatInterval = 60 / bpm;
        const time = state.clock.elapsedTime;
        const beat = (time % beatInterval) / beatInterval;
        audioReactive = 0.3 + Math.pow(1.0 - beat, 3.0) * 0.7; // Sharp falloff
      }
    } else {
      audioReactive = 0.0;
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * 0.5;
      
      // Update color based on intensity (simulating Grok Mood Analysis mapping)
      if (audioReactive > 0.8) {
        materialRef.current.uniforms.uColorGlow.value.lerp(new THREE.Color('#ffffff'), 0.1);
      } else {
        materialRef.current.uniforms.uColorGlow.value.lerp(new THREE.Color('#d0ff00'), 0.05);
      }

      // Smoothly interpolate the displacement amplitude
      materialRef.current.uniforms.uAudioFrequency.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uAudioFrequency.value,
        audioReactive * 1.5,
        0.15
      );
    }

    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002 + (audioReactive * 0.01);
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
      
      // Scale pop effect on heavy bass hits
      const targetScale = 2.5 + audioReactive * 0.3;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <Float speed={isActive ? 2 : 1} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={[0, 0, 0]} scale={2.5}>
        <icosahedronGeometry args={[1, 64]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={AnymaShaderMaterial.vertexShader}
          fragmentShader={AnymaShaderMaterial.fragmentShader}
          uniforms={THREE.UniformsUtils.clone(AnymaShaderMaterial.uniforms)}
          transparent
          wireframe={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Float>
  );
}

function Particles() {
  const count = 2000;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);
  const { isPlaying } = useMusicEngine();

  useFrame((state) => {
    if (!pointsRef.current) return;
    const speed = isPlaying ? 0.05 : 0.01;
    pointsRef.current.rotation.y += speed;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#d0ff00"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function CinematicBackscreen({ opacity = 1, pageType = "nexus" }: { opacity?: number, pageType?: string }) {
  // pageType modifies the colors for specific contexts
  const { isPlaying } = useMusicEngine();
  
  return (
    <div className="fixed inset-0 pointer-events-none transition-opacity duration-1000" style={{ zIndex: 0, opacity }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 2]}>
        <color attach="background" args={['#020202']} />
        
        <fog attach="fog" args={['#020202', 5, 20]} />
        
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 10, 5]} intensity={2} color="#00e0ff" />
        <pointLight position={[-5, -5, -5]} intensity={5} color="#ff007a" />
        
        <QuantumHyperobject isActive={isPlaying} />
        <Particles />
        
        <EffectComposer enableNormalPass={false}>
          <Bloom
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
            intensity={pageType === "djverse" ? 3.0 : 1.5}
            mipmapBlur
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={new THREE.Vector2(0.002, 0.002)}
          />
          <DepthOfField target={[0, 0, 0]} focalLength={0.5} bokehScale={2} height={480} />
          <Noise opacity={0.04} />
          <Vignette eskil={false} offset={0.1} darkness={1.2} />
        </EffectComposer>
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60 mix-blend-multiply" />
    </div>
  );
}
