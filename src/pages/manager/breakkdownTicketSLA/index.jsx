import React, { useState } from "react";
import { PlusCircleFilled, QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Tabs, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import AssetBasedSLA from "./AssetBasedSLA";
import GenericBasedSLA from "./GenericBasedSLA";
import  {staticPath} from "../../../router/routerConfig"
export default function BreakkdownTicketSLA() {
  const navigate = useNavigate();

  const onClickCreate = () => {
    navigate(staticPath.createBreackdownTicketSLA);
  }
  const items = [
    {
      key: "1",
      label: "Asset Based SLA ",
      children: <AssetBasedSLA />,
    },
    {
      key: "2",
      label: "Generic Based SLA",
      children: <GenericBasedSLA />,
    },
  ];

  return (
    <div className="content-manager">
      <div className="header-all">
        <Tooltip title="Hỗ trợ" color="#616263">
          <QuestionCircleOutlined
            style={{ fontSize: "20px", cursor: "pointer" }}
          />
        </Tooltip>
        <Button
          style={{ background: "#ecedf0", marginRight: "5px" }}
            onClick={() => onClickCreate()}
        >
          <PlusCircleFilled />
          Add SLA
        </Button>
      </div>
      <Tabs
        // defaultActiveKey={tabFromState}
        defaultActiveKey="1"
        items={items}
        // onChange={onChange}
        className="tab-all"
      />
    </div>
  );
}
