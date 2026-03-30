import React from "react";
import { Modal, Radio, Input, Button, Card, Form } from "antd";
import { useWatch } from "antd/es/form/Form";
import * as _unitOfWork from "../../../api";
import ShowSuccess from "../../../components/modal/result/successNotification";
import ShowError from "../../../components/modal/result/errorNotification";
import { useTranslation } from "react-i18next";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
const { TextArea } = Input;
const options = {
  entire: 'entire',
  fromTask: 'fromTask'
};
const ConfirmReOpenModal = ({ open, onCancel, schedulePreventive, onRefresh }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const option = useWatch("entire", form);
  const selectedTask = useWatch("selectedTask", form);

  const onCancelComfirmReOpen = () => {
    onCancel();
    form.resetFields();
  }

  const onFinish = async () => {
    const formValues = form.getFieldsValue();
    const data = {
      schedulePreventive: schedulePreventive._id || schedulePreventive.id,
      comment: formValues.comment,
    };
    if (option === options.fromTask && selectedTask) {
      data.schedulePreventiveTask = selectedTask;
    }
    const res = await _unitOfWork.schedulePreventive.comfirmReOpenSchedulePreventive(data)
    if (res && res.code === 1) {
      onRefresh();
      onCancelComfirmReOpen();
      ShowSuccess('topRight', t("preventiveSchedule.modal.reopen_title"), t("preventiveSchedule.messages.reopen_success"));
    } else {
      ShowError('topRight', t("preventiveSchedule.modal.reopen_title"), res?.message || t("preventiveSchedule.messages.reopen_error"));
    }

  }
  return (
    <Modal
      open={open}
      onCancel={onCancelComfirmReOpen}
      footer={null}
      width={"70%"}
      closable={false}
      className="custom-modal"
    >
      <Card title={t("preventiveSchedule.modal.reopen_title")}>
        <Form labelWrap form={form} onFinish={onFinish}
          className="p-3"
          initialValues={{ entire: options.entire }}
        >
          <Form.Item name="entire">
            <Radio.Group style={{ fontWeight: 600 }}>
              <Radio value={options.entire} >{t("preventiveSchedule.buttons.reopen_all")}</Radio>
              <Radio value={options.fromTask} >{t("preventiveSchedule.buttons.reopen_by_task")}</Radio>
            </Radio.Group>
          </Form.Item>

          {option === options.fromTask && (
            <Form.Item name="selectedTask">
              <Radio.Group>
                {schedulePreventive?.schedulePreventiveTasks?.length > 0 &&
                  schedulePreventive.schedulePreventiveTasks.map((item) => (
                    <Radio key={item._id} value={item._id || item.id} style={{ display: 'block' }}>
                      {item.taskName}
                    </Radio>
                  ))}
              </Radio.Group>
            </Form.Item>

          )}

          <Form.Item
            name="comment"
          >
            <TextArea
              placeholder={t("preventiveSchedule.fields.comment")}
              rows={3}
            />
          </Form.Item>

          <div style={{ textAlign: "right", marginTop: 16 }}>
            <Button onClick={onCancelComfirmReOpen} style={{ marginRight: 8 }} icon={<CloseCircleOutlined/>}>
              {t("preventiveSchedule.buttons.cancel")}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<CheckCircleOutlined />}
            >
              {t("preventiveSchedule.buttons.submit")}
            </Button>
          </div>
        </Form>
      </Card>
    </Modal>
  );
};

export default ConfirmReOpenModal;