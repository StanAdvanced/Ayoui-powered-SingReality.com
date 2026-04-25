import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Users, Zap } from 'lucide-react';

export function NeuroDAO() {
  const rankings = [
    { user: "Acoustic_God", engagement: "99.9%", dopamineCycle: "Optimized" },
    { user: "Vocal_Resonance", engagement: "98.5%", dopamineCycle: "Optimized" },
    { user: "Harmonic_Sync", engagement: "97.2%", dopamineCycle: "Optimized" }
  ];

  return (
    <div className="glass-card p-12 rounded-[3rem] border border-white/5">
      <h2 className="text-4xl font-display font-black tracking-tighter mb-12">
        NEURO-DIGITAL <span className="text-gradient">DAO</span>
      </h2>
      <div className="space-y-6">
        {rankings.map((rank, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between p-6 glass rounded-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-singularity/20 flex items-center justify-center font-bold">
                {i + 1}
              </div>
              <span className="font-bold text-xl">{rank.user}</span>
            </div>
            <div className="flex gap-8 text-sm text-gray-400">
              <span className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-singularity" /> {rank.engagement}</span>
              <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-quantum" /> {rank.dopamineCycle}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
