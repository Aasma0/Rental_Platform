import { useEffect } from "react";
import { useMap } from "react-leaflet";

const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center?.lat && center?.lng) {
      map.setView([center.lat, center.lng], map.getZoom());
    }
  }, [center, map]);
  return null;
};

export default ChangeView;