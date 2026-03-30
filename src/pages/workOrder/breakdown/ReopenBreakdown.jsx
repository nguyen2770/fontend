import React from "react";
import { Modal, Row, Col, Button, Input, Form, message, Card } from "antd";
import { parseDateHH } from "../../../helper/date-helper";
import * as _unitOfWork from "../../../api";
import { assetType } from "../../../utils/constant";
import { useTranslation } from "react-i18next";
export default function ReopenBreakdown({
    open,
    onCancel,
    breakdown,
    onRefresh
}) {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    const onResetAndCancel = () => {
        form.resetFields();
        onCancel();
    }
    const handleFinish = async (values) => {
        const data = {
            breakdown: breakdown.id,
            reasonReopen: values.reasonReopen,
        };
        try {
            const res = await _unitOfWork.breakdown.comfirmReopenBreakdown({ data: data });
            if (res && res.code === 1) {
                onRefresh();
                onResetAndCancel();
                message.success(t("breakdown.reopen.messages.success"));
            }
        } catch (error) {
            console.error("Error reopening breakdown:", error);
        }
    };
    
    return (
        <Modal
            open={open}
            onCancel={onResetAndCancel}
            footer={null}
            width={"50%"}
            closable={false}
            className="custom-modal"
        >
            <Card title={t("breakdown.reopen.title")}>
                <div style={{ padding: 24 }}>
                    <Row gutter={[16, 16]}>
                        {[
                            { label: t("breakdown.reopen.fields.code"), value: breakdown?.code },
                            { label: t("breakdown.reopen.fields.opened_by"), value: breakdown?.createdBy?.fullName || "--" },
                            { label: t("breakdown.reopen.fields.manufacturer"), value: breakdown?.assetMaintenance?.assetModel?.supplier?.supplierName || "--" },
                            { label: t("breakdown.reopen.fields.supplier"), value: breakdown?.assetMaintenance?.assetModel?.manufacturer?.manufacturerName || "--" },
                            { label: t("breakdown.reopen.fields.serial"), value: breakdown?.assetMaintenance?.serial || "--" },
                            { label: t("breakdown.reopen.fields.opened_date"), value: breakdown?.createdAt ? parseDateHH(breakdown?.createdAt) : "--" },
                            { label: t("breakdown.reopen.fields.category"), value: breakdown?.assetMaintenance?.assetModel?.category?.categoryName || "--" },
                            { label: t("breakdown.reopen.fields.asset_name"), value: breakdown?.assetMaintenance?.assetModel?.asset?.assetName || "--" },
                            { label: t("breakdown.reopen.fields.deadline"), value: breakdown?.incidentDeadline ? parseDateHH(breakdown?.incidentDeadline) : "--" },
                            {
                                label: t("breakdown.reopen.fields.asset_style"),
                                value: t(assetType.Options.find(
                                    (item) => item.value === breakdown?.assetMaintenance?.assetStyle
                                )?.label || "--"),
                            },
                            { label: t("breakdown.reopen.fields.customer"), value: breakdown?.assetMaintenance?.assetModel?.customer?.customerName || "--" },
                        ].map((item, index) => (
                            <Col span={8} key={index}>
                                <div style={{ marginBottom: 8 }}>
                                    <b>{item.label}:</b>
                                    <br />
                                    <div
                                        style={{
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            maxWidth: "100%",
                                        }}
                                        title={item.value}
                                    >
                                        {item.value}
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>

                    <Form
labelWrap
                        form={form}
                        layout="vertical"
                        style={{ marginTop: 32 }}
                        onFinish={handleFinish}
                    >
                        <Form.Item
                            name="reasonReopen"
                            label={t("breakdown.reopen.fields.reason")}
                            rules={[{ required: true, message: t("breakdown.reopen.validation.reason_required") }]}
                        >
                            <Input.TextArea rows={2} placeholder={t("breakdown.reopen.fields.reason_placeholder")} />
                        </Form.Item>
                        <div style={{ textAlign: "right" }}>
                            <Button onClick={onResetAndCancel} style={{ marginRight: 8 }}>
                                {t("breakdown.reopen.buttons.cancel")}
                            </Button>
                            <Button type="primary" htmlType="submit" >
                                {t("breakdown.reopen.buttons.submit")}
                            </Button>
                        </div>
                    </Form>
                </div>
            </Card>
        </Modal>
    );
}