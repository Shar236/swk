import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, LocateFixed } from 'lucide-react';
import { TrackingMap } from './TrackingMap';

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface LocationPickerProps {
  onLocationSelect: (location: Location) => void;
  initialLocation?: Location;
  // Adding compatibility with the original interface
  onConfirm?: (location: Location) => void;
  onCancel?: () => void;
}

// Reverse geocoding function to get address from coordinates
const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    // Using OpenStreetMap Nominatim API for reverse geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=en`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding failed');
    }
    
    const data = await response.json();
    
    // Construct a readable address
    const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    return address;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
};

// Forward geocoding function to get coordinates from address
const forwardGeocode = async (query: string): Promise<Location | null> => {
  try {
    // Using OpenStreetMap Nominatim API for forward geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&accept-language=en`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding failed');
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = data[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        address: result.display_name || query
      };
    }
    
    return null;
  } catch (error) {
    console.error('Forward geocoding error:', error);
    return null;
  }
};

export const LocationPicker: React.FC<LocationPickerProps> = ({ 
  onLocationSelect, 
  initialLocation,
  onConfirm,
  onCancel
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(initialLocation || null);
  const [isLocating, setIsLocating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Handle location selection from map
  const handleMapLocationSelect = async (lat: number, lng: number) => {
    // Reverse geocode to get the address
    const address = await reverseGeocode(lat, lng);
    
    const location = {
      lat,
      lng,
      address
    };
    
    setSelectedLocation(location);
    onLocationSelect(location);
    if (onConfirm) onConfirm(location);
  };

  // Get user's current location
  const getCurrentLocation = () => {
    setIsLocating(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // Reverse geocode the current coordinates to get address
          const address = await reverseGeocode(position.coords.latitude, position.coords.longitude);
          
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address
          };
          
          setSelectedLocation(location);
          onLocationSelect(location);
          if (onConfirm) onConfirm(location);
          setIsLocating(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLocating(false);
          
          // Fallback to India center
          const fallbackLocation = {
            lat: 20.5937,
            lng: 78.9629,
            address: 'India'
          };
          
          setSelectedLocation(fallbackLocation);
          onLocationSelect(fallbackLocation);
          if (onConfirm) onConfirm(fallbackLocation);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    } else {
      setIsLocating(false);
      alert('Geolocation is not supported by your browser');
    }
  };

  // Handle search with geocoding
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (searchQuery.trim()) {
      setIsSearching(true);
      
      const location = await forwardGeocode(searchQuery.trim());
      
      if (location) {
        setSelectedLocation(location);
        onLocationSelect(location);
        if (onConfirm) onConfirm(location);
      } else {
        // If geocoding fails, use a default location
        const fallbackLocation = {
          lat: 20.5937,
          lng: 78.9629,
          address: `Location not found: ${searchQuery}`
        };
        setSelectedLocation(fallbackLocation);
        onLocationSelect(fallbackLocation);
        if (onConfirm) onConfirm(fallbackLocation);
      }
      
      setIsSearching(false);
    }
  };

  // Handle input change with debouncing for live search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Perform search when user stops typing
    if (value.trim()) {
      // Debounce search to avoid too many API calls
      setTimeout(() => {
        if (value === searchQuery) { // Only search if the value hasn't changed
          handleSearch();
        }
      }, 1000);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Select Your Location
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose a location for your service
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search and Current Location */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for location..."
                value={searchQuery}
                onChange={handleInputChange}
                className="pl-10"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={getCurrentLocation}
              disabled={isLocating}
            >
              {isLocating ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <LocateFixed className="h-4 w-4" />
              )}
            </Button>
            <Button type="submit" disabled={isSearching}>
              {isSearching ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </form>

          {/* Selected Location Info */}
          {selectedLocation && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">{selectedLocation.address}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Map */}
          <div className="h-64 w-full bg-gray-100 rounded-lg border overflow-hidden">
            <TrackingMap
              customerLocation={selectedLocation ? {
                lat: selectedLocation.lat,
                lng: selectedLocation.lng,
                timestamp: new Date()
              } : null}
              workerLocation={null}
              routeHistory={[]}
              onLocationSelect={handleMapLocationSelect}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button 
              className="flex-1 min-w-[120px]"
              disabled={!selectedLocation}
              onClick={() => selectedLocation && onLocationSelect(selectedLocation)}
            >
              Confirm Location
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 min-w-[120px]"
              onClick={getCurrentLocation}
            >
              Use Current Location
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};