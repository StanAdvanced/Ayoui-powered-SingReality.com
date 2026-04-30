import React from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

interface SpatialCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function SpatialCard({ children, className = '', glowColor = '#00f0ff' }: SpatialCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-[2rem] border border-white/10 glass-card transition-all hover:border-[${glowColor}]/50 ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              ${glowColor}15,
              transparent 80%
            )
          `,
        }}
      />
      {children}
    </div>
  );
}
