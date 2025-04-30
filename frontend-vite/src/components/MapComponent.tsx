import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { Business, SearchLocation } from "../types";

interface MapComponentProps {
  mapCenter: [number, number];
  businesses: Business[];
  searchLocation: SearchLocation;
  selectedLocation: [number, number] | null;
  onLocationSelect: (lat: number, lng: number) => void;
}

function LocationMarker({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const MapComponent: React.FC<MapComponentProps> = ({
  mapCenter,
  businesses,
  searchLocation,
  selectedLocation,
  onLocationSelect,
}) => {
  return (
    <div className="flex-1 rounded-lg overflow-hidden relative z-0">
      <MapContainer center={mapCenter} zoom={13} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {searchLocation.latitude && searchLocation.longitude && (
          <Marker
            position={[searchLocation.latitude, searchLocation.longitude]}
          >
            <Popup>Search Location</Popup>
          </Marker>
        )}

        {selectedLocation && (
          <Marker position={selectedLocation}>
            <Popup>New Business Location</Popup>
          </Marker>
        )}

        {businesses.map((business) => (
          <Marker
            key={business.business_id}
            position={[business.latitude, business.longitude]}
          >
            <Popup>
              <div>
                <h3 className="font-bold">{business.name}</h3>
                <p>Type: {business.type}</p>
                {business.address && <p>Address: {business.address}</p>}
                {business.city && <p>City: {business.city}</p>}
                {business.distance !== undefined && (
                  <p>Distance: {(business.distance / 1000).toFixed(2)} km</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        <LocationMarker onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
