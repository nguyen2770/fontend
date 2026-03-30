import React from "react";
import { Row, Col } from "antd";
import { assetType } from "../../../utils/constant";
import "./index.scss";
import { useTranslation } from "react-i18next";
export default function AssetDetailTab({ assetMaintenance }) {
  const { t } = useTranslation();
  if (!assetMaintenance) return null;
  return (
    <Row gutter={32} className="asset-detail-row">
      <Col span={8}>
        <div className="asset-detail-item">
          <span className="asset-detail-label">
            {t("myTask.asset_details.manufacturer")} :{" "}
          </span>
          <span className="asset-detail-value">
            {assetMaintenance?.assetModel?.manufacturer?.manufacturerName}
          </span>
        </div>
        <div className="asset-detail-item">
          <span className="asset-detail-label">
            {t("myTask.asset_details.asset_type")} :{" "}
          </span>
          <span className="asset-detail-value">
            {t(
              assetType.Options.find(
                (item) => item.value === assetMaintenance?.assetStyle
              )?.label || ""
            )}
          </span>
        </div>
        <div className="asset-detail-item">
          <span className="asset-detail-label">
            {t("myTask.asset_details.serial")} :{" "}
          </span>
          <span className="asset-detail-value">{assetMaintenance?.serial}</span>
        </div>
      </Col>
      <Col span={8}>
        <div className="asset-detail-item">
          <span className="asset-detail-label">
            {t("myTask.asset_details.main_category")} :{" "}
          </span>
          <span className="asset-detail-value">
            {assetMaintenance?.assetModel?.category?.categoryName}
          </span>
        </div>
        <div className="asset-detail-item">
          <span className="asset-detail-label">
            {t("myTask.asset_details.asset_name")} :{" "}
          </span>
          <span className="asset-detail-value">
            {assetMaintenance?.assetModel?.asset?.assetName}
          </span>
        </div>
        <div className="asset-detail-item">
          <span className="asset-detail-label">
            {t("myTask.asset_details.asset_number")} :{" "}
          </span>
          <span className="asset-detail-value">
            {assetMaintenance?.assetNumber}
          </span>
        </div>
      </Col>
      <Col span={8}>
        <div className="asset-detail-item">
          <span className="asset-detail-label">
            {t("myTask.asset_details.sub_category")} :{" "}
          </span>
          <span className="asset-detail-value">
            {assetMaintenance?.assetModel?.subCategory?.subCategoryName}
          </span>
        </div>
        <div className="asset-detail-item">
          <span className="asset-detail-label">
            {t("myTask.asset_details.model")} :{" "}
          </span>
          <span className="asset-detail-value">
            {assetMaintenance?.assetModel?.assetModelName}
          </span>
        </div>
      </Col>
    </Row>
  );
}
