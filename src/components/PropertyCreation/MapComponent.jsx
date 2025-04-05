import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ChangeView from "./ChangeView";
import MapEvents from "./MapEvents";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const MapComponent = ({ location, onMapClick, isGeocoding, onAddressSearch, onAddressChange }) => {
  const currentCenter = [location.lat, location.lng];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={location.address}
          onChange={onAddressChange}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
          placeholder="Search locations in Nepal..."
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), onAddressSearch())}
        />
        <button
          type="button"
          onClick={onAddressSearch}
          disabled={isGeocoding}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isGeocoding ? "Searching..." : "Search"}
        </button>
      </div>
      <div className="relative h-64 w-full z-0">
        {isGeocoding && (
          <div className="absolute inset-0 bg-white bg-opacity-50 z-10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        <MapContainer center={currentCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
          <ChangeView center={location} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={currentCenter} />
          <MapEvents onMapClick={onMapClick} />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapComponent;