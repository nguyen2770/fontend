import { AppstoreOutlined } from "@ant-design/icons";
import { Card, Col, Tooltip } from "antd";
import * as _unitOfWork from "../../../api";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { staticPath } from "../../../router/routerConfig";
const { Meta } = Card;

const AssetSummary = () => {
  const { t } = useTranslation();
  const [data, setData] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    getAssetSummary();
  }, []);

  const getAssetSummary = async () => {
    const res = await _unitOfWork.assetMaintenance.getAssetSummary();
    if (res) {
      setData(res.data);
    }
  };

  return (
    <Col span={12}>
      <Card variant="borderless" className="wp-100">
        <Meta
          avatar={<AppstoreOutlined />}
          title={t("dashboard.asset_summary.title")}
        />
        <div className="amc-card">
          <div
            className="amc-item"
            onClick={() => {
              navigate(`${staticPath.assetMaintenance}`);
            }}
          >
            <Tooltip title={t("dashboard.asset_summary.total_tooltip")}>
              <div>{data?.total || 0}</div>
              <div>{t("dashboard.cards.asset.total")}</div>
            </Tooltip>
          </div>
          <div
            className="amc-item"
            onClick={() => {
              // navigate(`${staticPath.workOrderBreakdown }`);
            }}
          >
            <Tooltip title={t("dashboard.asset_summary.breakdown_tooltip")}>
              <div>{data?.breakdown || 0}</div>
              <div>{t("dashboard.cards.asset.breakdown")}</div>
            </Tooltip>
          </div>
          <div
            className="amc-item"
            onClick={() => {
              // navigate(`${staticPath.workSchedulePreventive}`);
            }}
          >
            <Tooltip title={t("dashboard.asset_summary.preventive_tooltip")}>
              <div>{data?.schedulePreventive || 0}</div>
              <div>{t("dashboard.cards.asset.preventive")}</div>
            </Tooltip>
          </div>
          <div
            className="amc-item"
            onClick={() => {
              // navigate(`${staticPath.workSchedulePreventive}`);
            }}
          >
            <Tooltip title={t("dashboard.asset_summary.preventive_tooltip")}>
              <div>{data?.totalCalibrationGroupByAssetMaintenance || 0}</div>
              <div>{t("dashboard.cards.asset.preventive")}</div>
            </Tooltip>
          </div>
        </div>
      </Card>
    </Col>
  );
};

export default AssetSummary;
