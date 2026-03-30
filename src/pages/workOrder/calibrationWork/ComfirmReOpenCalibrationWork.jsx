import { CheckSquareFilled } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Modal, Row } from "antd";
import React, { useEffect } from "react";
import * as _unitOfWork from "../../../api";
import ShowSuccess from "../../../components/modal/result/successNotification";
import { useTranslation } from "react-i18next";

export default function ComfirmReOpenCalibrationWork({
  open,
  calibrationWork,
  onCallback,
  onClose,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onFinish = async () => {
    let payload = {
      ...form.getFieldsValue(),
      calibrationWork: calibrationWork?._id,
    };
    let res = await _unitOfWork.calibrationWork.comfirmReOpenCalibrationWork(
      payload
    );
    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("common.messages.success.successfully")
      );
      onCloseReject();
      onCallback();
    }
  };
  const onCloseReject = () => {
    onClose();
    form.resetFields();
  };
  return (
    <Modal
      // className="comfirm-reject-modal"
      open={open}
      footer={null}
      width={"40%"}
      closable={false}
      className="custom-modal"
    >
      <Card title={t("calibrationWork.comfirm.title_confirmation_of_reopening_of_work")}>
        <Form labelWrap form={form} onFinish={onFinish}>
          <Row gutter={32}>
            <Col span={24}>
              <Form.Item
                name="reasonForReopening"
                rules={[
                  {
                    required: true,
                    message: t("calibrationWork.please_enter_reason_for_reopening"),
                  },
                ]}
              >
                <Input.TextArea
                  placeholder={t("calibrationWork.enter_reason_for_reopening")}
                  autoSize={{ minRows: 3, maxRows: 6 }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end" gutter={8}>
            <Col>
              <Button onClick={onCloseReject}>{t("common_buttons.cancel")}</Button>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<CheckSquareFilled />}
                htmlType="submit"
              >
                {t("common_buttons.agree")}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </Modal>
  );
}
