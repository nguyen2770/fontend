import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Row, Col, Select, Upload, Typography, Button, message, Card } from 'antd';
import { CloseCircleFilled, InboxOutlined, PlusCircleFilled } from '@ant-design/icons';
import FormItem from 'antd/es/form/FormItem';
import * as _unitOfWork from "../../../api";
import MapModal from './MapModal';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

const UpdateCustomer = ({ open, id, handleCancel, onRefresh }) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [taxGroup, setTaxGroup] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [commune, setCommune] = useState();
    const [provinces, setProvinces] = useState([]);
    const [communes, setCommunes] = useState([]);
    const [mapModalVisible, setMapModalVisible] = useState(false);

    useEffect(() => {
        if (open && id) {
            fetchAllTaxGroup();
            fetchAllProvince();
            fetchCustomerById(id);
        }
    }, [open, id]);

    const onClose = () => {
        handleCancel();
        form.resetFields();
    };

    const fetchCustomerById = async (id) => {
        try {
            const res = await _unitOfWork.customer.getCustomerById({ id });
            if (res) {
                const data = res.customer;
                if (data.province) {
                    fetchAllCommunesByProvince(data.province);
                }
                form.setFieldsValue({
                    ...data
                });
                if (data.resourceId) {
                    setFileList([{
                        uid: data?.resourceId,
                        url: _unitOfWork.resource.getImage(data?.resourceId),
                        supportDocumentId: data?.resourceId,
                        name: data?.resourceId
                    }]);
                }
            }
        } catch (error) {
            message.error(t('customer.messages.load_detail_error', { defaultValue: 'Không thể tải thông tin người dùng tài sản!' }));
        }
    };

    const onFinish = async () => {
        try {
            const values = await form.validateFields();
            const { Image, ...rest } = values;
            let addressTwo;

            if (!rest.address) {
                addressTwo = `${commune?.pathWithType || " "}`;
            }

            if (!commune) {
                addressTwo = `${rest.address || " "}`;
            }

            if (rest.address && commune) {
                addressTwo = `${rest.address || " "}, ${commune?.pathWithType || " "}`;
            }

            const res = await _unitOfWork.customer.updateCustomer({
                id,
                ...rest,
                addressTwo,
            });

            if (res && res.code === 1) {
                message.success(t('customer.update.success_message'));
                onRefresh();
                form.resetFields();
                setFileList([]);
                handleCancel();
            } else {
                message.error(res?.message || t('customer.messages.update_error', { defaultValue: 'Đã xảy ra lỗi khi cập nhật người dùng tài sản!' }));
            }
        } catch (error) {
            message.error(t('customer.messages.check_info', { defaultValue: 'Vui lòng kiểm tra lại thông tin!' }));
        }
    };

    const fetchAllProvince = async () => {
        const res = await _unitOfWork.geography.getAllProvinces();
        if (res?.data) {
            const options = res.data.map(item => ({
                label: item.name,
                value: item.id,
                data: item
            }));
            setProvinces(options);
        }
    };

    const fetchAllCommunesByProvince = async (id) => {
        const res = await _unitOfWork.geography.getAllCommunesByProvince({ id });
        if (res?.data) {
            const options = res.data.map(item => ({
                label: item.name,
                value: item.id,
                data: item
            }));
            setCommunes(options);
        }
    };

    const fetchAllTaxGroup = async () => {
        const res = await _unitOfWork.taxGroup.getTaxGroups();
        if (res?.data) {
            setTaxGroup(res.data.map(item => ({ label: item.name, value: item.id })));
        }
    };

    const handleMapSelect = (location) => {
        form.setFieldsValue({
            addressOne: location.addressOne,
            latitude: location.latitude,
            longitude: location.longitude,
        });
        setMapModalVisible(false);
    };

    return (
        <Modal
            open={open}
            onCancel={() => { handleCancel(); form.resetFields(); setFileList([]); }}
            className="custom-modal"
            closable
            footer={null}
            width={800}
        >
            <Form labelWrap form={form} layout="vertical">
                <Card title={t('customer.update.title')}>
                    <FormItem
                        name="customerName"
                        label={t('customer.form.fields.customer_name')}
                        rules={[{ required: true, message: t('customer.validation.required_name', { defaultValue: 'Vui lòng nhập tên người dùng tài sản' }) }]}
                    >
                        <Input placeholder={t('customer.form.placeholders.customer_name')} />
                    </FormItem>

                    <Row gutter={16}>
                        <Col span={12}>
                            <FormItem name="contactEmail" label={t('customer.form.fields.customer_email')}>
                                <Input placeholder={t('customer.form.placeholders.customer_email')} type="email" />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem name="contactNumber" label={t('customer.form.fields.customer_phone_number')}>
                                <Input placeholder={t('customer.form.placeholders.customer_phone_number')} showCount />
                            </FormItem>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <FormItem name="taxGroupId" label={t('customer.form.fields.customer_tax_group')}>
                                <Select
                                    placeholder={t('customer.form.placeholders.customer_tax_group')}
                                    options={taxGroup}
                                />
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem name="customer_gst_number" label={t('customer.form.fields.customer_tax_code')}>
                                <Input
                                    placeholder={t('customer.form.placeholders.customer_tax_code')}
                                    maxLength={15}
                                    showCount
                                />
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem name="resourceId" hidden>
                                <Input />
                            </FormItem>
                            <FormItem name="Image" label={t('customer.form.fields.customer_avatar')}>
                                <Upload
                                    name="file"
                                    accept=".png,.jpg,.jpeg"
                                    listType="picture-card"
                                    maxCount={1}
                                    fileList={fileList}
                                    onChange={({ fileList: newList }) => setFileList(newList.slice(-1))}
                                    beforeUpload={(file) => {
                                        const isImage = ["image/png", "image/jpeg", "image/jpg"].includes(file.type);
                                        if (!isImage) message.error(t('customer.validation.invalid_image_type', { defaultValue: "Chỉ được chọn file PNG, JPG, JPEG!" }));
                                        return isImage || Upload.LIST_IGNORE;
                                    }}
                                    customRequest={async ({ file, onSuccess, onError }) => {
                                        try {
                                            const formData = new FormData();
                                            formData.append("file", file);
                                            const res = await _unitOfWork.resource.uploadImage(formData);
                                            if (res) {
                                                form.setFieldsValue({ resourceId: res.resourceId });
                                                setFileList([{ ...file, url: res.url }]);
                                                onSuccess(t('customer.messages.upload_success', { defaultValue: t("common.messages.success.successfully") }));
                                            } else {
                                                throw new Error("Upload failed");
                                            }
                                        } catch (err) {
                                            onError(t('customer.messages.upload_error', { defaultValue:  t("common.messages.errors.failed")}));
                                        }
                                    }}
                                >
                                    {fileList.length >= 1 ? null : (
                                        <div>
                                            <InboxOutlined style={{ fontSize: 24 }} />
                                        </div>
                                    )}
                                </Upload>
                            </FormItem>
                        </Col>
                    </Row>

                    <Title level={4}>{t('customer.form.fields.customer_address')}</Title>

                    <Row gutter={16}>
                        <Col span={24}>
                            <FormItem name="address" label={t('customer.form.fields.customer_address_detail')}>
                                <Input placeholder={t('customer.form.placeholders.customer_address_detail')} />
                            </FormItem>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <FormItem name="province" label={t('customer.form.fields.customer_province')}>
                                <Select
                                    placeholder={t('customer.form.placeholders.customer_province')}
                                    options={provinces}
                                    onChange={(value) => {
                                        form.setFieldsValue({ commune: null });
                                        setCommunes([]);
                                        fetchAllCommunesByProvince(value);
                                    }}
                                    showSearch
                                    optionFilterProp="label"
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().includes(input.toLowerCase())
                                    }
                                />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem name="commune" label={t('customer.form.fields.customer_ward')}>
                                <Select
                                    placeholder={t('customer.form.placeholders.customer_ward')}
                                    options={communes}
                                    onChange={(value) => {
                                        const selected = communes.find(p => p.value === value)?.data;
                                        setCommune(selected);
                                    }}
                                    showSearch
                                    optionFilterProp="label"
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().includes(input.toLowerCase())
                                    }
                                />
                            </FormItem>
                        </Col>
                    </Row>

                    <Row>
                        <div className="modal-footer">
                            <Button onClick={onClose}>
                                <CloseCircleFilled /> {t('customer.form.buttons.back')}
                            </Button>
                            <Button type="primary" onClick={onFinish}>
                                <PlusCircleFilled /> {t('customer.form.buttons.submit_update')}
                            </Button>
                        </div>
                    </Row>

                    <MapModal
                        visible={mapModalVisible}
                        onCancel={() => setMapModalVisible(false)}
                        onSelect={handleMapSelect}
                        lat={form.getFieldValue('latitude')}
                        lng={form.getFieldValue('longitude')}
                    />
                </Card>
            </Form>
        </Modal>
    );
};

export default UpdateCustomer;