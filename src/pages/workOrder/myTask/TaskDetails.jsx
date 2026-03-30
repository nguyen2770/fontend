import React from "react";
import { Row, Col } from "antd";
import { parseDateHH } from "../../../helper/date-helper";
import { useTranslation } from "react-i18next";

export default function TaskDetails({ data }) {
  const { t } = useTranslation();
  if (!data) return null;
  return (
    <Row gutter={32} className="asset-detail-row">
      <Col span={8}>
        <div className="asset-detail-item">
          <span className="asset-detail-label">{t("myTask.taskDetails.schedule_date")} : </span>
          <span className="asset-detail-value">
            {parseDateHH(data?.actualScheduleDate)}
          </span>
        </div>
      </Col>
      <Col span={8}>
        {" "}
        <div className="asset-detail-item">
          <span className="asset-detail-label">{t("myTask.taskDetails.assigned_date")} : </span>
          <span className="asset-detail-value">
            {parseDateHH(data?.confirmDate)}
          </span>
        </div>
      </Col>
      <Col span={8}>
        {" "}
        <div className="asset-detail-item">
          <span className="asset-detail-label">{t("myTask.taskDetails.task_name")} : </span>
          <span className="asset-detail-value">
            {Array.isArray(data?.tasks)
              ? data.tasks
                .map((item) => item.taskName)
                .filter(Boolean)
                .join(", ")
              : ""}
          </span>
        </div>
      </Col>
    </Row>
  );
}