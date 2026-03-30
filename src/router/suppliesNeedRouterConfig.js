import {
    SelectOutlined,
    ShoppingOutlined,
    SolutionOutlined,
} from "@ant-design/icons";
import { lazy } from "react";
import { permissionCodeConstant } from "../utils/permissionConstant";

export const suppliesNeedStaticPath = {
    suppliesNeed: '/purchase/supplies-need',
    createSuppliesNeed: '/purchase/supplies-need/create',
    updateSuppliesNeed: '/purchase/supplies-need/update',
    approveSuppliersNeed: '/purchase/supplies-need/approve'

};

export const routeSuppliesNeedOrders = [
    {
        path: suppliesNeedStaticPath.suppliesNeed,
        exact: true,
        show_menu: true,
        key: suppliesNeedStaticPath.suppliesNeed,
        icon: <ShoppingOutlined />,
        label: "menu.purchase.supplies_need",
        component: lazy(() => import("../pages/purchase/suppliesNeed")),
        permisisonCode: permissionCodeConstant.material_request_view
    },
    {
        path: suppliesNeedStaticPath.createSuppliesNeed,
        exact: true,
        show_menu: false,
        key: suppliesNeedStaticPath.createSuppliesNeed,
        icon: <SolutionOutlined />,
        label: "purchase.supplies_need",
        component: lazy(() => import("../pages/purchase/suppliesNeed/CreateSuppilersNeed")),
        permisisonCode: permissionCodeConstant.material_request_create
    },
    {
        path: suppliesNeedStaticPath.updateSuppliesNeed + "/:id",
        exact: true,
        show_menu: false,
        key: suppliesNeedStaticPath.updateSuppliesNeed ,
        label: "purchase.supplies_need",
        component: lazy(() => import("../pages/purchase/suppliesNeed/UpdateSuppilersNeed")),
        permisisonCode: permissionCodeConstant.material_request_edit
    },
    {
        path: suppliesNeedStaticPath.approveSuppliersNeed + "/:id",
        exact: true,
        show_menu: false,
        key: suppliesNeedStaticPath.approveSuppliersNeed ,
        label: "purchase.supplies_need",
        component: lazy(() => import("../pages/purchase/suppliesNeed/ApproveSuppliersNeed")),
        permisisonCode: permissionCodeConstant.material_request_approve
    },
];
