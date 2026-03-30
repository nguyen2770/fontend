import React, { useEffect, useState } from "react";
import {
  CheckCircleTwoTone,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ImportOutlined,
  QuestionCircleOutlined,
  UploadOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Button, Space, Switch, Table, Tooltip } from "antd";
import Confirm from "../../../components/modal/Confirm";
import { useNavigate } from "react-router-dom";
import { staticPath } from "../../../router/routerConfig";
import BulkUploadModal from "../../../components/modal/BulkUpload";
import useHeader from "../../../contexts/headerContext";

export default function ReminderEscalation() {
  const navigate = useNavigate();
  const [isOpenBulkUpload, setOpenBulkUpload] = useState(false);
  const { setHeaderTitle } = useHeader();
  useEffect(() => {
    setHeaderTitle("Nhắc nhở và nâng cấp");
  }, []);
  const onClickCreate = () => {
    navigate(staticPath.createReminderEscalation);
  };
  const onUpdate = (value) => {
    navigate(staticPath.updateReminderEscalation + "/" + value.id);
  };
  const onDetail = (value) => {
    navigate(staticPath.viewReminderEscalation + "/" + value.id);
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      width: 50,
      align: "center",
      render: (_text, _record, index) => index + 1,
    },
    {
      title: "Group Name",
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
          <Tooltip title="Edit">
            <EditOutlined
              className="icon-table"
              onClick={() => onUpdate(record)}
            />
          </Tooltip>
          <Tooltip title="View">
            <EyeOutlined
              className="icon-table"
              onClick={() => onDetail(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <DeleteOutlined
              className="icon-table"
              onClick={() => Confirm("Xác nhận xóa ?", () => {})}
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
    <div className="content-manager">
      <div className="header-all">
        <Tooltip title="Hỗ trợ" color="#616263">
          <QuestionCircleOutlined
            style={{ fontSize: "20px", cursor: "pointer" }}
          />
        </Tooltip>
        <Button onClick={() => onClickCreate()} className="button">
          <UsergroupAddOutlined />
          Thêm thông báo và nâng cấp
        </Button>
      </div>
      <div className="table-container ">
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={{ pageSize: 5 }}
          className="custom-table"
        />
      </div>
      <BulkUploadModal
        open={isOpenBulkUpload}
        onCancel={() => setOpenBulkUpload(false)}
      />
    </div>
  );
}
