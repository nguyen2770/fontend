import { CompassOutlined, FontColorsOutlined } from "@ant-design/icons";
import { lazy } from "react";
import { permissionCodeConstant } from "../utils/permissionConstant";
import { create } from "qrcode";
import { update } from "../api/spareCategoryApi";

export const calibrationManagementStaticPath = {
  calibration: "/calibration",
  calibrationCreate: "/calibration/create",
  calibrationView: "/calibration/view",
  calibrationUpdate: "/calibration/update",
  calibrationTask: "/calibration/calibration-work",
  calibrationWorkComment: "/calibration/calibration-work/comment",
  calibrationTaskView: "/calibration/calibration-work/view",
  myCalibrationTask: "/calibration/my-calibration-work",
  calbratedComfirm: "/calibration/my-calibration-work/calbrated-comfirm",
  groupCalibrationTask: "/calibration/group-calibration-work",
  calibrationContract: "/calibration/calibration-contract",
  createCalibrationContract: "/calibration/calibration-contract/create",
  viewCalibrationContract: "/calibration/calibration-contract/view",
  updateCalibrationContract: "/calibration/calibration-contract/update",
  calibrationMappingAssetMaintenance: "/calibration/calibration-contract/mapping-asset-maintenance",
  changeOfContractCalibration: "/calibration/calibration/change-of-contract",
};

