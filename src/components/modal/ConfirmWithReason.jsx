import React from "react";
import { Modal, Form, Input } from "antd";
import { useTranslation } from "react-i18next";

const { TextArea } = Input;

const ConfirmWithReasonModal = ({ visible, onConfirm, onCancel }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onConfirm(values.reason);
      form.resetFields();
    } catch {
      // validation error
    }
  };

  const handleCancel = () => {
    onCancel();
    form.resetFields();
  };

  return (
    <Modal
      title={t("modal.confirmWithReason.title")}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={t("modal.confirmWithReason.ok")}
      cancelText={t("modal.confirmWithReason.cancel")}
    >
      <Form labelWrap form={form} layout="vertical">
        <Form.Item
          label={t("modal.confirmWithReason.label")}
            name="reason"
          rules={[{ required: true, message: t("modal.confirmWithReason.validation") }]}
        >
          <TextArea rows={4} placeholder={t("modal.confirmWithReason.placeholder")} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ConfirmWithReasonModal;