import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';

export function useBootSequence() {
  const [isBooting, setIsBooting] = useState(() => {
    // Check if seen in this session to prevent re-booting on every refresh if annoying, 
    // but the prompt says MUST be FIRST experience on website loads.
    // We use sessionStorage to allow it once per tab session.
    return !sessionStorage.getItem('singreality_boot_complete');
  });
  const [bootProgress, setBootProgress] = useState(0);
  const [bootStatus, setBootStatus] = useState('Initializing Hardware...');
  const { setAuthReady } = useStore();

  useEffect(() => {
    if (!isBooting) return;

    // Simulated system initialization
    const stages = [
      { progress: 10, status: 'Calibrating Neural Pathways...', delay: 800 },
      { progress: 30, status: 'Establishing Quantum Link...', delay: 1200 },
      { progress: 55, status: 'Synchronizing Biometrics...', delay: 1000 },
      { progress: 80, status: 'Activating GlassVerse Layers...', delay: 900 },
      { progress: 100, status: 'Convergence Optimized.', delay: 500 },
    ];

    let currentStage = 0;
    const runStage = () => {
      if (currentStage >= stages.length) return;
      
      const stage = stages[currentStage];
      setBootStatus(stage.status);
      setBootProgress(stage.progress);
      
      setTimeout(() => {
        currentStage++;
        if (currentStage < stages.length) {
          runStage();
        }
      }, stage.delay);
    };

    runStage();
  }, [isBooting]);

  const completeBoot = () => {
    sessionStorage.setItem('singreality_boot_complete', 'true');
    setAuthReady(true);
    setIsBooting(false);
  };

  return {
    isBooting,
    bootProgress,
    bootStatus,
    completeBoot
  };
}
