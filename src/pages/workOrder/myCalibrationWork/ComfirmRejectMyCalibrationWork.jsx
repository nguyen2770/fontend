import { CheckSquareFilled } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Modal, Row } from "antd";
import React, { useEffect } from "react";
import * as _unitOfWork from "../../../api";
import ShowSuccess from "../../../components/modal/result/successNotification";
import { useTranslation } from "react-i18next";

export default function ComfirmRejectMyCalibrationWork({
  open,
  calibrationWorkAssignUser,
  onCallback,
  onClose,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    fetchGetBreakAssignUsers();
  }, [open]);

  const fetchGetBreakAssignUsers = async () => {};

  const onFinish = async () => {
    let payload = {
      ...form.getFieldsValue(),
      calibrationWork: calibrationWorkAssignUser?.calibrationWork?._id,
    };
    let res = await _unitOfWork.calibrationWork.comfirmRejectCalibrationWork(
      payload
    );
    if (res && res.code === 1) {
      ShowSuccess("topRigth",  t("common.notifications"), t("common.messages.success.successfully"));
      form.resetFields();
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
      <Card title={t("Từ chối công việc kiểm định/ hiệu chuẩn")}>
        <Form labelWrap form={form} onFinish={onFinish}>
          <Row gutter={32}>
            <Col span={24}>
              <Form.Item
                name="reasonsForRefusal"
                rules={[
                  {
                    required: true,
                    message: t("Nhập lý do từ chối công việc kiểm định / hiệu chuẩn"),
                  },
                ]}
              >
                <Input.TextArea
                  placeholder={t("Nhập lý do...")}
                  autoSize={{ minRows: 3, maxRows: 6 }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end" gutter={8}>
            <Col>
              <Button onClick={onCloseReject}>{t("Hủy bỏ")}</Button>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<CheckSquareFilled />}
                htmlType="submit"
              >
                {t("Đồng ý")}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </Modal>
  );
}
