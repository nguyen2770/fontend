import React from "react";
import { Row, Col } from "antd";
import { useTranslation } from "react-i18next";

export default function ScheduleDetails({ data }) {
  const { t } = useTranslation();
  if (!data) return null;
  return (
    <Row gutter={32} className="asset-detail-row">
      <Col span={8}>
        <div className="asset-detail-item">
          <span className="asset-detail-label">{t("myTask.scheduleDetails.task_name")} : </span>
          <span className="asset-detail-value">
            {data?.preventive?.preventiveName}
          </span>
        </div>
      </Col>
      <Col span={8}>
        {" "}
        <div className="asset-detail-item">
          <span className="asset-detail-label">{t("myTask.scheduleDetails.code")} : </span>
          <span className="asset-detail-value">{data?.preventive?.code}</span>
        </div>
      </Col>
      <Col span={8}>
        {" "}
        <div className="asset-detail-item">
          <span className="asset-detail-label">{t("myTask.scheduleDetails.severity")} : </span>
          <span className="asset-detail-value">
            {data?.preventive?.importance}
          </span>
        </div>
      </Col>
    </Row>
  );
}