import {
  FullscreenExitOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { lazy } from "react";
import { permissionCodeConstant } from "../utils/permissionConstant";

export const receiptStaticPath = {
  receiptPurchase: '/inventory/receipt',
  createReceiptPurchase: '/inventory/receipt/create',
  updateReceiptPurchase: '/inventory/receipt/update',
  approvalReceiptPurchase: '/inventory/receipt/approval'
};

export const routeReceipts = [
  {
    path: receiptStaticPath.receiptPurchase,
    exact: true,
    show_menu: true,
    key: receiptStaticPath.receiptPurchase,
    icon: <FullscreenExitOutlined />,
    label: "Nhập kho mua hàng",
    component: lazy(() => import("../pages/purchase/receiptPurchase")),
    // permisisonCode: permissionCodeConstant.stock_receipt_view_request

  },
  {
    path: receiptStaticPath.createReceiptPurchase,
    exact: true,
    show_menu: false,
    key: receiptStaticPath.createReceiptPurchase,
    icon: <SolutionOutlined />,
    label: "Thêm mới phiếu nhập kho",
    component: lazy(() => import("../pages/purchase/receiptPurchase/CreateReceiptPurchase")),

  },
  {
    path: receiptStaticPath.updateReceiptPurchase + "/:id",
    exact: true,
    show_menu: false,
    key: receiptStaticPath.updateReceiptPurchase + "/:id",
    icon: <SolutionOutlined />,
    label: "update phiếu nhập kho",
    component: lazy(() => import("../pages/purchase/receiptPurchase/UpdateReceiptPurchase")),

  }, {
    path: receiptStaticPath.approvalReceiptPurchase + "/:id",
    exact: true,
    show_menu: false,
    key: receiptStaticPath.approvalReceiptPurchase + "/:id",
    icon: <SolutionOutlined />,
    label: "update phiếu nhập kho",
    component: lazy(() => import("../pages/purchase/receiptPurchase/approveReceiptPurchase")),

  },
];
