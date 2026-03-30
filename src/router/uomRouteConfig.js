import {
    ContainerOutlined,
    SolutionOutlined,
} from "@ant-design/icons";
import { lazy } from "react";
import { permissionCodeConstant } from "../utils/permissionConstant";

export const uomStaticPath = {
    uom: "/cai-dat/asset/don-vi",
};

export const routeUoms = [
    {
        path: uomStaticPath.uom,
        exact: true,
        show_menu: true,
        key: uomStaticPath.uom,
        //    icon: <ContainerOutlined />,
        label: "menu.settings.uom",
        component: lazy(() => import("../pages/manager/uom")),
          permisisonCode: permissionCodeConstant.uom_view_list
    },
];
