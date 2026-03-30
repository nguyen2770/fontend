import React, { useState, useEffect, useRef } from "react";
import { Modal, Input, Row, List } from "antd";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvent,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import PanToLocation from "./PanToLocation";

// Default icon fix for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const defaultCenter = {
  lat: 21.028511,
  lng: 105.804817,
};

const MapModal = ({ visible, onCancel, onSelect, lat, lng }) => {
  const [selectedLocation, setSelectedLocation] = useState({
    lat: lat || defaultCenter.lat,
    lng: lng || defaultCenter.lng,
  });
  const [locationName, setLocationName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef();
  // Debounce tìm kiếm vị trí
  useEffect(() => {
    if (!locationName) {
      setSearchResults([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      handleSearch(locationName);
    }, 1000); // 5 giây
    return () => clearTimeout(debounceRef.current);
  }, [locationName]);

  // Khi click trên bản đồ
  const handleMapClick = async (event) => {
    const { lat, lng } = event.latlng;
    setSelectedLocation({ lat, lng });
    const locationDetails = await fetchLocationDetails(lat, lng);
    setLocationName(locationDetails);
    setSearchResults([]);
  };

  const LocationMarker = () => {
    useMapEvent("click", handleMapClick);
    return <Marker position={selectedLocation} />;
  };

  const fetchLocationDetails = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error("Error fetching location details:", error);
      return "Unknown location";
    }
  };

  const MapSizeHandler = ({ open }) => {
    const map = useMap();
    useEffect(() => {
      if (open) {
        setTimeout(() => {
          map.invalidateSize();
        }, 300);
      }
    }, [map, open]);
    return null;
  };

  // Tìm kiếm vị trí theo tên
  const handleSearch = async (value) => {
    setLocationName(value);
    if (!value) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    const api = `https://nominatim.openstreetmap.org/search?format=geojson&limit=5&q=${encodeURI(
      value
    )}`;
    const res = await fetch(api);
    const data = await res.json();
    setSearchResults(data.features || []);
    setSearching(false);
  };

  const handleSelectSuggestion = async (item) => {
    const [lng, lat] = item.geometry.coordinates;
    setSelectedLocation({ lat, lng });
    setLocationName(item.properties.display_name);
    setSearchResults([]);
    // PanToLocation sẽ tự động zoom đến vị trí mới
  };

  const handleConfirm = () => {
    onSelect({
      address: locationName,
      latitude:
        selectedLocation.lat == defaultCenter.lat ? null : selectedLocation.lat,
      longitude:
        selectedLocation.lng == defaultCenter.lng ? null : selectedLocation.lng,
    });
  };

  return (
    <Modal
      open={visible}
      title="Select Location"
      onCancel={onCancel}
      onOk={handleConfirm}
      okText="Confirm"
      cancelText="Cancel"
      width={"60%"}
    >
      <Row
        style={{
          marginBottom: "10px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Input
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          placeholder="Nhập địa chỉ hoặc tên vị trí"
          style={{ flex: 1 }}
          allowClear
        />
      </Row>
      {/* Hiển thị gợi ý tìm kiếm */}
      {searchResults.length > 0 && (
        <List
          bordered
          size="small"
          style={{
            marginBottom: 10,
            maxHeight: 150,
            overflowY: "auto",
            cursor: "pointer",
          }}
          dataSource={searchResults}
          renderItem={(item) => (
            <List.Item onClick={() => handleSelectSuggestion(item)}>
              {item.properties.display_name}
            </List.Item>
          )}
        />
      )}
      <MapContainer
        center={selectedLocation}
        zoom={15}
        style={{ width: "100%", height: "400px" }}
      >
        <MapSizeHandler open={visible} />
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}"
          attribution="© Google Maps"
        />
        <LocationMarker />
        <PanToLocation lat={selectedLocation.lat} lng={selectedLocation.lng} />
      </MapContainer>
    </Modal>
  );
};

export default React.memo(MapModal);
