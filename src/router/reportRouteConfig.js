import { ApartmentOutlined, SolutionOutlined } from "@ant-design/icons";
import { lazy } from "react";
import { permissionCodeConstant } from "../utils/permissionConstant";

export const reportStaticPath = {
  report: "/report",
  spareMovementReport: "/spare-movement-report",
  sparePartsUsageSummaryReport: "/spare-usage-summary-report",
  assetMaintenanceReport: "/asset-report",
  assetPerformance: "/asset-performance",
  assetDepreciation: "/asset-depreciation",
  processingStatusReportBreakdown: "/processing-status-report-breakdown",
  processingStatusReportSchedulePreventive:
    "/processing-status-report-schedule-preventive",
  reportAssetMaintenanceRequest: "/report-assetMaintenance-request",
  reportEngineerPerformanceInBreakdown:
    "/report-engineer-performance-in-breakdown",
  reportEngineerPerformanceInSchedulePreventive:
    "/report-engineer-performance-in-schedulePreventive",
  workReportByPerson: "/work-report-by-person",
  listWorkReportByPerson: "/work-report-by-person/list",
  assetMaintenanceCostReport: "/asset-maintenance-cost-report",
};

export const routeReport = [
  {
    key: reportStaticPath.report,
    path: reportStaticPath.report,
    label: "menu.reports.root",
    show_menu: true,
    icon: <ApartmentOutlined />,
    component: lazy(() => import("../pages/report")),
    un_check_permission: true,
  },
  {
    key: reportStaticPath.spareMovementReport,
    path: reportStaticPath.spareMovementReport,
    label: "Báo cáo sử dụng phụ tùng",
    icon: <ApartmentOutlined />,
    component: lazy(() => import("../pages/report/sparePart/SparePartsUsage")),
    permisisonCode: permissionCodeConstant.report_spare_movement_report,
  },
  {
    key: reportStaticPath.sparePartsUsageSummaryReport,
    path: reportStaticPath.sparePartsUsageSummaryReport,
    label: "Báo cáo tổng hợp sử dụng phụ tùng",
    icon: <ApartmentOutlined />,
    component: lazy(
      () => import("../pages/report/sparePart/SparePartsUsageSummaryReport"),
    ),
    permisisonCode:
      permissionCodeConstant.report_spare_parts_usage_summary_report,
  },
  {
    key: reportStaticPath.assetMaintenanceReport,
    path: reportStaticPath.assetMaintenanceReport,
    label: "Báo cáo tài sản",
    icon: <ApartmentOutlined />,
    component: lazy(
      () => import("../pages/report/assetMaintenance/AssetMaintenanceReport"),
    ),
    permisisonCode: permissionCodeConstant.report_asset_maintenance,
  },
  {
    key: reportStaticPath.assetPerformance,
    path: reportStaticPath.assetPerformance,
    label: "Báo cáo hiệu suất tài sản",
    icon: <ApartmentOutlined />,
    component: lazy(
      () => import("../pages/report/assetMaintenance/AssetPerformance"),
    ),
    permisisonCode: permissionCodeConstant.report_asset_performance,
  },
  {
    key: reportStaticPath.assetDepreciation,
    path: reportStaticPath.assetDepreciation,
    label: "Báo cáo khấu hao tài sản",
    icon: <ApartmentOutlined />,
    component: lazy(
      () => import("../pages/report/assetMaintenance/AssetDepreciation"),
    ),
    permisisonCode: permissionCodeConstant.report_asset_depreciation,
  },
  {
    path: reportStaticPath.processingStatusReportBreakdown,
    exact: true,
    show_menu: false,
    icon: <SolutionOutlined />,
    key: reportStaticPath.processingStatusReportBreakdown,
    label: "Báo cáo tình hình xử lý sự cố",
    component: lazy(
      () =>
        import("../pages/report/reportBreakdown/ProcessingStatusReportBreakdown"),
    ),
    permisisonCode:
      permissionCodeConstant.report_processing_status_report_breakdown,
  },
  {
    path: reportStaticPath.processingStatusReportSchedulePreventive,
    exact: true,
    show_menu: false,
    icon: <SolutionOutlined />,
    key: reportStaticPath.processingStatusReportSchedulePreventive,
    label: "Báo cáo tình hình xử lý công việc",
    component: lazy(
      () =>
        import("../pages/report/reportSchedulePreventive/ProcessingStatusReportSchedulePreventive"),
    ),
    permisisonCode:
      permissionCodeConstant.report_processing_status_report_schedule_preventive,
  },
  {
    path: reportStaticPath.reportAssetMaintenanceRequest,
    exact: true,
    show_menu: false,
    icon: <SolutionOutlined />,
    key: reportStaticPath.reportAssetMaintenanceRequest,
    label: "menu.maintenance_request.root",
    component: lazy(
      () =>
        import("../pages/report/reportAssetMaintenanceRequest/ReportAssetMaintenanceRequest"),
    ),
    permisisonCode: permissionCodeConstant.report_report_asset_maintenance,
  },
  {
    path: reportStaticPath.reportEngineerPerformanceInBreakdown,
    exact: true,
    show_menu: false,
    icon: <SolutionOutlined />,
    key: reportStaticPath.reportEngineerPerformanceInBreakdown,
    label: "Báo cáo hiệu suất kỹ sư trong sự cố",
    component: lazy(
      () =>
        import("../pages/report/reportBreakdown/ReportEngineerPerformanceInBreakdown"),
    ),
    permisisonCode:
      permissionCodeConstant.report_report_engineer_performance_in_breakdown,
  },
  {
    path: reportStaticPath.reportEngineerPerformanceInSchedulePreventive,
    exact: true,
    show_menu: false,
    icon: <SolutionOutlined />,
    key: reportStaticPath.reportEngineerPerformanceInSchedulePreventive,
    label: "Báo cáo hiệu suất kỹ sư trong công việc",
    component: lazy(
      () =>
        import("../pages/report/reportSchedulePreventive/ReportEngineerPerformanceInSchedulePreventive"),
    ),
    permisisonCode:
      permissionCodeConstant.report_report_engineer_performance_in_schedule_preventive,
  },
  {
    path: reportStaticPath.workReportByPerson,
    exact: true,
    show_menu: false,
    icon: <SolutionOutlined />,
    key: reportStaticPath.workReportByPerson,
    label: "Báo cáo công việc theo người thực hiện",
    component: lazy(() => import("../pages/report/general/WorkReportByPerson")),
    permisisonCode: permissionCodeConstant.report_work_report_by_person,
  },
  {
    path: reportStaticPath.listWorkReportByPerson,
    exact: true,
    show_menu: false,
    icon: <SolutionOutlined />,
    key: reportStaticPath.listWorkReportByPerson,
    label: "Báo cáo công việc theo người thực hiện",
    component: lazy(
      () => import("../pages/report/general/ListWorkReportByPerSon"),
    ),
    permisisonCode: permissionCodeConstant.report_work_report_by_person,
  },
  {
    path: reportStaticPath.assetMaintenanceCostReport,
    exact: true,
    show_menu: false,
    icon: <SolutionOutlined />,
    key: reportStaticPath.assetMaintenanceCostReport,
    label: "Báo cáo chi phí bảo trì tài sản",
    component: lazy(
      () => import("../pages/report/contractReport/AssetMaintenanceCostReport"),
    ),
    un_check_permission: true, // chưa check
  },
];
