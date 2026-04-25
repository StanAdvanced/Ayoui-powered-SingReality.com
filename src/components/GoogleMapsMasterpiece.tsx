import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 40.7128,
  lng: -74.0060
};

// Advanced Dark Mode Styles for "Quantum Maps"
const mapStyles = [
  { "elementType": "geometry", "stylers": [{ "color": "#121212" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#8e8e8e" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#000000" }] },
  { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#333333" }] },
  { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#1a1a1a" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#444444" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#2c2c2c" }] },
  { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212121" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] },
  { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#3d3d3d" }] }
];

export function GoogleMapsMasterpiece() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center font-mono text-[10px] text-gray-500 animate-pulse uppercase tracking-widest">
        Initializing Geospatial Matrix...
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden border border-white/5 shadow-inner">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: mapStyles,
          disableDefaultUI: true,
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false
        }}
      >
        {/* Dynamic Resonance Pulse circles on the map */}
        <Circle
          center={center}
          radius={5000}
          options={{
            fillColor: '#00f0ff',
            fillOpacity: 0.1,
            strokeColor: '#00f0ff',
            strokeOpacity: 0.3,
            strokeWeight: 1
          }}
        />
        <Marker 
          position={center}
          icon={{
            path: 'M 0,0 m -5,-5 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0',
            fillColor: '#7000ff',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#ffffff',
            scale: 2
          }}
        />
      </GoogleMap>
    </div>
  );
}
