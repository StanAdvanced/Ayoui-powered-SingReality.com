import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';
import { Network, Satellite, Zap } from 'lucide-react';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '1.5rem'
};

const center = {
  lat: -33.8688, // Sydney, Australia 
  lng: 151.2093
};

// Dark, futuristic map style
const nightModeStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

export function GeoSpatialHub() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    // Using explicit Vite env var access pattern defined in your configuration
    googleMapsApiKey: (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const [activeNodes, setActiveNodes] = useState(42);

  useEffect(() => {
     const i = setInterval(() => {
        setActiveNodes(prev => prev + Math.floor(Math.random() * 3));
     }, 5000);
     return () => clearInterval(i);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="h-full p-6 flex flex-col gap-6"
    >
        <div className="flex justify-between items-end mb-4">
            <div>
                <h2 className="text-3xl font-heading font-black flex items-center gap-3"><Satellite className="text-[#00D4FF]" /> AR GEO-SPATIAL MAPPING</h2>
                <p className="text-gray-400 mt-2 font-mono text-sm max-w-xl">Live Sydney dropship deployments and AR anchors targeting Google Partnership integration vectors.</p>
            </div>
            
            <div className="glass px-6 py-4 rounded-2xl border border-[#00D4FF]/30 flex flex-col items-end">
                <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-1">Live XR Nodes</span>
                <span className="text-3xl font-mono text-white font-bold">{activeNodes}</span>
            </div>
        </div>

        <div className="flex-1 rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl">
            {isLoaded ? (
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={12}
                    options={{
                        styles: nightModeStyle,
                        disableDefaultUI: true,
                        zoomControl: true,
                    }}
                >
                    <Marker position={center} icon={{ url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png" }} />
                    <Marker position={{ lat: -33.88, lng: 151.21 }} icon={{ url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png" }} />
                    <Marker position={{ lat: -33.85, lng: 151.19 }} icon={{ url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png" }} />
                </GoogleMap>
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#050510]">
                    <div className="flex flex-col items-center gap-4">
                        <Zap className="w-8 h-8 text-[#00D4FF] animate-pulse" />
                        <span className="font-mono text-sm text-[#00D4FF] tracking-widest uppercase">Initializing Geospatial APIs...</span>
                    </div>
                </div>
            )}

            {/* Overlay stats */}
            <div className="absolute top-4 left-4 glass p-4 rounded-xl border border-white/10 backdrop-blur-md">
                <h4 className="text-xs font-bold font-mono text-gray-300 uppercase tracking-widest flex items-center gap-2 mb-3">
                    <Network className="w-4 h-4 text-green-400" /> Swarm Feed
                </h4>
                <div className="space-y-2 text-[10px] font-mono text-gray-400">
                    <div className="flex gap-4 justify-between border-b border-white/5 pb-1"><span>Target: Opera House</span><span className="text-[#00D4FF]">AR Anchor Deployed</span></div>
                    <div className="flex gap-4 justify-between border-b border-white/5 pb-1"><span>Target: Surry Hills</span><span className="text-green-500">Inventory Sync</span></div>
                    <div className="flex gap-4 justify-between pb-1"><span>Target: Bondi</span><span className="text-yellow-500">Awaiting Signal</span></div>
                </div>
            </div>
        </div>
    </motion.div>
  );
}
