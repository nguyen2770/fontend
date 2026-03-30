import React, { useEffect, useState } from "react";
import {
  QuestionCircleOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Select, Table, Tooltip } from "antd";
import CreateLanguage from "./CreateLanguage";
import useHeader from "../../../contexts/headerContext";

export default function LabelConfiguration() {
  const [isOpenCreate, setOpenCreate] = useState(false);
  const { setHeaderTitle } = useHeader();
  useEffect(() => {
    setHeaderTitle("Cấu hình nhãn")
  }, [])
  const onClickCreate = () => {
    setOpenCreate(true);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      align: "center",
    },
    {
      title: "Default Value",
      dataIndex: "defaultVale",
      align: "center",
    },
    {
      title: "Equivalent Value",
      dataIndex: "address",
      className: "text-left-column",
      align: "center",
      render: (text, record, index) => <Input />,
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
      <div className="header-all justify-content-space-between ">
        <Form.Item
          id=""
          name="agencyId"
          style={{
            width: "30vw",
            marginBottom: "0",
          }}
        >
          <Select
            allowClear
            placeholder="Chọn ngôn ngữ"
            showSearch
          //   options={agencys.map((item) => ({
          //     value: item.id,
          //     label: item.name,
          //   }))}
          //   filterOption={filterOption}
          //   dropdownStyle={dropdownRender}
          ></Select>
        </Form.Item>
        <div className="header-all">
          <Tooltip title="Hỗ trợ" color="#616263">
            <QuestionCircleOutlined
              style={{ fontSize: "20px", cursor: "pointer" }}
            />
          </Tooltip>
          <Button onClick={() => onClickCreate()} className="button">
            <UsergroupAddOutlined />
            Add Language
          </Button>
          <Button onClick={() => onClickCreate()} className="button">
            <UsergroupAddOutlined />
            Update
          </Button>
        </div>
      </div>
      <div className="table-container ">
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={{ pageSize: 5 }}
          className="custom-table"
        />
      </div>
      <CreateLanguage
        open={isOpenCreate}
        handleCancel={() => setOpenCreate(false)}
      />
    </div>
  );
}
