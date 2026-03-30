import { Button, Card, Col, Form, Input, Modal, Row } from "antd";
import React, { useEffect } from "react";
import Confirm from "../../../components/modal/Confirm";
import * as _unitOfWork from "../../../api";
import { useTranslation } from "react-i18next";

export default function UpdateBranch({ open, handleOk, handleCancel, id, onRefresh }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && id) {
      fetchGetGroupById();
    }
  }, [open, id]);

  const fetchGetGroupById = async () => {
    const res = await _unitOfWork.branch.getBranchById({
      id: id,
    });
    if (res) {
      form.setFieldsValue({ ...res.asset });
    }
  };

  const onFinish = async () => {
    const res = await _unitOfWork.branch.updateBranch({
      Branch: {
        id: id,
        ...form.getFieldsValue(),
      },
    });
    if (res && res.code === 1) {
      onRefresh();
      handleCancel();
      form.resetFields();
    } else {
      // Keeping original behavior (no explicit error messaging)
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
        <Card title={t("branch.update.title")}>
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
                    t("branch.messages.confirm_update"),
                    () => onFinish()
                  )
                }
              >
                {t("branch.form.buttons.submit_update")}
              </Button>
            </div>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}