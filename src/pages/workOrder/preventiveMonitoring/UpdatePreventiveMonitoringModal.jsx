import { Button, Card, Col, Form, Input, Modal, Row } from "antd";
import React, { useEffect, useState } from "react";
import * as _unitOfWork from "../../../api";
import { LeftCircleOutlined, PlusOutlined } from "@ant-design/icons";
import ShowSuccess from "../../../components/modal/result/successNotification";
import ShowError from "../../../components/modal/result/errorNotification";
import { useTranslation } from "react-i18next";

export default function UpdatePreventiveMonitoringModal({
  open,
  handleCancel,
  preventiveMonitoring,
  onRefresh,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onCancel = () => {
    handleCancel();
    form.resetFields();
  };

  const onFinish = async () => {
    const res =
      await _unitOfWork.preventiveMonitoring.updatePreventiveMonitoringById(
        preventiveMonitoring?._id,
        {
          meterValue: form.getFieldValue("meterValue"),
        }
      );
    if (res && res.code === 1) {
      onRefresh();
      handleCancel();
      form.resetFields();
      ShowSuccess(
        "topRight",
        t("asset.notifications.title"),
        t("asset.notifications.update_success")
      );
    } else {
      ShowError(
        "topRight",
        t("asset.notifications.title"),
        t("asset.notifications.update_error")
      );
    }
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
      >
        <Card title={t("preventiveMonitoring.title_enter_monitoring_data")}>
          <Row gutter={32}>
            <Col span={24}>
              <Form.Item
                name="meterValue"
                label={t("preventiveMonitoring.meter_value")}
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: t(
                      "preventiveMonitoring.placeholder.enter_meter_value"
                    ),
                  },
                ]}
              >
                <Input
                  placeholder={t(
                    "preventiveMonitoring.placeholder.enter_meter_value"
                  )}
                />
              </Form.Item>
            </Col>
            <div className="modal-footer">
              <Button onClick={onCancel}>
                <LeftCircleOutlined />
                {t("asset.buttons.close")}
              </Button>
              <Button type="primary" htmlType="submit">
                <PlusOutlined />
                {t("asset.buttons.update")}
              </Button>
            </div>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}
