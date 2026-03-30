import { Button, Card, Col, Form, Input, Modal, Row } from "antd";
import React from "react";
import Confirm from "../../../components/modal/Confirm";
import * as _unitOfWork from "../../../api";
import { useTranslation } from "react-i18next";

export default function CreateRole({ open, handleOk, handleCancel, onRefresh }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onFinish = async () => {
    const values = await form.getFieldValue();
    const res = await _unitOfWork.role.createRole(values);
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
        <Card title={t("roles.create.title")}>
          <Row>
            <Col span={24}>
              <Form.Item
                name="name"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: t("roles.create.validation.name_required"),
                  },
                ]}
              >
                <Input placeholder={t("roles.create.placeholder.name")} />
              </Form.Item>
            </Col>
            <div className="modal-footer">
              <Button key="back" onClick={handleCancel}>
                {t("roles.create.buttons.cancel")}
              </Button>
              <Button
                key="button"
                type="primary"
                onClick={() =>
                  Confirm(t("roles.create.confirm.create"), () => onFinish())
                }
              >
                {t("roles.create.buttons.submit")}
              </Button>
            </div>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}