import { Button, Card, Col, DatePicker, Form, Input, Modal, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import * as _unitOfWork from "../../../api";
import ShowSuccess from "../../../components/modal/result/successNotification";
import ShowError from "../../../components/modal/result/errorNotification";
import { PlusCircleFilled } from "@ant-design/icons";
import { assetMaintenanceStatus, FORMAT_DATE, priorityLevelStatus } from "../../../utils/constant";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

export default function UpdateBreakdown({
  open,
  handleCancel,
  onRefresh,
  subBreakdowns,
  breakdown,
  id,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [assetModelFailureTypes, setAssetModelFailureTypes] = useState([]);
  useEffect(() => {
    if (breakdown) {
      form.setFieldsValue({
        ...breakdown,
        breakdownDefect: breakdown?.breakdownDefect?.id || breakdown?.breakdownDefect?._id,
        incidentDeadline: breakdown?.incidentDeadline ? dayjs(breakdown?.incidentDeadline) : null,
      });
      fetchGetAssetModelFailureTypeByAssetModel();
    }
  }, [open, breakdown]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchGetAssetModelFailureTypeByAssetModel = async () => {
    let payload = {
      assetModel: breakdown?.assetMaintenance?.assetModel?.id || breakdown?.assetMaintenance?.assetModel?._id,
    };
    let res = await _unitOfWork.assetModelFailureType.getAllAssetModelFailureType(payload);
    if (res && res.code === 1) {
      setAssetModelFailureTypes(res.data);
    }
  }

  const onFinish = async () => {
    const values = await form.getFieldsValue();
    const formatedValues = {
      ...values,
      id: id,
    };
    const response = await _unitOfWork.breakdown.updateBreakdown({
      data: formatedValues,
    });
    if (response && response.code === 1) {
      handleCancel();
      form.resetFields();
      onRefresh();
      ShowSuccess("topRight", t("common.notifications"), t("breakdown.update.messages.update_success"));
    } else {
      ShowError("topRight", t("common.notifications"), t("breakdown.update.messages.update_error"));
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
      width={"80%"}
    >
      <Form
labelWrap
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Card title={t("breakdown.update.title")}>
          <Row gutter={32}>
            <Col span={12}>
              <Form.Item name="incidentDeadline" label={t("breakdown.update.fields.incident_deadline")} labelAlign="left">
                <DatePicker
                  placeholder={t("breakdown.update.fields.incident_deadline_placeholder")}
                  format={FORMAT_DATE}
                  style={{ width: "100%" }}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("breakdown.update.fields.asset_status")}
                name="assetMaintenanceStatus"
                labelAlign="left"
                rules={[
                  { required: true, message: t("breakdown.update.validation.asset_status_required") },
                ]}
              >
                <Select
                  placeholder={t("breakdown.update.fields.asset_status_placeholder")}
                  options={(assetMaintenanceStatus.Options || []).map((item) => ({
                    value: item.value,
                    label: t(item.label),
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("breakdown.update.fields.priority_level")}
                name="priorityLevel"
                labelAlign="left"
                rules={[
                  { required: true, message: t("breakdown.update.validation.priority_required") },
                ]}
              >
                <Select
                  placeholder={t("breakdown.update.fields.priority_level_placeholder")}
                  options={(priorityLevelStatus.Options || []).map((item) => ({
                    value: item.value,
                    label: t(item.label),
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("breakdown.update.fields.failure_type")}
                name="breakdownDefect"
                labelAlign="left"
              >
                <Select
                  placeholder={t("breakdown.update.fields.failure_type_placeholder")}
                  options={(assetModelFailureTypes || []).map(
                    (item) => ({
                      value: item.id,
                      label: item.name,
                    })
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("breakdown.update.fields.description")}
                name="defectDescription"
                labelAlign="left"
              >
                <Input.TextArea placeholder={t("breakdown.update.fields.description_placeholder")} />
              </Form.Item>
            </Col>
            <Col span={24} style={{ textAlign: "right" }}>
              <Button onClick={onCancel} style={{ marginRight: 8 }}>
                {t("breakdown.update.buttons.cancel")}
              </Button>
              <Button type="primary" htmlType="submit">
                <PlusCircleFilled />
                {t("breakdown.update.buttons.save")}
              </Button>
            </Col>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}