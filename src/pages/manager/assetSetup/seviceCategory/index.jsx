import React, { useState, useEffect } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CheckCircleTwoTone,
} from "@ant-design/icons";
import * as _unitOfWork from "../../../../api";
import Confirm from "../../../../components/modal/Confirm";
import {
  Row,
  Col,
  Table,
  Switch,
  Button,
  Space,
  Tooltip,
  Pagination,
} from "antd";
import { PAGINATION } from "../../../../utils/constant";

import CreateServiceCategory from "./CreateServiceCategory";
import UpdateServiceCategory from "./UpdateServiceCategory";
export default function ServiceCategory(props) {
  const [pagination, setPagination] = useState(PAGINATION);
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [serviceCategoryUpdate, setServiceCategoryUpdate] = useState(null);
  const [totalRecord, setTotalRecord] = useState(0);
  const onClickSearch = (value) => { };
  useEffect(() => {
    fetchServiceCategories();
  }, [page]);
  const fetchServiceCategories = async () => {
    let payload = {
      page: page,
      limit: PAGINATION.limit,
    };
    let res = await _unitOfWork.serviceCategory.getServiceCategories(payload);
    if (res && res.data && res.data.results) {
      setServiceCategories(res.data.results);
      setTotalRecord(res.data.totalResults);
    }
  };
  const onClickCreate = () => {
    setIsOpenCreate(true);
  };
  const onCallbackCreate = () => {
    setIsOpenCreate(false);
    fetchServiceCategories();
  }
  const onCancelCreate = () => {
    setIsOpenCreate(false);
  }
  const onCallbackUpdate = () => {
    setIsOpenUpdate(false);
    fetchServiceCategories();
  }
  const onClickUpdate = (record) => {
    setServiceCategoryUpdate(record);
    setIsOpenUpdate(true);
  };
  const onCancelUpdate = () => {
    setIsOpenUpdate(false);
  }
  const onClickDelete = async (_record) => {
    let res = await _unitOfWork.serviceCategory.deleteServiceCategory(_record.id);
    fetchServiceCategories();
  };
  const onChangePagination = (value) => {
    setPage(value);
  };
  const onClickUpdateStatus = async (_record) => {
    let res = await _unitOfWork.serviceCategory.updateStatus(_record.id);
    if (res && res.code === 1) {
      fetchServiceCategories();
    }
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      width: "60px",
      align: "center",
      render: (_, record, _idx) => {
        return <span>{_idx + 1 + PAGINATION.limit * (page - 1)}</span>;
      },
    },
    {
      title: "Service category name",
      dataIndex: "serviceCategoryName",
      key: "serviceCategoryName",
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 150,
      align: "center",
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          autoFocus={true}
          onChange={() => onClickUpdateStatus(record)}
          checkedChildren={<CheckCircleTwoTone twoToneColor="#52c41a" />}
          unCheckedChildren="x"
        />
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => onClickUpdate(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="primary"
              onClick={() => Confirm("Xác nhận xóa?", () => onClickDelete(record))}
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  return (
    <div className="content-manager">
      <div className="header-all">
        {/* <Tooltip title="Hỗ trợ" color="#616263">
          <QuestionCircleOutlined
            style={{ fontSize: "20px", cursor: "pointer" }}
          />
        </Tooltip> */}
        <Button key="1" type="primary" onClick={onClickCreate}>
          <PlusOutlined />
          Thêm mới
        </Button>
      </div>
      {/* <Row className="mb-1">
        <Col span={24} style={{ textAlign: "right" }}>
          <Button key="1" type="primary" onClick={onClickCreate}>
            <PlusOutlined />
            Thêm mới
          </Button>
        </Col>
      </Row> */}
      <div className="table-container ">
        <Table
          rowKey="id"
          columns={columns}
          key={"id"}
          dataSource={serviceCategories}
          bordered
          pagination={false}
        ></Table>
      </div>

      <Pagination
        className="pagination-table mt-2"
        onChange={onChangePagination}
        pageSize={pagination.limit}
        total={totalRecord}
        current={page}
      />
      <CreateServiceCategory open={isOpenCreate} handleCancel={onCancelCreate} handleOk={onCallbackCreate} />
      <UpdateServiceCategory open={isOpenUpdate} handleCancel={onCancelUpdate} handleOk={onCallbackUpdate} serviceCategory={serviceCategoryUpdate} />
    </div>
  );
}
