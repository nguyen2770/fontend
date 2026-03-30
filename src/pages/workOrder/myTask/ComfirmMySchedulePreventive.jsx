import { CheckSquareFilled } from "@ant-design/icons";
import { Button, Col, Form, Modal, Row } from "antd";
import React, { useEffect, useState } from "react";
import * as _unitOfWork from "../../../api";
import { CheckCircleTwoTone } from "@ant-design/icons";
import Confirm from "../../../components/modal/Confirm";
import ShowSuccess from "../../../components/modal/result/successNotification";
import { useTranslation } from "react-i18next";

export default function ComfirmMySchedulePreventive({
  open,
  handlCanel,
  schedulePreventive,
  onReset,
}) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [breakAssignUser, setBreakAssignUser] = useState([]);
  const userLocal = JSON.parse(localStorage.getItem("USER"));
  useEffect(() => {
    fetchGetBreakAssignUsers();
  }, [open]);

  const fetchGetBreakAssignUsers = async () => {

  };

  const onFinish = async () => {

  };
  const allConfirmed =
    breakAssignUser.length > 0 &&
    breakAssignUser
      .filter((u) => u.userType === "charge")
      .every((u) => u.status === true);

  return (
    <Modal
      open={open}
      footer={null}
      width={"60%"}
      destroyOnClose
      closable={false}
    >
      <Form labelWrap form={form} onFinish={onFinish}>
        <div style={{ marginBottom: 24 }}>
        </div>
        <Row justify="end" gutter={8}>
          <Col>
            <Button onClick={handlCanel}>{t("myTask.confirmMySchedule.buttons.cancel")}</Button>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<CheckSquareFilled />}
              htmlType="submit"
              disabled={!allConfirmed}
            >
              {t("myTask.confirmMySchedule.buttons.confirm")}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}