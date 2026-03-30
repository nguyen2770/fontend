import { Button, Card, Col, Form, Input, Modal, Row } from "antd";
import React, { useEffect } from "react";
import * as _unitOfWork from "../../../../../api";
import { useTranslation } from "react-i18next";

export default function UpdateAssetModelParameter({
  open,
  handleOk,
  handleCancel,
  onRefresh,
  assetModel,
  assetModelParameterChange
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    if (assetModelParameterChange) {
      form.setFieldsValue({ ...assetModelParameterChange });
    }
  }, [assetModelParameterChange]);

  const onFinish = async () => {
    const values = form.getFieldsValue();
    const payload = { ...values, assetModel: assetModel.id };
    const res =
      await _unitOfWork.assetModelParameter.updateAssetModelParameter(
        assetModelParameterChange.id,
        payload
      );
    if (res?.code === 1) {
      handleCancel();
      form.resetFields();
      onRefresh();
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
      footer={false}
      className="custom-modal"
      destroyOnClose
    >
      <Form labelWrap form={form} onFinish={onFinish} layout="vertical">
        <Card title={t("assetModel.parameter.update_title")}>
          <Row>
            <Col span={24}>
              <Form.Item
                name="name"
                label={t("assetModel.parameter.fields.name")}
                rules={[
                  {
                    required: true,
                    message: t(
                      "assetModel.parameter.validation.required_name"
                    )
                  }
                ]}
              >
                <Input
                  placeholder={t(
                    "assetModel.parameter.fields.name_placeholder"
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="value"
                label={t("assetModel.parameter.fields.value")}
                rules={[
                  {
                    required: true,
                    message: t(
                      "assetModel.parameter.validation.required_value"
                    )
                  }
                ]}
              >
                <Input
                  placeholder={t(
                    "assetModel.parameter.fields.value_placeholder"
                  )}
                />
              </Form.Item>
            </Col>
            <div className="modal-footer">
              <Button onClick={onCancel}>
                {t("assetModel.common.buttons.close")}
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