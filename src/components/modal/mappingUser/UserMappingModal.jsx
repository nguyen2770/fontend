import React, { useEffect, useState } from "react";
import {
  Modal,
  Input,
  Button,
  Table,
  Pagination,
  Checkbox,
  Form,
  Row,
  Col,
  Card,
} from "antd";
import { RedoOutlined, CheckSquareFilled } from "@ant-design/icons";
import * as _unitOfWork from "../../../api";
import ShowSuccess from "../result/successNotification";
import ShowError from "../result/errorNotification";
import { PAGINATION } from "../../../utils/constant";
import { useTranslation } from "react-i18next";

export default function UserMappingModal({
  open,
  onCancel,
  onSave,
  breakdownAssignUser,
  onReset,
  serviceContractor,
}) {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(PAGINATION);
  const [totalRecord, setTotalRecord] = useState(0);
  const [selectedRowKey, setSelectedRowKey] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      fetchListUser();
    }
  }, [page, open]);

  const fetchListUser = async (searchText = search) => {
    let payload = {
      page: page,
      limit: PAGINATION.limit,
      fullName: searchText,
      serviceContractor: serviceContractor,
    };
    let res =
      await _unitOfWork.serviceContractor.getListUserNotInServiceContractUserMapping(
        payload
      );
    if (res && res.code === 1) {
      setUsers(res?.data?.results);
      setTotalRecord(res?.data?.totalResults);
    }
  };

  const onSearch = () => {
    setPage(1);
    fetchListUser();
  };

  const onSelectRow = (id, checked) => {
    if (checked) {
      setSelectedRowKey([id]);
    } else {
      setSelectedRowKey([]);
    }
  };

  const onFinish = async () => {
    if (selectedRowKey.length === 0) {
      ShowError(
        "topRight",
        t("common.notifications"),
        t("modal.userMapping.messages.select_one")
      );
      return;
    }
    const payload = {
      serviceContractor: serviceContractor,
      user: selectedRowKey[0],
    };
    const res =
      await _unitOfWork.serviceContractor.createServiceContractorUserMapping(
        payload
      );
    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("modal.userMapping.messages.success")
      );
      onReset();
      form.resetFields();
      setSelectedRowKey([]);
    } else {
      ShowError(
        "topRight",
        t("common.notifications"),
        t("modal.userMapping.messages.error")
      );
    }
  };

  const columns = [
    {
      title: t("modal.userMapping.columns.select"),
      dataIndex: "select",
      render: (_, record) => (
        <Checkbox
          checked={selectedRowKey.includes(record.id)}
          onChange={(e) => onSelectRow(record.id, e.target.checked)}
        />
      ),
      width: 60,
      align: "center",
    },
    {
      title: t("modal.userMapping.columns.fullName"),
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: t("modal.userMapping.columns.email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("modal.userMapping.columns.phone"),
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
      title: t("modal.userMapping.columns.role"),
      dataIndex: ["roleId", "name"],
      render: (_, record) => record.roleId?.name,
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
      onCancel={onCancel}
      footer={null}
      closable={false}
      width="80%"
      className="custom-modal"
    >
      <Card title={t("modal.userMapping.title")}>
        <Form labelWrap form={form} onFinish={onFinish}>
          <Row gutter={[16, 16]} align="middle">
            <Col>
              <Input.Search
                placeholder={t("modal.userMapping.search_placeholder")}
                allowClear
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onSearch={onSearch}
                enterButton={t("modal.userMapping.search_button")}
                style={{ width: 300 }}
              />
            </Col>
            <Col>
              <Button
                onClick={() => {
                  setSearch("");
                  fetchListUser("");
                }}
              >
                <RedoOutlined /> {t("modal.userMapping.refresh")}
              </Button>
            </Col>
          </Row>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={users}
            pagination={false}
            bordered
            style={{ marginTop: 16, marginBottom: 16 }}
            size="middle"
          />
          <Pagination
            total={totalRecord}
            pageSize={pagination.limit}
            current={page}
            onChange={(p) => setPage(p)}
            style={{ textAlign: "right", marginBottom: 16 }}
          />
          <Row justify="end" gutter={8}>
            <Col>
              <Button onClick={onCancel}>
                {t("modal.userMapping.buttons.cancel")}
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<CheckSquareFilled />}
                htmlType="submit"
              >
                {t("modal.userMapping.buttons.save")}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </Modal>
  );
}
