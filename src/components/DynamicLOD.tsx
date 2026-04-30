import React from 'react';
import { Detailed } from '@react-three/drei';

export function DynamicLOD({
  distances = [0, 10, 20],
  children
}: {
  distances?: number[],
  children: React.ReactNode
}) {
  return (
    <Detailed distances={distances}>
      {children}
    </Detailed>
  );
}
