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
import {
  CheckSquareFilled,
  CloseCircleOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import * as _unitOfWork from "../../../api";
import ShowSuccess from "../../../components/modal/result/successNotification";
import ShowError from "../../../components/modal/result/errorNotification";
import { PAGINATION } from "../../../utils/constant";
import { useTranslation } from "react-i18next";
import { filterOption } from "../../../helper/search-select-helper";
export default function AssignUser({
  open,
  callbackAssignUser,
  hanldeColse,
  onReset,
  assignUser,
  selectMulti = true,
  noSelectContract,
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
      if (
        assignUser?.assetMaintenance &&
        (assignUser?.assetMaintenance?._id || assignUser?.assetMaintenance?.id)
      ) {
        fetchGetRepairContracts();
      }
    }
  }, [page, open]);

  const onSelectRow = (id, checked) => {
    if (selectMulti) {
      setSelectedRowKeys((prev) =>
        checked ? [...prev, id] : prev.filter((key) => key !== id),
      );
    } else {
      setSelectedRowKeys([id]);
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
    let res = await _unitOfWork.user.getListUserKS(payload);
    if (res && res.results) {
      setUsers(res.results);
      setTotalRecord(res.totalResults);
    }
  };
  const fetchGetRepairContracts = async () => {
    let res = await _unitOfWork.repairContract.getAllRepairContractByRes({
      assetMaintenance:
        assignUser?.assetMaintenance?._id || assignUser?.assetMaintenance?.id,
    });
    if (res && res?.code === 1) {
      setRepairContracts(res?.repairContracts);
    }
  };
  const onFinish = async () => {
    if (selectedRowKeys.length === 0) {
      ShowError(
        "topRight",
        t("common.notifications"),
        t("breakdown.assignUser.errors.select_user"),
      );
      return;
    }
    const value = form.getFieldsValue();
    if (callbackAssignUser) {
      callbackAssignUser(value, selectedRowKeys);
      form.resetFields();
      setSelectedRowKeys([]);
      return;
    }
    const payload = {
      ...value,
      user: selectedRowKeys,
      breakdown: assignUser.id,
    };
    const res =
      await _unitOfWork.breakdownAssignUser.createBreakdownAssignUser(payload);
    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("breakdown.assignUser.messages.assign_success"),
      );
      onReset();
      hanldeColse();
      form.resetFields();
      setSelectedRowKeys([]);
    } else {
      ShowError(
        "topRight",
        t("common.notifications"),
        t("breakdown.assignUser.messages.assign_error"),
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
      title: t("breakdown.assignUser.columns.select"),
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
      title: t("breakdown.assignUser.columns.fullName"),
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: t("breakdown.assignUser.columns.email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("breakdown.assignUser.columns.contactNo"),
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
      title: t("breakdown.assignUser.columns.role"),
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
                  placeholder={t("breakdown.assignUser.search_placeholder")}
                  value={search}
                  allowClear
                  enterButton={t("breakdown.assignUser.search_button")}
                  htmlType="button"
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
                  {t("breakdown.common.reset")}
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
              {!noSelectContract && (
                <Col span={12}>
                  <Form.Item
                    label={t("menu.maintenance_request.repair_contract")}
                    name="repairContract"
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
                          (item?.contractName
                            ? " - " + item?.contractName
                            : ""),
                      }))}
                      filterOption={filterOption}
                    />
                  </Form.Item>
                </Col>
              )}

              <Col span={12}></Col>
              <Col span={24}>
                <div style={{ margin: "24px 0 12px 0" }}>
                  <b>{t("breakdown.assignUser.note")}</b>
                  <Form.Item name="comments">
                    <Input.TextArea
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={t("breakdown.assignUser.note_placeholder")}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </div>
              </Col>
            </Row>
            <Row justify="end" gutter={8}>
              <Col>
                <Button onClick={onCancel}>
                  <CloseCircleOutlined />{" "}
                  {t("breakdown.assignUser.buttons.cancel")}
                </Button>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<CheckSquareFilled />}
                  htmlType="submit"
                >
                  {t("breakdown.assignUser.buttons.submit")}
                </Button>
              </Col>
            </Row>
          </div>
        </Form>
      </Card>
    </Modal>
  );
}
