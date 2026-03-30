import {
  CheckCircleTwoTone,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Space, Switch, Table, Tooltip } from "antd";
import React from "react";

export default function AssetBasedSLA() {
  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      width: 50,
      align: "center",
    },
    {
      title: "Asset Based SLA Name",
      dataIndex: "address",
      width: 500,
      className: "text-left-column",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 150,
      align: "center",
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          checkedChildren={<CheckCircleTwoTone twoToneColor="#52c41a" />}
          unCheckedChildren="x"
        />
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View">
            <EyeOutlined
              className="icon-table"
            //   onClick={() => {
            //     setIsOpenView(true);
            //   }}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <EditOutlined
              className="icon-table"
            //   onClick={() => {
            //     setIsOpenEdit(true);
            //   }}
            />
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
    <div className="table-container ">
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 5 }}
        className="custom-table"
      />
    </div>
  );
};

