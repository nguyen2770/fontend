import React, { useState } from "react";
import {
  Modal,
  Row,
  Col,
  Input,
  Button,
  Typography,
  Divider,
  Card,
  Form,
} from "antd";
import { parseDateHH } from "../../../helper/date-helper";
import * as _unitOfWork from "../../../api";
import ShowSuccess from "../../../components/modal/result/successNotification";
import ShowError from "../../../components/modal/result/errorNotification";
import { useTranslation } from "react-i18next";
import AttachmentModel from "../../../components/modal/attachmentModel/AttachmentModel";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
const { Text } = Typography;
const { TextArea } = Input;

const ComfirmColseModal = ({
  open,
  onCancel,
  onRefresh,
  schedulePreventive,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const onCancelComfirm = () => {
    form.resetFields();
    onCancel();
    setFileList([]);
  };

  const onFinish = async () => {
    const formValues = form.getFieldsValue();
    try {
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
      const res =
        await _unitOfWork.schedulePreventive.comfirmCloseSchedulePreventive({
          schedulePreventive: schedulePreventive._id || schedulePreventive.id,
          comment: formValues.comment,
          listResource: newSupportDocuments,
        });
      if (res && res.code === 1) {
        onRefresh();
        onCancelComfirm();
        ShowSuccess(
          "topRight",
          t("preventiveSchedule.modal.close_title"),
          t("preventiveSchedule.messages.close_success"),
        );
        form.resetFields();
      } else {
        ShowError(
          "topRight",
          t("preventiveSchedule.modal.close_title"),
          res?.message || t("preventiveSchedule.messages.close_error"),
        );
      }
    } catch (error) {
      console.error("Error confirming close schedule preventive:", error);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancelComfirm}
      closable={false}
      footer={null}
      width={"70%"}
      className="custom-modal"
    >
      <Card title={t("preventiveSchedule.modal.close_title")}>
        <Form labelWrap form={form} onFinish={onFinish} className="p-3">
          <Row gutter={[16, 16]}>
            <Col span={3}>
              {" "}
              <Text strong>{t("preventiveSchedule.fields.plan_name")}:</Text>
            </Col>
            <Col span={5}>{schedulePreventive?.preventive?.preventiveName}</Col>
            <Col span={3}>
              <Text strong>{t("preventiveSchedule.fields.plan_code")}:</Text>
            </Col>
            <Col span={5}>{schedulePreventive?.code}</Col>
            <Col span={3}>
              {" "}
              <Text strong>{t("preventiveSchedule.fields.start_date")}:</Text>
            </Col>
            <Col span={5}>{parseDateHH(schedulePreventive?.startDate)}</Col>
          </Row>
          <Divider />
          <Col span={24}>
            <AttachmentModel
              value={fileList}
              onChange={setFileList}
              notSize={true}
              notDelete={true}
            />
          </Col>
          <Form.Item name="comment" label="">
            <TextArea
              rows={3}
              placeholder={t("preventiveSchedule.fields.comment")}
            />
          </Form.Item>
          <div style={{ textAlign: "right", marginTop: 16 }}>
            <Button
              onClick={onCancelComfirm}
              style={{ marginRight: 8 }}
              icon={<CloseCircleOutlined />}
            >
              {t("preventiveSchedule.buttons.cancel")}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<CheckCircleOutlined />}
            >
              {t("preventiveSchedule.buttons.approve")}
            </Button>
          </div>
        </Form>
      </Card>
    </Modal>
  );
};

export default ComfirmColseModal;
