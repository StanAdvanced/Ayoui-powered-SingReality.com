// @ts-nocheck
import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Canvas } from '@react-three/fiber';
import { XR, createXRStore } from '@react-three/xr';
import { Box, Text, OrbitControls } from '@react-three/drei';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { MapPin, X, Radio, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// CloudXR WebRTC Integration layer
class CloudXRClient {
  private peerConnection: RTCPeerConnection | null = null;
  private ws: WebSocket | null = null;
  public onStream: ((stream: MediaStream) => void) | null = null;

  connect(url: string, venueId: string) {
    console.log(`Connecting CloudXR to ${url} for venue ${venueId}`);
    
    // Simulate signaling server connection
    this.ws = new WebSocket(url === "wss://mock.cloudxr.nvidia.com" ? "wss://echo.websocket.events" : url);

    this.peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    this.peerConnection.ontrack = (event) => {
      if (this.onStream && event.streams[0]) {
        this.onStream(event.streams[0]);
      }
    };

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
      }
    };

    // Simulate receiving an offer and streaming (mock video stream)
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      canvas.width = 640; canvas.height = 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#76b900';
        ctx.fillRect(0, 0, 640, 480);
      }
      const mockStream = canvas.captureStream(30);
      if (this.onStream) this.onStream(mockStream);
    }, 2000);
  }

  disconnect() {
    console.log("Disconnecting CloudXR");
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

interface Venue {
  id: string;
  name: string;
  lat: number;
  lng: number;
  activePerformers: number;
}

const store = createXRStore();

export function GeoARStage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [isCloudXRConnected, setIsCloudXRConnected] = useState(false);
  const [isARActive, setIsARActive] = useState(false);
  
  const cloudXRClientRef = useRef(new CloudXRClient());
  const markersRef = useRef<google.maps.Marker[]>([]);

  // 1. Fetch Venues from Firestore
  useEffect(() => {
    async function loadVenues() {
      try {
        const venuesCol = collection(db, 'venues');
        const venueSnapshot = await getDocs(venuesCol);
        const venueList = venueSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Venue[];
        
        // If empty, seed some mock venues
        if (venueList.length === 0) {
          const mockVenues: Venue[] = [
            { id: 'tokyo-shibuya', name: 'Shibuya Crossing AR Mainstage', lat: 35.6595, lng: 139.7005, activePerformers: 12 },
            { id: 'london-soho', name: 'Soho Sonic Spheres', lat: 51.5136, lng: -0.1365, activePerformers: 5 },
            { id: 'ny-times-square', name: 'Times Square Hologram Stage', lat: 40.7580, lng: -73.9855, activePerformers: 24 }
          ];
          
          for (const v of mockVenues) {
            await setDoc(doc(db, 'venues', v.id), v);
          }
          setVenues(mockVenues);
        } else {
          setVenues(venueList);
        }
      } catch (error) {
        console.error("Error loading venues: ", error);
      }
    }
    
    loadVenues();
  }, []);

  // 2. Load Google Maps
  useEffect(() => {
    if (!mapRef.current) return;

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSy_MOCK_KEY_FOR_DEV';
    const loader = new Loader({
      apiKey,
      version: "weekly",
      libraries: ["places"]
    });

    (loader as any).importLibrary("maps").then(() => {
      const gMap = new google.maps.Map(mapRef.current as HTMLElement, {
        center: { lat: 35.6595, lng: 139.7005 }, // Default to Shibuya
        zoom: 3,
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
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
          { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
          { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
        ],
        disableDefaultUI: true,
      });

      setMap(gMap);
    });
  }, []);

  // 3. Render Markers
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    venues.forEach(venue => {
      const marker = new google.maps.Marker({
        position: { lat: venue.lat, lng: venue.lng },
        map,
        title: venue.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#00f0ff",
          fillOpacity: 0.8,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        }
      });

      marker.addListener("click", () => {
        setSelectedVenue(venue);
        map.panTo({ lat: venue.lat, lng: venue.lng });
        map.setZoom(16);
      });

      markersRef.current.push(marker);
    });
  }, [map, venues]);

  // 4. CloudXR Connection
  const connectCloudXR = () => {
    if (!selectedVenue) return;
    setIsCloudXRConnected(true);
    const wsUrl = import.meta.env.VITE_NVIDIA_CLOUDXR_WEBSOCKET_URL || "wss://mock.cloudxr.nvidia.com";
    cloudXRClientRef.current.connect(wsUrl, selectedVenue.id);
  };

  const enterAR = () => {
    setIsARActive(true);
    store.enterAR();
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col">
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 mix-blend-screen"
        src="https://videos.pexels.com/video-files/3163534/3163534-uhd_3840_2160_30fps.mp4"
      />
      {/* Dynamic Background Banner */}
      <div className="absolute top-0 left-0 w-full p-4 z-10 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl max-w-2xl mx-auto flex items-center justify-between shadow-[0_0_50px_rgba(0,240,255,0.1)]">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter bg-gradient-to-r from-singularity to-purple-500 bg-clip-text text-transparent">Sonic Geospheres</h1>
            <p className="text-gray-400 font-mono text-sm mt-1">Perform Live, Echo Across the World.</p>
          </div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 rounded-full border-2 border-singularity flex items-center justify-center shrink-0"
          >
            <Radio className="w-6 h-6 text-singularity" />
          </motion.div>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="flex-1 relative z-0">
        <div ref={mapRef} className="absolute inset-0 w-full h-full" />
        
        {/* Cinematic Map Overlay Overlay */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,1)]" />
      </div>

      {/* Venue Selection Modal */}
      <AnimatePresence>
        {selectedVenue && !isARActive && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 z-20"
          >
            <button 
              onClick={() => setSelectedVenue(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-singularity/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-singularity" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{selectedVenue.name}</h3>
                <p className="text-xs text-gray-400 font-mono">{selectedVenue.lat.toFixed(4)}, {selectedVenue.lng.toFixed(4)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Live</div>
                <div className="font-mono text-xl">{selectedVenue.activePerformers}</div>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Status</div>
                <div className="font-mono text-xl text-green-400">Online</div>
              </div>
            </div>

            {!isCloudXRConnected ? (
              <button 
                onClick={connectCloudXR}
                className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                <Radio className="w-5 h-5" />
                Connect to CloudXR Server
              </button>
            ) : (
              <button 
                onClick={enterAR}
                className="w-full py-4 bg-singularity text-black rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                <Video className="w-5 h-5" />
                Enter WebXR AR Stage
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* WebXR AR Layer */}
      {isARActive && (
        <div className="absolute inset-0 z-50 bg-black">
          <button 
            className="absolute top-4 right-4 z-50 text-white bg-black/50 p-2 rounded-full border border-white/20"
            onClick={() => { store.getState().session?.end(); setIsARActive(false); }}
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 text-center pointer-events-none">
             <div className="px-4 py-2 bg-singularity text-black rounded-full text-xs font-bold uppercase tracking-widest animate-pulse">
               Live: NVIDIA CloudXR Stream
             </div>
          </div>

          <Canvas>
            <XR store={store}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} color="#00f0ff" />
              <Suspense fallback={null}>
                {/* Represents the CloudXR video stream mapped to a geometric primitive in AR */}
                <Box position={[0, 1, -2]} scale={[2, 2, 2]}>
                  <meshStandardMaterial color="#222" wireframe />
                </Box>
                <Text position={[0, 2.5, -2]} fontSize={0.2} color="white" anchorX="center" anchorY="middle">
                  {selectedVenue?.name} AR Stage
                </Text>
              </Suspense>
              <OrbitControls />
            </XR>
          </Canvas>
        </div>
      )}
    </div>
  );
}
