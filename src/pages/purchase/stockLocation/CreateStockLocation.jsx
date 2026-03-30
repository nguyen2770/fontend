import { Modal, Form, Input, Select, Button, Row, Col, Card } from "antd";
import { useEffect, useState } from "react";
import * as _unitOfWork from "../../../api";
import ShowSuccess from "../../../components/modal/result/successNotification";
import ShowError from "../../../components/modal/result/errorNotification";
import { useTranslation } from "react-i18next";
import { filterOption } from "../../../helper/search-select-helper";

export default function CreateStockLocationModal({ open, onCancel, onSuccess }) {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [provinces, setProvinces] = useState([]);
    const [communes, setCommunes] = useState([]);

    useEffect(() => {
        if (open) {
            fetchProvinces();
        }
    }, [open]);

    const fetchProvinces = async () => {
        const res = await _unitOfWork.geography.getAllProvinces();
        if (res?.code === 1) setProvinces(res.data || []);
    };

    const fetchDistricts = async (provinceId) => {
        setCommunes([]);
        form.setFieldsValue({ district: null });
        const res = await _unitOfWork.geography.getAllCommunesByProvince({
            id: provinceId,
        });
        if (res?.code === 1) setCommunes(res.data || []);
    };

    const onFinish = async (values) => {
        const res = await _unitOfWork.stockLocation.createStockLocation(values);
        if (res?.code === 1) {
            ShowSuccess("topRight", "Thông báo", "Tạo kho thành công");
            form.resetFields();
            onSuccess();
            onCancel();
        } else {
            ShowError("topRight", "Thông báo", "Tạo kho thất bại");
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            closable={false}
            className="custom-modal"
            width={800}
        >
            <Form labelWrap form={form} layout="vertical" onFinish={onFinish}>
                <Card title={t("Thêm mới kho hàng")}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Tên kho"
                                name="name"
                                rules={[{ required: true, message: "Bắt buộc nhập tên kho" }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="Mã kho" name="code">
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item label="Địa chỉ" name="address">
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="Tỉnh/Thành phố" name="province">
                                <Select
                                    allowClear
                                    showSearch
                                    onChange={fetchDistricts}
                                    filterOption={filterOption}
                                    options={provinces.map(p => ({
                                        value: p.id,
                                        label: p.nameWithType,
                                    }))}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="Phường/Xã" name="commune">
                                <Select
                                    allowClear
                                    showSearch
                                    filterOption={filterOption}
                                    options={communes.map(d => ({
                                        value: d.id,
                                        label: d.nameWithType,
                                    }))}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item style={{ textAlign: "right" }}>
                        <Button onClick={onCancel}>Hủy</Button>
                        <Button type="primary" htmlType="submit" className="ml-2">
                            Lưu
                        </Button>
                    </Form.Item>
                </Card>
            </Form>
        </Modal>
    );
}
