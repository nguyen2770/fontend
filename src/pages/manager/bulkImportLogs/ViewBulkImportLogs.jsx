import React, { useState } from "react";
import {
  ArrowLeftOutlined,
  EyeFilled,
  FileExcelOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Button, Space, Switch, Table, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { staticPath } from "../../../router/routerConfig";
export default function ViewBulkImportLogs() {
  const navigate = useNavigate();

  const onBack = () => {
    navigate(-1);
  };

  const columns = [
    {
      dataIndex: "key",
    },
  ];
  const dataSource = Array.from({ length: 100 }).map((_, i) => ({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
  }));
  return (
    <div className="content-manager">
      <div className="header-all">
        <Button className="button" onClick={() => onBack()}>
          <ArrowLeftOutlined />
          Quay lại
        </Button>
      </div>
      <div className="table-container ">
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={{ pageSize: 5 }}
          className="custom-table"
          showHeader={false}
        />
      </div>
    </div>
  );
}
