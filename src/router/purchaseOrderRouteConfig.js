import {
    ShopOutlined,
    ShoppingOutlined,
    SolutionOutlined,
    UnorderedListOutlined,
} from "@ant-design/icons";
import { lazy } from "react";
import { permissionCodeConstant } from "../utils/permissionConstant";
import { assetMaintenanceStaticPath } from "./assetMaintenanceRouteConfig";

export const purchaseOrderStaticPath = {
    purchaseOrder: '/purchase/order',
    createOrderPurchase: '/purchase/order/create',
    updateOrderPurchase: '/purchase/order/update',

};

export const routePurchaseOrders = [
    {
        path: purchaseOrderStaticPath.purchaseOrder,
        exact: true,
        show_menu: true,
        key: purchaseOrderStaticPath.purchaseOrder,
        icon: <ShoppingOutlined />,
        label: "menu.purchase.purchase_order",
        component: lazy(() => import("../pages/purchase/purchaseOrder")),
        permisisonCode: permissionCodeConstant.purchase_order_view
    },
    {
        path: purchaseOrderStaticPath.createOrderPurchase,
        exact: true,
        show_menu: false,
        key: purchaseOrderStaticPath.createOrderPurchase,
        icon: <SolutionOutlined />,
        label: "Thêm mới đề nghị mua hàng",
        component: lazy(() => import("../pages/purchase/purchaseOrder/CreatOrderPurchase")),
        permisisonCode: permissionCodeConstant.purchase_order_create
    },
    {
        path: purchaseOrderStaticPath.updateOrderPurchase + "/:id",
        exact: true,
        show_menu: false,
        key: purchaseOrderStaticPath.updateOrderPurchase + "/:id",
        icon: <SolutionOutlined />,
        label: "update đề nghị mua hàng",
        component: lazy(() => import("../pages/purchase/purchaseOrder/UpdateOrderPurchase")),
        permisisonCode: permissionCodeConstant.purchase_order_edit
    },
     {
        path: assetMaintenanceStaticPath.assetType,
        exact: true,
        show_menu: true,
        icon: <ShoppingOutlined />,
        key: assetMaintenanceStaticPath.assetType,
        label: "menu.asset_setup.asset_type",
        component: lazy(() => import("../pages/manager/assetSetup/assetType")),
        permisisonCode: permissionCodeConstant.equipment_hierarchy_view_list,
      },
];
