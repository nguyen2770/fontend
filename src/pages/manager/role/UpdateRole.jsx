import { Button, Card, Col, Form, Input, Modal, Row } from "antd";
import React, { useEffect } from "react";
import Confirm from "../../../components/modal/Confirm";
import * as _unitOfWork from "../../../api";
import { useTranslation } from "react-i18next";

export default function UpdateRole({ open, handleOk, handleCancel, role, onRefresh }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    if (role) {
      form.setFieldsValue({ ...role });
    }
  }, [role, form]);

  const onFinish = async () => {
    const res = await _unitOfWork.role.updateRole(role.id, form.getFieldsValue());
    if (res && res.code === 1) {
      onRefresh();
      handleCancel();
      form.resetFields();
    }
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
        <Card title={t("roles.update.title")}>
          <Row>
            <Col span={24}>
              <Form.Item
                name="name"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: t("roles.update.validation.name_required"),
                  },
                ]}
              >
                <Input placeholder={t("roles.update.placeholder.name")} />
              </Form.Item>
            </Col>
            <div className="modal-footer">
              <Button key="back" onClick={handleCancel}>
                {t("roles.update.buttons.cancel")}
              </Button>
              <Button
                key="button"
                type="primary"
                onClick={() =>
                  Confirm(t("roles.update.confirm.update"), () => onFinish())
                }
              >
                {t("roles.update.buttons.submit")}
              </Button>
            </div>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}