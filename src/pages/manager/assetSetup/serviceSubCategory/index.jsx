import React, { useState, useEffect } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  RedoOutlined,
  CheckCircleTwoTone,
  BorderOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import Confirm from "../../../../components/modal/Confirm";
import * as _unitOfWork from '../../../../api'
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
import {
  PAGINATION,
} from "../../../../utils/constant";

import CreateServiceSubCategory from "./CreateServiceSubCategory";
import UpdateServiceSubCategory from "./UpdateServiceSubCategory";
import useHeader from "../../../../contexts/headerContext";
export default function ServiceCategory(props) {
  const [pagination, setPagination] = useState(PAGINATION);
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [serviceSubCategories, setServiceSubCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [serviceSubCategoryUpdate, setServiceSubCategoryUpdate] = useState(null);
  const { setHeaderTitle } = useHeader();
  const [serviceCategories, setServiceCategories] = useState([]);
  const [totalRecord, setTotalRecord] = useState(0);

  useEffect(() => {
    fetchSubServiceCategories();
    fetchServiceCategories();
  }, [page])

  useEffect(() => {
    setHeaderTitle("Quản lý danh mục dịch vụ");
  }, []);

  const fetchServiceCategories = async () => {
    let res = await _unitOfWork.serviceCategory.getServiceCategories({ page: 1, limit: 999 });
    if (res && res.data && res.data.results) {
      setServiceCategories(res.data.results);
    }
  }
  const fetchSubServiceCategories = async () => {
    let payload = {
      page: page,
      limit: PAGINATION.limit
    }
    let res = await _unitOfWork.serviceSubCategory.getServiceSubCategories(payload);
    if (res && res.data && res.data.results) {
      setServiceSubCategories(res.data.results);
      setTotalRecord(res.data.totalResults)
    }
  }
  const onClickCreate = () => {
    setIsOpenCreate(true);
  };
  const onCallbackCreate = () => {
    setIsOpenCreate(false);
    fetchSubServiceCategories();
  }
  const onCancelCreate = () => {
    setIsOpenCreate(false);
  }
  const onClickView = (value) => {

  };
  const onCallbackUpdate = () => {
    setIsOpenUpdate(false);
    fetchSubServiceCategories();
  }
  const onClickUpdate = (record) => {
    setServiceSubCategoryUpdate(record);
    setIsOpenUpdate(true);
  };
  const onCancelUpdate = () => {
    setIsOpenUpdate(false);
  }
  const onClickDelete = async (_record) => {
    let res = await _unitOfWork.serviceSubCategory.deleteServiceSubCategory(_record._id);
    fetchSubServiceCategories();
  };
  const onChangePagination = (value) => {
    setPage(value)
  };
  const onClickUpdateStatus = async (_record) => {
    let res = await _unitOfWork.serviceSubCategory.updateStatus(_record._id);
    if (res && res.code === 1) {
      fetchSubServiceCategories();
    }
  }
  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      width: '60px',
      align: 'center',
      render: (_, record, _idx) => {
        return <span>{_idx + 1 + PAGINATION.limit * (page - 1)}</span>
      }
    },
    {
      title: "Tên danh mục dịch vụ",
      dataIndex: "serviceCategoryName",
      key: "serviceCategoryName",
      render: (_, record, _idx) => {
        return <span>{record && record.serviceCategoryObj && record.serviceCategoryObj.serviceCategoryName}</span>
      }
    },
    {
      title: "Tên danh mục dịch vụ phụ",
      dataIndex: "serviceSubCategoryName",
      key: "serviceSubCategoryName",
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
    <div
      className="content-manager">
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
          dataSource={serviceSubCategories}
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
      <CreateServiceSubCategory serviceCategories={serviceCategories} open={isOpenCreate} handleCancel={onCancelCreate} handleOk={onCallbackCreate} />
      <UpdateServiceSubCategory open={isOpenUpdate} serviceCategories={serviceCategories} handleCancel={onCancelUpdate} handleOk={onCallbackUpdate} serviceSubCategory={serviceSubCategoryUpdate} />
    </div>
  );
}
