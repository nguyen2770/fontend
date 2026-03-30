import {
  BorderVerticleOutlined,
  BuildOutlined,
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
import { update } from "../api/spareCategoryApi";

export const assetMaintenanceStaticPath = {
  assetMaintenance: "/quan-ly-tai-san",
  createAssetMaintenance: "/quan-ly-tai-san/create",
  updateAssetMaintenance: "/quan-ly-tai-san/update",
  viewAssetMaintenance: "/quan-ly-tai-san/view",
  assetSetup: "/assetSetup",
  manuafcturer: "/cai-dat/asset/manuafcturer",
  category: "/category",
  subCategory: "/subCategory",
  assetType: "/purchase/assetType",
  createAssetType: "/purchase/assetType/create",
  updateAssetType: "/purchase/assetType/update",
  viewAssetType: "/purchase/assetType/view",
  assetInfo: "/assetInfo",
  assetModel: "/cai-dat/asset/assetModel",
  updateAssetModel: "/update-asset-model",
  viewAssetModel: "/cai-dat/asset/assetModel/view",
  preventiveOfModel: "/cai-dat/asset/assetModel/preventive-of-model",
  cretaePreventiveOfModel: "/preventive-of-model/create",
  updatePreventiveOfModel: "/preventive-of-model/update",
  supplier: "/nha-cung-cap",
  assetTypeCategory: "/assetTypeCategory",
  searchQrCodeAssetMaintenance: "/seart-qrcode",
  customerAsset: "/khach-hang/tai-san",
  updateAssetMaintenanceChecklist: "/update-asset-maintenance-checklist",
  propertyAccessories: "/quan-ly-tai-san/thiet-bi-phu",
};

export const routeAssetMaintenances = [
  // {
  //   path: assetMaintenanceStaticPath.assetSetup,
  //   exact: true,
  //   show_menu: true,
  //   icon: <SolutionOutlined />,
  //   key: assetMaintenanceStaticPath.assetSetup,
  //   label: "Cài đặt thiết bị",
  //   component: lazy(() => import("../pages/manager/assetSetup")),
  // },
  // {
  //   path: assetMaintenanceStaticPath.category,
  //   exact: true,
  //   show_menu: true,
  //   icon: <MenuFoldOutlined />,
  //   key: assetMaintenanceStaticPath.category,
  //   label: "menu.asset_setup.category",
  //   component: lazy(() => import("../pages/manager/assetSetup/category")),
  //   permisisonCode: permissionCodeConstant.main_equipment_view_list,
  // },
  // {
  //   path: assetMaintenanceStaticPath.subCategory,
  //   exact: true,
  //   show_menu: true,
  //   icon: <BorderVerticleOutlined />,
  //   key: assetMaintenanceStaticPath.subCategory,
  //   label: "menu.asset_setup.sub_category",
  //   component: lazy(() => import("../pages/manager/assetSetup/subCategory")),
  //   permisisonCode: permissionCodeConstant.sub_equipment_view_list,
  // },
  {
    path: assetMaintenanceStaticPath.supplier,
    exact: true,
    show_menu: true,
    icon: <SolutionOutlined />,
    key: assetMaintenanceStaticPath.supplier,
    label: "menu.asset_setup.supplier",
    component: lazy(() => import("../pages/manager/assetSetup/supplier")),
    permisisonCode: permissionCodeConstant.supplier_view_list,
  },
  // {
  //   path: assetMaintenanceStaticPath.assetTypeCategory,
  //   exact: true,
  //   show_menu: true,
  //   icon: <PicCenterOutlined />,
  //   label: "Danh mục loại thiết bị",
  //   key: assetMaintenanceStaticPath.assetTypeCategory,
  //   component: lazy(() =>
  //     import("../pages/manager/assetSetup/assetTypeCategory")
  //   ),
  // },
  {
    path: assetMaintenanceStaticPath.assetInfo,
    exact: true,
    show_menu: true,
    icon: <FontColorsOutlined />,
    key: assetMaintenanceStaticPath.assetInfo,
    label: "menu.asset_setup.asset_info",
    component: lazy(() => import("../pages/manager/assetSetup/asset")),
    permisisonCode: permissionCodeConstant.equipment_category_view_list,
  },
  {
    path: assetMaintenanceStaticPath.createAssetType,
    exact: true,
    show_menu: false,
    label: "Thêm phân cấp thiết bị",
    component: lazy(
      () => import("../pages/manager/assetSetup/assetType/CreateAssetType"),
    ),
    permisisonCode: permissionCodeConstant.equipment_hierarchy_create,
  },
  {
    path: assetMaintenanceStaticPath.updateAssetType + "/:id",
    exact: true,
    show_menu: false,
    label: "Cập nhật phân cấp thiết bị",
    component: lazy(
      () => import("../pages/manager/assetSetup/assetType/UpdateAssetType"),
    ),
    permisisonCode: permissionCodeConstant.equipment_hierarchy_update,
  },
  {
    path: assetMaintenanceStaticPath.viewAssetType + "/:id",
    exact: true,
    show_menu: false,
    label: "Chi tiết phân cấp thiết bị",
    component: lazy(
      () => import("../pages/manager/assetSetup/assetType/ViewAssetType"),
    ),
    permisisonCode: permissionCodeConstant.equipment_hierarchy_details,
  },
  {
    path: assetMaintenanceStaticPath.updateAssetModel + "/:id",
    exact: true,
    show_menu: false,
    icon: <SolutionOutlined />,
    key: assetMaintenanceStaticPath.updateAssetModel,
    label: "Cập nhật Model thiết bị",
    component: lazy(
      () => import("../pages/manager/assetSetup/assetModel/UpdateAssetModel"),
    ),
    permisisonCode: permissionCodeConstant.equipment_model_update,
  },
  {
    path: assetMaintenanceStaticPath.viewAssetModel + "/:id",
    exact: true,
    show_menu: false,
    icon: <SolutionOutlined />,
    key: assetMaintenanceStaticPath.viewAssetModel,
    label: "Cập nhật Model thiết bị",
    component: lazy(
      () => import("../pages/manager/assetSetup/assetModel/ViewAssetModel"),
    ),
    permisisonCode: permissionCodeConstant.equipment_model_view_detail,
  },
  {
    path: assetMaintenanceStaticPath.preventiveOfModel + "/:id",
    exact: true,
    show_menu: false,
    icon: <SolutionOutlined />,
    key: assetMaintenanceStaticPath.preventiveOfModel,
    label: "Preventive of model",
    component: lazy(
      () =>
        import("../pages/manager/assetSetup/assetModel/preventiveOfModel/PreventiveOfModel"),
    ),
    // permisisonCode: permissionCodeConstant.equipment_model_view_detail // chưa check
    un_check_permission: true,
  },
  {
    path: assetMaintenanceStaticPath.cretaePreventiveOfModel + "/:id",
    exact: true,
    show_menu: false,
    icon: <SolutionOutlined />,
    key: assetMaintenanceStaticPath.cretaePreventiveOfModel + "/:id",
    label: "Create preventive of model",
    component: lazy(
      () =>
        import("../pages/manager/assetSetup/assetModel/preventiveOfModel/CreatePreventiveOfModel"),
    ),
    // permisisonCode: permissionCodeConstant.equipment_model_view_detail // chưa check
    un_check_permission: true,
  },
  {
    path: assetMaintenanceStaticPath.updatePreventiveOfModel + "/:id",
    exact: true,
    show_menu: false,
    icon: <SolutionOutlined />,
    key: assetMaintenanceStaticPath.updatePreventiveOfModel,
    label: "Update preventive of model",
    component: lazy(
      () =>
        import("../pages/manager/assetSetup/assetModel/preventiveOfModel/UpdatePreventiveOfModel"),
    ),
    // permisisonCode: permissionCodeConstant.equipment_model_view_detail // chưa check
    un_check_permission: true,
  },
  {
    path: assetMaintenanceStaticPath.createAssetMaintenance,
    exact: true,
    show_menu: false,
    key: assetMaintenanceStaticPath.createAssetMaintenance,
    component: lazy(
      () => import("../pages/manager/assetMaintenance/CreateAssetMaintenance"),
    ),
    permisisonCode: permissionCodeConstant.equipment_model_create,
  },
  {
    path: assetMaintenanceStaticPath.customerAsset + "/:id",
    exact: true,
    show_menu: false,
    key: assetMaintenanceStaticPath.customerAsset + "/:id",
    component: lazy(
      () => import("../pages/manager/customer/MappingAssetMaintenance"),
    ),
    un_check_permission: true,
  },
  {
    path: assetMaintenanceStaticPath.updateAssetMaintenanceChecklist + "/:id",
    exact: true,
    show_menu: false,
    key: assetMaintenanceStaticPath.updateAssetMaintenanceChecklist + "/:id",
    component: lazy(
      () =>
        import("../pages/manager/assetMaintenance/UpdateAssetMaintenanceChecklist"),
    ),
    un_check_permission: true,
  },
  {
    path: assetMaintenanceStaticPath.propertyAccessories + "/:id",
    exact: true,
    show_menu: false,
    key: assetMaintenanceStaticPath.propertyAccessories + "/:id",
    component: lazy(
      () => import("../pages/manager/assetMaintenance/PropertyAccessories"),
    ),
    un_check_permission: true,
  },
];
