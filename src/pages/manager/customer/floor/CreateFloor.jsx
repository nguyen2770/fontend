import { Button, Card, Col, Form, Input, message, Modal, Row } from "antd";
import React from "react";
import * as _unitOfWork from "../../../../api";
import { useTranslation } from "react-i18next";

export default function CreateFloor({
  open,
  handleOk,
  handleCancel,
  onRefresh,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onFinish = async () => {
    const values = await form.getFieldsValue();
    const response = await _unitOfWork.floor.createFloor(values);
    if (response && response.code === 1) {
      message.success(t("floor.create.success_message"));
      handleCancel();
      form.resetFields();
      onRefresh();
    } else {
      message.error(t("floor.messages.create_error"));
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
      <Form labelWrap form={form} onFinish={onFinish}>
        <Card title={t("floor.create.title")}>
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
                  placeholder={t("floor.form.placeholders.floor_name")}
                />
              </Form.Item>
            </Col>
            <div className="modal-footer">
              <Button key="back" onClick={onCancel}>
                {t("floor.form.buttons.back")}
              </Button>
              <Button key="button" type="primary" htmlType="submit">
                {t("floor.form.buttons.submit_create")}
              </Button>
            </div>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}