import { Badge, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import "./index.scss";
import { useLocation } from "react-router-dom";
import DashbroadTab from "./Dashbroad";
import ComparisonDashbroardTab from "./ComparisonDashbroard";
import KPBIndicatorTab from "./KPBIndicators";
import MyCalender from "./myCalender/MyCalender";
import AssetMaintenanceDueInspection from "./AssetMaintenanceDueInspection";
import useHeader from "../../contexts/headerContext";
import * as _unitOfWork from "../../api";
import {
  AppstoreAddOutlined,
  BlockOutlined,
  DashboardOutlined,
  FieldTimeOutlined,
  HomeOutlined,
  PieChartOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import QuickApproval from "./QuickApproval";
import OperationalMetricsTab from "./OperationalMetrics";
import JobSummary from "./jobSummary";
import { useTranslation } from "react-i18next";
const Dashbroad = () => <DashbroadTab />;
const ComparisonDashbroard = () => <ComparisonDashbroardTab />;
const KPBIndicator = () => <KPBIndicatorTab />;
const OperationalMetrics = () => <OperationalMetricsTab />;
const MyCalenders = () => <MyCalender />;
const JobSummaryTab = () => <JobSummary />;

export default function Home() {
  const { t } = useTranslation();
  const { setHeaderTitle } = useHeader();
  const [quickApprovalTotal, setQuickApprovalTotal] = useState(0);
  useEffect(() => {
    setHeaderTitle(t("dashboard.tabs.home"));
    fetchQuickApprovalTotal();
  }, []);

  const fetchQuickApprovalTotal = async () => {
    try {
      const payload = { page: 1, limit: 1 };
      const res = await _unitOfWork.report.getApproveWorks(payload);
      if (res && res.data) {
        setQuickApprovalTotal(res.data.totalResults);
      }
    } catch (err) {
      console.error("Error fetching quick approval total:", err);
    }
  };
  const location = useLocation();
  const tabFromState = location.state?.tab || "1";
  const items = [
    {
      key: "1",
      label: t("dashboard.tabs.main"),
      children: <Dashbroad />,
      icon: <AppstoreAddOutlined />,
    },
    {
      key: "2",
      label: t("dashboard.tabs.comparison"),
      children: <ComparisonDashbroard />,
      icon: <PieChartOutlined />,
    },
    {
      key: "3",
      label: t("dashboard.tabs.kpi"),
      children: <KPBIndicator />,
      icon: <DashboardOutlined />,
    },
    {
      key: "4",
      label: t("dashboard.tabs.operational"),
      children: <OperationalMetrics />,
      icon: <FieldTimeOutlined />,
    },
    // {
    //   key: "5",
    //   label: t("dashboard.tabs.inspection_calibration_due_date"),
    //   children: <AssetMaintenanceDueInspections />,
    //   icon: <ScheduleOutlined />,
    // },
    {
      key: "6",
      label:
        quickApprovalTotal && quickApprovalTotal > 0 ? (
          <Badge
            className="approve-icon-dashbroad"
            count={quickApprovalTotal}
            size="small"
            offset={[6, 0]}
          >
            <span>{t("dashboard.tabs.quick_approval")}</span>
          </Badge>
        ) : (
          <span>{t("dashboard.tabs.quick_approval")}</span>
        ),
      children: <QuickApproval onTotalChange={setQuickApprovalTotal} />,
      icon: <HomeOutlined />,
    },
    {
      key: "7",
      label: t("dashboard.tabs.my_calendar"),
      children: <MyCalenders />,
      icon: <ScheduleOutlined />,
    },
    {
      key: "8",
      label: t("Tổng hợp công việc"),
      children: <JobSummaryTab />,
      icon: <BlockOutlined />,
    },
  ];
  return (
    <Tabs
      defaultActiveKey={tabFromState}
      items={items}
      className="tab-all tabs-home"
    />
  );
}
