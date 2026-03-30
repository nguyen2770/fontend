import React, { useEffect, useState } from "react";
import { Layout, Menu, Select } from "antd";
import { routes } from "../../router/routerConfig";
import "./Baselayout.scss";
import "../../styles/index.scss";
import LogoPng from "../../assets/images/logo.png";
import LogoSmallPng from "../../assets/images/logo-small.png";
import { useCustomNav } from "../../helper/navigate-helper";
import HeaderLayout from "./HeaderLayout";
import { STORAGE_KEY } from "../../utils/constant";
import { checkPermission } from "../../helper/permission-helper";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import useAuth from "../../contexts/authContext";
const { Header, Content, Sider } = Layout;
const { Option } = Select;
export default function BaseLayout(props) {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState("");
  const { moduleChange } = props;
  const navigate = useCustomNav();
  const { t } = useTranslation();
  const { pathname } = useLocation();

  useEffect(() => {
    let parts = pathname.split("/").filter(Boolean);

    // Bỏ id nếu là ObjectId hoặc UUID
    if (
      /^[0-9a-fA-F]{24}$/.test(parts[parts.length - 1]) || // Mongo ID
      /^[0-9a-fA-F-]{8,}$/.test(parts[parts.length - 1]) // UUID
    ) {
      parts = parts.slice(0, -1);
    }

    // Bỏ action: create, update, approval
    const last = parts[parts.length - 1];
    if (
      [
        "create",
        "update",
        "approve",
        "comparison",
        "view",
        "change-of-contract",
        "comment",
        "amc-mapping",
        "mapping-asset",
      ].includes(last)
    ) {
      parts = parts.slice(0, -1);
    }

    console.log(parts);
    const keys = [];

    for (let i = 0; i < parts.length; i++) {
      const key = "/" + parts.slice(0, i + 1).join("/");
      keys.push(key);
    }
    const key = "/" + parts.join("/");
    setOpenKeys(keys);
    setSelectedKey(key);
  }, [pathname]);
  useEffect(() => { }, [moduleChange]);
  // const generateMenu = (_routers = routes) => {
  //   const permissions = JSON.parse(localStorage.getItem(STORAGE_KEY.PERMISSION));
  //   let flatRoutes = [];
  //   _routers.forEach((r) => {
  //     let newItem = { ...r };
  //     if (r.show_menu && (r.un_check_permission || (r.permisisonCodes && r.permisisonCodes.findIndex(pc => checkPermission(permissions, pc)) > -1) || checkPermission(permissions, r.permisisonCode))) {
  //       //&& checkPermission(r.permissionCode)
  //       if (r.children) {
  //         newItem.children = r.children
  //           .filter(
  //             (c) => {
  //               if (c.show_menu &&
  //                 (c.un_check_permission || (c.permisisonCodes && c.permisisonCodes.findIndex(pc => checkPermission(permissions, pc)) > -1) ||
  //                   checkPermission(permissions, c.permisisonCode))
  //               ) {
  //                 return true;
  //               }
  //               else {
  //                 return false
  //               }
  //             }
  //           )
  //           // thêm map để dịch label cho menu con
  //           .map(c => ({
  //             ...c,
  //             label: t(c.label) // i18n cho child
  //           }));
  //       }
  //       newItem.label = t(r.label); // i18n cho menu cha

  //       flatRoutes.push(newItem);
  //     }
  //   });

  //   return flatRoutes;
  // };
  const generateMenu = (_routers = routes) => {
    const permissions = JSON.parse(
      localStorage.getItem(STORAGE_KEY.PERMISSION),
    );
    const filterAndTranslate = (routers) => {
      return routers
        .filter(
          (r) =>
            r.show_menu &&
            (r.un_check_permission ||
              (r.permisisonCodes &&
                r.permisisonCodes.some((pc) =>
                  checkPermission(permissions, pc),
                )) ||
              checkPermission(permissions, r.permisisonCode)),
        )
        .map((r) => {
          const newItem = {
            ...r,
            label: t(r.label), // i18n label cho menu cha
          };
          if (r.children && r.children.length > 0) {
            newItem.children = filterAndTranslate(r.children);
          }
          return newItem;
        });
    };
    const newRouters = filterAndTranslate(_routers);
    return newRouters;
  };

  const routesSidebar = generateMenu(moduleChange);
  // const updateItems = () => {
  //   debugger;
  //   let newitems = routes.filter(
  //     (r) =>
  //       r.show_menu && (r.is_all || r.module_code?.indexOf(moduleChange) > -1)
  //   );
  //   newitems.forEach((item) => {
  //     if (item.children && item.children.length > 0) {
  //       item.children = [...item.children.filter((c) => c.show_menu)];
  //     }
  //   });
  // };
  const goToHome = () => {
    navigate("main");
  };
  return (
    <Layout className="container-app">
      {/* <Header className="base-layout-header">
        <div className="company-name">
          CÔNG TY TNHH CÔNG NGHỆ VÀ DỊCH PNP
        </div>
        <div className="item-user-info d-flex">
          <div className="hotline-info">
            Hotline: 0852391816
          </div>
          <div>
            Trợ giúp
          </div>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="1">
                  <a onClick={() => setShowUpdateUserInforModal(true)}>
                    Cập nhật thông tin
                  </a>
                </Menu.Item>
                <Menu.Item key="2">
                  <a onClick={() => setShowChangePassModal(true)}>
                    Đổi mật khẩu
                  </a>
                </Menu.Item>
                <Menu.Item key="3">
                  <a onClick={logout}>Đăng xuất</a>
                </Menu.Item>
              </Menu>
            }
          >
            <span
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              <Avatar
                icon={<UserOutlined />}
                style={{ verticalAlign: "middle", marginRight: "5px" }}
              ></Avatar>
              {user && user.fullname}
            </span>
          </Dropdown>
        </div>
      </Header> */}
      <HeaderLayout></HeaderLayout>
      <Layout>
        <div className="layout-left-main">
          <Sider
            className="sider-menu-main "
            width={250}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
          >
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              // defaultOpenKeys={[pathname.split("/")[1]]}
              openKeys={openKeys}
              onOpenChange={(keys) => setOpenKeys(keys)}
              items={routesSidebar}
              className="left-menu-main custom-scrollbar"
              onClick={(e) => {
                setSelectedKey(e.key);
                navigate(e.key);
              }}
            />
          </Sider>
        </div>
        <Layout className="content-layout" style={{ paddingLeft: "6px" }}>
          <Content
            style={{
              margin: 0,
              height: "calc(100vh - 62px)",
              // background: "#fff",
            }}
            className="content-container custom-scrollbar box-shadow-main "
          >
            {props.children}
          </Content>
        </Layout>
      </Layout>
      {/* <div className="footer-company-name">{user?.company?.name}</div> */}
    </Layout>
  );
}
