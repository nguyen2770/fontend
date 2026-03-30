import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button, Row, Col, Card } from "antd";
import {
  dropdownRender,
  filterOption,
} from "../../../../../helper/search-select-helper";
import {
  measuringTypeOptions,
  frequencyTypeOptions,
} from "../../../../../utils/constant";
import * as _unitOfWork from "../../../../../api";
import ShowSuccess from "../../../../../components/modal/result/successNotification";
import { useTranslation } from "react-i18next";

export default function UpdateMonitoringPoint({
  open,
  onCancel,
  uoms,
  onReset,
  assetModel,
  monitoringPointChange,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && monitoringPointChange) {
      form.setFieldsValue({
        ...monitoringPointChange,
        uomId: monitoringPointChange.uomId?.id,
      });
    }
  }, [open, monitoringPointChange]);

  const handleOk = async () => {
    const value = form.getFieldsValue();
    const res =
      await _unitOfWork.assetModelMonitoringPoint.updateAssetModelMonitoringPoint(
        {
          data: {
            id: monitoringPointChange.id,
            ...value,
            assetModel: assetModel.id,
          },
        }
      );
    if (res?.code === 1) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("assetModel.common.messages.update_success")
      );
      handleCancelLocal();
      onReset();
    }
  };

  const handleCancelLocal = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      open={open}
      className="custom-modal"
      onCancel={handleCancelLocal}
      closable={false}
      footer={null}
      width={"70%"}
      destroyOnClose
    >
      <Form
labelWrap
        form={form}
        layout="vertical"
        style={{ marginTop: 16 }}
        onFinish={handleOk}
      >
        <Card title={t("assetModel.monitoring_point.update_title")}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("assetModel.monitoring_point.fields.name")}
                name="name"
                rules={[
                  {
                    required: true,
                    message: t(
                      "assetModel.monitoring_point.validation.required_name"
                    ),
                  },
                ]}
              >
                <Input
                  placeholder={t(
                    "assetModel.monitoring_point.fields.name_placeholder"
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("assetModel.monitoring_point.fields.uom")}
                name="uomId"
                rules={[
                  {
                    required: true,
                    message: t(
                      "assetModel.monitoring_point.validation.required_uom"
                    ),
                  },
                ]}
              >
                <Select
                  allowClear
                  placeholder={t(
                    "assetModel.monitoring_point.fields.uom_placeholder"
                  )}
                  showSearch
                  options={uoms?.map((item) => ({
                    value: item.id,
                    label: item.uomName,
                  }))}
                  filterOption={filterOption}
                  dropdownStyle={dropdownRender}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t("assetModel.monitoring_point.fields.value")}
                name="duration"
              >
                <Input type="number" min={1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("assetModel.monitoring_point.fields.frequency_type")}
                name="frequencyType"
              >
                <Select
                  allowClear
                  placeholder={t(
                    "assetModel.monitoring_point.fields.frequency_type_placeholder"
                  )}
                  options={(frequencyTypeOptions || []).map((item) => ({
                    key: item.value,
                    value: item.value,
                    label: item.label,
                  }))}
                  filterOption={filterOption}
                  showSearch={true}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("assetModel.monitoring_point.fields.measuring_type")}
                name="measuringType"
              >
                <Select
                  allowClear
                  placeholder={t(
                    "assetModel.monitoring_point.fields.measuring_type_placeholder"
                  )}
                  options={(measuringTypeOptions.Option || []).map((item) => ({
                    key: item.value,
                    value: item.value,
                    label: item.label,
                  }))}
                  filterOption={filterOption}
                  showSearch={true}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <div className="modal-footer">
              <Button onClick={handleCancelLocal}>
                {t("assetModel.common.buttons.cancel")}
              </Button>
              <Button type="primary" htmlType="submit">
                {t("assetModel.common.buttons.update")}
              </Button>
            </div>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}
