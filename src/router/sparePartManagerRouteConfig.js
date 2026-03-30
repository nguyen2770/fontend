import { BarsOutlined, DashOutlined } from "@ant-design/icons";
import { lazy } from "react";
import { permissionCodeConstant } from "../utils/permissionConstant";
export const staticPathSparePartManager = {
    sparePart: '/sparePart',
    sparePartCategory: '/spare-part-category',
    sparePartSubCategory: '/spare-part-sub-category',
    spareParts: "/cai-dat/asset/sparePart",
    createSparePart: "/cai-dat/asset/sparePart/create",
    updateSparePart: "/cai-dat/asset/sparePart/update",
    searchQRCodeSparePart: "/cai-dat/asset/sparePart/tim-kiem-qrcode",
};

export const routeSparePartManagers = [
    {
        path: staticPathSparePartManager.sparePartCategory,
        exact: true,
        show_menu: true,
        key: staticPathSparePartManager.sparePartCategory,
        label: "menu.spare_parts_classification.spare_category",
        icon: <BarsOutlined />,
        component: lazy(() => import("../pages/sparePartManager/spareCategory")),
        permisisonCode: permissionCodeConstant.spare_part_category_view_list
    },
    {
        path: staticPathSparePartManager.sparePartSubCategory,
        exact: true,
        show_menu: true,
        key: staticPathSparePartManager.sparePartSubCategory,
        label: "menu.spare_parts_classification.sub_category",
        icon: <DashOutlined />,
        component: lazy(() => import("../pages/sparePartManager/spareSubCategory")),
        permisisonCode: permissionCodeConstant.sub_spare_part_category_view_list
    },
    {
        path: staticPathSparePartManager.createSparePart,
        exact: true,
        show_menu: false,
        key: staticPathSparePartManager.createSparePart,
        component: lazy(() => import("../pages/manager/spareParts/CreateSparePart")),
        permisisonCode: permissionCodeConstant.spare_part_replacement_create
    },
    {
        path: staticPathSparePartManager.updateSparePart + "/:id",
        exact: true,
        show_menu: false,
        key: staticPathSparePartManager.updateSparePart + "/:id",
        component: lazy(() => import("../pages/manager/spareParts/UpdateSparePart")),
        permisisonCode: permissionCodeConstant.spare_part_replacement_update
    },
    {
        path: staticPathSparePartManager.searchQRCodeSparePart,
        exact: true,
        show_menu: false,
        key: staticPathSparePartManager.searchQRCodeSparePart,
        component: lazy(() => import("../pages/manager/spareParts/SearchSparePartQrCode")),
    },
];

