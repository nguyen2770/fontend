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
} from "antd";
import { CheckSquareFilled, RedoOutlined } from "@ant-design/icons";
import * as _unitOfWork from "../../../api";
import ShowError from "../result/errorNotification";
import { PAGINATION } from "../../../utils/constant";
import { useTranslation } from "react-i18next";

export default function PreventiveAssignUser({
  open,
  hanldeClose,
  callbackAssignUser,
  preventiveTask,
}) {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(PAGINATION);
  const [totalRecord, setTotalRecord] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (open) {
      fetchListUser();
    }
  }, [page, open]);

  useEffect(() => {
    if (preventiveTask) {
      setSelectedRowKeys(
        [preventiveTask.schedulePreventiveTaskAssignUserIsActive?.user?.id] ||
          [],
      );
    }
  }, [preventiveTask]);

  const onSelectRow = (id) => {
    setSelectedRowKeys([id]);
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
    let res = await _unitOfWork.user.getListUserKS(payload);
    if (res && res.results) {
      setUsers(res.results);
      setTotalRecord(res.totalResults);
    }
  };

  const onFinish = async () => {
    if (selectedRowKeys.length === 0) {
      ShowError(
        "topRight",
        t("common.notifications"),
        t("modal.preventiveAssignUser.messages.select_one"),
      );
      return;
    }
    callbackAssignUser(selectedRowKeys, comment);
  };
  const onCancel = () => {
    form.resetFields();
    setSelectedRowKeys([]);
    hanldeClose();
  };

  const columns = [
    {
      title: t("modal.preventiveAssignUser.columns.select"),
      dataIndex: "select",
      render: (_, record) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.id)}
          onChange={() => onSelectRow(record.id)}
        />
      ),
      width: 60,
      align: "center",
    },
    {
      title: t("modal.preventiveAssignUser.columns.fullName"),
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: t("modal.preventiveAssignUser.columns.email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("modal.preventiveAssignUser.columns.phone"),
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
      title: t("modal.preventiveAssignUser.columns.role"),
      dataIndex: ["role", "name"],
      key: "roleName",
      render: (_, record) => record.role?.name,
    },
    {
      title: t("users.position"),
      dataIndex: "positionName",
      key: "positionName",
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
      <Form labelWrap form={form} onFinish={onFinish}>
        <div style={{ background: "#fff" }}>
          <Row style={{ marginBottom: 16 }}>
            <Col>
              <Input.Search
                placeholder={t("modal.preventiveAssignUser.search_placeholder")}
                value={search}
                allowClear
                htmlType="button"
                enterButton={t("modal.preventiveAssignUser.search_button")}
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
                {t("modal.preventiveAssignUser.refresh")}
              </Button>
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
          <Row className="mt-3">
            <Col span={24}>
              <Form.Item label="">
                <Input.TextArea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t(
                    "modal.preventiveAssignUser.comment_placeholder",
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end" gutter={8}>
            <Col>
              <Button onClick={onCancel}>
                {t("modal.preventiveAssignUser.buttons.cancel")}
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<CheckSquareFilled />}
                htmlType="submit"
              >
                {t("modal.preventiveAssignUser.buttons.submit")}
              </Button>
            </Col>
          </Row>
        </div>
      </Form>
    </Modal>
  );
}
