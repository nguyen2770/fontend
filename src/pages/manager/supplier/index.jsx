import React, { useEffect, useState } from "react";
import {
  CheckCircleTwoTone,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { Button, Col, Pagination, Row, Switch, Table, Tooltip } from "antd";
import CreateSupplier from "./CreateSupplier";
import UpdateSupplier from "./UpdateSupplier";
import { PAGINATION } from "../../../utils/constant";
import * as _unitOfWork from "../../../api";
import Comfirm from "../../../components/modal/Confirm";

export default function Supplier() {
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [page, setPage] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);
  const [pagination, setPagination] = useState(PAGINATION);
  const [supplierId, setSupplierId] = useState([]);

  useEffect(() => {
    fetchGetListSupplier();
  }, [page]);

  const fetchGetListSupplier = async () => {
    let payload = {
      page: page,
      limit: PAGINATION.limit,
    };
    const res = await _unitOfWork.supplier.getListSuppliers(payload);
    if (res && res.results && res.results?.results) {
      setDataSource(res.results?.results);
      setTotalRecord(res.results.totalResults);
    }
  };
  const onChangePagination = (value) => {
    setPage(value);
  };
  const onClickUpdate = (values) => {
    setIsOpenUpdate(true);
    setSupplierId(values.id);
  };
  const onClickDelete = async (values) => {
    const res = await _unitOfWork.supplier.deleteSupplier({
      id: values.id,
    });
    if (res && res.code === 1) {
      // Nếu chỉ còn 1 bản ghi trên trang hiện tại và không phải trang 1, sau khi xóa sẽ về trang 1
      if (dataSource.length === 1 && page > 1) {
        setPage(1);
      } else {
        fetchGetListSupplier();
      }
    }
  };
  const onUpdateStatus = async (record, checked) => {
    const res = await _unitOfWork.supplier.updateSupplierStatus({
      Supplier: { id: record.id, status: checked },
    });
    if (res && res.code === 1) {
      fetchGetListSupplier();
    }
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      align: "center",
      width: "60px",
      render: (_text, _record, index) =>
        (page - 1) * PAGINATION.limit + index + 1,
    },
    {
      title: "Tên nhà cung cấp",
      dataIndex: "supplierName",
      className: "text-left-column",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          checkedChildren={<CheckCircleTwoTone twoToneColor="#52c41a" />}
          unCheckedChildren="x"
          onChange={(checked) =>
            Comfirm("Xác nhận thay đổi trạng thái ?", () =>
              onUpdateStatus(record, checked)
            )
          } // Call the function to update status
        />
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      render: (_, record) => (
        <div>
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
              danger
              icon={<DeleteOutlined />}
              size="small"
              className="ml-2"
              onClick={() =>
                Comfirm("Xác nhận xóa ?", () => onClickDelete(record))
              }
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="p-3">
      <Row className="mb-1">
        <Col span={24} style={{ textAlign: "right" }}>
          {/* <Tooltip title="Hỗ trợ" color="#616263">
            <QuestionCircleOutlined
              style={{ fontSize: "20px", cursor: "pointer" }}
            />
          </Tooltip> */}
          <Button
            key="1"
            type="primary"
            onClick={() => setIsOpenCreate(true)}
            className="ml-3"
          >
            <PlusOutlined />
            Thêm mới
          </Button>
        </Col>
      </Row>
      <Table
        key={"id"}
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        bordered
      />
      <Pagination
        className="pagination-table mt-2"
        onChange={onChangePagination}
        pageSize={pagination.limit}
        total={totalRecord}
        current={page}
      />
      <CreateSupplier
        open={isOpenCreate}
        handleCancel={() => setIsOpenCreate(false)}
        onRefresh={fetchGetListSupplier}
      />
      <UpdateSupplier
        open={isOpenUpdate}
        handleCancel={() => setIsOpenUpdate(false)}
        handleOk={() => setIsOpenUpdate(false)}
        id={supplierId}
        onRefresh={fetchGetListSupplier}
      />
    </div>
  );
}
