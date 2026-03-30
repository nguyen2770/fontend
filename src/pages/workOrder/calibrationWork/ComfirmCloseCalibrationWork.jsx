import { CheckSquareFilled, CloseCircleOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Modal, Row } from "antd";
import React, { useEffect, useState } from "react";
import * as _unitOfWork from "../../../api";
import ShowSuccess from "../../../components/modal/result/successNotification";
import { useTranslation } from "react-i18next";
import AttachmentModel from "../../../components/modal/attachmentModel/AttachmentModel";

export default function ComfirmCloseCalibrationWork({
  open,
  calibrationWork,
  onCallback,
  onClose,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const onFinish = async () => {
    const newSupportDocuments = [];
    if (fileList) {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const resUpload = await _unitOfWork.resource.uploadImage({
          file: file?.originFileObj,
        });
        if (resUpload && resUpload.code === 1) {
          newSupportDocuments.push({
            resource: resUpload.resourceId,
          });
        }
      }
    }
    let payload = {
      ...form.getFieldsValue(),
      calibrationWork: calibrationWork?._id,
      listResource: newSupportDocuments,
    };
    // console.log(payload);
    let res =
      await _unitOfWork.calibrationWork.comfirmCloseCalibrationWork(payload);
    if (res && res.code === 1) {
      ShowSuccess(
        "topRigth",
        t("common.notifications"),
        t("common.messages.success.successfully"),
      );
      onCloseReject();
      onCallback();
    }
  };
  const onCloseReject = () => {
    onClose();
    form.resetFields();
    setFileList([]);
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
      <Card title={t("calibrationWork.comfirm.title_close_calibration_work")}>
        <Form labelWrap form={form} onFinish={onFinish}>
          <Row gutter={32}>
            <Col span={24}>
              <AttachmentModel
                value={fileList}
                onChange={setFileList}
                notSize={true}
                notDelete={true}
              />
            </Col>
            <Col span={24}>
              <Form.Item name="note">
                <Input.TextArea
                  placeholder={t("calibrationWork.enter_note")}
                  autoSize={{ minRows: 3, maxRows: 6 }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end" gutter={8}>
            <Col>
              <Button onClick={onCloseReject} icon={<CloseCircleOutlined />}>
                {t("common_buttons.cancel")}
              </Button>
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
