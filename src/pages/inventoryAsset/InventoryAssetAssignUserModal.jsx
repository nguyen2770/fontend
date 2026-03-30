import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Checkbox,
  Modal,
  Form,
  Table,
  Pagination,
  Select,
  notification,
} from "antd";
import { CheckSquareFilled, RedoOutlined } from "@ant-design/icons";
import * as _unitOfWork from "../../api";
import { PAGINATION } from "../../utils/constant";
import { useTranslation } from "react-i18next";

export default function InventoryAssetAssignUserModal({
  open,
  hanldeClose,
  callbackAssignUser,
  inventoryAssetDeparment,
  inventoryAssetDepartments = [],
  departments = [],
}) {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [departmentChange, setDepartmentChange] = useState(null);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(PAGINATION);
  const [totalRecord, setTotalRecord] = useState(0);

  useEffect(() => {
    if (open) {
      fetchListUser();
    }
  }, [page, open]);

  useEffect(() => {
    if (inventoryAssetDeparment) {
      setSelectedRowKeys([inventoryAssetDeparment?.user] || []);
    }
  }, [inventoryAssetDeparment]);

  const onSelectRow = (id, checked) => {
    setSelectedRowKeys((prev) =>
      checked ? [...prev, id] : prev.filter((key) => key !== id),
    );
  };

  const onChangePagination = (value) => {
    setPage(value);
  };

  const fetchListUser = async () => {
    let payload = {
      page: page,
      limit: PAGINATION.limit,
      fullName: search,
    };
    let res = await _unitOfWork.user.getListUser(payload);
    if (res && res.results) {
      setUsers(res.results);
      setTotalRecord(res.totalResults);
    }
  };

  const onFinish = async () => {
    if (selectedRowKeys.length === 0) {
      notification.error({
        message: "Thông báo",
        description: "Vui lòng chọn người kiểm kê",
      });
      return;
    }
    if (!departmentChange) {
      notification.error({
        message: "Thông báo",
        description: "Vui lòng chọn khoa/phòng kiểm kê",
      });
      return;
    }
    let assignUsers = [];
    selectedRowKeys.forEach((_item) => {
      var userInfo = users.find((_u) => _u.id === _item);
      assignUsers.push({
        user: _item,
        ...userInfo,
      });
    });
    let data = {
      department: departmentChange,
      assignUsers: assignUsers,
      departmentName: null,
      fullName: null,
    };
    var departmentInfo = departments.find((_d) => _d.id === data.department);
    if (departmentInfo) {
      data.departmentName = departmentInfo.departmentName;
    }
    setSelectedRowKeys([]);
    setDepartmentChange(null);
    callbackAssignUser(data);
  };

  const onCancel = () => {
    form.resetFields();
    setSelectedRowKeys([]);
    hanldeClose();
  };

  const columns = [
    {
      title: t("preventiveAssignUser.columns.select"),
      dataIndex: "select",
      render: (_, record) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.id)}
          onChange={(e) => onSelectRow(record.id, e.target.checked)}
        />
      ),
      width: 60,
      align: "center",
    },
    {
      title: t("preventiveAssignUser.columns.full_name"),
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: t("preventiveAssignUser.columns.email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("preventiveAssignUser.columns.phone"),
      dataIndex: "contactNo",
      key: "contactNo",
    },
    {
      title: t("breakdown.assignUser.columns.branch"),
      dataIndex: "branch",
      key: "branch",
      render: (_, record) => record?.branch?.name,
    },
    {
      title: t("preventiveAssignUser.columns.role"),
      dataIndex: ["role", "name"],
      key: "roleName",
      render: (_, record) => record.role?.name,
    },
    {
      title: t("dashboard.cards.breakdown.title"),
      dataIndex: "breakdownAssignUserCount",
      key: "breakdownAssignUserCount",
      align: "center",
    },
    {
      title: t("dashboard.cards.preventive.title"),
      dataIndex: "schedulePreventiveTaskAssignUser",
      key: "schedulePreventiveTaskAssignUser",
      align: "center",
    },
    {
      title: t("dashboard.cards.calibration"),
      dataIndex: "calibrationWorkAssignUserByUser",
      key: "calibrationWorkAssignUserByUser",
      align: "center",
    },
  ];

  return (
    <Modal
      open={open}
      footer={null}
      width={"80%"}
      destroyOnClose
      closable={false}
    >
      <div style={{ background: "#fff" }}>
        <Form labelWrap form={form} onFinish={onFinish}>
          <Row style={{ marginBottom: 16 }}>
            <Col>
              <Input.Search
                placeholder={t("preventiveAssignUser.search_placeholder")}
                value={search}
                allowClear
                htmlType="button"
                enterButton={t("preventiveAssignUser.search_button")}
                style={{ width: 350 }}
                onChange={(e) => setSearch(e.target.value)}
                onSearch={() => {
                  setPage(1);
                  fetchListUser();
                }}
                onPressEnter={(e) => {
                  e.preventDefault();
                  setPage(1);
                  fetchListUser();
                }}
              />

              <Button
                className="bt-green mr-2 ml-2"
                onClick={() => {
                  setSearch("");
                  form.resetFields();
                  setPage(1);
                  fetchListUser();
                }}
              >
                <RedoOutlined />
                {t("preventiveAssignUser.refresh")}
              </Button>
            </Col>
          </Row>
        </Form>
        <Row>
          <Col span={24}>
            <Form.Item
              id=""
              label="Chọn khoa/phòng kiểm kê"
              name="title"
              labelAlign="left"
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 18,
              }}
              rules={[
                {
                  required: true,
                  message: "",
                },
              ]}
            >
              <Select
                value={departmentChange}
                placeholder={"Chọn khoa/phòng kiểm kê"}
                options={(departments || [])
                  .filter(
                    (_d) =>
                      inventoryAssetDepartments.findIndex(
                        (_iad) => _iad.department === _d.id,
                      ) < 0,
                  )
                  .map((item) => ({
                    label: item.departmentName,
                    value: item.id,
                  }))}
                style={{ width: "100%" }}
                onChange={(e) => setDepartmentChange(e)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={32}>
          <Col span={24}>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={users}
              pagination={false}
              bordered
              size="middle"
              style={{ marginBottom: 24 }}
            />
            <Pagination
              className="pagination-table mt-2"
              onChange={onChangePagination}
              pageSize={pagination.limit}
              total={totalRecord}
              current={page}
            />
          </Col>
        </Row>
        <Row justify="end" gutter={8} className="mt-2">
          <Col>
            <Button onClick={onCancel}>
              {t("preventiveAssignUser.cancel")}
            </Button>
          </Col>
          <Col>
            <Button
              onClick={onFinish}
              type="primary"
              icon={<CheckSquareFilled />}
              htmlType="submit"
            >
              {t("preventiveAssignUser.submit")}
            </Button>
          </Col>
        </Row>
      </div>
    </Modal>
  );
}
