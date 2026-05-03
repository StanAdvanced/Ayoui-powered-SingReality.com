import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { HeartPulse, Activity, Zap, Wind, Ear, PlayCircle } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { PsycheResonantConduit } from '../components/PsycheResonantConduit';
import * as Tone from 'tone';

export function Wellness() {
  const [bpm, setBpm] = useState(72);
  const [stressLevel, setStressLevel] = useState<number>(45); // 0-100
  const [isScanning, setIsScanning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  
  useEffect(() => {
    // Simulated web bluetooth heart rate hook
    // Usually uses navigator.bluetooth.requestDevice(...)
  }, []);

  const startBioScan = () => {
    setIsScanning(true);
    setLogs(prev => [...prev, '> Initializing Web Bluetooth Heart Rate Monitor...']);
    setTimeout(() => {
        setLogs(prev => [...prev, '> Connection established. Streaming BPM...']);
        // Simulate reading variations
        const interval = setInterval(() => {
            setBpm(prev => prev + Math.floor(Math.random() * 5) - 2);
            setStressLevel(prev => prev + Math.floor(Math.random() * 5) - 2);
        }, 2000);
        return () => clearInterval(interval);
    }, 1500);
  };

  const startTherapy = async () => {
      setLogs(prev => [...prev, '> DeepSeek-R1 Bio-Analysis initialized...']);
      setLogs(prev => [...prev, '> Entrainment protocol: Slowing ambient heartbeat to 60 BPM.']);
      setIsPlaying(true);
      await Tone.start();
      
      const osc = new Tone.Oscillator(100, "sine").toDestination();
      const lfo = new Tone.LFO(0.5, 80, 120).start();
      lfo.connect(osc.frequency);
      osc.start();
      
      const filter = new Tone.Filter(400, "lowpass").toDestination();
      const noise = new Tone.Noise("pink").connect(filter);
      noise.volume.value = -20;
      noise.start();

      setTimeout(() => {
          setLogs(prev => [...prev, '> Generating Binaural Beats (Theta waves).']);
          const leftOsc = new Tone.Oscillator(200, "sine").toDestination();
          const rightOsc = new Tone.Oscillator(206, "sine").toDestination(); // 6Hz diff
          leftOsc.volume.value = -15;
          rightOsc.volume.value = -15;
          leftOsc.start();
          rightOsc.start();
      }, 3000);

      // We'll leave it running for simulation.
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6 relative overflow-hidden font-inter">
      {/* Background gradients tracking stress level */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-red-900/10 transition-colors duration-1000 pointer-events-none" 
        style={{ opacity: stressLevel / 100 }}
      />
      
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 relative z-10">
          {/* Bio Data Column */}
          <div className="md:w-1/3 flex flex-col gap-6">
              <div className="glass p-8 rounded-3xl border border-white/10 text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-singularity/20 flex items-center justify-center mb-6">
                      <HeartPulse className={`w-10 h-10 text-singularity ${isScanning ? 'animate-pulse' : ''}`} />
                  </div>
                  <h2 className="text-3xl font-heading font-bold mb-2">{bpm} <span className="text-sm text-gray-400">BPM</span></h2>
                  <p className="text-sm text-gray-400 mb-8">Live Biometric Feed</p>
                  
                  {!isScanning ? (
                      <button onClick={startBioScan} className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                        <Activity className="w-4 h-4" /> Connect Sensor
                      </button>
                  ) : (
                      <button onClick={startTherapy} className="w-full bg-gradient-to-r from-blue-500 to-singularity text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-singularity/20">
                        <PlayCircle className="w-5 h-5" /> Execute Therapy
                      </button>
                  )}
              </div>

              <div className="glass p-6 rounded-3xl border border-white/10 space-y-4">
                  <h3 className="font-heading font-semibold text-gray-300 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" /> Neural Stress Index
                  </h3>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 transition-all duration-1000" style={{ width: `${stressLevel}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs font-mono text-gray-500">
                      <span>Rest</span>
                      <span>Anxiety Peak</span>
                  </div>
              </div>
              
              <div className="glass p-6 rounded-2xl border border-white/10 h-48 overflow-y-auto font-mono text-[10px] text-green-400/80 space-y-2">
                <p className="text-gray-500 mb-2">// DeepSeek-R1 Biometric Logs</p>
                {logs.map((log, index) => (
                    <div key={index} className="animate-fade-in">{log}</div>
                ))}
              </div>
          </div>

          {/* Visualization Column */}
          <div className="md:w-2/3 glass rounded-3xl border border-white/10 relative overflow-hidden flex flex-col">
              <div className="absolute top-6 left-6 z-10 flex gap-2">
                  <div className="px-3 py-1 bg-black/40 border border-white/10 rounded-full text-[10px] font-mono text-gray-300 flex items-center gap-2 uppercase tracking-widest backdrop-blur-md">
                      <Wind className="w-3 h-3 text-blue-400" /> DeepSeek-R1 Active
                  </div>
                  <div className="px-3 py-1 bg-black/40 border border-white/10 rounded-full text-[10px] font-mono text-gray-300 flex items-center gap-2 uppercase tracking-widest backdrop-blur-md">
                      <Ear className="w-3 h-3 text-purple-400" /> Binaural Entrainment
                  </div>
              </div>
              
              <div className="flex-1 min-h-[500px]">
                  <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                      <ambientLight intensity={0.2} />
                      <directionalLight position={[10, 10, 10]} intensity={1} color={isPlaying ? '#00D4FF' : '#ffffff'} />
                      <directionalLight position={[-10, -10, -10]} intensity={0.5} color={isPlaying ? '#6C3CE1' : '#ffffff'} />
                      
                      {/* PsycheResonantConduit reacts to stress and play state */}
                      <PsycheResonantConduit 
                        state={isPlaying ? 'creating' : isScanning ? 'active' : 'idle'} 
                        color={stressLevel > 60 ? '#f43f5e' : stressLevel < 40 ? '#10b981' : '#6C3CE1'} 
                        scale={1.5} 
                      />
                  </Canvas>
              </div>
              
              <div className="p-8 border-t border-white/10 bg-black/20 backdrop-blur-md">
                  <h3 className="text-xl font-heading font-bold text-white mb-2">DeepSeek Biomedical Feedback</h3>
                  <p className="text-gray-400 text-sm">
                      Streaming your real-time heart rate and HRV into DeepSeek-R1. The engine calculates your instantaneous 
                      stress index and commands the Lyria RealTime WebSocket to generate a therapeutic soundscape (binaural beats, pink noise) 
                      to entrain your physiological state towards calm.
                  </p>
              </div>
          </div>
      </div>
    </div>
  );
}
