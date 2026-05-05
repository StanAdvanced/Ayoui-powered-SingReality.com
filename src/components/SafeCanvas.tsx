import React, { Suspense, Component, ReactNode, ComponentProps } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader2, AlertCircle } from 'lucide-react';
import { isWebGLAvailable } from '../lib/webgl';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: any;
}

class CanvasErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.group('Three.js / WebGL Error');
    console.error('Error:', error);
    console.error('Info:', errorInfo);
    console.groupEnd();
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center h-full bg-black/40 text-gray-400 p-8 text-center rounded-3xl border border-white/5">
          <AlertCircle className="w-8 h-8 mb-4 text-red-500/50" />
          <p className="text-xs font-mono uppercase tracking-[0.2em]">Quantum Visualizer Offline</p>
          <p className="text-[10px] mt-2 opacity-50">Hardware acceleration unavailable or context lost.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

import { XR, createXRStore } from '@react-three/xr';

const xrStore = createXRStore();

export function SafeCanvas({ children, fallback, xr = false, ...props }: { children: ReactNode, fallback?: ReactNode, xr?: boolean } & ComponentProps<typeof Canvas>) {
  const supported = isWebGLAvailable();

  if (!supported) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-black/20 text-gray-500 font-mono text-[10px] uppercase tracking-widest">
        <AlertCircle className="w-6 h-6 mb-2 opacity-30" />
        WebGL Context Disabled
      </div>
    );
  }

  const canvasContent = xr ? (
    <XR store={xrStore}>
      {children}
    </XR>
  ) : children;

  return (
    <CanvasErrorBoundary fallback={fallback}>
      <div className="relative w-full h-full">
        {xr && (
          <div className="absolute top-4 left-4 z-50 flex gap-2 pointer-events-auto">
            <button 
              onClick={() => xrStore.enterVR()}
              className="px-3 py-1.5 glass rounded-xl text-[8px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-white border border-white/10"
            >
              Enter VR
            </button>
            <button 
              onClick={() => xrStore.enterAR()}
              className="px-3 py-1.5 glass rounded-xl text-[8px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-white border border-white/10"
            >
              Enter AR
            </button>
          </div>
        )}
        <Suspense fallback={<div className="flex items-center justify-center h-full"><Loader2 className="w-6 h-6 animate-spin text-singularity opacity-20" /></div>}>
          <Canvas {...props}>
            {canvasContent}
          </Canvas>
        </Suspense>
      </div>
    </CanvasErrorBoundary>
  );
}
