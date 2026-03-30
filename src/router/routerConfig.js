import {
  AlertOutlined,
  AlignCenterOutlined,
  ApartmentOutlined,
  AppstoreOutlined,
  BorderlessTableOutlined,
  BranchesOutlined,
  BuildOutlined,
  CloudServerOutlined,
  CodepenCircleOutlined,
  CompassOutlined,
  ContactsOutlined,
  ContainerOutlined,
  CustomerServiceOutlined,
  DatabaseOutlined,
  ForwardOutlined,
  MinusOutlined,
  MinusSquareOutlined,
  ScissorOutlined,
  SettingOutlined,
  ShoppingOutlined,
  SolutionOutlined,
  UnlockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { lazy } from "react";

import {
  receiptStaticPath,
  routeReceipts,
} from "./receiptPurchaseRouterConfig";
import {
  routePurchaseOrders,
  purchaseOrderStaticPath,
} from "./purchaseOrderRouteConfig";
import {
  routeRequestPurchase,
  requestPurchaseStaticPath,
} from "./requestPurchaseRouteConfig";
import {
  routeSuppliesNeedOrders,
  suppliesNeedStaticPath,
} from "./suppliesNeedRouterConfig";
import { requestIssueStaticPath } from "./requestIssueRouteConfig";
import {
  routeAssetMaintenances,
  assetMaintenanceStaticPath,
} from "./assetMaintenanceRouteConfig";
import { routeWorkOrders, workOrderStaticPath } from "./workOrderRouteConfig";
import {
  purchaseQuotationStaticPath,
  routePurchaseQuotation,
} from "./quotationRouteConfig";
import {
  routeSparePartManagers,
  staticPathSparePartManager,
} from "./sparePartManagerRouteConfig";
import { amcStaticPath, routeAmcs } from "./amcRouteConfig";
import { routeRoles, roleStaticPath } from "./roleRouteConfig";
import { routeUoms, uomStaticPath } from "./uomRouteConfig";
import {
  routeCalibrationManagements,
  calibrationManagementStaticPath,
} from "./calibrationManagementRouteConfig";
import { reportStaticPath, routeReport } from "./reportRouteConfig";
import {
  routeWarehouseManagements,
  warehouseManagementStaticPath,
} from "./warehouseManagementRouteConfig";
import { routeServices, staticPathService } from "./serviceRouterConfig";
import {
  inventoryAssetStaticPath,
  routeinventoryAssets,
} from "./inventoryAssetRouteConfig";
import { checkPermission } from "../helper/permission-helper";
import { STORAGE_KEY } from "../utils/constant";
import { permissionCodeConstant } from "../utils/permissionConstant";
export const staticPath = {
  home: "/trang-chu",
  setting: "/cai-dat",
  group: "/cai-dat/nhom-nguoi-dung",
  upserMapping: "/cai-dat/nhom-nguoi-dung/mapping-user",
  user: "/cai-dat/phan-quyen/nguoi-dung",
  UserMappingAsset: "/cai-dat/phan-quyen/nguoi-dung/mapping-asset",
  serverContractors: "/cai-dat/nha-thau-dich-vu",
  serverContractorUserMapping: "/cai-dat/nha-thau-dich-vu-mapping-user",
  assetSetup: "/cai-dat/thiet-lap-tai-san",
  //serverce
  services: "/cai-dat/dich-vu",
  createService: "/cai-dat/dich-vu/them-moi",
  updateService: "/cai-dat/dich-vu/cap-nhat",
  detailService: "/cai-dat/dich-vu/chi-tiet",
  //servicesPackage
  servicesPackage: "/cai-dat/supplier/goi-dich-vu",
  createServicesPackage: "/cai-dat/supplier/goi-dich-vu/create",
  updateServicesPackage: "/cai-dat/supplier/goi-dich-vu/update",
  detailServicesPackage: "/cai-dat/supplier/goi-dich-vu/view",
  reminder: "/cai-dat/goi-dich-vu/nhac-nho",
  //breackdownTicketSLA
  breackdownTicketSLA: "/cai-dat/SLA",
  createBreackdownTicketSLA: "/cai-dat/SLA/them-moi",

  //
  reminderEscalation: "/cai-dat/nhac-nho-nang-cap",
  createReminderEscalation: "/cai-dat/nhac-nho-nang-cap/them-moi",
  updateReminderEscalation: "/cai-dat/nhac-nho-nang-cap/cap-nhat",
  viewReminderEscalation: "/cai-dat/nhac-nho-nang-cap/chi-tiet",
  //
  contractandCompliance: "/cai-dat/hop-dong-tuan-thu",
  taxtGroup: "/cai-dat/common/nhom-thue",
  createTaxGroup: "/cai-dat/common/nhom-thue/create",
  updateTaxGroup: "/cai-dat/common/nhom-thue/update",
  //
  labelConfiguration: "/cai-dat/common/cau-hinh-nhan",
  //
  bulkImportLogs: "/cai-dat/nhat-ky-nhap-hang",
  viewBulkImportLogs: "/cai-dat/nhat-ky-nhap-hang/chi-tiet",
  //
  systemSettings: "/cai-dat/cai-dat-he-thong",
  levelofApproval: "/cai-dat/level-of-approval",
  configurationWorkflow: "/cai-dat/common/configuration-work",
  NotificationConfiguration: "/cai-dat/notification-configuration",
  ...staticPathService,
  //asset maintenance
  ...assetMaintenanceStaticPath,
  customer: "/cai-dat/customer",
  reportForm: "/mau-don-bao-cao",
  //work-order
  ...workOrderStaticPath,
  // purchase
  purchase: "/purchase",
  ...suppliesNeedStaticPath,
  ...requestPurchaseStaticPath,
  ...purchaseQuotationStaticPath,
  ...purchaseOrderStaticPath,
  // Inventory
  inventory: "/inventory",
  inventoryManagement: "/inventory/management",
  ...receiptStaticPath,
  ...requestIssueStaticPath,
  //stock
  branch: "/branch",
  supplier: "/cai-dat/nha-cung-cap",
  ...staticPathSparePartManager,
  ...amcStaticPath,
  ...roleStaticPath,
  building: "/building",
  floor: "/floor",
  department: "/department",
  companySetting: "/cai-dat/common/cau-hinh-cong-ty",
  ...reportStaticPath,
  ...uomStaticPath,
  notificationSetting: "/cai-dat/common/notification-setting",
  ...calibrationManagementStaticPath,
  ...warehouseManagementStaticPath,
  equipmentClassification: "/cai-dat/asset/equipment-classification",
  sparePartsClassification: "/cai-dat/asset/spare-parts-classification",
  location: "/cai-dat/location",
  supplierInformation: "/cai-dat/supplier/supplier-information",
  ...inventoryAssetStaticPath
};

export const routes = [
  {
    path: staticPath.home,
    exact: true,
    show_menu: false,
    key: staticPath.home,
    icon: <UserOutlined />,
    label: "Trang chủ",
    component: lazy(() => import("../pages/home")),
    un_check_permission: true,
  },
  {
    path: assetMaintenanceStaticPath.assetMaintenance,
    exact: true,
    show_menu: true,
    key: assetMaintenanceStaticPath.assetMaintenance,
    icon: <CodepenCircleOutlined />,
    label: "menu.asset_management.root",
    component: lazy(() => import("../pages/manager/assetMaintenance")),
    permisisonCode: permissionCodeConstant.asset_view_list,
  },
  {
    path: staticPath.createAssetMaintenance,
    exact: true,
    show_menu: false,
    key: staticPath.createAssetMaintenance,
    component: lazy(() =>
      import("../pages/manager/assetMaintenance/CreateAssetMaintenance")
    ),
    permisisonCode: permissionCodeConstant.asset_create,
  },
  {
    path: assetMaintenanceStaticPath.updateAssetMaintenance + "/:id",
    exact: true,
    show_menu: false,
    key: assetMaintenanceStaticPath.updateAssetMaintenance + "/:id",
    component: lazy(() =>
      import("../pages/manager/assetMaintenance/UpdateAssetMaintenance")
    ),
    permisisonCode: permissionCodeConstant.asset_update,
  },
  {
    path: assetMaintenanceStaticPath.viewAssetMaintenance + "/:id",
    exact: true,
    show_menu: false,
    key: assetMaintenanceStaticPath.viewAssetMaintenance + "/:id",
    component: lazy(() =>
      import("../pages/manager/assetMaintenance/ViewAssetMaintaenance")
    ),
    permisisonCode: permissionCodeConstant.asset_view_detail,
  },
  {
    path: assetMaintenanceStaticPath.searchQrCodeAssetMaintenance,
    exact: true,
    show_menu: false,
    key: assetMaintenanceStaticPath.searchQrCodeAssetMaintenance,
    component: lazy(() =>
      import("../pages/manager/assetMaintenance/SearchAssetMaintenanceQrCode")
    ),
    permisisonCode: permissionCodeConstant.asset_search_Qr_code,
  },
  {
    key: "/maintenance",
    exact: true,
    show_menu: true,
    icon: <ContactsOutlined />,
    label: "menu.maintenance_request.maintenance_management",
    un_check_permission: true,
    children: [...routeWorkOrders],
  },
  {
    key: "/breakdown",
    exact: true,
    show_menu: true,
    icon: <AlertOutlined />,
    label: "menu.maintenance_request.incident_management",
    un_check_permission: true,
    children: [
      {
        path: workOrderStaticPath.workOrderBreakdown,
        exact: true,
        show_menu: true,
        key: workOrderStaticPath.workOrderBreakdown,
        icon: <AlertOutlined />,
        label: "menu.maintenance_request.breakdown",
        component: lazy(() => import("../pages/workOrder/breakdown/Breakdown")),
        permisisonCode: permissionCodeConstant.breakdown_view_list,
      },
      {
        path: workOrderStaticPath.viewWorkOrderBreakdown + "/:id",
        exact: true,
        show_menu: false,
        key: workOrderStaticPath.viewWorkOrderBreakdown + "/:id",
        icon: <AlertOutlined />,
        label: "View Breakdown ",
        component: lazy(() =>
          import("../pages/workOrder/breakdown/ViewBreakdown")
        ),
        permisisonCode: permissionCodeConstant.breakdown_view_detail,
      },
      {
        path: workOrderStaticPath.breakdownComment + "/:id",
        exact: true,
        show_menu: false,
        key: workOrderStaticPath.breakdownComment + "/:id",
        icon: <AlertOutlined />,
        label: "Comment Breakdown ",
        component: lazy(() =>
          import("../pages/workOrder/breakdown/BreakdownComment")
        ),
        permisisonCode: permissionCodeConstant.breakdown_comment,
      },
      {
        path: workOrderStaticPath.workOrderMyBreakdown,
        exact: true,
        show_menu: true,
        key: workOrderStaticPath.workOrderMyBreakdown,
        icon: <AlertOutlined />,
        label: "menu.maintenance_request.ticket",
        component: lazy(() =>
          import("../pages/workOrder/myBreakdown/MyBreakdown")
        ),
        permisisonCode: permissionCodeConstant.ticket_view_list,
      },
      {
        path: workOrderStaticPath.groupIncidentCard,
        exact: true,
        show_menu: true,
        key: workOrderStaticPath.groupIncidentCard,
        icon: <AlertOutlined />,
        label: "menu.maintenance_request.group_incident_card",
        component: lazy(() =>
          import("../pages/workOrder/groupIncidentCard/GroupIncidentCard")
        ),
        permisisonCode: permissionCodeConstant.breakdown_group_view_list,
      },
      {
        path: workOrderStaticPath.breakdownSpareRequest,
        exact: true,
        show_menu: true,
        key: workOrderStaticPath.breakdownSpareRequest,
        icon: <AlertOutlined />,
        label: "menu.maintenance_request.required_spare_parts_breakdown",
        component: lazy(() =>
          import("../pages/workOrder/breakdown/sparePartRequest")
        ),
        permisisonCode: permissionCodeConstant.spare_view_list,
      },
      {
        path: workOrderStaticPath.repairContract,
        exact: true,
        show_menu: true,
        key: workOrderStaticPath.repairContract,
        icon: <AlertOutlined />,
        label: "menu.maintenance_request.repair_contract",
        component: lazy(() =>
          import("../pages/workOrder/repairContract/RepairContract")
        ),
        permisisonCode: permissionCodeConstant.breakdown_contract_view_list,
      },
      // {
      //   path: workOrderStaticPath.workOrderMonitoring,
      //   exact: true,
      //   show_menu: true,
      //   key: workOrderStaticPath.workOrderMonitoring,
      //   icon: <SolutionOutlined />,
      //   label: "Monitoring",
      //   component: lazy(() => import("../pages/workOrder/monitoring/Monitoring")),
      // },
      {
        path: workOrderStaticPath.preventiveComment + "/:id",
        exact: true,
        show_menu: false,
        key: workOrderStaticPath.preventiveComment + "/:id",
        // icon: <SolutionOutlined />,
        label: "Comment Breakdown ",
        component: lazy(() =>
          import("../pages/workOrder/preventive/PreventiveComment")
        ),
        // permisisonCode: permisisonCode.prev   // chưa sử dụng
      },
    ],
  },
  {
    key: "/calibration",
    exact: true,
    show_menu: true,
    icon: <CompassOutlined />,
    label: "menu.maintenance_request.calibration_management",
    un_check_permission: true,
    children: [...routeCalibrationManagements],
  },
  {
    path: staticPath.purchase,
    exact: true,
    show_menu: true,
    key: staticPath.purchase,
    icon: <ShoppingOutlined />,
    label: "menu.purchase.root",
    // un_check_permission: true,
    permisisonCodes: [
      permissionCodeConstant.material_request_view,
      permissionCodeConstant.purchase_request_view,
      permissionCodeConstant.quotation_view_list,
      permissionCodeConstant.purchase_order_view,
      permissionCodeConstant.equipment_hierarchy_view_list,
    ],
    children: [
      ...routeSuppliesNeedOrders,
      ...routeRequestPurchase,
      ...routePurchaseQuotation,
      ...routePurchaseOrders,
    ],
  },
  {
    key: "/stock",
    exact: true,
    show_menu: true,
    icon: <CloudServerOutlined />,
    label: "menu.warehouse_management.title_warehouse_management",
    un_check_permission: true,
    children: [...routeWarehouseManagements],
  },
  {
    path: staticPath.inventory,
    exact: true,
    show_menu: true,
    key: staticPath.inventory,
    icon: <AppstoreOutlined />,
    label: "Kho",
    // children: [

    //   ...routeReceipts,
    //   ...routeRequestIssue,
    //   ...routeReceiptIssues,
    //   ...routeReturnToSuppliers,
    //   {
    //     path: staticPath.inventoryManagement,
    //     exact: true,
    //     show_menu: true,
    //     key: staticPath.inventoryManagement,
    //     icon: <BuildOutlined />,
    //     label: "Tồn kho",
    //     component: lazy(() => import("../pages/purchase/inventory")),
    //   },
    //   // ...routeInternalReceipt,
    //   // ...routePeriodClosings,
    // ],
  },
  {
    path: staticPath.reportForm,
    exact: true,
    show_menu: false,
    key: staticPath.reportForm,
    label: "Mẫu đơn báo cáo",
    component: lazy(() => import("../pages/manager/reportForm")),
    // permisisonCode: permissionCodeConstant.re
    //không tìm thấy chỗ dùng
  },
  ...routeinventoryAssets,
  ...routeReport,
  {
    key: staticPath.setting,
    // path: staticPath.setting,
    label: "menu.settings.root",
    show_menu: true,
    un_check_permission: true,
    icon: <SettingOutlined />,
    children: [
      {
        key: "/cai-dat/asset",
        exact: true,
        show_menu: true,
        label: "menu.settings.asset",
        icon: <SettingOutlined />,
        un_check_permission: true,
        children: [
          {
            path: staticPath.equipmentClassification,
            exact: true,
            show_menu: true,
            // icon: <SettingOutlined />,
            key: staticPath.equipmentClassification,
            label: "menu.settings.equipment_classification",
            component: lazy(() =>
              import("../pages/setting/asset/EquipmentClassification")
            ),
            un_check_permission: true,
          },
          {
            path: assetMaintenanceStaticPath.assetModel,
            exact: true,
            show_menu: true,
            // icon: <ForwardOutlined />,
            key: assetMaintenanceStaticPath.assetModel,
            label: "menu.asset_setup.model",
            component: lazy(() =>
              import("../pages/manager/assetSetup/assetModel")
            ),
            permisisonCode: permissionCodeConstant.equipment_model_view_list,
          },
          {
            path: staticPath.sparePartsClassification,
            exact: true,
            show_menu: true,
            // icon: <ForwardOutlined />,
            key: staticPath.sparePartsClassification,
            label: "menu.spare_parts_classification.spare_parts_classification",
            component: lazy(() =>
              import(
                "../pages/setting/sparePartsClassification/SparePartsClassification"
              )
            ),
            un_check_permission: true,
          },
          {
            path: staticPathSparePartManager.spareParts,
            exact: true,
            show_menu: true,
            key: staticPathSparePartManager.spareParts,
            label: "menu.spare_parts_classification.spare_parts",
            // icon: <ScissorOutlined />,
            component: lazy(() => import("../pages/manager/spareParts")),
            permisisonCode:
              permissionCodeConstant.spare_part_replacement_view_list, // chưa checl
          },
          {
            path: staticPathSparePartManager.searchQRCodeSparePart,
            exact: true,
            show_menu: false,
            key: staticPathSparePartManager.searchQRCodeSparePart,
            component: lazy(() => import("../pages/manager/spareParts/SearchSparePartQrCode")),
            un_check_permission: true,

          },
          {
            path: assetMaintenanceStaticPath.manuafcturer,
            exact: true,
            show_menu: true,
            // icon: <ContainerOutlined />,
            key: assetMaintenanceStaticPath.manuafcturer,
            label: "menu.asset_setup.manufacturer",
            component: lazy(() =>
              import("../pages/manager/assetSetup/manufacturer")
            ),
            permisisonCode: permissionCodeConstant.manufacturer_view_list,
          },
          ...routeUoms,
        ],
      },
      // {
      //   path: staticPath.building,
      //   exact: true,
      //   show_menu: true,
      //   key: staticPath.building,
      //   label: "menu.settings.building",
      //   component: lazy(() => import("../pages/manager/customer/building")),
      //   permisisonCode: permissionCodeConstant.building_view_list,
      // },
      {
        path: staticPath.location,
        label: "menu.localtion.title_localtion",
        exact: true,
        key: staticPath.location,
        show_menu: true,
        icon: <SettingOutlined />,
        component: lazy(() => import("../pages/setting/localtion/Location")),
        un_check_permission: true,
      },
      {
        path: staticPath.customer,
        exact: true,
        show_menu: true,
        key: staticPath.customer,
        icon: <SettingOutlined />,
        label: "menu.customer.root",
        component: lazy(() => import("../pages/manager/customer")),
        permisisonCode: permissionCodeConstant.customer_view_list,
      },
      {
        key: "/cai-dat/supplier",
        exact: true,
        show_menu: true,
        label: "menu.settings.supplier",
        icon: <SettingOutlined />,
        un_check_permission: true,
        children: [
          {
            path: staticPath.supplierInformation,
            exact: true,
            show_menu: true,
            key: staticPath.supplierInformation,
            // icon: <CustomerServiceOutlined />,
            label: "menu.settings.supplier_information",
            component: lazy(() =>
              import("../pages/setting/supplier/SupplierServiceContractor")
            ),
            un_check_permission: true,
          },
          {
            path: staticPathService.services,
            exact: true,
            show_menu: true,
            // icon: <CustomerServiceOutlined />,
            key: staticPathService.services,
            label: "menu.settings.service",
            component: lazy(() => import("../pages/manager/services")),
            un_check_permission: true,
          },
          {
            path: staticPath.servicesPackage,
            exact: true,
            show_menu: true,
            key: staticPath.servicesPackage,
            // icon: <CustomerServiceOutlined />,
            label: "menu.settings.service_package",
            component: lazy(() => import("../pages/manager/servicesPackage")),
            permisisonCode: permissionCodeConstant.service_package_view_list,
          },
          //chưa sử dụng
          // {
          //   path: staticPath.contractandCompliance,
          //   exact: true,
          //   show_menu: true,
          //   key: staticPath.contractandCompliance,
          //   // icon: <CustomerServiceOutlined />,
          //   label: "menu.settings.contract",
          //   component: lazy(() => import("../pages/manager/contractCompliance")),
          //   permisisonCodes: [
          //     permissionCodeConstant.compliance_view_list,
          //     permissionCodeConstant.contractand_view_list,
          //   ],
          // },
        ],
      },
      {
        key: "/cai-dat/phan-quyen",
        exact: true,
        show_menu: true,
        label: "menu.settings.decentralization",
        icon: <SettingOutlined />,
        un_check_permission: true,
        children: [
          ...routeRoles,
          {
            path: staticPath.user,
            exact: true,
            show_menu: true,
            key: staticPath.user,
            // icon: <SettingOutlined />,
            label: "menu.settings.user",
            component: lazy(() => import("../pages/manager/user")),
            permisisonCode: permissionCodeConstant.view_list_user,
          },
        ],
      },
      {
        key: "/cai-dat/common",
        exact: true,
        show_menu: true,
        label: "menu.settings.common",
        icon: <SettingOutlined />,
        un_check_permission: true,
        children: [
          {
            path: staticPath.companySetting,
            exact: true,
            show_menu: true,
            // icon: <SettingOutlined />,
            key: staticPath.companySetting,
            label: "menu.settings.configuration",
            component: lazy(() =>
              import("../pages/manager/companySetting/companySetting")
            ),
            permisisonCode: permissionCodeConstant.company_setting_view_list,
          },
          // {
          //   path: staticPath.taxtGroup,
          //   exact: true,
          //   show_menu: true,
          //   // icon: <SettingOutlined />,
          //   key: staticPath.taxtGroup,
          //   label: "menu.settings.tax_group",
          //   component: lazy(() => import("../pages/manager/taxGroup")),
          //   permisisonCode: permissionCodeConstant.tax_group_view_list,
          // },
          {
            path: staticPath.notificationSetting,
            exact: true,
            show_menu: true,
            // icon: <SettingOutlined />,
            key: staticPath.notificationSetting,
            label: "menu.settings.notification_configuration",
            component: lazy(() =>
              import("../pages/manager/notificationSetting/NotificationSetting")
            ),
            permisisonCode: permissionCodeConstant.company_setting_view_list, // chưa check
          },
          {
            path: staticPath.configurationWorkflow,
            exact: true,
            show_menu: true,
            // icon: <SettingOutlined />,
            key: staticPath.configurationWorkflow,
            label: "menu.settings.configuration_process",
            component: lazy(() =>
              import("../pages/manager/configurationWorkflow")
            ),
            permisisonCode:
              permissionCodeConstant.configuration_workflow_view_list,
          },
        ],
      },
      {
        path: staticPath.floor,
        exact: true,
        show_menu: false,
        key: staticPath.floor,
        label: "menu.settings.floor",
        component: lazy(() => import("../pages/manager/customer/floor")),
        permisisonCode: permissionCodeConstant.floor_view_list,
      },
      {
        path: staticPath.department,
        exact: true,
        show_menu: false,
        key: staticPath.department,
        label: "menu.settings.department",
        component: lazy(() => import("../pages//manager/customer/department")),
        permisisonCode: permissionCodeConstant.department_view_list,
      },
      {
        path: staticPath.branch,
        exact: true,
        show_menu: false,
        key: staticPath.branch,
        label: "menu.settings.branch",
        component: lazy(() => import("../pages/manager/branch")),
        permisisonCode: permissionCodeConstant.branch_view_list,
      },
      {
        path: staticPath.UserMappingAsset + "/:id",
        exact: true,
        show_menu: false,
        key: staticPath.UserMappingAsset + "/:id",
        label: "Người dùng",
        component: lazy(() =>
          import("../pages/manager/user/MappingAssetMainteance")
        ),
        permisisonCode: permissionCodeConstant.mapping_user_asset,
      },
      // {
      //   path: staticPath.group,
      //   exact: true,
      //   show_menu: true,
      //   key: staticPath.group,
      //   label: "Nhóm người dùng",
      //   component: lazy(() => import("../pages/manager/group")),
      // },

      {
        path: staticPath.upserMapping,
        exact: true,
        show_menu: false,
        key: staticPath.upserMapping,
        label: "userMapping",
        component: lazy(() => import("../pages/manager/group/UserMapping")),
        un_check_permission: true,
      },
      {
        path: staticPath.serverContractors,
        exact: true,
        show_menu: false,
        key: staticPath.serverContractors,
        label: "menu.settings.service_contractor",
        component: lazy(() => import("../pages/manager/serviceContractors")),
        permisisonCode: permissionCodeConstant.service_contractor_list,
      },
      {
        path: staticPath.serverContractorUserMapping + "/:id",
        exact: true,
        show_menu: false,
        key: staticPath.serverContractorUserMapping + "/:id",
        label: "Mapping user service contractor",
        component: lazy(() =>
          import(
            "../pages/manager/serviceContractors/ServiceContractorUserMapping"
          )
        ),
        permisisonCode: permissionCodeConstant.service_contractor_map_user,
      },
      // {
      //   path: staticPath.assetSetup,
      //   exact: true,
      //   show_menu: true,
      //   key: staticPath.assetSetup,
      //   label: "Asset setup",
      //   component: lazy(() => import("../pages/manager/assetSetup")),
      // },
      {
        path: staticPath.services,
        exact: true,
        show_menu: false,
        key: staticPath.services,
        label: "menu.settings.service",
        component: lazy(() => import("../pages/manager/services")),
        permisisonCode: permissionCodeConstant.service_view_list,
      },
      {
        path: staticPath.createService,
        exact: true,
        show_menu: false,
        key: staticPath.createService,
        label: "Thêm mới dịch vụ",
        component: lazy(() =>
          import("../pages/manager/services/CreateService")
        ),
        permisisonCode: permissionCodeConstant.service_create,
      },
      {
        path: staticPath.updateService + "/:id",
        exact: true,
        show_menu: false,
        key: staticPath.updateService + "/:id",
        label: "Cập nhật dịch vụ",
        component: lazy(() =>
          import("../pages/manager/services/UpdateService")
        ),
        permisisonCode: permissionCodeConstant.service_update,
      },

      {
        path: staticPath.detailService + "/:id",
        exact: true,
        show_menu: false,
        key: staticPath.detailService + "/:id",
        label: "Chi tiết dịch vụ",
        component: lazy(() =>
          import("../pages/manager/services/DetailService")
        ),
        un_check_permission: true,
        //chưa sử dụng
      },
      {
        path: staticPath.createServicesPackage,
        exact: true,
        show_menu: false,
        key: staticPath.createServicesPackage,
        label: "Thêm mới gói dịch vụ",
        component: lazy(() =>
          import("../pages/manager/servicesPackage/CreateServicePackage")
        ),
        permisisonCode: permissionCodeConstant.service_package_create,
      },
      {
        path: staticPath.updateServicesPackage + "/:id",
        exact: true,
        show_menu: false,
        key: staticPath.updateServicesPackage + "/:id",
        label: "Cập nhật gói dịch vụ",
        component: lazy(() =>
          import("../pages/manager/servicesPackage/UpdateServicePackage")
        ),
        permisisonCode: permissionCodeConstant.service_package_update,
      },
      {
        path: staticPath.detailServicesPackage + "/:id",
        exact: true,
        show_menu: false,
        key: staticPath.detailServicesPackage + "/:id",
        label: "Chi tiết gói dịch vụ",
        component: lazy(() =>
          import("../pages/manager/servicesPackage/DetailServicePackage")
        ),
        permisisonCode: permissionCodeConstant.service_package_view_detail,
      },
      {
        path: staticPath.reminder + "/:id",
        exact: true,
        show_menu: false,
        key: staticPath.reminder + "/:id",
        label: "Nhắc nhở",
        component: lazy(() =>
          import("../pages/manager/servicesPackage/Reminder")
        ),
        permisisonCode: permissionCodeConstant.reminder_view, // chưa được sử dụng
      },
      // {
      //   path: staticPath.breackdownTicketSLA,
      //   exact: true,
      //   show_menu: true,
      //   key: staticPath.breackdownTicketSLA,
      //   label: "Breakdown Ticket SLA",
      //   component: lazy(() => import("../pages/manager/breakkdownTicketSLA")),
      // },
      // {
      //   path: staticPath.createBreackdownTicketSLA,
      //   exact: true,
      //   show_menu: false,
      //   key: staticPath.createBreackdownTicketSLA,
      //   label: "Nhắc nhở",
      //   component: lazy(() =>
      //     import("../pages/manager/breakkdownTicketSLA/CreateSLA")
      //   ),
      //   //  permisisonCode: permissionCodeConstant.tick
      // },
      // {
      //   path: staticPath.reminderEscalation,
      //   exact: true,
      //   show_menu: true,
      //   key: staticPath.reminderEscalation,
      //   label: "Nhắc nhở và nâng cấp",
      //   component: lazy(() => import("../pages/manager/reminderEscalation")),
      // },
      // {
      //   path: staticPath.createReminderEscalation,
      //   exact: true,
      //   show_menu: false,
      //   key: staticPath.createReminderEscalation,
      //   label: "Nhắc nhở",
      //   component: lazy(() =>
      //     import("../pages/manager/reminderEscalation/CreateReminderEscalation")
      //   ),
      // },
      // {
      //   path: staticPath.updateReminderEscalation + "/:id",
      //   exact: true,
      //   show_menu: false,
      //   key: staticPath.updateReminderEscalation + "/:id",
      //   label: "Nhắc nhở",
      //   component: lazy(() =>
      //     import("../pages/manager/reminderEscalation/UpdateReminderEscalation")
      //   ),
      // },
      // {
      //   path: staticPath.viewReminderEscalation + "/:id",
      //   exact: true,
      //   show_menu: false,
      //   key: staticPath.viewReminderEscalation + "/:id",
      //   label: "Nhắc nhở",
      //   component: lazy(() =>
      //     import("../pages/manager/reminderEscalation/ViewReminderEscalation")
      //   ),
      // },
      {
        path: staticPath.createTaxGroup,
        exact: true,
        show_menu: false,
        key: staticPath.createTaxGroup,
        label: "Thêm mới nhóm thuế",
        component: lazy(() =>
          import("../pages/manager/taxGroup//CreateTaxGroup")
        ),
        permisisonCode: permissionCodeConstant.tax_group_create,
      },
      {
        path: staticPath.updateTaxGroup + "/:id",
        exact: true,
        show_menu: false,
        key: staticPath.updateTaxGroup + "/:id",
        label: "Cập nhật nhóm thuế",
        component: lazy(() =>
          import("../pages/manager/taxGroup/UpdateTaxGroup")
        ),
        permisisonCode: permissionCodeConstant.tax_group_update,
      },
      // {
      //   path: staticPath.labelConfiguration,
      //   exact: true,
      //   show_menu: true,
      //   key: staticPath.labelConfiguration,
      //   label: "Cấu hình nhãn",
      //   component: lazy(() => import("../pages/manager/labelConfiguration")),
      // },

      // {
      //   path: staticPath.bulkImportLogs,
      //   exact: true,
      //   show_menu: true,
      //   key: staticPath.bulkImportLogs,
      //   label: "Nhật ký nhập hàng",
      //   component: lazy(() => import("../pages/manager/bulkImportLogs")),
      // },
      // {
      //   path: staticPath.viewBulkImportLogs + "/:id",
      //   exact: true,
      //   show_menu: false,
      //   key: staticPath.viewBulkImportLogs + "/:id",
      //   label: "Chi tiết",
      //   component: lazy(() =>
      //     import("../pages/manager/bulkImportLogs/ViewBulkImportLogs")
      //   ),
      // },

      // {
      //   path: staticPath.systemSettings,
      //   exact: true,
      //   show_menu: true,
      //   key: staticPath.systemSettings,
      //   label: "Cài đặt hệ thống",
      //   component: lazy(() => import("../pages/manager/systemSettings")),
      // },
      // {
      //   path: staticPath.levelofApproval,
      //   exact: true,
      //   show_menu: true,
      //   key: staticPath.levelofApproval,
      //   label: "Level Of Approval",
      //   component: lazy(() => import("../pages/manager/levelOfApproval")),
      // },
      // {
      //   path: staticPath.NotificationConfiguration,
      //   exact: true,
      //   show_menu: true,
      //   key: staticPath.NotificationConfiguration,
      //   label: "Notification Configuration",
      //   component: lazy(() =>
      //     import("../pages/manager/notificationConfiguration")
      //   ),
      // },
    ],
  },
  {
    path: staticPath.assetSetup,
    exact: true,
    show_menu: false,
    key: staticPath.assetSetup,
    icon: <SettingOutlined />,
    label: "menu.asset_setup.root",
    component: lazy(() => import("../pages/manager/assetMaintenance")),
    un_check_permission: true,
    children: [...routeAssetMaintenances],
  },
  {
    path: staticPathSparePartManager.sparePart,
    exact: true,
    show_menu: false,
    key: staticPathSparePartManager.sparePart,
    icon: <SettingOutlined />,
    label: "menu.spare_parts_classification.root",
    // component: lazy(() => import("../pages/manager/assetMaintenance")),
    un_check_permission: true,
    children: [...routeSparePartManagers],
  },
];
// export const flatRoutes = (_routers = routes) => {
//   let flatRoutes = [];
//   const permissions = JSON.parse(localStorage.getItem(STORAGE_KEY.PERMISSION));
//   _routers.forEach((item) => {
//     if (item.children) {
//       const _children = item.children.filter(
//         (c) =>
//           c.un_check_permission ||
//           (c.permisisonCodes &&
//             c.permisisonCodes.findIndex((pc) =>
//               checkPermission(permissions, pc)
//             ) > -1) ||
//           checkPermission(permissions, c.permisisonCode)
//       );

//       flatRoutes.push(..._children);
//     } else {
//       if (
//         item.un_check_permission ||
//         checkPermission(permissions, item.permisisonCode)
//       ) {
//         item.path && flatRoutes.push(item);
//       }
//       // else {
//       //   item.path && flatRoutes.push(item);
//       // }
//     }
//   });
//   // flatRoutes = flatRoutes.filter((r) => !r.permissionCode || checkPermission(r.permissionCode));
//   return flatRoutes;
// };
export const flatRoutes = (_routers = routes) => {
  let flatRoutes = [];
  const permissions = JSON.parse(localStorage.getItem(STORAGE_KEY.PERMISSION));

  const flatten = (routers) => {
    routers.forEach((item) => {
      // Kiểm tra quyền
      const hasPermission =
        item.un_check_permission ||
        checkPermission(permissions, item.permisisonCode) ||
        (item.permisisonCodes &&
          item.permisisonCodes.some((pc) => checkPermission(permissions, pc)));

      // Nếu có children → đệ quy
      if (item.children && item.children.length > 0) {
        flatten(item.children);
      }

      // Nếu có quyền và có path thì thêm vào danh sách
      if (hasPermission && item.path) {
        flatRoutes.push(item);
      }
    });
  };

  flatten(_routers);
  return flatRoutes;
};

// function flatRouteConfig(routes) {
//   let flatRoutes = [];
//   Array.isArray(routes) &&
//     routes.forEach((item) => {
//       if (item.children && !item.hide_on_sidebar) {
//         flatRoutes.push(...item.children);
//       } else {
//         if (!item.hide_on_sidebar) {
//           item.path && flatRoutes.push(item);
//         }
//       }
//     });
//   // flatRoutes = flatRoutes.filter((r) => !r.code || checkPermission(r.code));
//   return flatRoutes;
// }

// export const flatConfig = flatRouteConfig(routes);

// export default routes;
