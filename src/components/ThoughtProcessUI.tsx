import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Sparkles, Shield, Cpu, Zap } from 'lucide-react';

export interface ThoughtStep {
  signature: string;
  summary: string[];
}

interface ThoughtProcessUIProps {
  steps: ThoughtStep[];
  isThinking: boolean;
}

export function ThoughtProcessUI({ steps, isThinking }: ThoughtProcessUIProps) {
  return (
    <div className="space-y-4 font-mono text-[10px] uppercase tracking-tighter">
      <AnimatePresence mode="popLayout">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="border-l-2 border-singularity/30 pl-3 py-1 space-y-2 bg-gradient-to-r from-singularity/5 to-transparent"
          >
            <div className="flex items-center gap-2 text-singularity opacity-70">
              <Shield className="w-3 h-3" />
              <span className="truncate w-32">SIG: {step.signature}</span>
            </div>
            <div className="space-y-1">
              {step.summary.map((text, sIdx) => (
                <div key={sIdx} className="flex gap-2 text-white/50">
                  <Zap className="w-2 h-2 mt-1 shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {isThinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex items-center gap-2 text-singularity py-2"
          >
            <Cpu className="w-4 h-4 animate-spin-slow" />
            <span className="animate-pulse">Active Inference: Orchestrating Agent Swarm...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
