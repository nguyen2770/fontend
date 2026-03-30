import { Button, Card, Col, Form, Input, message, Modal, Row } from "antd";
import React, { useEffect } from "react";
import Confirm from "../../../../components/modal/Confirm";
import * as _unitOfWork from "../../../../api";
import { useTranslation } from "react-i18next";

export default function UpdateBuilding({
    open,
    handleOk,
    handleCancel,
    id,
    onRefresh,
}) {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    useEffect(() => {
        if (open && id) {
            fetchGetBuildingById();
        }
    }, [open, id]);

    const fetchGetBuildingById = async () => {
        const res = await _unitOfWork.building.getBuildingById({
            id: id,
        });
        if (res) {
            form.setFieldsValue({ ...res.Building });
        }
    };

    const onFinish = async () => {
        const response = await _unitOfWork.building.updateBuilding({
            Building: {
                id: id,
                ...form.getFieldsValue(),
            },
        });
        if (response && response.code === 1) {
            message.success(t("building.update.success_message"));
            handleCancel();
            form.resetFields();
            onRefresh();
        } else {
            message.error(t("building.messages.update_error"));
        }
    };

    const onCancel = () => {
        handleCancel();
        form.resetFields();
    };

    return (
        <Modal
            open={open}
            onOk={handleOk}
            closable={false}
            className="custom-modal"
            footer={false}
        >
            <Form labelWrap form={form} onFinish={() => onFinish()}>
                <Card title={t("building.update.title")}>
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                name="buildingName"
                                labelAlign="left"
                                rules={[
                                    {
                                        required: true,
                                        message: t("building.validation.required_name"),
                                    },
                                ]}
                            >
                                <Input
                                    placeholder={t(
                                        "building.form.placeholders.building_name"
                                    )}
                                />
                            </Form.Item>
                        </Col>
                        <div className="modal-footer">
                            <Button key="back" onClick={onCancel}>
                                {t("building.form.buttons.back")}
                            </Button>
                            <Button
                                key="button"
                                type="primary"
                                onClick={() =>
                                    Confirm(
                                        t("building.messages.confirm_update"),
                                        () => onFinish()
                                    )
                                }
                            >
                                {t("building.form.buttons.submit_update")}
                            </Button>
                        </div>
                    </Row>
                </Card>
            </Form>
        </Modal>
    );
}