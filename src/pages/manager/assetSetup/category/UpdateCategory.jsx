import { Button, Card, Col, Form, Input, Modal, Row } from "antd";
import React, { useEffect } from "react";
import * as _unitOfWork from "../../../../api";
import { useTranslation } from "react-i18next";
import { CloseCircleOutlined, SaveOutlined } from "@ant-design/icons";

export default function UpdateCategory({
  open,
  handleOk,
  handleCancel,
  id,
  onRefresh,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && id) {
      fetchGetCategoryById();
    }
  }, [open, id]);

  const fetchGetCategoryById = async () => {
    const res = await _unitOfWork.category.getCategoryById({ id });
    if (res) {
      form.setFieldsValue({ ...res.category });
    }
  };

  const onFinish = async () => {
    const res = await _unitOfWork.category.updateCategory({
      category: {
        id,
        ...form.getFieldsValue(),
      },
    });
    if (res && res.code === 1) {
      onRefresh();
      handleCancel();
      form.resetFields();
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
        s
      >
        <Card title={t("category.form.update_title")}>
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
                <SaveOutlined /> {t("category.buttons.update")}
              </Button>
            </div>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}
