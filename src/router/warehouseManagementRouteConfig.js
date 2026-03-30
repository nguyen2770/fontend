import { CloudServerOutlined, FontColorsOutlined } from "@ant-design/icons";
import { lazy } from "react";
import { permissionCodeConstant } from "../utils/permissionConstant";

export const warehouseManagementStaticPath = {
  warehouseReceipt: "/stock/warehouse-receipt",
  createStockReceipt: "/stock/warehouse-receipt/create",
  updateStockReceipt: "/stock/warehouse-receipt/update",
  approveStockReceipt: "/stock/warehouse-receipt/approve",

  usedWarehouseDelivery: "/stock/used-warehouse-delivery",
  usedWarehouseDeliveryCreate: "/stock/used-warehouse-delivery/create",
  usedWarehouseDeliveryUpdate: "/stock/used-warehouse-delivery/update",
  usedWarehouseDeliveryApproved: "/stock/used-warehouse-delivery/approve",

  liquidationWarehouseReceipt: "/stock/liquidation-warehouse-receipt",
  liquidationWarehouseReceiptCreate:
    "/stock/liquidation-warehouse-receipt/create",
  liquidationWarehouseReceiptUpdate:
    "/stock/liquidation-warehouse-receipt/update",
  liquidationWarehouseReceiptApproved:
    "/stock/liquidation-warehouse-receipt/approve",

  equipmenWarehouse: "/stock/equipmen-warehouse",
  sparePartsComponentsWarehouse: "/stock/spare-parts-components-warehouse",
  stockLocation: "/stock/stockLocation",
  warehouseAwaitingLiquidation: "/stock/warehouse-awaiting-liquidation",
};

