import React from "react";
import { Row, Col } from "antd";
import { parseDateHH } from "../../../../helper/date-helper";
import { assetMaintenanceStatus, assetType, priorityLevelStatus, ticketStatuOptions } from "../../../../utils/constant";
import { parseToLabel } from "../../../../helper/parse-helper";
import { useTranslation } from "react-i18next";

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

const TabsGeneralInformatio = ({ breakdown }) => {
  const { t } = useTranslation();
  if (!breakdown) return null;

  return (
    <div>
      <div style={sectionStyle}>{t("breakdown.viewTabs.general.sections.ticket")}</div>
      <Row gutter={32} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <span style={labelStyle}>{t("breakdown.viewTabs.general.fields.code")}</span>
          <span style={valueStyle}>{breakdown?.code}</span>
        </Col>
        <Col span={8}>
          <span style={labelStyle}>{t("breakdown.viewTabs.general.fields.opened_at")}</span>
          <span style={valueStyle}>{parseDateHH(breakdown?.createdAt)}</span>
        </Col>
        <Col span={8}>
          <span style={labelStyle}>{t("breakdown.viewTabs.general.fields.status")}</span>
          <span style={{ ...valueStyle }}>
            {t(ticketStatuOptions[
              breakdown?.ticketStatus
                ? breakdown?.ticketStatus.charAt(0).toUpperCase() +
                breakdown?.ticketStatus.slice(1)
                : ""
            ] || breakdown?.ticketStatus)}
          </span>
        </Col>
        <Col span={8}>
          <span style={labelStyle}>{t("breakdown.viewTabs.general.fields.priority")}</span>
          <span style={{
            fontWeight: 600,
            color: priorityLevelStatus.Options.find(
              opt => opt.value === breakdown?.priorityLevel
            )?.color || "#333"
          }}>
            {t(priorityLevelStatus.Options.find(
              opt => opt.value === breakdown?.priorityLevel
            )?.label) || "--"}
          </span>
        </Col>
        <Col span={8}>
          <span style={labelStyle}>{t("breakdown.viewTabs.general.fields.description")}</span>
          <span style={valueStyle}>{breakdown?.defectDescription ? breakdown?.defectDescription : "--"}</span>
        </Col>
        <Col span={8}>
          <span style={labelStyle}>{t("breakdown.viewTabs.general.fields.service_category")}</span>
          <span style={valueStyle}>
            {breakdown?.serviceCategory?.serviceCategoryName ? breakdown?.serviceCategory?.serviceCategoryName : "--"}
          </span>
        </Col>
        <Col span={8}>
          <span style={labelStyle}>{t("breakdown.viewTabs.general.fields.service_sub_category")}</span>
          <span style={valueStyle}>
            {breakdown?.serviceSubCategory?.serviceSubCategoryName ? breakdown?.serviceSubCategory?.serviceSubCategoryName : "--"}
          </span>
        </Col>
        <Col span={8}>
          <span style={labelStyle}>{t("breakdown.viewTabs.general.fields.asset_status")}</span>
          <span style={valueStyle}>
            {breakdown?.assetMaintenanceStatus ? t(parseToLabel(assetMaintenanceStatus.Options, breakdown?.assetMaintenanceStatus)) : "--"}
          </span>
        </Col>
        {
          breakdown.reasonCancel && (
            <Col span={8}>
              <span style={labelStyle}>{t("breakdown.viewTabs.general.fields.cancel_reason")}</span>
              <span
                className="reason-cancel-ellipsis"
                title={breakdown?.reasonCancel}
              >
                {breakdown?.reasonCancel || "--"}
              </span>
            </Col>
          )
        }
        {
          breakdown.reasonReopen && (
            <Col span={8}>
              <span style={labelStyle}>{t("breakdown.viewTabs.general.fields.reopen_reason")}</span>
              <span
                className="reason-cancel-ellipsis"
              >
                {breakdown?.reasonReopen || "--"}
              </span>
            </Col>
          )
        }

      </Row>

      <div style={sectionStyle}>{t("breakdown.viewTabs.general.sections.asset")}</div>
      <Row gutter={32} style={{ marginBottom: 20 }} >
        <Col span={8}>
          <span style={labelStyle}>{t("breakdown.viewTabs.general.fields.manufacturer")}</span>
          <span style={valueStyle}>{breakdown?.assetMaintenance?.assetModel?.manufacturer?.manufacturerName || "--"}</span>
        </Col>
        <Col span={8}>
          <span style={labelStyle}>{t("breakdown.viewTabs.general.fields.category")}</span>
          <span style={valueStyle}>{breakdown?.assetMaintenance?.assetModel?.category?.categoryName || "--"}</span>
        </Col>
        <Col span={8}>
          <span style={labelStyle}>{t("breakdown.viewTabs.general.fields.type")}</span>
          <div style={valueStyle}>{breakdown?.assetMaintenance?.assetModel?.assetTypeCategory?.name || "--"}</div>
        </Col>

        <Col span={8}>
          <span style={labelStyle}>{t("breakdown.viewTabs.general.fields.asset_style")}</span>
          <span style={valueStyle}>
            {t(assetType.Options.find(
              (item) =>
                item.value === breakdown?.assetMaintenance?.assetStyle
            )?.label || "")}
          </span>
        </Col>
        <Col span={8}>
          <span style={labelStyle}>{t("breakdown.viewTabs.general.fields.asset_name")}</span>
          <span style={valueStyle}>{breakdown?.assetMaintenance?.assetModel?.asset?.assetName || "--"}</span>
        </Col>
        <Col span={8}>
          <span style={labelStyle}>{t("breakdown.viewTabs.general.fields.model")}</span>
          <span style={valueStyle}>{breakdown?.assetMaintenance?.assetModel?.assetModelName || "--"}</span>
        </Col>
         <Col span={8}>
          <span style={labelStyle}>{t("assetMaintenance.asset_number")}</span>
          <span style={valueStyle}>
            {breakdown?.assetMaintenance?.assetNumber || "--"}
          </span>
        </Col>
        <Col span={8}>
          <span style={labelStyle}>{t("breakdown.viewTabs.general.fields.serial")}</span>
          <span style={valueStyle}>
            {breakdown?.assetMaintenance?.serial || "--"}
          </span>
        </Col>
        <Col span={8}>
          <span style={labelStyle}>{t("breakdown.viewTabs.general.fields.defect")}</span>
          <span style={valueStyle}>{breakdown?.breakdownDefect?.name || "--"}</span>
        </Col>
      </Row>

      <div style={sectionStyle}>{t("breakdown.viewTabs.general.sections.customer")}</div>
      <Row gutter={32} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <span style={labelStyle}>{t("breakdown.viewTabs.general.fields.customer_name")}</span>
          <span style={valueStyle}>{breakdown?.assetMaintenance?.customer?.customerName || "--"}</span>
        </Col>
        <Col span={8}>
          <span style={labelStyle}>{t("breakdown.viewTabs.general.fields.customer_location")}</span>
          <span style={valueStyle}>{breakdown?.assetMaintenance?.customer?.addressOne || "--"}</span>
        </Col>
        <Col span={8}>
          <span style={labelStyle}>{t("breakdown.viewTabs.general.fields.opened_by")}</span>
          <span style={valueStyle}>{breakdown?.createdBy?.fullName || "--"}</span>
        </Col>
        <Col span={8}>
          <span style={labelStyle}>{t("breakdown.viewTabs.general.fields.email")}</span>
          <span style={valueStyle}>{breakdown?.assetMaintenance?.customer?.contactEmail || "--"}</span>
        </Col>
        <Col span={8}>
          <span style={labelStyle}>{t("breakdown.viewTabs.general.fields.contact_number")}</span>
          <span style={valueStyle}>{breakdown?.assetMaintenance?.customer?.contactNumber || "--"}</span>
        </Col>
      </Row>
    </div>
  );
};

export default TabsGeneralInformatio;