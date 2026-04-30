import React, { useState } from 'react';
import { Brain, Waves, Activity, Hexagon } from 'lucide-react';

export function AvatarBioLink() {
  const [syncStatus, setSyncStatus] = useState(0);

  React.useEffect(() => {
    const int = setInterval(() => {
      setSyncStatus((prev) => Math.min(prev + 1, 100));
    }, 50);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="absolute top-20 right-8 w-80 glass p-6 rounded-3xl border border-cyan-500/30">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
          <Brain className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-white">Numtrin Bio-Link</h3>
          <p className="text-xs text-cyan-400">Vessel Sync Active</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-white/60">Neural Synchronization</span>
            <span className="text-cyan-400">{syncStatus}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
              style={{ width: `${syncStatus}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <Activity className="w-4 h-4 text-green-400 mb-2" />
            <div className="text-[10px] text-white/50 uppercase tracking-wider">Heart Rate</div>
            <div className="font-mono text-lg text-white">72 BPM</div>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <Waves className="w-4 h-4 text-purple-400 mb-2" />
            <div className="text-[10px] text-white/50 uppercase tracking-wider">Brainwave</div>
            <div className="font-mono text-lg text-white">Alpha</div>
          </div>
        </div>

        <div className="bg-cyan-500/10 p-3 rounded-xl border border-cyan-500/20 flex items-center gap-3">
          <Hexagon className="w-5 h-5 text-cyan-400 animate-spin-slow" />
          <span className="text-sm font-medium text-cyan-100">Universal Health Link Connected</span>
        </div>
      </div>
    </div>
  );
}
