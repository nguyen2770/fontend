import { CheckSquareFilled } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row } from "antd";
import React, { useEffect } from "react";
import * as _unitOfWork from "../../../api";
import ShowSuccess from "../../../components/modal/result/successNotification";
import { useTranslation } from "react-i18next";

export default function ConfirmCancelMyTask({
  open,
  schedulePreventiveTaskAssignUser,
  onCallback,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    fetchGetBreakAssignUsers();
  }, [open]);

  const fetchGetBreakAssignUsers = async () => { };

  const onFinish = async () => {
    let payload = {
      ...form.getFieldsValue(),
      schedulePreventiveTask: schedulePreventiveTaskAssignUser?.schedulePreventiveTask?._id,
      user: schedulePreventiveTaskAssignUser?.user?._id,
    }
    let res = await _unitOfWork.schedulePreventive.userCancelConfirm(payload);
    if (res && res.code === 1) {
      ShowSuccess(t("myTask.cancelMyTask.messages.cancel_success"));
      form.resetFields();
      onCallback();
    }
  };

  return (
    <Modal
      open={open}
      footer={null}
      width={"50%"}
      destroyOnClose
      closable={false}
    >
      <Form labelWrap form={form} onFinish={onFinish}>
        <Row gutter={32}>
          <Col span={24}>
            <Form.Item
              name="reasonCancelConfirm"
              label={t("myTask.cancelMyTask.reason")}
              rules={[{ required: true, message: t("myTask.cancelMyTask.reason_required") }]}
            >
              <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="end" gutter={8}>
          <Col>
            <Button onClick={onCallback}>{t("myTask.cancelMyTask.buttons.cancel")}</Button>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<CheckSquareFilled />}
              htmlType="submit"
            >
              {t("myTask.cancelMyTask.buttons.confirm_cancel")}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}