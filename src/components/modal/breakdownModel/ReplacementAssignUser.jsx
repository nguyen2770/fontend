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
  Card,
  Select,
} from "antd";
import { CheckSquareFilled, RedoOutlined } from "@ant-design/icons";
import * as _unitOfWork from "../../../api";
import ShowSuccess from "../result/successNotification";
import ShowError from "../result/errorNotification";
import { PAGINATION } from "../../../utils/constant";
import { useTranslation } from "react-i18next";
import { filterOption } from "../../../helper/search-select-helper";

export default function ReplacementAssignUser({
  open,
  hanldeColse,
  onReset,
  breakdownAssignUser,
  breakdowns,
}) {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [comment, setComment] = useState("");
  const [search, setSearch] = useState("");
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(PAGINATION);
  const [totalRecord, setTotalRecord] = useState(0);
  const [repairContracts, setRepairContracts] = useState([]);
  useEffect(() => {
    if (open) {
      fetchListUser();
      if (breakdowns?.assetMaintenance) {
        fetchGetRepairContracts();
      }
    }
  }, [page, open]);

  const onSelectRow = (id, checked) => {
    setSelectedRowKeys((prev) =>
      checked ? [...prev, id] : prev.filter((key) => key !== id),
    );
  };
  const fetchGetRepairContracts = async () => {
    let res = await _unitOfWork.repairContract.getAllRepairContractByRes({
      assetMaintenance: breakdowns?.assetMaintenance?._id,
    });
    if (res && res?.code === 1) {
      setRepairContracts(res?.repairContracts);
    }
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
      ShowError(
        "topRight",
        t("common.notifications"),

        t("modal.replacementAssignUser.messages.select_one"),
      );
      return;
    }
    const value = form.getFieldsValue();
    const payload = {
      ...value,
      user: selectedRowKeys,
      breakdown: breakdownAssignUser.breakdown,
      breakdownAssignUser: breakdownAssignUser?.id || breakdownAssignUser?._id,
      replacementUser:
        breakdownAssignUser?.user?._id || breakdownAssignUser?.user?.id,
    };
    if (value?.repairContract) {
      payload.repairContract = breakdownAssignUser?.repairContract?._id;
    } else {
      payload.repairContract = value.selectRepairContract;
    }
    const res =
      await _unitOfWork.breakdownAssignUser.replacementAssignUser(payload);
    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("modal.replacementAssignUser.messages.success"),
      );
      onReset();
      hanldeColse();
      form.resetFields();
      setSelectedRowKeys([]);
    } else {
      ShowError(
        "topRight",
        t("common.notifications"),
        t("modal.replacementAssignUser.messages.error"),
      );
    }
  };
  const onCancel = () => {
    form.resetFields();
    setSelectedRowKeys([]);
    hanldeColse();
  };
  const columns = [
    {
      title: t("modal.replacementAssignUser.columns.select"),
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
      title: t("modal.replacementAssignUser.columns.fullName"),
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: t("modal.replacementAssignUser.columns.phone"),
      dataIndex: "contactNo",
      key: "contactNo",
    },
    {
      title: t("modal.replacementAssignUser.columns.branch"),
      dataIndex: "branch",
      key: "branch",
      render: (_, record) => record?.branch?.name,
    },
    {
      title: t("modal.replacementAssignUser.columns.role"),
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
      className="custom-modal"
    >
      <Card title={t("breakdownAssignUser.assign_work_to_engineers")}>
        <Form labelWrap form={form} onFinish={onFinish}>
          <div style={{ background: "#fff" }}>
            <Row style={{ marginBottom: 16 }}>
              <Col>
                <Input.Search
                  placeholder={t(
                    "modal.replacementAssignUser.search_placeholder",
                  )}
                  value={search}
                  allowClear
                  htmlType="button"
                  enterButton={t("modal.replacementAssignUser.search_button")}
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
                  {t("modal.replacementAssignUser.refresh")}
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
              <Col span={12}>
                <Form.Item
                  label={t("menu.maintenance_request.repair_contract")}
                  name="selectRepairContract"
                  labelAlign="left"
                >
                  <Select
                    allowClear
                    showSearch
                    placeholder={t("preventive.form.contract_placeholder")}
                    options={repairContracts.map((item) => ({
                      value: item.id,
                      label:
                        item?.contractNo +
                        (item?.contractName ? " - " + item?.contractName : ""),
                    }))}
                    filterOption={filterOption}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <div style={{ margin: "24px 0 12px 0" }}>
                  <b>{t("modal.replacementAssignUser.comment_label")}</b>
                  <Form.Item name="comments">
                    <Input.TextArea
                      rows={2}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={t(
                        "modal.replacementAssignUser.comment_placeholder",
                      )}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row justify="end" gutter={8}>
              <Col>
                <Button onClick={onCancel}>
                  {t("modal.replacementAssignUser.buttons.cancel")}
                </Button>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<CheckSquareFilled />}
                  htmlType="submit"
                >
                  {t("modal.replacementAssignUser.buttons.submit")}
                </Button>
              </Col>
            </Row>
          </div>
        </Form>
      </Card>
    </Modal>
  );
}
