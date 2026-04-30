import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Navigation, Globe, Box, Zap, Compass, Filter, Layers, Radio } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker, Circle, HeatmapLayer, GroundOverlay } from '@react-google-maps/api';

const center = { lat: 34.0522, lng: -118.2437 }; // LA - Media Empire HQ

const mapStyles = [
  { "elementType": "geometry", "stylers": [{ "color": "#0a0a0a" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#00f0ff" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#000000" }] },
  { "featureType": "administrative", "stylers": [{ "visibility": "simplified" }] },
  { "featureType": "landscape", "stylers": [{ "color": "#050505" }] },
  { "featureType": "road", "stylers": [{ "color": "#1a1a1a" }] },
  { "featureType": "water", "stylers": [{ "color": "#000000" }] }
];

export function GoogleMapsMasterpiece() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [viewMode, setViewMode] = useState<google.maps.MapTypeId | 'custom'>(google.maps.MapTypeId.SATELLITE);
  const [nodes, setNodes] = useState<{lat: number, lng: number, id: string}[]>([]);
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    if (!map) return;
    
    // Orbital flyover animation logic
    const interval = setInterval(() => {
      setHeading(prev => (prev + 0.1) % 360);
    }, 50);
    
    return () => clearInterval(interval);
  }, [map]);

  useEffect(() => {
    if (map) {
      map.setHeading(heading);
    }
  }, [heading, map]);

  const addNode = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setNodes([...nodes, { lat: e.latLng.lat(), lng: e.latLng.lng(), id: Math.random().toString() }]);
    }
  };

  if (!isLoaded) return <div className="w-full h-full bg-black" />;

  return (
    <div className="w-full h-full rounded-[2.5rem] overflow-hidden border border-white/5 relative group bg-black shadow-2xl">
      {/* Control Stack */}
      <div className="absolute top-6 left-6 z-20 flex flex-col gap-3 pointer-events-none">
         <motion.div 
           initial={{ x: -20, opacity: 0 }}
           animate={{ x: 0, opacity: 1 }}
           className="pointer-events-auto glass p-2 rounded-2xl border border-white/10 flex flex-col gap-1"
         >
            {[
              { id: google.maps.MapTypeId.SATELLITE, icon: Globe, label: 'Orbital' },
              { id: google.maps.MapTypeId.ROADMAP, icon: Filter, label: 'Grid' },
              { id: google.maps.MapTypeId.HYBRID, icon: Layers, label: 'Hybrid' },
            ].map(type => (
              <button 
                key={type.id}
                onClick={() => setViewMode(type.id as any)}
                className={`p-3 rounded-xl transition-all flex items-center gap-3 ${viewMode === type.id ? 'bg-singularity text-black active-pulse' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
              >
                 <type.icon className="w-4 h-4" />
                 <span className="text-[10px] font-black uppercase tracking-widest leading-none">{type.label}</span>
              </button>
            ))}
         </motion.div>
      </div>

      {/* Floating HUD */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col items-end gap-3 pointer-events-none">
         <div className="pointer-events-auto glass px-4 py-2 rounded-full border border-singularity/30 flex items-center gap-3">
            <Radio className="w-4 h-4 text-singularity animate-pulse" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live Node Injection Active</span>
         </div>
         <div className="pointer-events-auto glass px-6 py-4 rounded-[2rem] border border-white/10 w-64 space-y-3">
            <div className="flex justify-between items-center text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
               <span>Orbital Sync</span>
               <span className="text-singularity">{Math.round(heading)}° Azimuth</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 animate={{ width: `${(heading / 360) * 100}%` }}
                 className="h-full bg-gradient-to-r from-singularity to-quantum"
               />
            </div>
            <p className="text-[9px] text-gray-400 font-mono leading-relaxed italic opacity-60 group-hover:opacity-100 transition-opacity">
              Singularity Apex Architecture: Integrating Google Space & Earth API nexus. Global delivery nuance synchronized across 12M nodes.
            </p>
         </div>
      </div>

      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={12}
        mapTypeId={viewMode === 'custom' ? google.maps.MapTypeId.ROADMAP : viewMode}
        onLoad={setMap}
        onClick={addNode}
        options={{
          styles: mapStyles,
          disableDefaultUI: true,
          tilt: 45,
          heading: 90
        }}
      >
        {nodes.map(node => (
          <Marker 
            key={node.id}
            position={{ lat: node.lat, lng: node.lng }}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#00f0ff',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2
            }}
          />
        ))}
        
        <Circle
          center={center}
          radius={5000}
          options={{
            fillColor: '#7000ff',
            fillOpacity: 0.05,
            strokeColor: '#7000ff',
            strokeOpacity: 0.3,
            strokeWeight: 1
          }}
        />
      </GoogleMap>

      {/* Media Empire Scanning Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: [0, 400, 0], opacity: [0, 0.2, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="w-full h-1 bg-singularity shadow-[0_0_50px_rgba(0,240,255,1)]"
         />
      </div>
    </div>
  );
}
