'use client';

import React, { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Custom component to set map view
function MapViewSetter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Fix Leaflet marker icon issue in Next.js
const createMarkerIcon = (type, level) => {
  // Define the correct icon URL based on marker type
  let iconUrl = '/images/map/marker-blue.png';
  
  if (type === 'accident') {
    iconUrl = '/images/map/marker-red.png';
  } else if (type === 'roadwork' || type === 'congestion') {
    iconUrl = '/images/map/marker-orange.png';
  } else if (type === 'hospital') {
    iconUrl = '/images/map/marker-green.png';
  }
  
  // Modify size based on severity level if specified
  let iconSize = [25, 41];
  if (level === 'major' || level === 'critical') {
    iconSize = [30, 49];
  } else if (level === 'minor') {
    iconSize = [20, 33];
  }
  
  return new L.Icon({
    iconUrl,
    shadowUrl: '/images/map/marker-shadow.png',
    iconSize,
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const MapView = ({ 
  center = [40.7128, -74.0060], // Default to NYC
  zoom = 12,
  height = '400px',
  markers = [],
  showHeatmap = false,
  showRoutes = [],
  trafficEvents = []
}) => {
  // Combine markers and traffic events if both are provided
  const allMarkers = [
    ...markers,
    ...trafficEvents.map(event => ({
      location: { lat: event.coordinates[0], lng: event.coordinates[1] },
      type: event.type,
      description: event.description
    }))
  ];
  
  return (
    <div style={{ height, width: '100%', zIndex: 1 }}>
      <MapContainer 
        center={[center[0] || 40.7128, center[1] || -74.0060]} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapViewSetter center={[center[0] || 40.7128, center[1] || -74.0060]} zoom={zoom} />
        
        {allMarkers.map((marker, index) => {
          const position = [
            marker.location.lat || marker.location[0], 
            marker.location.lng || marker.location[1]
          ];
          
          return (
            <Marker 
              key={marker.id || `marker-${index}`} 
              position={position}
              icon={createMarkerIcon(marker.type, marker.level)}
            >
              <Popup>
                <div>
                  <h3 className="font-bold text-md capitalize">{marker.type}</h3>
                  <p className="text-sm">{marker.description}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
        
        {showRoutes.map((route, index) => {
          const positions = route.path.map(point => [
            point.lat || point[0],
            point.lng || point[1]
          ]);
          
          return (
            <Polyline
              key={`route-${index}`}
              positions={positions}
              pathOptions={{ 
                color: route.color || '#3388ff',
                weight: route.width || 3,
                opacity: 0.8,
                dashArray: route.dashArray || null
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;