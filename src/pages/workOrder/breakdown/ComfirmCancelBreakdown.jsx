import React from "react";
import { Modal, Row, Col, Button, Input, Form, Card } from "antd";
import { assetType, priorityLevelStatus } from "../../../utils/constant";
import { parseDateHH } from "../../../helper/date-helper";
import * as _unitOfWork from "../../../api";
import ShowSuccess from "../../../components/modal/result/successNotification";
import ShowError from "../../../components/modal/result/errorNotification";
import { parseToLabel } from "../../../helper/parse-helper";
import { useTranslation } from "react-i18next";
export default function ComfirmCancelBreakdown({
    open,
    onCancel,
    breakdown,
    onRefresh,
}) {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    const handleFinish = async () => {
        const values = form.getFieldsValue();
        let res = await _unitOfWork.breakdown.comfirmCancelBreakdown({
            data: {
                breakdown: breakdown.id || breakdown._id,
                reasonCancel: values.reasonCancel,
            }
        })
        if (res && res.code === 1) {
            form.resetFields();
            onCancel();
            onRefresh();
            ShowSuccess("topRight", t("common.notifications"), t("breakdown.cancel.messages.cancel_success"));
        } else {
            ShowError("topRight", t("common.notifications"), t("breakdown.cancel.messages.cancel_error"));
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            width={800}
            closable={false}
            className="custom-modal"
        >
            <Card title={t("breakdown.cancel.title")}>
                <div style={{ padding: 24 }}>
                    <Row gutter={[32, 32]} className="mb-3">
                        <Col span={8}>
                            <b>{t("breakdown.cancel.fields.id")} :</b>
                            <div>{breakdown?.code || "--"}</div>
                        </Col>
                        <Col span={8}>
                            <b>{t("breakdown.cancel.fields.opened_by")} :</b>
                            <div>{breakdown?.createdBy?.fullName || "--"}</div>
                        </Col>
                        <Col span={8}>
                            <b>{t("breakdown.cancel.fields.opened_date")} :</b>
                            <div>{parseDateHH(breakdown?.createdAt) || "--"}</div>
                        </Col>
                    </Row>
                    <Row gutter={[32, 32]} className="mb-3">
                        <Col span={8}>
                            <b>{t("breakdown.cancel.fields.manufacturer")} :</b>
                            <div>{breakdown?.assetMaintenance?.assetModel?.manufacturer?.manufacturerName || "--"}</div>
                        </Col>
                        <Col span={8}>
                            <b>{t("breakdown.cancel.fields.category")} :</b>
                            <div>{breakdown?.assetMaintenance?.assetModel?.category?.categoryName || "--"}</div>
                        </Col>
                        <Col span={8}>
                            <b>{t("breakdown.cancel.fields.device_type")} :</b>
                            <div>{breakdown?.assetMaintenance?.assetModel?.assetTypeCategory?.name || "--"}</div>
                        </Col>
                    </Row>
                    <Row gutter={[32, 32]} className="mb-3">
                        <Col span={8}>
                            <b>{t("breakdown.cancel.fields.asset_style")} :</b>
                            <div style={{ color: "#888" }}>
                                {t(assetType.Options.find(
                                    (item) => item.value === breakdown?.assetMaintenance?.assetStyle
                                )?.label || "--")}
                            </div>
                        </Col>
                        <Col span={8}>
                            <b>{t("breakdown.cancel.fields.asset_name")} :</b>
                            <div>{breakdown?.assetMaintenance?.assetModel?.asset?.assetName || "--"}</div>
                        </Col>
                        <Col span={8}>
                            <b>{t("breakdown.cancel.fields.model")} :</b>
                            <div>{breakdown?.assetMaintenance?.assetModel?.assetModelName || "--"}</div>
                        </Col>
                    </Row>
                    <Row gutter={[32, 8]}>
                        <Col span={8}>
                            <b>{t("breakdown.cancel.fields.serial")} :</b>
                            <div>{breakdown?.assetMaintenance?.serial || "--"}</div>
                        </Col>
                        <Col span={8}>
                            <b>{t("breakdown.cancel.fields.priority")}:</b>
                            <div>{t(parseToLabel(priorityLevelStatus.Options, breakdown?.priorityLevel)) || "--"}</div></Col>
                        <Col span={8}></Col>
                    </Row>
                    <Form
labelWrap
                        form={form}
                        layout="vertical"
                        style={{ marginTop: 32 }}
                        onFinish={handleFinish}
                    >
                        <Form.Item
                            name="reasonCancel"
                            label={t("breakdown.cancel.fields.reason")}
                            rules={[{ required: true, message: t("breakdown.cancel.validation.reason_required") }]}
                        >
                            <Input.TextArea rows={2} placeholder={t("breakdown.cancel.placeholders.reason")} />
                        </Form.Item>
                        <div style={{ textAlign: "right" }}>
                            <Button onClick={onCancel} style={{ marginRight: 8 }}>
                                {t("breakdown.cancel.buttons.cancel")}
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {t("breakdown.cancel.buttons.submit")}
                            </Button>
                        </div>
                    </Form>
                </div>
            </Card>
        </Modal>
    );
}