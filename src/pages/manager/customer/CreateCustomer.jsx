import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Row, Col, Select, Upload, Typography, Button, message, Card } from 'antd';
import { CloseCircleFilled, InboxOutlined, PlusCircleFilled } from '@ant-design/icons';
import FormItem from 'antd/es/form/FormItem';
import * as _unitOfWork from "../../../api";
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

const CreateCustomer = ({ open, handleCancel, onRefresh }) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [commune, setCommune] = useState();
    const [provinces, setProvinces] = useState([]);
    const [communes, setCommunes] = useState([]);
    const [taxGroup, setTaxGroup] = useState([]);

    useEffect(() => {
        if (open) {
            fetchAllProvince();
            fetchAllTaxGroup();
        }
    }, [open]);

    const onFinish = async () => {
        try {
            const values = await form.validateFields();
            const { Image, ...rest } = values;
            let addressTwo = null;

            if (!rest.address) {
                addressTwo = `${commune?.pathWithType || " "}`;
            }

            if (!commune) {
                addressTwo = `${rest.address || " "}`;
            }

            if (rest.address && commune) {
                addressTwo = `${rest.address || " "}, ${commune?.pathWithType || " "}`;
            }

            const res = await _unitOfWork.customer.createCustomer({
                ...rest,
                addressTwo,
            });

            if (res && res.code === 1) {
                message.success(t('customer.create.success_message'));
                onRefresh();
                form.resetFields();
                handleCancel();
            } else {
                message.error(res?.message || t('customer.messages.create_error', { defaultValue: 'Đã xảy ra lỗi khi tạo người dùng tài sản!' }));
            }
        } catch (error) {
            message.error(t('customer.messages.check_info', { defaultValue: 'Vui lòng kiểm tra lại thông tin!' }));
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

    const fetchAllTaxGroup = async () => {
        const res = await _unitOfWork.taxGroup.getTaxGroups();
        if (res?.data) {
            const options = res.data.map(item => ({
                label: item.name,
                value: item.id,
            }));
            setTaxGroup(options);
        }
    };

    return (
        <Modal
            open={open}
            onCancel={handleCancel}
            className="custom-modal"
            closable={true}
            footer={null}
            width={800}
        >
            <Form labelWrap form={form} layout="vertical" onFinish={onFinish}>
                <Card title={t('customer.create.title')}>
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
                                <Select placeholder={t('customer.form.placeholders.customer_tax_group')} options={taxGroup} />
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem name="customer_gst_number" label={t('customer.form.fields.customer_tax_code')}>
                                <Input placeholder={t('customer.form.placeholders.customer_tax_code')} maxLength={15} showCount />
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
                                        if (!isImage) {
                                            window?.message?.error(t('customer.validation.invalid_image_type', { defaultValue: "Chỉ được chọn file PNG, JPG, JPEG!" }));
                                        }
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
                                            onError(t('customer.messages.upload_error', { defaultValue:  t("common.messages.errors.failed") }));
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
                            <Button onClick={handleCancel}>
                                <CloseCircleFilled />
                                {t('customer.form.buttons.back')}
                            </Button>
                            <Button type="primary" htmlType="submit">
                                <PlusCircleFilled />
                                {t('customer.form.buttons.submit_create')}
                            </Button>
                        </div>
                    </Row>
                </Card>
            </Form>
        </Modal>
    );
};

export default CreateCustomer;
