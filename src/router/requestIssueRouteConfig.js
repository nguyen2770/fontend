import {
    CompressOutlined,
    FullscreenOutlined,
    SolutionOutlined,
} from "@ant-design/icons";
import { lazy } from "react";

export const requestIssueStaticPath = {
    requestIssue: '/inventory/requestIssue',
    createRequestIssue: '/inventory/requestIssue/create',
    updateRequestIssue: '/inventory/requestIssue/update',
    approveRequestIssue: '/inventory/requestIssue/approve'
};

export const routeRequestIssue = [
    // {
    //     path: requestIssueStaticPath.requestIssue,
    //     exact: true,
    //     show_menu: true,
    //     key: requestIssueStaticPath.requestIssue,
    //     icon: <CompressOutlined />,
    //     label: "Đề nghị xuất kho",
    //     component: lazy(() => import("../pages/purchase/RequestIssue")),
    // },
    // {
    //     path: requestIssueStaticPath.createRequestIssue,
    //     exact: true,
    //     show_menu: false,
    //     key: requestIssueStaticPath.createRequestIssue,
    //     icon: <SolutionOutlined />,
    //     label: "Đề nghị xuất kho",
    //     component: lazy(() => import("../pages/purchase/RequestIssue/CreateRequestIssue")),
    // },
    // {
    //     path: requestIssueStaticPath.updateRequestIssue + "/:id",
    //     exact: true,
    //     show_menu: false,
    //     key: requestIssueStaticPath.updateRequestIssue + "/:id",
    //     icon: <SolutionOutlined />,
    //     label: "Đề nghị xuất kho",
    //     component: lazy(() => import("../pages/purchase/RequestIssue/UpdateRequestIssue")),
    // },
    // {
    //     path: requestIssueStaticPath.approveRequestIssue + "/:id",
    //     exact: true,
    //     show_menu: false,
    //     key: requestIssueStaticPath.approveRequestIssue + "/:id",
    //     icon: <SolutionOutlined />,
    //     label: "Đề nghị xuất kho",
    //     component: lazy(() => import("../pages/purchase/RequestIssue/approveRequestIssue")),
    // },


];
