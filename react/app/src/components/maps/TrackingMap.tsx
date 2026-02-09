import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
interface LocationData {
  lat: number;
  lng: number;
  timestamp: Date;
  accuracy?: number;
}

// Fix for default marker icons in Leaflet with React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapTrackingProps {
  customerLocation: LocationData | null;
  workerLocation: LocationData | null;
  routeHistory: LocationData[];
  onLocationSelect?: (lat: number, lng: number) => void;
}

const MapEventsHandler = ({ onLocationSelect }: { onLocationSelect?: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click: (e) => {
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    }
  });
  return null;
};

export const TrackingMap: React.FC<MapTrackingProps> = ({ 
  customerLocation, 
  workerLocation, 
  routeHistory,
  onLocationSelect
}) => {
  const mapRef = useRef<L.Map>(null);
  const [center, setCenter] = useState<[number, number]>([20.5937, 78.9629]); // Center of India
  const [zoom, setZoom] = useState(13);

  // Update map center based on locations
  useEffect(() => {
    if (customerLocation) {
      setCenter([customerLocation.lat, customerLocation.lng]);
    } else if (workerLocation) {
      setCenter([workerLocation.lat, workerLocation.lng]);
    }
  }, [customerLocation, workerLocation]);

  // Fit bounds when locations change
  useEffect(() => {
    if (mapRef.current && customerLocation && workerLocation) {
      const bounds = L.latLngBounds([
        [customerLocation.lat, customerLocation.lng],
        [workerLocation.lat, workerLocation.lng]
      ]);
      mapRef.current.fitBounds(bounds.pad(0.1));
    }
  }, [customerLocation, workerLocation]);

  // Prepare route coordinates for polyline
  const routePoints = routeHistory.map(loc => [loc.lat, loc.lng] as [number, number]);

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      style={{ height: '100%', width: '100%' }}
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      <MapEventsHandler onLocationSelect={onLocationSelect} />
      
      {/* Customer Location Marker */}
      {customerLocation && (
        <Marker position={[customerLocation.lat, customerLocation.lng]}>
          <Popup>
            <div className="font-medium">Customer Location</div>
            <div>Lat: {customerLocation.lat.toFixed(6)}</div>
            <div>Lng: {customerLocation.lng.toFixed(6)}</div>
          </Popup>
        </Marker>
      )}
      
      {/* Worker Location Marker */}
      {workerLocation && (
        <Marker position={[workerLocation.lat, workerLocation.lng]}>
          <Popup>
            <div className="font-medium">Worker Location</div>
            <div>Lat: {workerLocation.lat.toFixed(6)}</div>
            <div>Lng: {workerLocation.lng.toFixed(6)}</div>
          </Popup>
        </Marker>
      )}
      
      {/* Route History Polyline */}
      {routePoints.length > 1 && (
        <Polyline 
          positions={routePoints} 
          color="#3b82f6" 
          weight={4}
          opacity={0.7}
        />
      )}
    </MapContainer>
  );
};