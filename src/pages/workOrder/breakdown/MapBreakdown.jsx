import React, { useEffect, useRef, useState } from "react";
import {
    Modal,
    Button,
    Card,
    Row,
    Col,
    Form,
    Divider,
    Select,
    Spin,
} from "antd";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useTranslation } from "react-i18next";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const defaultCenter = { lat: 21.028511, lng: 105.804817 };

function PanToLocation({ lat, lng }) {
    const map = useMap();
    useEffect(() => {
        if (map && lat && lng) {
            map.setView([lat, lng], 15);
        }
    }, [lat, lng, map]);
    return null;
}
export default function MapBreakdown({ open, onCancel, breakdown = {} }) {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [locationName, setLocationName] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(defaultCenter);
    const debounceRef = useRef(null);

    function ResizeMapOnModalOpen({ open }) {
        const map = useMap();
        useEffect(() => {
            if (open) {
                setTimeout(() => {
                    map.invalidateSize();
                }, 300);
            }
        }, [open, map]);
        return null;
    }
    useEffect(() => {
        if (!locationName) {
            setSearchResults([]);
            return;
        }
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            handleSearch(locationName);
        }, 800);
        return () => clearTimeout(debounceRef.current);
    }, [locationName]);

    const handleSearch = async (value) => {
        setSearching(true);
        const api = `https://nominatim.openstreetmap.org/search?format=geojson&limit=5&q=${encodeURIComponent(
            value
        )}`;
        const res = await fetch(api);
        const data = await res.json();
        setSearchResults(data.features || []);
        setSearching(false);
    };

    const handleSelectSuggestion = (item) => {
        const [lng, lat] = item.geometry.coordinates;
        setSelectedLocation({ lat, lng });
        setLocationName(item.properties.display_name);
    };

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={false}
            width="80%"
            closable={false}
            className="custom-modal"
        >
            <Form labelWrap form={form} labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                <Card title={t("breakdown.map.title")}>
                    <Row gutter={8}>
                        <Col span={8}>
                            <Form.Item label={t("breakdown.map.fields.country")} labelAlign="left">
                                <span style={{ fontWeight: 600 }}>
                                    {breakdown?.assetMaintenance?.country?.name}
                                </span>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label={t("breakdown.map.fields.state")} labelAlign="left">
                                <span style={{ fontWeight: 600 }}>
                                    {breakdown?.assetMaintenance?.state?.name}
                                </span>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label={t("breakdown.map.fields.city")} labelAlign="left">
                                <span style={{ fontWeight: 600 }}>
                                    {breakdown?.assetMaintenance?.city?.name}
                                </span>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label={t("breakdown.map.fields.branch")} labelAlign="left">
                                <span style={{ fontWeight: 600 }}>
                                    {breakdown?.assetMaintenance?.branch?.name}
                                </span>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label={t("breakdown.map.fields.building")} labelAlign="left">
                                <span style={{ fontWeight: 600 }}>
                                    {breakdown?.assetMaintenance?.building?.buildingName}
                                </span>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label={t("breakdown.map.fields.floor")} labelAlign="left">
                                <span style={{ fontWeight: 600 }}>
                                    {breakdown?.assetMaintenance?.floor?.floorName}
                                </span>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label={t("breakdown.map.fields.department")} labelAlign="left">
                                <span style={{ fontWeight: 600 }}>
                                    {breakdown?.assetMaintenance?.department?.departmentName}
                                </span>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label={t("breakdown.map.fields.address")} labelAlign="left">
                                <span style={{ fontWeight: 600 }}>
                                    {breakdown?.assetMaintenance?.addressNote}
                                </span>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider />

                    <Row style={{ marginBottom: 12 }}>
                        <Select
                            showSearch
                            value={locationName}
                            placeholder={t("breakdown.map.search_placeholder")}
                            onSearch={(value) => setLocationName(value)}
                            onChange={(value, option) =>
                                handleSelectSuggestion(option.item)
                            }
                            filterOption={false}
                            notFoundContent={searching ? <Spin size="small" /> : null}
                            style={{ width: "100%" }}
                        >
                            {searchResults.map((item) => (
                                <Select.Option
                                    key={item.properties.place_id}
                                    value={item.properties.display_name}
                                    item={item}
                                >
                                    {item.properties.display_name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Row>

                    <MapContainer
                        center={selectedLocation}
                        zoom={15}
                        scrollWheelZoom={true}
                        style={{ width: "100%", height: "400px" }}
                    >
                        <TileLayer
                            url="https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}"
                            attribution="© Google Maps"
                        />
                        <PanToLocation lat={selectedLocation.lat} lng={selectedLocation.lng} />
                        <ResizeMapOnModalOpen open={open} />
                        <Marker position={selectedLocation} />
                    </MapContainer>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            padding: "16px 24px",
                        }}
                    >
                        <Button onClick={onCancel} style={{ fontWeight: 500 }}>
                            {t("breakdown.map.buttons.cancel")}
                        </Button>
                    </div>
                </Card>
            </Form>
        </Modal>
    );
}