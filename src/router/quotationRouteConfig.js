import {
    HddOutlined,
    ShoppingOutlined,
    SolutionOutlined,
    SplitCellsOutlined,
} from "@ant-design/icons";
import { lazy } from "react";
import { permissionCodeConstant } from "../utils/permissionConstant";

export const purchaseQuotationStaticPath = {
    purchaseQuotation: '/purchase/quotation',
    createPurchaseQuotation: '/purchase/quotation/create',
    updatePurchaseQuotation: '/purchase/quotation/update',
    quotationComparison: '/purchase/quotation/comparison',
};

export const routePurchaseQuotation = [
    {
        path: purchaseQuotationStaticPath.purchaseQuotation,
        exact: true,
        show_menu: true,
        key: purchaseQuotationStaticPath.purchaseQuotation,
        icon:<ShoppingOutlined />,
        label: "menu.purchase.quotation",
        component: lazy(() => import("../pages/purchase/purchaseQuotation")),
        permisisonCode: permissionCodeConstant.quotation_view_list
    },
    {
        path: purchaseQuotationStaticPath.createPurchaseQuotation,
        exact: true,
        show_menu: false,
        key: purchaseQuotationStaticPath.createPurchaseQuotation,
        icon: <SolutionOutlined />,
        label: "menu.purchase.quotation",
        component: lazy(() => import("../pages/purchase/purchaseQuotation/createPurchaseQuotation")),
        permisisonCode: permissionCodeConstant.quotation_create
    },
    {
        path: purchaseQuotationStaticPath.updatePurchaseQuotation + "/:id",
        exact: true,
        show_menu: false,
        key: purchaseQuotationStaticPath.updatePurchaseQuotation + "/:id",
        icon: <SolutionOutlined />,
        label: "menu.purchase.quotation",
        component: lazy(() => import("../pages/purchase/purchaseQuotation/updatePurchaseQuotation")),
        permisisonCode: permissionCodeConstant.quotation_edit
    },
    {
        path: purchaseQuotationStaticPath.quotationComparison,
        exact: false,
        show_menu: false,
        key: purchaseQuotationStaticPath.quotationComparison,
        icon: <SplitCellsOutlined />,
        label: "menu.purchase.quotation_compare",
        component: lazy(() => import("../pages/purchase/purchaseQuotation/QuotationComparison")),
        permisisonCode: permissionCodeConstant.quotation_compare_view
    },
];
