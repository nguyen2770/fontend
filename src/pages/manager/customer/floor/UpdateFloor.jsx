import { Button, Card, Col, Form, Input, message, Modal, Row } from "antd";
import React, { useEffect } from "react";
import Confirm from "../../../../components/modal/Confirm";
import * as _unitOfWork from "../../../../api";
import { useTranslation } from "react-i18next";

export default function UpdateFloor({
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
            fetchGetFloorById();
        }
    }, [open, id]);

    const fetchGetFloorById = async () => {
        const res = await _unitOfWork.floor.getFloorById({
            id: id,
        });
        if (res) {
            form.setFieldsValue({ ...res.Floor });
        }
    };

    const onFinish = async () => {
        const response = await _unitOfWork.floor.updateFloor({
            Floor: {
                id: id,
                ...form.getFieldsValue(),
            },
        });
        if (response && response.code === 1) {
            message.success(t("floor.update.success_message"));
            handleCancel();
            form.resetFields();
            onRefresh();
        } else {
            message.error(t("floor.messages.update_error"));
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
                <Card title={t("floor.update.title")}>
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                name="floorName"
                                labelAlign="left"
                                rules={[
                                    {
                                        required: true,
                                        message: t("floor.validation.required_name"),
                                    },
                                ]}
                            >
                                <Input
                                    placeholder={t(
                                        "floor.form.placeholders.floor_name"
                                    )}
                                />
                            </Form.Item>
                        </Col>
                        <div className="modal-footer">
                            <Button key="back" onClick={onCancel}>
                                {t("floor.form.buttons.back")}
                            </Button>
                            <Button
                                key="button"
                                type="primary"
                                onClick={() =>
                                    Confirm(
                                        t("floor.messages.confirm_update"),
                                        () => onFinish()
                                    )
                                }
                            >
                                {t("floor.form.buttons.submit_update")}
                            </Button>
                        </div>
                    </Row>
                </Card>
            </Form>
        </Modal>
    );
}