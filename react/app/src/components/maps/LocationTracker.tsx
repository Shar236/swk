import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Clock, Phone } from 'lucide-react';
import { TrackingMap } from './TrackingMap';

interface LocationData {
  lat: number;
  lng: number;
  timestamp: Date;
  accuracy?: number;
}

interface TrackingData {
  workerLocation: LocationData | null;
  customerLocation: LocationData | null;
  routeHistory: LocationData[];
  estimatedArrival?: string;
  distanceRemaining?: number;
}

export const LocationTracker: React.FC = () => {
  const [trackingData, setTrackingData] = useState<TrackingData>({
    workerLocation: null,
    customerLocation: null,
    routeHistory: [],
  });
  const [isTracking, setIsTracking] = useState(false);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const mapRef = useRef<HTMLDivElement>(null);

  // Request location permission and get customer location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions.query({ name: 'geolocation' }).then(permission => {
        setLocationPermission(permission.state);
        
        if (permission.state === 'granted') {
          getCurrentLocation();
        } else if (permission.state === 'prompt') {
          requestLocationPermission();
        }
      });
    }
  }, []);

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData: LocationData = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: new Date(position.timestamp),
            accuracy: position.coords.accuracy
          };
          
          setTrackingData(prev => ({
            ...prev,
            customerLocation: locationData
          }));
          
          setLocationPermission('granted');
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationPermission('denied');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData: LocationData = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: new Date(position.timestamp),
            accuracy: position.coords.accuracy
          };
          
          setTrackingData(prev => ({
            ...prev,
            customerLocation: locationData
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    }
  };

  // Simulate worker location updates (in real app, this would come from WebSocket)
  useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(() => {
      // Simulate worker moving toward customer
      if (trackingData.customerLocation) {
        const customer = trackingData.customerLocation;
        // Simulate worker location (would come from backend in real app)
        const workerLat = customer.lat + (Math.random() - 0.5) * 0.001; // Small random offset
        const workerLng = customer.lng + (Math.random() - 0.5) * 0.001; // Small random offset
        
        const workerLocation: LocationData = {
          lat: workerLat,
          lng: workerLng,
          timestamp: new Date(),
          accuracy: 10
        };

        setTrackingData(prev => ({
          ...prev,
          workerLocation,
          routeHistory: [...prev.routeHistory, workerLocation].slice(-50) // Keep last 50 locations
        }));
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isTracking, trackingData.customerLocation]);

  const startTracking = () => {
    setIsTracking(true);
  };

  const stopTracking = () => {
    setIsTracking(false);
  };

  const formatDistance = (distance?: number): string => {
    if (!distance) return 'Calculating...';
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5" />
          Live Location Tracking
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Track your service professional in real-time
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Tracking Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={isTracking ? "default" : "secondary"}>
                {isTracking ? "Active" : "Inactive"}
              </Badge>
              <span className="text-sm">
                {isTracking ? "Tracking in progress" : "Tracking paused"}
              </span>
            </div>
            <div className="flex gap-2">
              {!isTracking ? (
                <Button onClick={startTracking} disabled={locationPermission !== 'granted'}>
                  Start Tracking
                </Button>
              ) : (
                <Button onClick={stopTracking} variant="destructive">
                  Stop Tracking
                </Button>
              )}
            </div>
          </div>

          {/* Location Permission Status */}
          {locationPermission !== 'granted' && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                Location permission required for tracking.{' '}
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-yellow-800"
                  onClick={requestLocationPermission}
                >
                  Enable location
                </Button>
              </p>
            </div>
          )}

          {/* Location Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <h3 className="font-medium">Customer Location</h3>
                </div>
                {trackingData.customerLocation ? (
                  <div className="space-y-1 text-sm">
                    <p>Lat: {trackingData.customerLocation.lat.toFixed(6)}</p>
                    <p>Lng: {trackingData.customerLocation.lng.toFixed(6)}</p>
                    <p>Acc: {trackingData.customerLocation.accuracy}m</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Location not available</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Navigation className="h-4 w-4 text-green-600" />
                  <h3 className="font-medium">Worker Location</h3>
                </div>
                {trackingData.workerLocation ? (
                  <div className="space-y-1 text-sm">
                    <p>Lat: {trackingData.workerLocation.lat.toFixed(6)}</p>
                    <p>Lng: {trackingData.workerLocation.lng.toFixed(6)}</p>
                    <p>Acc: {trackingData.workerLocation.accuracy}m</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Worker location not available</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Estimated Arrival */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <h3 className="font-medium">Estimated Arrival</h3>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {trackingData.estimatedArrival || 'Calculating...'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-orange-600" />
                  <h3 className="font-medium">Distance Remaining</h3>
                </div>
                <p className="text-2xl font-bold text-orange-600">
                  {formatDistance(trackingData.distanceRemaining)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">
              <Phone className="h-4 w-4 mr-2" />
              Call Worker
            </Button>
            <Button variant="outline">
              <MapPin className="h-4 w-4 mr-2" />
              Directions
            </Button>
            <Button variant="outline">
              Share Location
            </Button>
          </div>

          {/* Interactive Map */}
          <div className="h-64 w-full bg-gray-100 rounded-lg border overflow-hidden">
            <TrackingMap
              customerLocation={trackingData.customerLocation}
              workerLocation={trackingData.workerLocation}
              routeHistory={trackingData.routeHistory}
              onLocationSelect={(lat, lng) => {
                // Handle location selection
                console.log('Selected location:', lat, lng);
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};