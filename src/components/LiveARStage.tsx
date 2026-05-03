import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { motion } from 'motion/react';
import { MapPin, Radio, Zap, Users, Globe2, DollarSign } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

export function LiveARStage() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const [map, setMap] = useState(null);
  const [anchors, setAnchors] = useState<{lat: number, lng: number, id: string}[]>([]);
  const [selectedAnchor, setSelectedAnchor] = useState<string | null>(null);

  const onLoad = useCallback(function callback(map: any) {
    // const bounds = new window.google.maps.LatLngBounds(defaultCenter);
    // map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: any) {
    setMap(null);
  }, []);

  const handleMapClick = (e: any) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setAnchors(prev => [...prev, { lat, lng, id: Date.now().toString() }]);
  };

  return (
    <div className="min-h-screen bg-black pt-20 flex flex-col font-inter">
      {/* Header Banner */}
      <div className="bg-[#0A0A0F] border-b border-white/10 p-8 flex items-center justify-between z-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-singularity/20 to-transparent opacity-50"></div>
        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
                <h1 className="text-4xl font-heading font-bold text-white flex items-center gap-3">
                    <Globe2 className="text-singularity" />
                    Sonic Geospheres
                </h1>
                <p className="text-gray-400">Perform Live, Echo Across the World. Drop an AR anchor to start your virtual busking session.</p>
            </div>
            <div className="flex gap-4">
                <div className="glass px-6 py-3 rounded-xl border border-white/10 flex items-center gap-3">
                    <Radio className="text-green-500 animate-pulse" />
                    <span className="text-white font-mono text-sm">CloudXR Connected</span>
                </div>
                <div className="glass px-6 py-3 rounded-xl border border-white/10 flex items-center gap-3">
                    <Users className="text-blue-400" />
                    <span className="text-white font-mono text-sm">4.2k Nearby Viewers</span>
                </div>
            </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Map Column */}
        <div className="md:w-1/2 h-[50vh] md:h-auto relative border-r border-white/10">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={defaultCenter}
              zoom={13}
              onLoad={onLoad}
              onUnmount={onUnmount}
              onClick={handleMapClick}
              options={{
                styles: [
                  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
                  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
                  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
                  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
                  { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
                  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
                  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
                  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
                  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
                  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
                  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
                  { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
                  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
                  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
                  { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
                ],
                disableDefaultUI: true
              }}
            >
              {anchors.map(anchor => (
                <Marker 
                  key={anchor.id} 
                  position={{lat: anchor.lat, lng: anchor.lng}} 
                  onClick={() => setSelectedAnchor(anchor.id)}
                  icon={{
                    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
                    fillColor: selectedAnchor === anchor.id ? '#6C3CE1' : '#00D4FF',
                    fillOpacity: 1,
                    strokeWeight: 0,
                    scale: 2
                  }}
                />
              ))}
            </GoogleMap>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">Loading Map...</div>
          )}
          
          <div className="absolute bottom-8 left-8 right-8 glass p-6 rounded-2xl border border-white/10 pointer-events-none">
             <p className="text-white text-sm">Click anywhere on the map to deploy a new AR Performance Anchor.</p>
          </div>
        </div>

        {/* CloudXR / AR Preview Column */}
        <div className="md:w-1/2 flex flex-col relative bg-gradient-to-b from-gray-900 to-black">
          {selectedAnchor ? (
            <>
              <div className="absolute top-4 left-4 z-10 glass px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-xs font-mono text-white">LIVE AR FEED</span>
              </div>
              <div className="absolute top-4 right-4 z-10 glass p-2 rounded-full border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              
              <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                
                {/* Simulated Hologram Character */}
                <group position={[0, -1, 0]}>
                    <mesh castShadow>
                        <cylinderGeometry args={[0.5, 0.5, 3, 32]} />
                        <meshStandardMaterial color="#00D4FF" emissive="#00D4FF" emissiveIntensity={0.5} wireframe />
                    </mesh>
                    <mesh position={[0, 2, 0]} castShadow>
                        <sphereGeometry args={[0.6, 32, 32]} />
                        <meshStandardMaterial color="#6C3CE1" emissive="#6C3CE1" emissiveIntensity={0.8} />
                    </mesh>
                    {/* Pulsing ring */}
                    <mesh position={[0, -1.4, 0]} rotation={[-Math.PI/2, 0, 0]}>
                        <ringGeometry args={[1, 1.2, 32]} />
                        <meshBasicMaterial color="#00D4FF" transparent opacity={0.5} side={2} />
                    </mesh>
                </group>

                <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
                <Environment preset="city" />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
              </Canvas>

              <div className="p-8 border-t border-white/10 glass z-10">
                <h3 className="text-xl font-heading font-bold text-white mb-2">Anchor ID: {selectedAnchor.slice(-6)}</h3>
                <p className="text-gray-400 text-sm mb-4">NVIDIA CloudXR streaming active. WebRTC latency: 12ms. 3D Face mesh tracked via Maxine SDK.</p>
                <div className="flex gap-4">
                  <button className="flex-1 bg-singularity hover:bg-singularity/80 text-white font-bold py-3 rounded-xl transition-colors">
                    Join Session (WebXR)
                  </button>
                  <button className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-colors">
                    Send Tip
                  </button>
                </div>
              </div>
            </>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8 text-center gap-4">
                <MapPin className="w-16 h-16 opacity-50" />
                <h2 className="text-2xl font-heading text-white">Select or Create an Anchor</h2>
                <p className="max-w-md">Drop a pin on the map to broadcast a holographic performance using Google Maps Geospatial AR and NVIDIA CloudXR.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
