import React, { useEffect, useRef, useMemo, useState } from 'react';
import Globe from 'react-globe.gl';
import { sumFormulaEngine } from '../services/sumFormulaEngine';

interface QuantumGlobeProps {
  width: number;
  height: number;
  resonance: number;
  users: any[];
  arcs: any[];
}

export function QuantumGlobe({ width, height, resonance, users, arcs }: QuantumGlobeProps) {
  const globeEl = useRef<any>(null);
  const [pulse, setPulse] = useState(0);

  // High-res textures from trusted CDNs for "Google Earth" feel
  const globeConfig = {
    globeImageUrl: "//unpkg.com/three-globe/example/img/earth-night.jpg",
    bumpImageUrl: "//unpkg.com/three-globe/example/img/earth-topology.png",
    showAtmosphere: true,
    atmosphereColor: "#00f0ff",
    atmosphereAltitude: 0.2,
  };

  useEffect(() => {
    if (globeEl.current) {
      // Auto-rotation speed influenced by resonance
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.2 + (resonance * 0.8);
      
      // Dynamic camera zoom based on resonance level
      const targetAltitude = 2.5 - (resonance * 0.5);
      globeEl.current.pointOfView({ altitude: targetAltitude }, 1000);
    }
  }, [resonance]);

  // Orbiting objects based on "Absence Protocol"
  useEffect(() => {
    let frameId: number;
    const animate = () => {
      setPulse(sumFormulaEngine.calculateAbsenceProtocol(Date.now() / 1000));
      frameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Mock node clusters for "Global Sync" visualization
  const nodeClusters = useMemo(() => {
    return [
      { lat: 40.7128, lng: -74.0060, name: 'Core Cluster - NYC', status: 'HYPER-SYNC' },
      { lat: 35.6762, lng: 139.6503, name: 'Edge Node - TYO', status: 'RESONATING' },
      { lat: 51.5074, lng: -0.1278, name: 'Quantum Relay - LDN', status: 'LINKED' },
      { lat: -33.8688, lng: 151.2093, name: 'Sub-Node - SYD', status: 'STABLE' },
      { lat: 55.7558, lng: 37.6173, name: 'Proxy Matrix - MOW', status: 'RESONATING' },
    ];
  }, []);

  return (
    <Globe
      ref={globeEl}
      width={width}
      height={height}
      backgroundColor="rgba(0,0,0,0)" // Transparent for GSpaceBackground
      {...globeConfig}
      
      // Resonance pulse visual for the atmosphere
      atmosphereAltitude={0.15 + (pulse * 0.1)}
      
      // Point Visualization (Users)
      pointsData={users}
      pointLat="lat"
      pointLng="lng"
      pointColor={d => (d as any).isVip ? '#eab308' : (d as any).color}
      pointAltitude={d => (d as any).size * (1 + resonance)}
      pointRadius={d => (d as any).isVip ? 0.8 : 0.4}
      pointsMerge={true}
      
      // Arc Visualization (Connections)
      arcsData={arcs}
      arcStartLat="startLat"
      arcStartLng="startLng"
      arcEndLat="endLat"
      arcEndLng="endLng"
      arcColor={d => (d as any).color}
      arcDashLength={0.4}
      arcDashGap={0.2}
      arcDashAnimateTime={1000 / (0.5 + resonance)}
      arcStroke={0.3}
      
      // Node Clusters Labels
      labelsData={nodeClusters}
      labelLat="lat"
      labelLng="lng"
      labelText="name"
      labelSize={1.5}
      labelDotRadius={0.5}
      labelColor={() => '#00f0ff'}
      labelResolution={2}
      
      // Custom Layer for "Quantum Resonance Halo"
      hexBinPointsData={users}
      hexBinPointWeight="size"
      hexBinResolution={4}
      hexMargin={0.2}
      hexTopColor={() => 'rgba(0, 240, 255, 0.4)'}
      hexSideColor={() => 'rgba(112, 0, 255, 0.2)'}
      hexLabel={d => `Region Resonance: ${(d as any).sumWeight.toFixed(2)}`}
    />
  );
}
