import { useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Button } from './ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

// Fix for default marker icon missing assets
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom draggable marker icon
const draggableIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #ef4444; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5); cursor: grab;"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

interface LocationPickerProps {
  onConfirm: (location: { lat: number; lng: number; address: string }) => void;
  onCancel: () => void;
}

// Component to handle map clicks and marker updates
const LocationMarker = ({ position, setPosition }: { position: L.LatLng, setPosition: (pos: L.LatLng) => void }) => {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
    dragend() {
      // Update position on map drag end if center changes significantly? 
      // Actually standard is usually fixed center marker or draggable marker. 
      // Let's stick to draggable marker + click to move.
    }
  });

  return (
    <Marker 
      position={position} 
      icon={draggableIcon}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          setPosition(e.target.getLatLng());
        },
      }}
    >
      <Popup>Drag to adjust location</Popup>
    </Marker>
  );
};

export default function LocationPicker({ onConfirm, onCancel }: LocationPickerProps) {
  const { language } = useLanguage();
  const [position, setPosition] = useState<L.LatLng>(new L.LatLng(28.6139, 77.2090)); // Default: New Delhi
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // Reverse geocoding using OpenStreetMap Nominatim API (Free, requires user-agent)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}&zoom=18&addressdetails=1`,
        { headers: { 'User-Agent': 'RahiApp/1.0' } }
      );
      const data = await response.json();
      
      onConfirm({
        lat: position.lat,
        lng: position.lng,
        address: data.display_name || `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`
      });
    } catch (error) {
      console.error("Geocoding error:", error);
      // Fallback if API fails
      onConfirm({
        lat: position.lat,
        lng: position.lng,
        address: `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="relative flex-grow h-full w-full">
        <MapContainer 
          center={position} 
          zoom={13} 
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
        
        {/* Helper Badge */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg z-[1000] text-sm font-medium pointer-events-none">
          {language === 'hi' ? 'स्थान चुनने के लिए टैप करें या मार्कर खींचें' : 'Tap or drag marker to set location'}
        </div>
      </div>

      <div className="p-4 bg-background border-t shadow-lg-up">
        <div className="flex gap-4">
          <Button variant="outline" className="flex-1" onClick={onCancel} disabled={loading}>
            {language === 'hi' ? 'रद्द करें' : 'Cancel'}
          </Button>
          <Button className="flex-1" onClick={handleConfirm} disabled={loading}>
            {loading 
              ? (language === 'hi' ? 'पता ले रहे हैं...' : 'Getting Address...') 
              : (language === 'hi' ? 'स्थान की पुष्टि करें' : 'Confirm Location')
            }
          </Button>
        </div>
      </div>
    </div>
  );
}
