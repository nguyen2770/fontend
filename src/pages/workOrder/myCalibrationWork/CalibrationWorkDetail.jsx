import React from "react";
import { Row, Col, Divider, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import {
  breakdownStatus,
  calibrationWorkAssignUserStatus,
  priorityType,
} from "../../../utils/constant";
import { parseToLabel } from "../../../helper/parse-helper";
import { parseDateHH } from "../../../helper/date-helper";

export default function CalibrationWorkDetail({ data, breakdowns }) {
  const { t } = useTranslation();
  if (!data) return null;

  return (
    <div className="calibration-work-detail">
      <Row gutter={32} className="asset-detail-row">
        <Col span={8}>
          <div className="asset-detail-item">
            <span className="asset-detail-label">
              {t("myTask.scheduleDetails.task_name")} :{" "}
            </span>
            <span className="asset-detail-value">
              {data?.calibrationWork?.calibrationName}
            </span>
          </div>
        </Col>
        <Col span={8}>
          <div className="asset-detail-item">
            <span className="asset-detail-label">
              {t("myTask.scheduleDetails.code")} :{" "}
            </span>
            <span className="asset-detail-value">
              {data?.calibrationWork?.code}
            </span>
          </div>
        </Col>
        <Col span={8}>
          <div className="asset-detail-item">
            <span className="asset-detail-label">
              {t("myTask.scheduleDetails.severity")} :{" "}
            </span>
            <span className="asset-detail-value">
              {t(
                parseToLabel(
                  priorityType.Option,
                  data?.calibrationWork?.importance
                )
              )}
            </span>
          </div>
        </Col>
        <Col span={8}>
          <div className="asset-detail-item">
            <span className="asset-detail-label">
              {t("calibration.start_date")} :{" "}
            </span>
            <span className="asset-detail-value">
              {parseDateHH(data?.calibrationWork?.startDate)}
            </span>
          </div>
        </Col>
        <Col span={8}>
          <div className="asset-detail-item">
            <span className="asset-detail-label">{t("report.maintenanceRequest.columns.status")} : </span>
            <span className="asset-detail-value">
              {(() => {
                const option = calibrationWorkAssignUserStatus.Options.find(
                  (opt) => opt.value === data?.status
                );
                const label = option ? t(option.label) : data?.status;
                const color = option?.color || "#d9d9d9";

                return (
                  <span className="status-badge" style={{ "--color": color }}>
                    {label}
                  </span>
                );
              })()}
            </span>
          </div>
        </Col>
      </Row>
      {data?.calibrationWork?.reasonForReopening && (
        <Col span={8}>
          <div className="asset-detail-item">
            <span className="asset-detail-label">{t("breakdown.viewTabs.general.fields.cancel_reason")} : </span>
            <Tooltip title={data?.reasonForReopening}>
              <span className="asset-detail-value text-ellipsis">
                {data?.reasonForReopening}
              </span>
            </Tooltip>
          </div>
        </Col>
      )}
      {Array.isArray(breakdowns) && breakdowns.length > 0 && (
        <>
          <Divider />
          <h4 style={{ marginBottom: 12 }}>{t("Danh sách sự cố liên quan")}</h4>

          {breakdowns.map((breakdown, index) => (
            <Row
              gutter={32}
              key={breakdown?._id || index}
              className="asset-detail-row"
            >
              <Col span={8}>
                <div className="asset-detail-item">
                  <span className="asset-detail-label">{t("Mã sự cố")} : </span>
                  <span className="asset-detail-value">{breakdown?.code}</span>
                </div>
              </Col>
              <Col span={8}>
                <div className="asset-detail-item">
                  <span className="asset-detail-label">
                    {t("Trạng thái sự cố")} :{" "}
                  </span>
                  <span className="asset-detail-value">
                    {(() => {
                      const option = breakdownStatus.Option.find(
                        (opt) => opt.value === breakdown?.status
                      );
                      const label = option
                        ? t(option.label)
                        : breakdown?.status;
                      const color = option?.color || "#d9d9d9";

                      return (
                        <span
                          className="status-badge"
                          style={{ "--color": color }}
                        >
                          {label}
                        </span>
                      );
                    })()}
                  </span>
                </div>
              </Col>
              <Col span={8}>
                <div className="asset-detail-item">
                  <span className="asset-detail-label">
                    {t("Mô tả sự cố")} :{" "}
                  </span>
                  <Tooltip title={breakdown?.defectDescription}>
                    <span className="asset-detail-value text-ellipsis">
                      {breakdown?.defectDescription}
                    </span>
                  </Tooltip>
                </div>
              </Col>
            </Row>
          ))}
        </>
      )}
    </div>
  );
}
