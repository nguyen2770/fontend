import React from "react";
import { Row, Col } from "antd";
import { parseDateHH } from "../../../../helper/date-helper";
import {
  assetMaintenanceStatus,
  assetType,
  calibrationWorkStatus,
  priorityLevelStatus,
  priorityType,
  ticketStatuOptions,
} from "../../../../utils/constant";
import { parseToLabel } from "../../../../helper/parse-helper";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate } from "react-router-dom";
import { staticPath } from "../../../../router/routerConfig";

const labelStyle = { fontWeight: 500, minWidth: 120, display: "block" };
const valueStyle = {
  marginLeft: 0,
  display: "block",
  marginBottom: 8,
  fontWeight: 600,
};
const sectionStyle = {
  background: "#F3FDFF",
  padding: "8px 12px",
  fontWeight: 600,
  margin: "18px 0 8px 0",
  borderRadius: 4,
};

const TabsGeneralInformationCalibrationWork = ({ calibrationWork }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  if (!calibrationWork) return null;

  const onViewContract = (value) => {
    navigate(
      staticPath.viewCalibrationContract + "/" + (value.id || value._id),
    );
  };
  return (
    <div>
      <div style={sectionStyle}>
        {t("calibrationWork.detail.title_job_information")}
      </div>
      <Row gutter={32} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <span style={labelStyle}>
            {t("calibrationWork.detail.fields.calibration_code")}
          </span>
          <span style={valueStyle}>{calibrationWork?.code}</span>
        </Col>
        <Col span={8}>
          <span style={labelStyle}>
            {t("calibrationWork.detail.fields.calibration_name")}
          </span>
          <span style={valueStyle}>{calibrationWork?.calibrationName}</span>
        </Col>
        <Col span={8}>
          <span style={labelStyle}>
            {t("calibrationWork.detail.fields.calibration_date")}
          </span>
          <span style={valueStyle}>
            {parseDateHH(calibrationWork?.startDate)}
          </span>
        </Col>
        <Col span={8}>
          <span style={labelStyle}>
            {t("calibrationWork.detail.fields.status")}
          </span>
          <span
            style={{
              fontWeight: 600,
              color:
                calibrationWorkStatus.Options.find(
                  (opt) => opt.value === calibrationWork?.status,
                )?.color || "#333",
            }}
          >
            {t(
              calibrationWorkStatus.Options.find(
                (opt) => opt.value === calibrationWork?.status,
              )?.label,
            ) || "--"}
          </span>
        </Col>
        <Col span={8}>
          <span style={labelStyle}>
            {t("calibrationWork.detail.fields.priority")}
          </span>
          <span
            style={{
              fontWeight: 600,
              color:
                priorityType.Option.find(
                  (opt) => opt.value === calibrationWork?.importance,
                )?.color || "#333",
            }}
          >
            {t(
              priorityType.Option.find(
                (opt) => opt.value === calibrationWork?.importance,
              )?.label,
            ) || "--"}
          </span>
        </Col>
        {calibrationWork?.calibrationContract && (
          <Col
            span={8}
            onClick={() =>
              window.open(
                staticPath.viewCalibrationContract +
                  "/" +
                  (calibrationWork?.calibrationContract.id ||
                    calibrationWork?.calibrationContract._id),
                "_blank",
              )
            }
            style={{ cursor: "pointer", color: "#00FFFF" }}
          >
            <span style={labelStyle}>{t("calibration.contract")}</span>
            <span style={valueStyle}>
              {calibrationWork.calibrationContract.contractNo}
            </span>
          </Col>
        )}

        {calibrationWork.mostRecentCalibration && (
          <Col span={8}>
            <span style={labelStyle}>
              {t("calibrationWork.detail.fields.most_recent_calibration")}
            </span>
            <span style={valueStyle}>
              {parseDateHH(calibrationWork?.mostRecentCalibration)}
            </span>
          </Col>
        )}
        {calibrationWork.nextInspectionDate && (
          <Col span={8}>
            <span style={labelStyle}>
              {t("calibrationWork.detail.fields.next_inspection_date")}
            </span>
            <span style={valueStyle}>
              {parseDateHH(calibrationWork?.nextInspectionDate)}
            </span>
          </Col>
        )}
      </Row>

      <div style={sectionStyle}>
        {t("breakdown.viewTabs.general.sections.asset")}
      </div>
      <Row gutter={32} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <span style={labelStyle}>
            {t("breakdown.viewTabs.general.fields.manufacturer")}
          </span>
          <span style={valueStyle}>
            {calibrationWork?.assetMaintenance?.assetModel?.manufacturer
              ?.manufacturerName || "--"}
          </span>
        </Col>
        <Col span={8}>
          <span style={labelStyle}>
            {t("breakdown.viewTabs.general.fields.category")}
          </span>
          <span style={valueStyle}>
            {calibrationWork?.assetMaintenance?.assetModel?.category
              ?.categoryName || "--"}
          </span>
        </Col>
        <Col span={8}>
          <span style={labelStyle}>
            {t("breakdown.viewTabs.general.fields.type")}
          </span>
          <div style={valueStyle}>
            {calibrationWork?.assetMaintenance?.assetModel?.assetTypeCategory
              ?.name || "--"}
          </div>
        </Col>
        <Col span={8}>
          <span style={labelStyle}>
            {t("breakdown.viewTabs.general.fields.asset_style")}
          </span>
          <span style={valueStyle}>
            {t(
              assetType.Options.find(
                (item) =>
                  item.value === calibrationWork?.assetMaintenance?.assetStyle,
              )?.label || "",
            )}
          </span>
        </Col>
        <Col span={8}>
          <span style={labelStyle}>
            {t("breakdown.viewTabs.general.fields.asset_name")}
          </span>
          <span style={valueStyle}>
            {calibrationWork?.assetMaintenance?.assetModel?.asset?.assetName ||
              "--"}
          </span>
        </Col>
        <Col span={8}>
          <span style={labelStyle}>
            {t("breakdown.viewTabs.general.fields.model")}
          </span>
          <span style={valueStyle}>
            {calibrationWork?.assetMaintenance?.assetModel?.assetModelName ||
              "--"}
          </span>
        </Col>
        <Col span={8}>
          <span style={labelStyle}>{t("assetMaintenance.asset_number")}</span>
          <span style={valueStyle}>
            {calibrationWork?.assetMaintenance?.assetNumber || "--"}
          </span>
        </Col>
        <Col span={8}>
          <span style={labelStyle}>
            {t("breakdown.viewTabs.general.fields.serial")}
          </span>
          <span style={valueStyle}>
            {calibrationWork?.assetMaintenance?.serial || "--"}
          </span>
        </Col>
      </Row>

      <div style={sectionStyle}>
        {t("breakdown.viewTabs.general.sections.customer")}
      </div>
      <Row gutter={32} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <span style={labelStyle}>
            {t("breakdown.viewTabs.general.fields.customer_name")}
          </span>
          <span style={valueStyle}>
            {calibrationWork?.assetMaintenance?.customer?.customerName || "--"}
          </span>
        </Col>
        <Col span={8}>
          <span style={labelStyle}>
            {t("breakdown.viewTabs.general.fields.contact_number")}
          </span>
          <span style={valueStyle}>
            {calibrationWork?.assetMaintenance?.customer?.contactNumber || "--"}
          </span>
        </Col>
      </Row>
    </div>
  );
};

export default TabsGeneralInformationCalibrationWork;
