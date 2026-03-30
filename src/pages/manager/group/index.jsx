import React, { useEffect, useState } from "react";
import {
  CheckCircleTwoTone,
  DeleteOutlined,
  EditOutlined,
  EyeFilled,
  EyeOutlined,
  QuestionCircleOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Pagination,
  Row,
  Space,
  Switch,
  Table,
  Tooltip,
} from "antd";
import CreateUserGroup from "./CreateUserGroup";
import UpdateUserGroup from "./UpdateUserGroup";
import DetailUserGroup from "./DetailUserGroup";
import Confirm from "../../../components/modal/Confirm";
import { useNavigate } from "react-router-dom";
import { staticPath } from "../../../router/routerConfig";
import { PAGINATION } from "../../../utils/constant";
import * as _unitOfWork from "../../../api";


export default function UserGroup() {
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenView, setIsOpenView] = useState(false);
  const [groups, setGroups] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(PAGINATION);
  const [groupUserId, setGroupUserId] = useState([]);
  const [totalRecord, setTotalRecord] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGetListUserGroup();
  }, [page]);

  const fetchGetListUserGroup = async () => {
    let payload = {
      page: page,
      limit: pagination.limit,
    };
    const res = await _unitOfWork.group.getListGroups(payload);
    if (res && res.results && res.results?.results) {
      setGroups(res.results?.results);
      setTotalRecord(res.results.totalResults);
    }
  };

  const onChangePagination = (value) => {
    setPage(value);
  };

  const onClickCreate = () => {
    setIsOpenCreate(true);
  };
  const onClickUpdate = (values) => {
    setIsOpenEdit(true);
    setGroupUserId(values.id)
  };
  const onUpdateStatus = async (record, checked) => {
    const res = await _unitOfWork.group.updateGroupStatus({
      group: { id: record.id, status: checked },
    });
    if (res && res.code === 1) {
      fetchGetListUserGroup();
    }
  };
  const onClickView = (values) => {
    setIsOpenView(true);
    setGroupUserId(values.id)
  };
  const onClikDelete = async (values) => {
    const res = await _unitOfWork.group.deleteGroup({
      id: values.id,
    });
    if (res && res.code === 1) {
      fetchGetListUserGroup();
    }
  };
  const onUserMapping = (values) => {
    navigate(staticPath.upserMapping, {
      state: { from: staticPath.userGroup },
    });
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      width: 50,
      align: "center",
      render: (_text, _record, index) =>
        (page - 1) * PAGINATION.limit + index + 1,
    },
    {
      title: "Group Name",
      dataIndex: "groupName",
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
          onChange={(checked) => {
            Confirm("xác nhận thay đổi trạng thái?", () =>
              onUpdateStatus(record, checked))
          }}
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
            <Button
              icon={<EyeFilled />}
              size="small"
              onClick={() => onClickView(record)}

            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="primary"
              icon={<EditOutlined />}
              className="ml-2"
              size="small"
              onClick={() => onClickUpdate(record)}
            ></Button>
          </Tooltip>

          <Tooltip title="Delete">
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
              className="ml-2"
              onClick={() =>
                Confirm("Xác nhận xóa ?", () => onClikDelete(record))
              }
            />
          </Tooltip>
          <Tooltip title="User Mapping">
            <Button
              type="primary"
              icon={<UsergroupAddOutlined />}
              size="small"
              className="ml-2"
              onClick={() => onUserMapping(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-3">
      <Row className="mb-1">
        <Col span={24} style={{ textAlign: "right" }}>
          <Tooltip title="Hỗ trợ" color="#616263">
            <QuestionCircleOutlined
              style={{ fontSize: "20px", cursor: "pointer" }}
            />
          </Tooltip>
          <Button
            className="ml-3"
            type="primary"
            onClick={() => onClickCreate()}
          >
            <UsergroupAddOutlined />
            Add User Group
          </Button>
        </Col>
        <Col span={24} style={{ fontSize: 16, textAlign: "right" }}>
          <b>Tổng: {totalRecord || 0}</b>
        </Col>
      </Row>
      <Table
        rowKey="id"
        columns={columns}
        key={"id"}
        dataSource={groups}
        bordered
        pagination={false}
      ></Table>
      <Pagination
        className="pagination-table mt-2"
        onChange={onChangePagination}
        pageSize={pagination.limit}
        total={totalRecord}
        current={page}
      />
      <CreateUserGroup
        open={isOpenCreate}
        handleCancel={() => setIsOpenCreate(false)}
        handleOk={() => setIsOpenCreate()}
        onRefresh={fetchGetListUserGroup}
      />
      <UpdateUserGroup
        open={isOpenEdit}
        handleCancel={() => setIsOpenEdit(false)}
        handleOk={() => setIsOpenEdit()}
        id={groupUserId}
        onRefresh={fetchGetListUserGroup}

      />
      <DetailUserGroup
        open={isOpenView}
        handleCancel={() => setIsOpenView(false)}
        handleOk={() => setIsOpenView()}
        id={groupUserId}
      />
    </div>
  );
}
