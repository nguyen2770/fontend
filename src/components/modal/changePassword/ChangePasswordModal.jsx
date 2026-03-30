import React from "react";
import { Input, Form, Modal, Button } from "antd";
import * as _unitOfWork from "../../../api";
import Confirm from "../Confirm";
import { useTranslation } from "react-i18next";

function ChangePasswordModal({ isModalOpen, onCallback, onCancel }) {
  const { t } = useTranslation();
  const [formAuth] = Form.useForm();

  const onFinishFormAuth = async () => {
    await formAuth.validateFields();
    let payload = {
      ...formAuth.getFieldsValue(),
    };
    let res = await _unitOfWork.auth.changePassword(payload);
    if (res && res.code === 1) {
      onCallback();
      formAuth.resetFields();
    }
  };
  const handleCancel = () => {
    onCancel();
    formAuth.resetFields();
  };

  return (
    <Modal
      title={t("modal.changePassword.title")}
      centered
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          {t("modal.changePassword.buttons.cancel")}
        </Button>,
        <Button
          key="button"
          type="primary"
          onClick={() =>
            Confirm(t("modal.changePassword.confirm"), () => onFinishFormAuth())
          }
        >
          {t("modal.changePassword.buttons.ok")}
        </Button>,
      ]}
    >
      <Form
labelWrap
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        form={formAuth}
        onFinish={onFinishFormAuth}
      >
        <Form.Item
          label={t("modal.changePassword.old_password")}
          name="oldPassword"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: t("modal.changePassword.validation.required_password"),
            },
          ]}
        >
          <Input.Password placeholder={t("modal.changePassword.placeholder_old")} />
        </Form.Item>

        <Form.Item
          label={t("modal.changePassword.new_password")}
          name="newPassword"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: t("modal.changePassword.validation.required_password"),
            },
          ]}
        >
          <Input.Password placeholder={t("modal.changePassword.placeholder_new")} />
        </Form.Item>
        <Form.Item
          label={t("modal.changePassword.re_password")}
          name="reNewPassword"
          labelAlign="left"
          dependencies={["newPassword"]}
          rules={[
            {
              required: true,
              message: t("modal.changePassword.validation.required_repassword"),
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(t("modal.changePassword.validation.not_match"))
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder={t("modal.changePassword.placeholder_re")} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default React.memo(ChangePasswordModal);