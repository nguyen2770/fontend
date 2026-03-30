import {
  AlertOutlined,
  AlignCenterOutlined,
  CaretRightOutlined,
  ContactsOutlined,
  MinusSquareOutlined,
  OrderedListOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { lazy } from "react";
import { permissionCodeConstant } from "../utils/permissionConstant";
import { routeAmcs } from "./amcRouteConfig";
import { preventive } from "../api";

export const workOrderStaticPath = {
  workOrderPreventive: "/maintenance/work-order-preventive",
  createPreventive: "/maintenance/work-order-preventive/create",
  viewPreventive: "/maintenance/work-order-preventive/view",
  updatePreventive: "/maintenance/work-order-preventive/update",
  changeOfContractPreventive:
    "/maintenance/work-order-preventive/change-of-contract",
  workSchedulePreventive: "/maintenance/work-order-schedule-preventive",
  workOrderBreakdown: "/breakdown/work-order-breakdown",
  workOrderMyBreakdown: "/breakdown/work-order-my-breakdown",
  viewWorkOrderBreakdown: "/breakdown/work-order-breakdown/view",
  breakdownComment: "/breakdown/work-order-breakdown/comment",
  workOrderMonitoring: "/work-order-monitoring",
  schedulePreventiveCheckinCheckout: "/schedule-preventive/checkin-checkout",
  breakdownSpareRequest: "/breakdown/breakdownSpareRequest",
  mySchedulePreventive: "/maintenance/my-schedule-preventive",
  preventiveComment: "/breakdown/work-order-preventive/comment",
  viewSchedulePreventive: "/maintenance/work-order-schedule-preventive/view",
  schedulePreventiveComment:
    "/maintenance/work-order-schedule-preventive/comment",
  groupMaintenanceCard: "/maintenance/group-maintenance-card",
  requiredSparePartsPrevetive: "/maintenance/required-spare-parts-preventive",
  maintenanceContract: "/maintenance-contract",
  groupIncidentCard: "/breakdown/group-incident-card",
  repairContract: "/breakdown/repair-contract",
  createRepairContract: "/repair-contract/create",
  updateRepairContract: "/repair-contract/update",
  viewRepairContract: "/repair-contract/view",
  repairContractMappingAssetMaintenance: "/repair-contract/mapping",
  preventiveMonotoring: "/maintenance/preventive-monitoring",
  preventiveConditionBasedSchedule:
    "/maintenance/preventive-condition-based-schedule",
  propertyInspection: "/maintenance/property-inspection",
  viewPropertyInspection: "/maintenance/property-inspection/view",
  createPropertyInspection: "/maintenance/property-inspection/create",
  updatePropertyInspection: "/maintenance/property-inspection/update",
};

export const routeWorkOrders = [
  {
    path: workOrderStaticPath.workOrderPreventive,
    exact: true,
    show_menu: true,
    key: workOrderStaticPath.workOrderPreventive,
    icon: <ContactsOutlined />,
    label: "menu.maintenance_request.preventive",
    component: lazy(() => import("../pages/workOrder/preventive/Preventive")),
    permisisonCode: permissionCodeConstant.preventive_view_list,
  },
  {
    path: workOrderStaticPath.createPreventive,
    exact: true,
    show_menu: false,
    key: workOrderStaticPath.createPreventive,
    icon: <SolutionOutlined />,
    label: "Thêm mới bảo trì",
    component: lazy(
      () => import("../pages/workOrder/preventive/CreatePreventive"),
    ),
    permisisonCode: permissionCodeConstant.preventive_create,
  },
  {
    path: workOrderStaticPath.viewPreventive + "/:id",
    exact: true,
    show_menu: false,
    key: workOrderStaticPath.viewPreventive + "/:id",
    icon: <SolutionOutlined />,
    label: "Chi tiết bảo trì",
    component: lazy(
      () => import("../pages/workOrder/preventive/ViewPreventive"),
    ),
    permisisonCode: permissionCodeConstant.preventive_update,
  },
  {
    path: workOrderStaticPath.updatePreventive + "/:id",
    exact: true,
    show_menu: false,
    key: workOrderStaticPath.updatePreventive + "/:id",
    icon: <SolutionOutlined />,
    label: "Cập nhật bảo trì",
    component: lazy(
      () => import("../pages/workOrder/preventive/UpdatePreventive"),
    ),
    permisisonCode: permissionCodeConstant.preventive_update,
  },
  {
    path: workOrderStaticPath.changeOfContractPreventive + "/:id",
    exact: true,
    show_menu: false,
    key: workOrderStaticPath.changeOfContractPreventive + "/:id",
    icon: <SolutionOutlined />,
    label: "Thay đổi hợp đồng",
    component: lazy(
      () => import("../pages/workOrder/preventive/ChangeOfContractPreventive"),
    ),
    // permisisonCode: permissionCodeConstant.preventive_update,
    un_check_permission: true,
  },
  {
    path: workOrderStaticPath.workSchedulePreventive,
    exact: true,
    show_menu: true,
    key: workOrderStaticPath.workSchedulePreventive,
    icon: <ContactsOutlined />,
    label: "menu.maintenance_request.work_schedule_preventive",
    component: lazy(
      () => import("../pages/workOrder/schedulePreventive/SchedulePreventive"),
    ),
    permisisonCode: permissionCodeConstant.schedule_preventive_view_list,
  },
  {
    path: workOrderStaticPath.viewSchedulePreventive + "/:id",
    exact: true,
    show_menu: false,
    key: workOrderStaticPath.viewSchedulePreventive + "/:id",
    icon: <CaretRightOutlined />,
    label: "Chi tiết lịch bảo trì",
    component: lazy(
      () =>
        import("../pages/workOrder//schedulePreventive/ViewSchedulePreventive"),
    ),
    permisisonCode: permissionCodeConstant.schedule_preventive_view_detail,
  },
  {
    path: workOrderStaticPath.mySchedulePreventive,
    exact: true,
    show_menu: true,
    key: workOrderStaticPath.mySchedulePreventive,
    icon: <ContactsOutlined />,
    label: "menu.maintenance_request.my_task",
    component: lazy(() => import("../pages/workOrder/myTask/MyTask")),
    permisisonCode:
      permissionCodeConstant.schedule_preventive_my_task_view_list,
  },
  {
    path: workOrderStaticPath.schedulePreventiveCheckinCheckout + "/:id",
    exact: true,
    show_menu: false,
    key: workOrderStaticPath.schedulePreventiveCheckinCheckout + "/:id",
    icon: <SolutionOutlined />,
    label: "Checkin - Checkout",
    component: lazy(() => import("../pages/workOrder/myTask/CheckinCheckout")),
    permisisonCode:
      permissionCodeConstant.schedule_preventive_my_task_checkin_checkout,
  },

  {
    path: workOrderStaticPath.schedulePreventiveComment + "/:id",
    exact: true,
    show_menu: false,
    key: workOrderStaticPath.schedulePreventiveComment + "/:id",
    icon: <SolutionOutlined />,
    label: "Comment schedule preventive ",
    component: lazy(
      () =>
        import("../pages/workOrder/schedulePreventive/schedulePreventiveComment"),
    ),
    permisisonCode: permissionCodeConstant.schedule_preventive_comment,
  },
  {
    path: workOrderStaticPath.groupMaintenanceCard,
    exact: true,
    show_menu: true,
    key: workOrderStaticPath.groupMaintenanceCard,
    icon: <ContactsOutlined />,
    label: "menu.maintenance_request.group_maintenance_card",
    component: lazy(
      () =>
        import("../pages/workOrder/groupMaintenanceCard/GroupMaintenanceCard"),
    ),
    permisisonCode: permissionCodeConstant.schedule_preventive_group_view_list,
  },
  {
    path: workOrderStaticPath.requiredSparePartsPrevetive,
    exact: true,
    show_menu: true,
    key: workOrderStaticPath.requiredSparePartsPrevetive,
    icon: <ContactsOutlined />,
    label: "menu.maintenance_request.required_spare_parts_prevetive",
    component: lazy(
      () =>
        import("../pages/workOrder/requiredSparePartsPrevetive/RequiredSparePartsSchedulePrevetiveTask"),
    ),
    permisisonCode:
      permissionCodeConstant.required_spare_part_schedule_preventive_view_list,
  },
  ...routeAmcs,
  // {
  //   path: workOrderStaticPath.preventiveMonotoring,
  //   exact: true,
  //   show_menu: true,
  //   key: workOrderStaticPath.preventiveMonotoring,
  //   icon: <ContactsOutlined />,
  //   label: "menu.maintenance_request.preventive_monitoring",
  //   component: lazy(() =>
  //     import("../pages/workOrder/preventiveMonitoring/PreventiveMonitoring")
  //   ),
  //   permisisonCode: permissionCodeConstant.preventive_monitoring_view_list,
  // },
  {
    path: workOrderStaticPath.preventiveConditionBasedSchedule,
    exact: true,
    show_menu: true,
    key: workOrderStaticPath.preventiveConditionBasedSchedule,
    icon: <ContactsOutlined />,
    label: "menu.maintenance_request.preventive_condition_based_schedule",
    component: lazy(
      () =>
        import("../pages/workOrder/preventiveConditionBasedSchedule/PreventiveConditionBasedSchedule"),
    ),
    permisisonCode:
      permissionCodeConstant.preventive_conditioon_based_schedule_view_list,
  },
  {
    path: workOrderStaticPath.propertyInspection,
    exact: true,
    show_menu: true,
    key: workOrderStaticPath.propertyInspection,
    icon: <ContactsOutlined />,
    label: "propertyInspection.title_menu",
    component: lazy(
      () => import("../pages/workOrder/propertyInspection/PropertyInspection"),
    ),
    permisisonCode: permissionCodeConstant.property_inspection_view,
  },
  {
    path: workOrderStaticPath.viewPropertyInspection + "/:id",
    exact: true,
    show_menu: false,
    key: workOrderStaticPath.viewPropertyInspection + "/:id",
    icon: <ContactsOutlined />,
    label: "Chi tiết kiểm tra tài sản",
    component: lazy(
      () =>
        import("../pages/workOrder/propertyInspection/ViewPropertyInspection"),
    ),
    permisisonCode: permissionCodeConstant.property_inspection_view,
  },
  {
    path: workOrderStaticPath.createPropertyInspection,
    exact: true,
    show_menu: false,
    key: workOrderStaticPath.createPropertyInspection,
    icon: <ContactsOutlined />,
    label: "Thêm mới kiểm tra tài sản",
    component: lazy(
      () =>
        import("../pages/workOrder/propertyInspection/CreatePropertyInspection"),
    ),
    permisisonCode: permissionCodeConstant.property_inspection_create,
  },
  {
    path: workOrderStaticPath.updatePropertyInspection + "/:id",
    exact: true,
    show_menu: false,
    key: workOrderStaticPath.updatePropertyInspection + "/:id",
    icon: <ContactsOutlined />,
    label: "Cập nhật kiểm tra tài sản",
    component: lazy(
      () =>
        import("../pages/workOrder/propertyInspection/UpdatePropertyInspection"),
    ),
    permisisonCode: permissionCodeConstant.property_inspection_update,
  },
  {
    path: workOrderStaticPath.createRepairContract,
    exact: true,
    show_menu: false,
    key: workOrderStaticPath.createRepairContract,
    icon: <ContactsOutlined />,
    label: "menu.maintenance_request.repair_contract",
    component: lazy(
      () => import("../pages/workOrder/repairContract/CreateRepairContract"),
    ),
    un_check_permission: true,
  },
  {
    path: workOrderStaticPath.updateRepairContract + "/:id",
    exact: true,
    show_menu: false,
    key: workOrderStaticPath.updateRepairContract + "/:id",
    icon: <ContactsOutlined />,
    label: "menu.maintenance_request.repair_contract",
    component: lazy(
      () => import("../pages/workOrder/repairContract/UpdateRepairContract"),
    ),
    un_check_permission: true,
  },
  {
    path: workOrderStaticPath.viewRepairContract + "/:id",
    exact: true,
    show_menu: false,
    key: workOrderStaticPath.viewRepairContract + "/:id",
    icon: <ContactsOutlined />,
    label: "menu.maintenance_request.repair_contract",
    component: lazy(
      () => import("../pages/workOrder/repairContract/ViewRepairContract"),
    ),
    un_check_permission: true,
  },
  {
    path: workOrderStaticPath.repairContractMappingAssetMaintenance + "/:id",
    exact: true,
    show_menu: false,
    key: workOrderStaticPath.repairContractMappingAssetMaintenance + "/:id",
    icon: <ContactsOutlined />,
    label: "menu.maintenance_request.repair_contract",
    component: lazy(
      () =>
        import("../pages/workOrder/repairContract/RepairContractMappingAssetMaintenance"),
    ),
    un_check_permission: true,
  },
  //  {
  //   path: workOrderStaticPath.maintenanceContract,
  //   exact: true,
  //   show_menu: true,
  //   key: workOrderStaticPath.maintenanceContract,
  //   icon: <SolutionOutlined />,
  //   label: "menu.maintenance_request.maintenance_contract",
  //   component: lazy(() =>
  //     import("../pages/workOrder/maintenanceContract/MaintenanceContract")
  //   ),
  //   un_check_permission: true,
  // },
];
