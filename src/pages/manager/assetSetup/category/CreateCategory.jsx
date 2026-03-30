import { Button, Card, Col, Form, Input, Modal, Row } from "antd";
import React from "react";
import * as _unitOfWork from "../../../../api";
import { useTranslation } from "react-i18next";
import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";

export default function CreateCategory({
  open,
  handleOk,
  handleCancel,
  onRefresh,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onFinish = async () => {
    const values = await form.getFieldsValue();
    const response = await _unitOfWork.category.createCategory(values);
    if (response && response.code === 1) {
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
      destroyOnClose
      width={"40%"}
    >
      <Form
labelWrap
        form={form}
        onFinish={onFinish}
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
      >
        <Card title={t("category.form.create_title")}>
          <Row>
            <Col span={24}>
              <Form.Item
                name="categoryName"
                label={t("category.form.fields.name")}
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: t("category.form.validation.required_name"),
                  },
                ]}
              >
                <Input
                  placeholder={t("category.form.fields.name_placeholder")}
                />
              </Form.Item>
            </Col>
            <div className="modal-footer">
              <Button key="back" onClick={onCancel}>
                <CloseCircleOutlined /> {t("category.buttons.close")}
              </Button>
              <Button key="button" type="primary" htmlType="submit">
                <PlusCircleOutlined /> {t("category.buttons.create")}
              </Button>
            </div>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}
