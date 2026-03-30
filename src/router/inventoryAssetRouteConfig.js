import {
    BorderVerticleOutlined,
    BuildOutlined,
    ContactsOutlined,
    ContainerOutlined,
    DatabaseOutlined,
    FontColorsOutlined,
    ForwardOutlined,
    MenuFoldOutlined,
    PicCenterOutlined,
    SolutionOutlined,
    UnorderedListOutlined,
} from "@ant-design/icons";
import { lazy } from "react";
import { createAsset } from "../api/assetApi";
import { permissionCodeConstant } from "../utils/permissionConstant";

export const inventoryAssetStaticPath = {
    inventoryAsset: "/inventory-asset",
    createinventoryAsset: "/inventory-asset/them-moi",
    updateInventoryAsset: "/inventory-asset/cap-nhat/",
    viewInventoryAsset: "/inventory-asset/chi-tiet/",
};

export const routeinventoryAssets = [
    {
        path: inventoryAssetStaticPath.inventoryAsset,
        exact: true,
        show_menu: true,
        icon: <DatabaseOutlined />,
        key: inventoryAssetStaticPath.inventoryAsset,
        label: "Kiểm kê",
        component: lazy(() => import("../pages/inventoryAsset/index")),
        un_check_permission: true,
    },
    {
        path: inventoryAssetStaticPath.createinventoryAsset,
        exact: true,
        show_menu: false,
        key: inventoryAssetStaticPath.createinventoryAsset,
        label: "Thêm mới",
        component: lazy(() => import("../pages/inventoryAsset/CreateInventoryAsset")),
        un_check_permission: true,
    },
    {
        path: inventoryAssetStaticPath.updateInventoryAsset + ":id",
        exact: true,
        show_menu: false,
        key: inventoryAssetStaticPath.updateInventoryAsset,
        label: "Cập nhật",
        component: lazy(() => import("../pages/inventoryAsset/UpdateInventoryAsset")),
        un_check_permission: true,
    },
    {
        path: inventoryAssetStaticPath.viewInventoryAsset + ":id",
        exact: true,
        show_menu: false,
        key: inventoryAssetStaticPath.viewInventoryAsset,
        label: "Cập nhật",
        component: lazy(() => import("../pages/inventoryAsset/ViewInventoryAsset")),
        un_check_permission: true,
    },
];
