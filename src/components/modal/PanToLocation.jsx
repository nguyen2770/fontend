import { useEffect } from "react";
import { useMap } from "react-leaflet";

const PanToLocation = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 18); // zoom đến vị trí, zoom level 18
    }
  }, [lat, lng, map]);
  return null;
};
export default PanToLocation;
