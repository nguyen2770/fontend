import { Row, Col, Card } from "antd";
import React, { useEffect, useState } from "react";
import "./styles/index.scss";
import * as _unitOfWork from "../../api";
import { useLocation, useNavigate } from "react-router-dom";
import useHeader from "../../contexts/headerContext";
import { staticPath } from "../../router/routerConfig";
import { useTranslation } from "react-i18next";

let dateNow = new Date();
export default function Report() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setHeaderTitle } = useHeader();
  const [reportTypeChange, setReportTypeChange] = useState(null);
  const [titleReport, setTitleReport] = useState(t("report.selection.title"));
  const location = useLocation();

  useEffect(() => {
    setHeaderTitle(t("report.selection.title"));
  }, []);

  const onClickProcessingStatusReportBreakdown = () => {
    window.open(staticPath.processingStatusReportBreakdown, "_blank");
  };
  const onClickActivityReportSchedulePreventive = () => {
    window.open(staticPath.processingStatusReportSchedulePreventive, "_blank");
  };
  const onClickReportAssetMaintenanceRequest = () => {
    window.open(staticPath.reportAssetMaintenanceRequest, "_blank");
  };
  const onClickReportAssetPerformance = () => {
    window.open(staticPath.assetPerformance, "_blank");
  };
  const onClickReportAssetDepreciation = () => {
    window.open(staticPath.assetDepreciation, "_blank");
  };
  const onClickReportEngineerPerformanceInSchedulePreventive = () => {
    window.open(
      staticPath.reportEngineerPerformanceInSchedulePreventive,
      "_blank",
    );
  };
  const onClickReportEngineerPerformanceInBreakdown = () => {
    window.open(staticPath.reportEngineerPerformanceInBreakdown, "_blank");
  };
  return (
    <div className="report-container">
      <Row gutter={8} className="p-2 row-report-container">
        <Col span={24}>
          <Row gutter={8}>
            <Col span={8} className="mb-2">
              <Card
                title={t("report.selection.incident_report")}
                bordered={false}
                className="w-full"
              >
                <div
                  className="space-y-2 cursor-pointer"
                  onClick={() => onClickProcessingStatusReportBreakdown()}
                >
                  <p>► {t("report.selection.incident_processing_status")}</p>
                </div>
                <div
                  className="space-y-2 cursor-pointer"
                  onClick={() => onClickReportEngineerPerformanceInBreakdown()}
                >
                  <p>► {t("report.selection.incident_engineer_pernce")}</p>
                </div>
              </Card>
            </Col>

            <Col span={8} className="mb-2">
              <Card
                title={t("report.selection.work_report")}
                bordered={false}
                style={{ width: 300 }}
              >
                <div
                  className="space-y-2 cursor-pointer"
                  onClick={() => onClickActivityReportSchedulePreventive()}
                >
                  <p>► {t("report.selection.work_processing_status")}</p>
                </div>
                <div
                  className="space-y-2 cursor-pointer"
                  onClick={() =>
                    onClickReportEngineerPerformanceInSchedulePreventive()
                  }
                >
                  <p>► {t("report.selection.work_engineer_performance")}</p>
                </div>
              </Card>
            </Col>
            <Col span={8} className="mb-2">
              <Card
                title={t("report.selection.spare_report")}
                bordered={false}
                style={{ width: 300 }}
              >
                <p
                  onClick={() => {
                    window.open(
                      staticPath.sparePartsUsageSummaryReport,
                      "_blank",
                    );
                  }}
                >
                  ► {t("report.selection.spare_usage_summary")}
                </p>
                <p
                  onClick={() => {
                    window.open(staticPath.spareMovementReport, "_blank");
                  }}
                >
                  ► {t("report.selection.spare_usage_detail")}
                </p>
              </Card>
            </Col>
            <Col span={8} className="mb-2">
              <Card
                title={t("report.selection.asset_report")}
                bordered={false}
                style={{ width: 300 }}
              >
                <p
                  onClick={() => {
                    window.open(staticPath.assetMaintenanceReport, "_blank");
                  }}
                >
                  ► {t("report.selection.asset_report")}
                </p>
                <div
                  className="space-y-2 cursor-pointer"
                  onClick={() => onClickReportAssetPerformance()}
                >
                  <p>► {t("report.selection.asset_performance")}</p>
                </div>
                <div
                  className="space-y-2 cursor-pointer"
                  onClick={() => onClickReportAssetDepreciation()}
                >
                  <p>► {t("report.selection.asset_depreciation")}</p>
                </div>
                <div
                  className="space-y-2 cursor-pointer"
                  onClick={() => onClickReportAssetMaintenanceRequest()}
                >
                  <p>► {t("report.selection.maintenance_request")}</p>
                </div>
              </Card>
            </Col>
            <Col span={8} className="mb-2">
              <Card
                title={t("Báo cáo hợp đồng")}
                bordered={false}
                style={{ width: 300 }}
              >
                <p
                  onClick={() => {
                    window.open(
                      staticPath.assetMaintenanceCostReport,
                      "_blank",
                    );
                  }}
                >
                  ► {t("Báo cáo chi phí bảo trì tài sản theo hợp đồng")}
                </p>
                <p>► {t("Báo cáo chi phí sự cố tài sản theo hợp đồng ")}</p>
                <p>► {t("Báo cáo chi phí hiệu chuẩn tài sản theo hợp đồng")}</p>
                <p>► {t("Báo cáo tổng hợp chi phí hợp đồng theo tài sản")}</p>
              </Card>
            </Col>
            <Col span={8} className="mb-2">
              <Card
                title={t("report.selection.general_report")}
                bordered={false}
                style={{ width: 300 }}
              >
                <p
                  onClick={() => {
                    window.open(staticPath.workReportByPerson, "_blank");
                  }}
                >
                  ► {t("report.selection.work_report_by_person")}
                </p>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
