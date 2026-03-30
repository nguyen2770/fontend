import React, { useEffect, useState } from "react";
import {
  CheckCircleTwoTone,
  EyeFilled,
  FileExcelOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Button, Space, Switch, Table, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { staticPath } from "../../../router/routerConfig";
import useHeader from "../../../contexts/headerContext";
export default function BulkImportLogs() {
  const navigate = useNavigate();
  const { setHeaderTitle } = useHeader();
  useEffect(() => {
    setHeaderTitle("Nhật ký nhập hàng")
  }, [])
  const onRefresh = () => { };
  const onView = (value) => {
    navigate(staticPath.viewBulkImportLogs + "/" + value.id);
  };
  const onOpenExcel = () => { };
  const columns = [
    {
      dataIndex: "key",
      align: "center",
    },
    {
      dataIndex: "address",
      className: "text-left-column",
      align: "center",
    },
    {
      dataIndex: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="W=Excel">
            <FileExcelOutlined
              className="icon-table"
              onClick={() => onOpenExcel(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <EyeFilled className="icon-table" onClick={() => onView(record)} />
          </Tooltip>
        </Space>
      ),
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
        <Button className="button" onClick={() => onRefresh()}>
          <SyncOutlined />
          Refresh
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
