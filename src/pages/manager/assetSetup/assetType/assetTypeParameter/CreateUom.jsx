import { Button, Card, Col, Form, Input, Modal, Row } from "antd";
import * as _unitOfWork from "../../../../../api";
import React from "react";
import { useTranslation } from "react-i18next";

export default function CreateUom({
    open,
    handleOk,
    handleCancel
}) {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const onFinish = async () => {
        const values = await form.getFieldsValue();
        const response = await _unitOfWork.uom.createUom(values);
        if (response && response.code === 1) {
            handleOk();
            form.resetFields();
        }
    };
    const onCancel = () => {
        handleCancel();
        form.resetFields();
    };

    return (
        <Modal
            open={open}
            closable={false}
            className="custom-modal"
            footer={false}
            width={"40%"}
            destroyOnClose
        >
            <Form
labelWrap
                form={form}
                onFinish={onFinish}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                layout="vertical"
            >
                <Card title={t("assetType.uom.create_title")}>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="uomName"
                                label={t("assetType.uom.fields.name")}
                                labelAlign="left"
                                rules={[
                                    {
                                        required: true,
                                        message: t("assetType.uom.validation.required_name")
                                    }
                                ]}
                            >
                                <Input
                                    placeholder={t(
                                        "assetType.uom.fields.name_placeholder"
                                    )}
                                />
                            </Form.Item>
                        </Col>
                        <div className="modal-footer">
                            <Button onClick={onCancel}>
                                {t("assetType.uom.buttons.close")}
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {t("assetType.uom.buttons.create")}
                            </Button>
                        </div>
                    </Row>
                </Card>
            </Form>
        </Modal>
    );
}