export const routeCalibrationManagements = [
  {
    path: calibrationManagementStaticPath.calibration,
    exact: true,
    show_menu: true,
    icon: <CompassOutlined />,
    key: calibrationManagementStaticPath.calibration,
    label: "menu.maintenance_request.calibration_plan",
    component: lazy(() => import("../pages/workOrder/calibration/Calibration")),
    permisisonCode: permissionCodeConstant.calibration_view_list,
  },
  {
    path: calibrationManagementStaticPath.calibrationCreate,
    exact: true,
    show_menu: false,
    icon: <CompassOutlined />,
    key: calibrationManagementStaticPath.calibrationCreate,
    label: "menu.maintenance_request.calibration_plan",
    component: lazy(() =>
      import("../pages/workOrder/calibration/CreateCalibration")
    ),
    permisisonCode: permissionCodeConstant.calibration_create,
  },
  {
    path: calibrationManagementStaticPath.calibrationView + "/:id",
    exact: true,
    show_menu: false,
    icon: <CompassOutlined />,
    key: calibrationManagementStaticPath.calibrationView + "/:id",
    label: "menu.maintenance_request.calibration_plan",
    component: lazy(() =>
      import("../pages/workOrder/calibration/ViewCalibration")
    ),
    un_check_permission: true,
  },
  {
    path: calibrationManagementStaticPath.calibrationUpdate + "/:id",
    exact: true,
    show_menu: false,
    icon: <CompassOutlined />,
    key: calibrationManagementStaticPath.calibrationUpdate + "/:id",
    label: "menu.maintenance_request.calibration_plan",
    component: lazy(() =>
      import("../pages/workOrder/calibration/UpdateCalibration")
    ),
    permisisonCode: permissionCodeConstant.calibration_update,
  },
  {
    path: calibrationManagementStaticPath.calibrationTask,
    exact: true,
    show_menu: true,
    icon: <CompassOutlined />,
    key: calibrationManagementStaticPath.calibrationTask,
    label: "menu.maintenance_request.calibration_task",
    component: lazy(() =>
      import("../pages/workOrder/calibrationWork/CalibrationWork")
    ),
    permisisonCode: permissionCodeConstant.calibration_work_view_list,
  },
  {
    path: calibrationManagementStaticPath.calibrationWorkComment + "/:id",
    exact: true,
    show_menu: false,
    icon: <CompassOutlined />,
    key: calibrationManagementStaticPath.calibrationWorkComment + "/:id",
    label: "menu.maintenance_request.calbrated_work_comment",
    component: lazy(() =>
      import("../pages/workOrder/calibrationWork/CalibrationWorkComment")
    ),
    permisisonCode: permissionCodeConstant.calibration_work_commet,
  },
  {
    path: calibrationManagementStaticPath.calibrationTaskView + "/:id",
    exact: true,
    show_menu: false,
    icon: <CompassOutlined />,
    key: calibrationManagementStaticPath.calibrationTaskView + "/:id",
    label: "menu.maintenance_request.view_calibration_task",
    component: lazy(() =>
      import("../pages/workOrder/calibrationWork/ViewCalibrationWork")
    ),
    permisisonCode: permissionCodeConstant.calibration_work_view_detail,
  },
  {
    path: calibrationManagementStaticPath.myCalibrationTask,
    exact: true,
    show_menu: true,
    icon: <CompassOutlined />,
    key: calibrationManagementStaticPath.myCalibrationTask,
    label: "menu.maintenance_request.my_calibration_task",
    component: lazy(() =>
      import("../pages/workOrder/myCalibrationWork/MyCalibrationWork")
    ),
    permisisonCode: permissionCodeConstant.calibration_work_my_view_list,
  },
  {
    path: calibrationManagementStaticPath.calbratedComfirm + "/:id",
    exact: true,
    show_menu: false,
    icon: <CompassOutlined />,
    key: calibrationManagementStaticPath.calbratedComfirm + "/:id",
    label: "menu.maintenance_request.calbrated_comfirm",
    component: lazy(() =>
      import("../pages/workOrder/myCalibrationWork/CalibratedComfirm")
    ),
    permisisonCode: permissionCodeConstant.calibration_work_my_calbrated_comfirm,
  },
  {
    path: calibrationManagementStaticPath.groupCalibrationTask,
    exact: true,
    show_menu: true,
    icon: <CompassOutlined />,
    key: calibrationManagementStaticPath.groupCalibrationTask,
    label: "menu.maintenance_request.group_calibration_task",
    component: lazy(() =>
      import("../pages/workOrder/groupCalibrationWork/GroupCalibrationWork")
    ),
    permisisonCode: permissionCodeConstant.calibration_work_group_view_list,
  },
  {
    path: calibrationManagementStaticPath.calibrationContract,
    exact: true,
    show_menu: true,
    icon: <CompassOutlined />,
    key: calibrationManagementStaticPath.calibrationContract,
    label: "menu.maintenance_request.calibration_contract",
    component: lazy(() => import("../pages/workOrder/calibrationContract/CalibrationContract")),
    permisisonCode: permissionCodeConstant.calibration_work_contract_view_list,
  },
  {
    path: calibrationManagementStaticPath.createCalibrationContract,
    exact: true,
    show_menu: false,
    icon: <CompassOutlined />,
    key: calibrationManagementStaticPath.createCalibrationContract,
    label: "menu.maintenance_request.calibration_contract",
    component: lazy(() => import("../pages/workOrder/calibrationContract/CreateCalibrationContract")),
    un_check_permission: true,
  },
  {
    path: calibrationManagementStaticPath.updateCalibrationContract + "/:id",
    exact: true,
    show_menu: false,
    icon: <CompassOutlined />,
    key: calibrationManagementStaticPath.updateCalibrationContract + "/:id",
    label: "menu.maintenance_request.calibration_contract",
    component: lazy(() => import("../pages/workOrder/calibrationContract/UpdateCalibrationContract")),
    un_check_permission: true,
  },
  {
    path: calibrationManagementStaticPath.viewCalibrationContract + "/:id",
    exact: true,
    show_menu: false,
    icon: <CompassOutlined />,
    key: calibrationManagementStaticPath.viewCalibrationContract + "/:id",
    label: "menu.maintenance_request.calibration_contract",
    component: lazy(() => import("../pages/workOrder/calibrationContract/ViewCalibrationContract")),
    un_check_permission: true,
  },
  {
    path: calibrationManagementStaticPath.calibrationMappingAssetMaintenance + "/:id",
    exact: true,
    show_menu: false,
    icon: <CompassOutlined />,
    key: calibrationManagementStaticPath.calibrationMappingAssetMaintenance + "/:id",
    label: "menu.maintenance_request.calibration_contract",
    component: lazy(() => import("../pages/workOrder/calibrationContract/CalibrationMappingAssetMaintenance")),
    un_check_permission: true,
  },
  {
    path: calibrationManagementStaticPath.changeOfContractCalibration + "/:id",
    exact: true,
    show_menu: false,
    icon: <CompassOutlined />,
    key: calibrationManagementStaticPath.changeOfContractCalibration + "/:id",
    label: "menu.maintenance_request.calibration_contract",
    component: lazy(() => import("../pages/workOrder/calibration/changeOfContractCalibration")),
    un_check_permission: true,
  },
];
