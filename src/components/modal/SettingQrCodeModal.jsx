import { Button, Card, Col, Form, Input, Modal, Row } from "antd";
import React from "react";
import Confirm from "../../components/modal/Confirm";
import * as _unitOfWork from "../../api";
import { useTranslation } from "react-i18next";

export default function SettingQrCodeModal({ open, handleOk, handleCancel, onRefresh }) {
    const { t } = useTranslation();
    const [formSetting] = Form.useForm();

    const onFinish = async () => {
        // API logic commented out (unchanged)
    };
    return (
        <Modal
            open={open}
            onOk={handleOk}
            closable={false}
            className="custom-modal"
            footer={false}
        >
            <Form labelWrap form={formSetting} onFinish={() => onFinish()} disabled={false}>
                <Card title={t("modal.qrCodeSetting.title")}>
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                id=""
                                name="name"
                                labelAlign="left"
                                label={t("modal.qrCodeSetting.field_name")}
                                rules={[
                                    {
                                        required: true,
                                        message: t("modal.qrCodeSetting.validation_required"),
                                    },
                                ]}
                            >
                                <Input placeholder={t("modal.qrCodeSetting.placeholder_name")} />
                            </Form.Item>
                        </Col>
                        <div className="modal-footer">
                            <Button key="back" onClick={handleCancel}>
                                {t("modal.common.buttons.exit")}
                            </Button>
                            <Button
                                key="button"
                                type="primary"
                                onClick={() => Confirm(t("modal.qrCodeSetting.confirm_add"), () => onFinish())}
                            >
                                {t("modal.common.buttons.update")}
                            </Button>
                        </div>
                    </Row>
                </Card>
            </Form>
        </Modal>
    );
}