import { Modal, Form, Input, Select, Button, Row, Col, Card } from "antd";
import { useEffect, useState } from "react";
import * as _unitOfWork from "../../../api";
import ShowSuccess from "../../../components/modal/result/successNotification";
import ShowError from "../../../components/modal/result/errorNotification";
import { useTranslation } from "react-i18next";
import { filterOption } from "../../../helper/search-select-helper";

function UpdateStockLocation({
    open,
    onCancel,
    onSuccess,
    data,
}) {
    const [form] = Form.useForm();
    const { t } = useTranslation()
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);

    useEffect(() => {
        if (open) {
            fetchProvinces();

            if (data.province?.id) {
                fetchDistricts(data.province.id);
            }

            form.setFieldsValue({
                name: data.name,
                code: data.code,
                address: data.address,
                province: data.province?.id || null,
                district: data.commune?.id || null,
            });

        }
    }, [open, data]);

    const fetchProvinces = async () => {
        const res = await _unitOfWork.geography.getAllProvinces();
        if (res?.code === 1) setProvinces(res.data || []);
    };

    const fetchDistricts = async (provinceId) => {
        setDistricts([]);
        form.setFieldsValue({ district: null });
        const res = await _unitOfWork.geography.getAllCommunesByProvince({
            id: provinceId,
        });
        if (res?.code === 1) setDistricts(res.data || []);
    };

    const onFinish = async (values) => {
        const payload = {
            id: data.id,            
            ...values,
        };

        const res = await _unitOfWork.stockLocation.updateStockLocation(payload);
        if (res?.code === 1) {
            ShowSuccess("topRight", "Thông báo", "Update thông tin thành công");
            form.resetFields();
            onSuccess();
            onCancel();
        } else {
            ShowError("topRight", "Thông báo", "Update thông tin thất bại");
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            className="custom-modal"
            closable={true}
            footer={null}
            width={800}
        >
            <Form
labelWrap
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Card title={t("Cập nhập kho hàng")}>


                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Tên kho"
                                name="name"
                                rules={[{ required: true, message: "Bắt buộc nhập tên kho" }]}
                            >
                                <Input placeholder="Nhập tên kho" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="Mã kho" name="code">
                                <Input placeholder="Nhập mã kho" />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item label="Địa chỉ" name="address">
                                <Input placeholder="Nhập địa chỉ kho" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="Tỉnh/Thành phố" name="province">
                                <Select
                                    placeholder="Chọn tỉnh"
                                    allowClear
                                    onChange={fetchDistricts}
                                    options={provinces.map((p) => ({
                                        value: p.id,
                                        label: p.nameWithType,
                                    }))}
                                    showSearch
                                    filterOption={filterOption}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="Phường/Xã" name="district">
                                <Select
                                    placeholder="Chọn phường xã"
                                    allowClear
                                    options={districts.map((d) => ({
                                        value: d.id,
                                        label: d.nameWithType,
                                    }))}
                                    showSearch
                                    filterOption={filterOption}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item style={{ textAlign: "right" }}>
                        <Button onClick={onCancel} style={{ marginRight: 8 }}>
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Lưu
                        </Button>
                    </Form.Item>
                </Card>
            </Form>
        </Modal>
    );
}

export default UpdateStockLocation;