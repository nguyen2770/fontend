import React, { useState, useEffect } from 'react';
import { Modal, Input, Row } from 'antd';
import { MapContainer, TileLayer, Marker, useMapEvent, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Default icon fix for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
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
    const [locationName, setLocationName] = useState('');

    const handleMapClick = async (event) => {
        const { lat, lng } = event.latlng;
        setSelectedLocation({ lat, lng });
        const locationDetails = await fetchLocationDetails(lat, lng);
        setLocationName(locationDetails); // Cập nhật 
    }

    const LocationMarker = () => {
        useMapEvent('click', handleMapClick);
        return <Marker position={selectedLocation} />;
    };

    const fetchLocationDetails = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();
            return data.display_name; // Trả về tên vị trí chi tiết
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
                }, 300); // Đợi modal hiển thị hoàn toàn
            }
        }, [map, open]);

        return null;
    };
    const searchLocationByName = async (locationName) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`
            );
            const data = await response.json();

            if (data && data.length > 0) {
                // Trả về tọa độ của kết quả đầu tiên
                return {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon),
                    displayName: data[0].display_name,
                };
            } else {
                return null; // Không tìm thấy kết quả
            }
        } catch (error) {
            console.error("Error searching location by name:", error);
            return null;
        }
    };
    const handleSearchLocation = async () => {
        if (locationName.trim() !== '') {
            const result = await searchLocationByName(locationName);
            if (result) {
                setSelectedLocation({ lat: result.lat, lng: result.lng });
                setLocationName(result.displayName); // Cập nhật tên vị trí chi tiết
            } else {
                alert('Location not found!');
            }
        }
    };
    const handleConfirm = () => {
        onSelect({
            addressOne: locationName,
            latitude: selectedLocation.lat == defaultCenter.lat ? null : selectedLocation.lat,
            longitude: selectedLocation.lng == defaultCenter.lng ? null : selectedLocation.lng,
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
            width={800}
        >
            <Row style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Input
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="Enter location name"
                    style={{ flex: 1 }}
                />
                <button
                    onClick={handleSearchLocation}
                    style={{
                        padding: '6px 12px',
                        backgroundColor: '#1890ff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Search
                </button>
            </Row>
            <MapContainer
                center={selectedLocation}
                zoom={15}
                style={{ width: '100%', height: '400px' }}
            >
                <MapSizeHandler open={visible} />
                <TileLayer
                    url="https://{s}.google.com/maps/vt?gl=vn&x={x}&y={y}&z={z}" 
                    subdomains={["mt0", "mt1", "mt2", "mt3"]} 
                    maxZoom={21} 
                    attribution="Google Maps"
                />
                <LocationMarker />
            </MapContainer>
        </Modal>
    );
};


export default React.memo(MapModal);