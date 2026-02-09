import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface LiveTrackingMapProps {
  customerLat: number;
  customerLng: number;
  workerLat?: number;
  workerLng?: number;
  isWorkerMoving?: boolean;
  eta?: number;
}

export default function LiveTrackingMap({
  customerLat,
  customerLng,
  workerLat,
  workerLng,
  isWorkerMoving = false,
  eta = 0,
}: LiveTrackingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const workerMarkerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const [currentWorkerPos, setCurrentWorkerPos] = useState<[number, number] | null>(
    workerLat && workerLng ? [workerLat, workerLng] : null
  );

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [customerLat, customerLng],
      zoom: 14,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Customer marker
    const customerIcon = L.divIcon({
      html: `<div style="width: 40px; height: 40px;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#ef4444"/>
          <circle cx="12" cy="9" r="2.5" fill="white"/>
        </svg>
      </div>`,
      className: '',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    L.marker([customerLat, customerLng], { icon: customerIcon }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [customerLat, customerLng]);

  // Worker marker and route
  useEffect(() => {
    if (!mapInstanceRef.current || !currentWorkerPos) return;

    const map = mapInstanceRef.current;

    // Worker icon
    const workerIcon = L.divIcon({
      html: `<div style="width: 40px; height: 40px;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40">
          <circle cx="12" cy="12" r="10" fill="#3b82f6"/>
          <circle cx="12" cy="12" r="6" fill="white"/>
          <circle cx="12" cy="12" r="3" fill="#3b82f6"/>
        </svg>
      </div>`,
      className: '',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    // Update or create worker marker
    if (workerMarkerRef.current) {
      workerMarkerRef.current.setLatLng(currentWorkerPos);
    } else {
      workerMarkerRef.current = L.marker(currentWorkerPos, { icon: workerIcon }).addTo(map);
    }

    // Update or create polyline
    const routePath: [number, number][] = [currentWorkerPos, [customerLat, customerLng]];
    if (polylineRef.current) {
      polylineRef.current.setLatLngs(routePath);
    } else {
      polylineRef.current = L.polyline(routePath, {
        color: '#3b82f6',
        weight: 4,
        opacity: 0.7,
        dashArray: '10, 10',
      }).addTo(map);
    }

    // Fit bounds
    const bounds = L.latLngBounds([currentWorkerPos, [customerLat, customerLng]]);
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [currentWorkerPos, customerLat, customerLng]);

  // Simulate worker movement
  useEffect(() => {
    if (!isWorkerMoving || !workerLat || !workerLng) return;

    const startLat = workerLat;
    const startLng = workerLng;
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.02;
      if (progress >= 0.8) {
        clearInterval(interval);
        return;
      }
      
      const newLat = startLat + (customerLat - startLat) * progress;
      const newLng = startLng + (customerLng - startLng) * progress;
      setCurrentWorkerPos([newLat, newLng]);
    }, 500);

    return () => clearInterval(interval);
  }, [isWorkerMoving, workerLat, workerLng, customerLat, customerLng]);

  // Update worker position when props change
  useEffect(() => {
    if (workerLat && workerLng) {
      setCurrentWorkerPos([workerLat, workerLng]);
    }
  }, [workerLat, workerLng]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl">
      <div ref={mapRef} className="h-full w-full" />

      {/* ETA Overlay */}
      {isWorkerMoving && eta > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]"
        >
          <div className="bg-background/95 backdrop-blur shadow-lg rounded-full px-4 py-2 flex items-center gap-2">
            <Navigation className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-medium">{eta} min away</span>
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-background/95 backdrop-blur rounded-lg p-2 text-xs space-y-1">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-500" />
          <span>Worker</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <span>Your Location</span>
        </div>
      </div>
    </div>
  );
}