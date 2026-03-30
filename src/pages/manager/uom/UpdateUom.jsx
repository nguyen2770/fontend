import { Button, Card, Col, Form, Input, Modal, Row } from "antd";
import React, { useEffect } from "react";
import Confirm from "../../../components/modal/Confirm";
import * as _unitOfWork from "../../../api";
import { useTranslation } from "react-i18next";

export default function UpdateUom({ open, handleOk, handleCancel, uom, onRefresh }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    if (uom) {
      form.setFieldsValue({ ...uom });
    }
  }, [uom, form]);

  const onFinish = async () => {
    const res = await _unitOfWork.uom.updateUom({
      id: uom.id,
      ...form.getFieldsValue(),
    });
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
      <Form labelWrap form={form} onFinish={() => onFinish()}>
        <Card title={t("uom.update.title")}>
          <Row>
            {/* Nếu bật lại mã: 
            <Col span={24}>
              <Form.Item
                name="name"
                label={t("uom.form.fields.uom_code")}
                labelAlign="left"
                rules={[{ required: true, message: t("uom.validation.required_code") }]}
              >
                <Input placeholder={t("uom.form.placeholders.uom_code")} />
              </Form.Item>
            </Col>
            */}
            <Col span={24}>
              <Form.Item
                id="uomName"
                name="uomName"
                label={t("uom.form.fields.uom_name")}
                labelAlign="left"
                rules={[
                  { required: true, message: t("uom.validation.required_name") },
                ]}
              >
                <Input placeholder={t("uom.form.placeholders.uom_name")} />
              </Form.Item>
            </Col>
            <div className="modal-footer">
              <Button key="back" onClick={handleCancel}>
                {t("uom.form.buttons.back")}
              </Button>
              <Button
                key="button"
                type="primary"
                onClick={() =>
                  Confirm(t("uom.messages.confirm_update"), () => onFinish())
                }
              >
                {t("uom.form.buttons.submit_update")}
              </Button>
            </div>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}