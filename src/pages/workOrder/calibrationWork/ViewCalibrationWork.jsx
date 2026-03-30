import React, { useEffect, useState } from "react";
import { Card, Row, Col, Tabs, Timeline, Tag, Button } from "antd";
import {
  CheckCircleTwoTone,
  LeftCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import * as _unitOfWork from "../../../api";
import { useTranslation } from "react-i18next";
import TabsGeneralInformationCalibrationWork from "./tabInViewCalibrationWork/TabsGeneralInformationCalibrationWork";
import CalibrationHistory from "./tabInViewCalibrationWork/CalibrationHistory";
import dayjs from "dayjs";
import { calibrationWorkStatus, progressStatus } from "../../../utils/constant";
import AssetModelDocument from "../../manager/assetSetup/assetModel/assetModelDocument";
import TabsCalibrationWork from "./TabsCalibrationWork";
export default function ViewCalibrationWork() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const [calibrationWork, setCalibrationWork] = useState([]);
  const [calibrationWorkAssignUsers, setCalibrationWorkAssignUsers] = useState(
    [],
  );
  const [calibrationWorkTimelines, setCalibrationWorkTimelines] = useState([]);
  const items = [
    {
      key: "general",
      label: t("calibrationWork.detail.title_general_information"),
      children: (
        <TabsGeneralInformationCalibrationWork
          calibrationWork={calibrationWork}
        />
      ),
    },
    {
      key: "attachment",
      label: t("calibrationWork.detail.title_calibration_history"),
      children: <CalibrationHistory calibrationWork={calibrationWork} />,
    },
    {
      key: "3",
      label: t("schedulePreventiveTask.equipment_technical_documentation"),
      children: (
        <AssetModelDocument
          assetModel={calibrationWork?.assetMaintenance?.assetModel}
          notButtonCreateDocuemnt={false}
          notButtonUpdateDocument={false}
          notButtonDeleteDocument={false}
        />
      ),
    },
    {
      key: "4",
      label: t("calibrationWork.calibration_work_documentation"),
      children: (
        <TabsCalibrationWork
          calibrationWorkId={calibrationWork?._id || calibrationWork?.id}
        />
      ),
    },
  ];

  useEffect(() => {
    fetchGetCalibrationWorkById();
  }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchGetCalibrationWorkById = async () => {
    let res = await _unitOfWork.calibrationWork.getCalibrationWorkById(
      params.id,
    );
    if (res) {
      setCalibrationWork(res?.calibrationWork);
      setCalibrationWorkAssignUsers(res?.calibrationWorkAssignUser);
      setCalibrationWorkTimelines(res?.calibrationWorkTimeline);
    }
  };
  const timelineLabelKey = (status) => {
    switch (status) {
      case progressStatus.new:
        return t("breakdown.view.timeline.created");
      case progressStatus.cloesed:
        return t("breakdown.view.timeline.closed");
      case progressStatus.cancelled:
        return t("breakdown.view.timeline.cancelled");
      case progressStatus.experimentalFix:
        return t("breakdown.view.timeline.experimental_fix");
      case progressStatus.fixedOnTrial:
        return t("breakdown.view.timeline.fixed_on_trial");
      case progressStatus.assigned:
        return t("breakdown.view.timeline.assigned");
      case progressStatus.reassignment:
        return t("calibrationWork.view.timeline.reassignment");
      case progressStatus.reopen:
        return t("breakdown.view.timeline.reopen");
      case progressStatus.requestForSupport:
        return t("breakdown.view.timeline.request_for_support");
      case progressStatus.replacement:
        return t("breakdown.view.timeline.replacement");
      case progressStatus.accepted:
        return t("breakdown.view.timeline.accepted");
      case progressStatus.WCA:
      case progressStatus.WWA:
        return t("breakdown.view.timeline.confirmed");
      case progressStatus.rejected:
        return t("calibrationWork.view.timeline.rejected");
      case progressStatus.completed:
        return t("calibrationWork.view.timeline.completed");
      case progressStatus.partiallyCompleted:
        return t("calibrationWork.view.timeline.partiallyCompleted");
      case progressStatus.completeRecalibrationIssue:
        return t("calibrationWork.view.timeline.completeRecalibrationIssue");
      default:
        return "";
    }
  };
  return (
    <div className="p-3" style={{ background: "#fff" }}>
      <Row gutter={32}>
        <Col span={24}>
          <div>
            <Button
              style={{ float: "right", marginBottom: 16 }}
              onClick={() => navigate(-1)}
            >
              <LeftCircleOutlined />
              {t("breakdown.view.buttons.back")}
            </Button>
          </div>
        </Col>
        <Col span={6}>
          <Timeline className="mt-2">
            {calibrationWorkTimelines.map((item, index) => {
              let label = timelineLabelKey(item?.status);
              if (!label && (item?.loginDate || item?.logoutDate)) {
                label = t("calibrationWork.view.timeline.work_date");
              }
              return (
                <Timeline.Item
                  key={index}
                  dot={
                    <CheckCircleTwoTone
                      twoToneColor="#52c41a"
                      style={{ fontSize: 24 }}
                    />
                  }
                  style={{ marginBottom: 16 }}
                >
                  <div
                    style={{
                      padding: "7px",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {label && (
                      <div>
                        <b>{label} :</b>{" "}
                        {dayjs(item?.workedDate).format("DD/MM/YYYY HH:mm")}
                      </div>
                    )}
                    <div>
                      <b>{t("breakdown.view.timeline.comment")} : </b>{" "}
                      {item?.comment || "null"}
                    </div>
                    <div>
                      <b>{t("breakdown.view.timeline.status")} : </b>{" "}
                      {t(
                        progressStatus.Option.find(
                          (p) => p.value === item.status,
                        )?.label,
                      )}
                    </div>
                    {item?.loginDate && (
                      <div>
                        <b>{t("breakdown.view.timeline.login_time")} : </b>{" "}
                        {dayjs(item?.loginDate).format("DD/MM/YYYY HH:mm")}
                      </div>
                    )}
                    {item?.logoutDate && (
                      <div>
                        <b>{t("breakdown.view.timeline.logout_time")} : </b>{" "}
                        {dayjs(item?.logoutDate).format("DD/MM/YYYY HH:mm")}
                      </div>
                    )}
                    {item.designatedUser && (
                      <div>
                        <b>{t("breakdown.view.timeline.designated_user")}:</b>{" "}
                        {item.designatedUser?.fullName}
                      </div>
                    )}
                    {item.indicatedUserBy && (
                      <div>
                        <b>{t("breakdown.view.timeline.executed_by")}:</b>{" "}
                        {item.indicatedUserBy?.fullName}
                      </div>
                    )}
                    {item.acceptedBy && (
                      <div>
                        <b>Chấp thuận bởi:</b> {item.acceptedBy?.fullName}
                      </div>
                    )}
                    {item.workedBy && (
                      <div>
                        <b>{t("breakdown.view.timeline.executed_by")}:</b>{" "}
                        {item.workedBy?.fullName}
                      </div>
                    )}
                    {item.replacementUser && (
                      <div>
                        <b>{t("breakdown.view.timeline.replacement_user")}:</b>{" "}
                        {item.replacementUser?.fullName}
                      </div>
                    )}
                    {item.replacementReason && (
                      <div>
                        <b>Lý do thay thế:</b> {item.replacementReason}
                      </div>
                    )}
                  </div>
                </Timeline.Item>
              );
            })}
          </Timeline>
        </Col>
        <Col span={13}>
          <Tabs
            defaultActiveKey="1"
            items={items}
            className="tab-all"
            style={{
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              borderRadius: 8,
              background: "#fff",
            }}
          />
        </Col>
        <Col span={5}>
          {calibrationWorkAssignUsers.map((u, idx) => (
            <div key={idx}>
              <Card
                style={{
                  marginBottom: 16,
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div
                  style={{ color: "#1890ff", fontWeight: 500, marginBottom: 4 }}
                >
                  {t(
                    progressStatus.Option.find((p) => p.value === u.status)
                      ?.label,
                  )}
                </div>
                <UserOutlined style={{ marginRight: 8 }} />
                {u.user.fullName}
              </Card>
            </div>
          ))}
        </Col>
      </Row>
    </div>
  );
}
