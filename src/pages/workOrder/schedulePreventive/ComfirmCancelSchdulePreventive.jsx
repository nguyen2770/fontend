import { CheckSquareFilled } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Modal, Row } from "antd";
import React, { useEffect } from "react";
import * as _unitOfWork from "../../../api";
import ShowSuccess from "../../../components/modal/result/successNotification";
import { schedulePreventiveStatus } from "../../../utils/constant";
import { parseToLabel } from "../../../helper/parse-helper";
import { parseDateHH } from "../../../helper/date-helper";
import { useTranslation } from "react-i18next";

export default function ComfirmCancelSchdulePreventive({
    open,
    schedulePreventive,
    onCancel,
    onRefresh
}) {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            ...schedulePreventive,
            preventiveName: schedulePreventive?.preventive?.preventiveName,
            startDate: parseDateHH(schedulePreventive?.startDate),
            status: t(parseToLabel(schedulePreventiveStatus.Options, schedulePreventive?.status)),
            model: schedulePreventive?.preventive?.assetMaintenance?.assetModel?.assetModelName,
            customerName: schedulePreventive?.preventive?.assetMaintenance?.customer?.customerName,
        })
        fetchGetBreakAssignUsers();
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchGetBreakAssignUsers = async () => { };

    const onFinish = async () => {
        let payload = {
            id: schedulePreventive?._id,
            comment: form.getFieldValue("comment"),
        }
        try {
            const res = await _unitOfWork.schedulePreventive.comfirmCancelSchedulePreventive(payload);
            if (res?.data) {
                ShowSuccess("topRight", t("common.notifications"), t("preventiveSchedule.messages.cancel_success"));
                onCancel();
                onRefresh();
            }
        } catch (error) {
            ShowSuccess("topRight", t("common.notifications"), t("preventiveSchedule.messages.cancel_error"));
        }
    };

    return (
        <Modal
            open={open}
            footer={null}
            width={"70%"}
            destroyOnClose
            closable={false}
            className="custom-modal"
        >
            <Card title={t("preventiveSchedule.modal.cancel_title")} bordered={false}>
                <Form labelWrap form={form} onFinish={onFinish} labelCol={{
                    span: 8,
                }}
                    wrapperCol={{
                        span: 16,
                    }}>
                    <Row gutter={32}>
                        <Col span={8}>
                            <Form.Item label={t("preventiveSchedule.fields.plan_code")} name="code" labelAlign="left">
                                <Input disabled value={schedulePreventive?.code} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label={t("preventiveSchedule.fields.plan_name")} name="preventiveName" labelAlign="left">
                                <Input disabled value={schedulePreventive?.preventive?.preventiveName} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label={t("preventiveSchedule.fields.start_date")} name="startDate" labelAlign="left">
                                <Input disabled value={parseDateHH(schedulePreventive?.startDate)} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label={t("preventiveSchedule.fields.status")} name="status" labelAlign="left">
                                <Input disabled value={t(parseToLabel(schedulePreventiveStatus.Options, schedulePreventive?.status))} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Model" name="model" labelAlign="left">
                                <Input disabled value={schedulePreventive?.preventive?.assetMaintenance?.assetModel?.assetModelName} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label={t("preventiveSchedule.fields.customer_name")} name="customerName" labelAlign="left">
                                <Input disabled value={schedulePreventive?.preventive?.assetMaintenance?.customer?.customerName} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={32} className="mt-3">
                        <Col span={24} className="pl-5 pr-5">
                            <Form.Item
                                name="comment"
                                label=''
                                rules={[{ required: true, message: t("preventiveSchedule.validation.reason_required") }]}
                                labelAlign="left"
                                labelCol={{ span: 0 }}
                                wrapperCol={{ span: 24 }}
                            >
                                <Input.TextArea autoSize={{ minRows: 5, maxRows: 6 }} placeholder={t("preventiveSchedule.fields.reason")} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify="end" gutter={8}>
                        <Col>
                            <Button onClick={onCancel}>{t("preventiveSchedule.buttons.cancel")}</Button>
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                icon={<CheckSquareFilled />}
                                htmlType="submit"
                            >
                                {t("preventiveSchedule.buttons.confirm_cancel")}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </Modal>
    );
}