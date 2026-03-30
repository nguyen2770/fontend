import { Button, Card, Col, Form, Input, Modal, Row } from "antd";
import { useEffect } from "react";
import * as _unitOfWork from "../../../../api";
import { useTranslation } from "react-i18next";
import { CloseCircleOutlined, SaveOutlined } from "@ant-design/icons";

export default function UpdateSupplier({
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
      fetchGetSupplierById();
    }
  }, [open, id]);

  const fetchGetSupplierById = async () => {
    const res = await _unitOfWork.supplier.getSupplierById({ id });
    if (res) {
      form.setFieldsValue({ ...res.Supplier });
    }
  };

  const onFinish = async () => {
    const res = await _unitOfWork.supplier.updateSupplier({
      Supplier: {
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
        <Card title={t("supplier.form.update_title")}>
          <Row gutter={16}>
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
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phoneNumber"
                label={t("supplier.form.fields.phone")}
                labelAlign="left"
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
                {" "}
                <CloseCircleOutlined />
                {t("supplier.buttons.close")}
              </Button>
              <Button type="primary" htmlType="submit">
                <SaveOutlined /> {t("supplier.buttons.update")}
              </Button>
            </div>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}
