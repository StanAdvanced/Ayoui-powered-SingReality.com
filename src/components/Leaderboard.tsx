import React from 'react';
import { Trophy } from 'lucide-react';

export function Leaderboard() {
  return (
    <div className="p-8 glass rounded-[2rem] border border-white/10">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Trophy className="text-singularity" /> Top 100 Global
      </h2>
      <div className="space-y-4">
        {/* Leaderboard items */}
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
          <span className="font-mono text-sm">#1 Artist Name</span>
          <span className="font-mono text-sm text-singularity">9999 pts</span>
        </div>
      </div>
    </div>
  );
}
