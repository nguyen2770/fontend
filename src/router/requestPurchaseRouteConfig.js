import {
  ShoppingOutlined,
  SolutionOutlined,
  SwitcherOutlined,
} from "@ant-design/icons";
import { lazy } from "react";
import { permissionCodeConstant } from "../utils/permissionConstant";

export const requestPurchaseStaticPath = {
  requestPurchase: '/purchase/request',
  createRequestPurchase: '/purchase/request/create',
  updateRequestPurchase: '/purchase/request/update',
  approveRequestPurchase: '/purchase/request/approve'
};

export const routeRequestPurchase = [
  {
    path: requestPurchaseStaticPath.requestPurchase,
    exact: true,
    show_menu: true,
    key: requestPurchaseStaticPath.requestPurchase,
    icon: <ShoppingOutlined />,
    label: "menu.purchase.purchase_request",
    component: lazy(() => import("../pages/purchase/requestPurchase")),
    permisisonCode: permissionCodeConstant.purchase_request_view
  },
  {
    path: requestPurchaseStaticPath.createRequestPurchase,
    exact: true,
    show_menu: false,
    key: requestPurchaseStaticPath.createRequestPurchase,
    icon: <SolutionOutlined />,
    label: "Thêm mới purchase.purchase_request",
    component: lazy(() => import("../pages/purchase/requestPurchase/CreateRequestPurchase")),
    permisisonCode: permissionCodeConstant.purchase_request_create
  },
  {
    path: requestPurchaseStaticPath.updateRequestPurchase + "/:id",
    exact: true,
    show_menu: false,
    key: requestPurchaseStaticPath.updateRequestPurchase + "/:id",
    icon: <SolutionOutlined />,
    label: "update purchase.purchase_request",
    component: lazy(() => import("../pages/purchase/requestPurchase/UpdateRequestPurchase")),
    permisisonCode: permissionCodeConstant.purchase_request_edit
  },
  {
    path: requestPurchaseStaticPath.approveRequestPurchase + "/:id",
    exact: true,
    show_menu: false,
    key: requestPurchaseStaticPath.approveRequestPurchase + "/:id",
    icon: <SolutionOutlined />,
    label: "update purchase.purchase_request",
    component: lazy(() => import("../pages/purchase/requestPurchase/ApproveRequestPurchase")),
    permisisonCode: permissionCodeConstant.purchase_request_approve
  },
];
