import React, { useMemo } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'motion/react';
import { Activity, Brain, Radio, Zap } from 'lucide-react';

interface BiometricPanelProps {
  data: {
    heartRate: number;
    alphaWave: number;
    thetaWave: number;
  };
  isActive: boolean;
}

const RadialGauge = ({ value, max, color }: { value: number, max: number, color: string }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const progress = useSpring(Math.min(value / max, 1), { stiffness: 100, damping: 30 });
  const strokeDashoffset = useTransform(progress, (p) => circumference - p * circumference);

  return (
    <div className="relative w-20 h-20">
      <svg className="w-full h-full -rotate-90">
        <circle cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="4" fill="none" className="text-white/5" />
        <motion.circle
          cx="40" cy="40" r={radius}
          stroke={color} strokeWidth="4" fill="none"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-mono font-bold text-white">{value.toFixed(0)}</span>
        <span className="text-[8px] text-gray-500 uppercase">BPM</span>
      </div>
    </div>
  );
};

const ProgressBar = ({ value, max, label, unit, color }: { value: number, max: number, label: string, unit: string, color: string }) => {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-1 w-full">
      <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase tracking-widest">
        <span>{label}</span>
        <span>{value.toFixed(0)} / {max} {unit}</span>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full"
          style={{ backgroundColor: color, width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const WaveVisualizer = ({ value, color }: { value: number, color: string }) => {
  return (
    <div className="h-8 flex items-center gap-0.5">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            height: [10, 10 + value * 20 * (0.8 + Math.random() * 0.4), 10],
          }}
          transition={{ duration: 0.3 + Math.random() * 0.2, repeat: Infinity, ease: "easeInOut" }}
          className="w-1 rounded-full"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};

export function BiometricPanel({ data, isActive }: BiometricPanelProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.95 }}
          className="glass p-6 rounded-[2rem] border border-white/10 w-full md:w-80 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-quantum/5 to-singularity/5 pointer-events-none"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
              <Zap className="w-4 h-4 text-quantum" /> Bio-Feedback
            </h3>
            <div className="flex gap-1.5">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} 
                transition={{ duration: 2, repeat: Infinity }} 
                className="w-2 h-2 rounded-full bg-quantum" 
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <motion.div
                className="flex items-center gap-4"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <RadialGauge value={data.heartRate} max={180} color="var(--color-reality)" />
                <ProgressBar value={data.heartRate} max={180} label="Heart Rate" unit="BPM" color="var(--color-reality)" />
              </motion.div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Brain className="w-3 h-3 text-singularity" /> Alpha
                  </span>
                  <WaveVisualizer value={data.alphaWave} color="var(--color-singularity)" />
                </div>
                <ProgressBar value={data.alphaWave * 100} max={100} label="Alpha Intensity" unit="%" color="var(--color-singularity)" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Radio className="w-3 h-3 text-quantum" /> Theta
                  </span>
                  <WaveVisualizer value={data.thetaWave} color="var(--color-quantum)" />
                </div>
                <ProgressBar value={data.thetaWave * 100} max={100} label="Theta Intensity" unit="%" color="var(--color-quantum)" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}
