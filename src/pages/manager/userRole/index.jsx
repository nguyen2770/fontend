import React, { useState, useEffect } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  RedoOutlined,
  CheckSquareOutlined,
  BorderOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  Row,
  Col,
  Table,
  Card,
  Button,
  Space,
  Tooltip,
  Pagination,
  Form,
  DatePicker,
  Select,
  notification,
} from "antd";
import {
  PAGINATION,
} from "../../../utils/constant";
import { useCustomNav } from "../../../helper/navigate-helper";

export default function Teacher(props) {
  const navigate = useCustomNav();
  const [searchForm] = Form.useForm();
  const [userRoles, setUserRoles] = useState([{
    name: 'test'
  }]);
  const [page, setPage] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);
  const onClickSearch = (value) => {
  };
  useEffect(() => {
  }, [page])

  const onClickCreate = () => {

  };
  const onClickView = (value) => {

  };
  const onClickUpdate = (record) => {

  };

  const onClickDelete = async (value) => {
  };
  const onChangePagination = (value) => {
    setPage(value)
  };
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
      title: "Tên nhóm quyền",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      width: "70px",
      align: "center",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Tooltip title="Xem">
            <Button
              icon={<EyeOutlined />}
              size="small"
            />
          </Tooltip>
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
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  return (
    <div>
      <Card title="Quản lý nhóm quyền">
        <Form
labelWrap
          className="search-form"
          form={searchForm}
          layout="vertical"
          onFinish={onClickSearch}
        >
          {/* <Row gutter={32}>
            <Col span={12}>
              <Form.Item id="" label="Ngày thi" name="dateRange">
                <DatePicker.RangePicker
                  className="wp-100"
                  format={FORMAT_DATE}
                  placeholder={["Từ ngày", "Đến ngày"]}
                ></DatePicker.RangePicker>
              </Form.Item>
            </Col>
          </Row> */}
          <Row className="mb-1">
            <Col span={12}>
              {/* <Button type="primary" className="mr-2" htmlType="submit" onClick={onClickSearch} >
                <SearchOutlined />
                Tìm kiếm
              </Button>
              <Button className=" mr-2" onClick={onClickResetSearch}>
                <RedoOutlined />
                Làm mới
              </Button> */}
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Button key="1" type="primary" onClick={onClickCreate}>
                <PlusOutlined />
                Thêm mới
              </Button>
            </Col>
          </Row>
        </Form>

        <Table
          rowKey="id"
          columns={columns}
          key={"id"}
          dataSource={userRoles}
          bordered
          pagination={false}
        ></Table>
        <Pagination
          style={{ marginTop: "10px", textAlign: "right" }}
          onChange={onChangePagination}
          pageSize={PAGINATION.limit}
          total={totalRecord}
        current={page}

        />
      </Card>
    </div>
  );
}
