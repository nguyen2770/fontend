import { lazy } from "react";
export const staticPathService = {
    services: "/cai-dat/supplier/dich-vu",
    createService: "/cai-dat/supplier/dich-vu/create",
    updateService: "/cai-dat/supplier/dich-vu/update",
    detailService: "/cai-dat/supplier/dich-vu/view",
};

export const routeServices = [
    {
        path: staticPathService.createService,
        exact: true,
        show_menu: false,
        key: staticPathService.createService,
        label: "Thêm mới dịch vụ",
        component: lazy(() =>
            import("../pages/manager/services/CreateService")
        ),
    },
    {
        path: staticPathService.updateService + "/:id",
        exact: true,
        show_menu: false,
        key: staticPathService.updateService + "/:id",
        label: "Cập nhật dịch vụ",
        component: lazy(() =>
            import("../pages/manager/services/UpdateService")
        ),
    },

    {
        path: staticPathService.detailService + "/:id",
        exact: true,
        show_menu: false,
        key: staticPathService.detailService + "/:id",
        label: "Chi tiết dịch vụ",
        component: lazy(() =>
            import("../pages/manager/services/DetailService")
        ),
    },
];

