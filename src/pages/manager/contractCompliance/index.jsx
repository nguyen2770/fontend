import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import ComplianceTab from "./ComplianceTab";
import ContractTable from "./ContractTab";
import GeneralTab from "./GeneralTab";
import useHeader from "../../../contexts/headerContext";
import { checkPermission } from "../../../helper/permission-helper";
import useAuth from "../../../contexts/authContext";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import { useTranslation } from "react-i18next";

export default function ContractCompliance() {
  const { t } = useTranslation();
  const { setHeaderTitle } = useHeader();
  const { permissions } = useAuth();
  useEffect(() => {
    setHeaderTitle(t("contractCompliance.page.title"))
  }, []) // eslint-disable-line
  const items = [
    ...(checkPermission(permissions, permissionCodeConstant.contractand_view_list)
      ? [
        {
          key: "1",
          label: t("contractCompliance.tabs.contracts"),
          children: <ContractTable />,
        },
      ] : []),
    ...(checkPermission(permissions, permissionCodeConstant.compliance_view_list)
      ? [
        {
          key: "2",
          label: t("contractCompliance.tabs.compliances"),
          children: <ComplianceTab />,
        },] : []),
    // {
    //   key: "3",
    //   label: "General",
    //   children: <GeneralTab />,
    // },
  ];

  return (
    <div className="content-manager">
      <Tabs
        defaultActiveKey="1"
        items={items}
        className=" tabs-asset"
        style={{ padding: "15px" }}
      />
    </div>
  );
}