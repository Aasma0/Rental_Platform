import { useEffect } from "react";
import { useMapEvents } from "react-leaflet";

const MapEvents = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export default MapEvents;