import { Button, Card, Col, Form, Input, Modal, Row } from "antd";
import React from "react";
import Confirm from "../../../components/modal/Confirm";
import * as _unitOfWork from "../../../api";
import { useTranslation } from "react-i18next";

export default function CreateBranch({ open, handleOk, handleCancel, onRefresh }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onFinish = async () => {
    // Keeping original logic (even though getFieldValue vs getFieldsValue)
    const values = await form.getFieldValue();
    const res = await _unitOfWork.branch.createBranch(values);

    if (res && res.code === 1) {
      onRefresh();
      handleCancel();
      form.resetFields();
    } else {
      // Optional error message (not originally present, so omitted to keep logic)
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
        <Card title={t("branch.create.title")}>
          <Row>
            <Col span={24}>
              <Form.Item
                name="name"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: t("branch.validation.required_name"),
                  },
                ]}
              >
                <Input
                  placeholder={t("branch.form.placeholders.branch_name")}
                />
              </Form.Item>
            </Col>
            <div className="modal-footer">
              <Button key="back" onClick={handleCancel}>
                {t("branch.form.buttons.back")}
              </Button>
              <Button
                key="button"
                type="primary"
                onClick={() =>
                  Confirm(
                    t("branch.messages.confirm_create"),
                    () => onFinish()
                  )
                }
              >
                {t("branch.form.buttons.submit_create")}
              </Button>
            </div>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}