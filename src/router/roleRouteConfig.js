import {
    SolutionOutlined,
} from "@ant-design/icons";
import { lazy } from "react";
import { permissionCodeConstant } from "../utils/permissionConstant";
import { icon } from "leaflet";

export const roleStaticPath = {
    role: "/cai-dat/phan-quyen/nhom-quyen",
    updateRolePermission: '/cai-dat/phan-quyen/nhom-quyen/update/'
};

export const routeRoles = [
    {
        path: roleStaticPath.role,
        exact: true,
        show_menu: true,
        key: roleStaticPath.role,
        label: "menu.settings.role_group",
        // icon:<SolutionOutlined/>,
        component: lazy(() => import("../pages/manager/role")),
        permisisonCode: permissionCodeConstant.view_list_role
    },
    {
        path: roleStaticPath.updateRolePermission + ":id",
        exact: true,
        show_menu: false,
        key: roleStaticPath.updateRolePermission + ":id",
        label: "Cập nhật quyền",
        component: lazy(() => import("../pages/manager/role/UpdateRolePermission")),
        permisisonCode: permissionCodeConstant.view_update_role

    },
];
