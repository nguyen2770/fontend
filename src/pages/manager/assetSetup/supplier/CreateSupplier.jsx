import { Button, Card, Col, Form, Input, Modal, Row } from "antd";
import React from "react";
import * as _unitOfWork from "../../../../api";
import { useTranslation } from "react-i18next";
import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";

export default function CreateSupplier({
  open,
  handleOk,
  handleCancel,
  onRefresh,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onFinish = async () => {
    const values = await form.getFieldsValue();
    const res = await _unitOfWork.supplier.createSupplier(values);
    if (res && res.code === 1) {
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
      onOk={handleOk}
      closable={false}
      className="custom-modal"
      footer={false}
      width={"60%"}
      destroyOnClose
    >
      <Form
labelWrap
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Card title={t("supplier.form.create_title")}>
          <Row gutter={[16]}>
            <Col span={12}>
              <Form.Item
                name="supplierName"
                label={t("supplier.form.fields.supplier_name")}
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: t(
                      "supplier.form.validation.required_supplier_name"
                    ),
                  },
                ]}
              >
                <Input
                  placeholder={t(
                    "supplier.form.fields.supplier_name_placeholder"
                  )}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phoneNumber"
                label={t("supplier.form.fields.phone")}
                labelAlign="left"
                style={{ width: "100%" }}
              >
                <Input
                  placeholder={t("supplier.form.fields.phone_placeholder")}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="address"
                label={t("supplier.form.fields.address")}
                labelAlign="left"
              >
                <Input
                  placeholder={t("supplier.form.fields.address_placeholder")}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label={t("supplier.form.fields.email")}
                labelAlign="left"
              >
                <Input
                  placeholder={t("supplier.form.fields.email_placeholder")}
                />
              </Form.Item>
            </Col>
            <div className="modal-footer">
              <Button onClick={onCancel}>
                <CloseCircleOutlined />
                {t("supplier.buttons.close")}
              </Button>
              <Button type="primary" htmlType="submit">
                <PlusCircleOutlined />
                {t("supplier.buttons.create")}
              </Button>
            </div>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}