export const routeWarehouseManagements = [
  {
    path: warehouseManagementStaticPath.stockLocation,
    exact: true,
    show_menu: true,
    icon: <CloudServerOutlined />,
    key: warehouseManagementStaticPath.stockLocation,
    label: "Danh sách kho",
    component: lazy(() => import("../pages/purchase/stockLocation")),
    un_check_permission: true, // chưa check
  },
  {
    path: warehouseManagementStaticPath.warehouseAwaitingLiquidation,
    exact: true,
    show_menu: true,
    icon: <CloudServerOutlined />,
    key: warehouseManagementStaticPath.warehouseAwaitingLiquidation,
    label: "Kho chờ thanh lý",
    component: lazy(
      () => import("../pages/purchase/warehouseAwaitingLiquidation"),
    ),
    un_check_permission: true, //chưa check
  },
  {
    path: warehouseManagementStaticPath.warehouseReceipt,
    exact: true,
    show_menu: true,
    icon: <CloudServerOutlined />,
    key: warehouseManagementStaticPath.warehouseReceipt,
    label: "menu.warehouse_management.warehouse_receipt",
    component: lazy(() => import("../pages/purchase/receiptPurchase")),
    permisisonCode: permissionCodeConstant.stock_receipt_view_request,
  },
  {
    path: warehouseManagementStaticPath.createStockReceipt,
    exact: true,
    show_menu: false,
    key: warehouseManagementStaticPath.createStockReceipt,
    label: "Thêm mới phiếu nhập kho",
    component: lazy(
      () => import("../pages/purchase/receiptPurchase/CreateReceiptPurchase"),
    ),
    un_check_permission: true,
  },
  {
    path: warehouseManagementStaticPath.updateStockReceipt + "/:id",
    exact: true,
    show_menu: false,
    key: warehouseManagementStaticPath.updateStockReceipt + "/:id",
    label: "update phiếu nhập kho",
    component: lazy(
      () => import("../pages/purchase/receiptPurchase/UpdateReceiptPurchase"),
    ),
    un_check_permission: true,
  },
  {
    path: warehouseManagementStaticPath.approveStockReceipt + "/:id",
    exact: true,
    show_menu: false,
    key: warehouseManagementStaticPath.approveStockReceipt + "/:id",
    label: "update phiếu nhập kho",
    component: lazy(
      () => import("../pages/purchase/receiptPurchase/approveReceiptPurchase"),
    ),
    un_check_permission: true,
  },
  {
    path: warehouseManagementStaticPath.usedWarehouseDelivery,
    exact: true,
    show_menu: true,
    icon: <CloudServerOutlined />,
    key: warehouseManagementStaticPath.usedWarehouseDelivery,
    label: "menu.warehouse_management.used_warehouse_delivery",
    component: lazy(
      () => import("../pages/warehouseManagement/usedWarehouseDelivery"),
    ),
    permisisonCode: permissionCodeConstant.stock_issue_use_view_request,
  },
  {
    path: warehouseManagementStaticPath.usedWarehouseDeliveryCreate,
    exact: true,
    show_menu: false,
    key: warehouseManagementStaticPath.usedWarehouseDeliveryCreate,
    label: "Xuất kho sử dụng",
    component: lazy(
      () =>
        import("../pages/warehouseManagement/usedWarehouseDelivery/CreateReceiptIssue"),
    ),
    un_check_permission: true,
  },
  {
    path: warehouseManagementStaticPath.usedWarehouseDeliveryUpdate + "/:id",
    exact: true,
    show_menu: false,
    key: warehouseManagementStaticPath.usedWarehouseDeliveryUpdate + "/:id",
    label: "Xuất kho ",
    component: lazy(
      () =>
        import("../pages/warehouseManagement/usedWarehouseDelivery/UpdateReceiptIssue"),
    ),
    un_check_permission: true,
  },
  {
    path: warehouseManagementStaticPath.usedWarehouseDeliveryApproved + "/:id",
    exact: true,
    show_menu: false,
    key: warehouseManagementStaticPath.usedWarehouseDeliveryApproved + "/:id",
    label: "Xuất kho ",
    component: lazy(
      () =>
        import("../pages/warehouseManagement/usedWarehouseDelivery/ApprovalReceiptIssue"),
    ),
    un_check_permission: true,
  },
  {
    path: warehouseManagementStaticPath.liquidationWarehouseReceipt,
    exact: true,
    show_menu: true,
    icon: <CloudServerOutlined />,
    key: warehouseManagementStaticPath.liquidationWarehouseReceipt,
    label: "menu.warehouse_management.liquidation receipt",
    component: lazy(
      () => import("../pages/warehouseManagement/liquidationWarehouseReceipt"),
    ),
    permisisonCode: permissionCodeConstant.stock_issue_liquidation_view_request,
  },
  {
    path: warehouseManagementStaticPath.liquidationWarehouseReceiptCreate,
    exact: true,
    show_menu: false,
    key: warehouseManagementStaticPath.liquidationWarehouseReceiptCreate,
    label: "Xuất kho thanh lý",
    component: lazy(
      () =>
        import("../pages/warehouseManagement/liquidationWarehouseReceipt/CreateReceiptIssue"),
    ),
    un_check_permission: true,
  },
  {
    path:
      warehouseManagementStaticPath.liquidationWarehouseReceiptUpdate + "/:id",
    exact: true,
    show_menu: false,
    key:
      warehouseManagementStaticPath.liquidationWarehouseReceiptUpdate + "/:id",
    label: "Xuất kho ",
    component: lazy(
      () =>
        import("../pages/warehouseManagement/liquidationWarehouseReceipt/UpdateReceiptIssue"),
    ),
    un_check_permission: true,
  },
  {
    path:
      warehouseManagementStaticPath.liquidationWarehouseReceiptApproved +
      "/:id",
    exact: true,
    show_menu: false,
    key:
      warehouseManagementStaticPath.liquidationWarehouseReceiptApproved +
      "/:id",
    label: "Xuất kho ",
    component: lazy(
      () =>
        import("../pages/warehouseManagement/liquidationWarehouseReceipt/ApprovalReceiptIssue"),
    ),
    un_check_permission: true,
  },
  {
    path: warehouseManagementStaticPath.equipmenWarehouse,
    exact: true,
    show_menu: true,
    icon: <CloudServerOutlined />,
    key: warehouseManagementStaticPath.equipmenWarehouse,
    label: "menu.warehouse_management.equipmen_warehouse",
    component: lazy(
      () => import("../pages/purchase/inventory/AssetsInventory"),
    ),
    permisisonCode: permissionCodeConstant.inventory_assets,
  },
  // {
  //     path: warehouseManagementStaticPath.createReceiptIssue,
  //     exact: true,
  //     show_menu: false,
  //     key: warehouseManagementStaticPath.createReceiptIssue,
  //     label: "Xuất kho ",
  //     component: lazy(() => import("../pages/purchase/ReceiptIssue/CreateReceiptIssue")),

  // },
  // {
  //     path: warehouseManagementStaticPath.updateReceiptIssue + "/:id",
  //     exact: true,
  //     show_menu: false,
  //     key: warehouseManagementStaticPath.updateReceiptIssue + "/:id",
  //     label: "Xuất kho ",
  //     component: lazy(() => import("../pages/purchase/ReceiptIssue/UpdateReceiptIssue")),
  // },
  // {
  //     path: warehouseManagementStaticPath.approvalReceiptIssue + "/:id",
  //     exact: true,
  //     show_menu: false,
  //     key: warehouseManagementStaticPath.approvalReceiptIssue + "/:id",
  //     label: "Xuất kho ",
  //     component: lazy(() => import("../pages/purchase/ReceiptIssue/ApprovalReceiptIssue"))
  // },
  {
    path: warehouseManagementStaticPath.sparePartsComponentsWarehouse,
    exact: true,
    show_menu: true,
    icon: <CloudServerOutlined />,
    key: warehouseManagementStaticPath.sparePartsComponentsWarehouse,
    label: "menu.warehouse_management.spare_parts_components_warehouse",
    component: lazy(
      () => import("../pages/purchase/inventory/SparePartsIventory"),
    ),
    permisisonCode: permissionCodeConstant.inventory_spareparts,
  },
];
