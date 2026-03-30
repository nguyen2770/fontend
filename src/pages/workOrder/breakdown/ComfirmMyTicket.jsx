import { CheckSquareFilled } from "@ant-design/icons";
import { Button, Card, Col, Form, Modal, Row, Switch } from "antd";
import React, { useEffect, useState } from "react";
import * as _unitOfWork from "../../../api";
import { CheckCircleTwoTone } from "@ant-design/icons";
import Confirm from "../../../components/modal/Confirm";
import ShowSuccess from "../../../components/modal/result/successNotification";
import { useTranslation } from "react-i18next";

export default function ComfirmMyTicket({
  open,
  handlCanel,
  dataMyTicket,
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
    let res =
      await _unitOfWork.breakdownAssignUser.getBreakdownAssignUserByBreakdownId(
        {
          id: dataMyTicket.id,
        }
      );
    if (res && res.code === 1) {
      setBreakAssignUser(res.data);
    }
  };
  const onUpdateStatus = async (value, checked) => {
    let res = await _unitOfWork.breakdownAssignUser.updateStatus({
      data: {
        id: value.id,
        status: checked,
      },
    });
    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("breakdown.myTicket.confirm_success")
      );
      fetchGetBreakAssignUsers();
    }
  };
  const onFinish = async () => {
    const res = await _unitOfWork.breakdown.updateBreakdown({
      data: {
        id: dataMyTicket.id,
        ticketStatus: "Accepted",
      },
    });
    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("breakdown.myTicket.accept_success")
      );
      handlCanel();
      onReset();
    }
  };
  const allConfirmed =
    breakAssignUser.length > 0 &&
    breakAssignUser.every((u) => u.status === true);

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
          {breakAssignUser && breakAssignUser.length > 0 ? (
            <Row gutter={[16, 16]}>
              {breakAssignUser.map((user) => (
                <Col span={24} key={user.id}>
                  <Card
                    hoverable
                    style={{
                      borderRadius: 10,
                      boxShadow: "0 2px 8px #f0f1f2",
                      height: "100%",
                    }}
                  >
                    <Row gutter={16}>
                      <Col span={6} style={{ textAlign: "center" }}>
                        <div style={{ fontWeight: 600, color: "#888" }}>
                          {t("breakdown.myTicket.labels.user_name")}
                        </div>
                        <div style={{ fontSize: 16 }}>
                          {user?.user?.fullName || "-"}
                        </div>
                      </Col>
                      <Col span={6} style={{ textAlign: "center" }}>
                        <div style={{ fontWeight: 600, color: "#888" }}>
                          {t("breakdown.myTicket.labels.phone")}
                        </div>
                        <div style={{ fontSize: 16 }}>
                          {user?.user?.contactNo || "-"}
                        </div>
                      </Col>
                      <Col span={6} style={{ textAlign: "center" }}>
                        <div style={{ fontWeight: 600, color: "#888" }}>
                          Email
                        </div>
                        <div style={{ fontSize: 16 }}>
                          {user?.user?.email || "-"}
                        </div>
                      </Col>
                      <Col span={6} style={{ textAlign: "center" }}>
                        <div style={{ fontWeight: 600, color: "#888" }}>
                          {t("breakdown.myTicket.labels.status")}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            marginTop: 4,
                          }}
                        >
                          <Switch
                            checked={
                              user.status === true || user.status === "true"
                            }
                            checkedChildren={
                              <CheckCircleTwoTone twoToneColor="#52c41a" />
                            }
                            unCheckedChildren="x"
                            disabled={user?.user?.id !== userLocal?.id}
                            onChange={(checked) => {
                              Confirm("Xác nhận thay đổi trạng thái?", () =>
                                onUpdateStatus(user, checked)
                              );
                            }}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div>{t("breakdown.myTicket.labels.no_data")}</div>
          )}
        </div>
        <Row justify="end" gutter={8}>
          <Col>
            <Button onClick={handlCanel}>{t("breakdown.myTicket.buttons.cancel")}</Button>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<CheckSquareFilled />}
              htmlType="submit"
              disabled={!allConfirmed}
            >
              {t("breakdown.myTicket.buttons.confirm")}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}