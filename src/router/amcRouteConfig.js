import {
  BorderVerticleOutlined,
  BuildOutlined,
  ContactsOutlined,
  ContainerOutlined,
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

export const amcStaticPath = {
  amc: "/maintenance/amc",
  createAmc: "/maintenance/amc/create",
  updateAmc: "/maintenance/amc/update",
  viewAmc: "/maintenance/amc/view",
  amcMappingAssetMaintenance: "/maintenance/amc/amc-mapping",
};

export const routeAmcs = [
  {
    path: amcStaticPath.amc,
    exact: true,
    show_menu: true,
    icon: <ContactsOutlined />,
    key: amcStaticPath.amc,
    label: "menu.amc.root",
    component: lazy(() => import("../pages/amc/index")),
    permisisonCode: permissionCodeConstant.maintenance_contract_view_list,
  },
  {
    path: amcStaticPath.createAmc,
    exact: true,
    show_menu: false,
    icon: <FontColorsOutlined />,
    key: amcStaticPath.amc,
    label: "Hợp đồng bảo trì (AMC)",
    component: lazy(() => import("../pages/amc/CreateAmc")),
    permisisonCode: permissionCodeConstant.maintenance_contract_create,
  },
  {
    path: amcStaticPath.updateAmc + "/:id",
    exact: true,
    show_menu: false,
    icon: <FontColorsOutlined />,
    key: amcStaticPath.updateAmc,
    label: "Hợp đồng bảo trì (AMC)",
    component: lazy(() => import("../pages/amc/UpdateAmc")),
    permisisonCode: permissionCodeConstant.maintenance_contract_update,
  },
  {
    path: amcStaticPath.viewAmc + "/:id",
    exact: true,
    show_menu: false,
    icon: <FontColorsOutlined />,
    key: amcStaticPath.viewAmc,
    label: "Hợp đồng bảo trì (AMC)",
    component: lazy(() => import("../pages/amc/ViewAmc")),
    permisisonCode: permissionCodeConstant.maintenance_contract_view_detail,
  },
  {
    path: amcStaticPath.amcMappingAssetMaintenance + "/:id",
    exact: true,
    show_menu: false,
    icon: <FontColorsOutlined />,
    key: amcStaticPath.amcMappingAssetMaintenance,
    // label: "Hợp đồng bảo trì (AMC)",
    component: lazy(() => import("../pages/amc/AmcMappingAssetMaintenance")),
    un_check_permission: true, // đợi làm xong rồi check lại
  },
];
