import { useEffect, useState } from "react";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  RedoOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Pagination,
  Radio,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import { FORMAT_DATE, PAGINATION } from "../../../utils/constant";
import * as _unitOfWork from "../../../api";
import { staticPath } from "../../../router/routerConfig";
import useHeader from "../../../contexts/headerContext";
import Comfirm from "../../../components/modal/Confirm";
import { useCustomNav } from "../../../helper/navigate-helper";
import ModalReason from "../../../components/modal/ModalReason";
import { checkPermission } from "../../../helper/permission-helper";
import useAuth from "../../../contexts/authContext";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import { useTranslation } from "react-i18next";
import SearchSelectInput from "../../../components/common/SearchSelectInput";
import DrawerSearchPurchase from "../../../components/drawer/drawerSearchPurchase";

export default function RequestPurchaseList() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(PAGINATION);
  const [totalRecord, setTotalRecord] = useState(0);
  const navigate = useCustomNav();
  const [requestPurchase, setRequestPurchase] = useState([]);
  const { setHeaderTitle } = useHeader();
  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [action, setAction] = useState("pendingApproval");
  const { permissions } = useAuth();
  const [searchParams, setSearchParams] = useState({
    code: "",
    branch: "",
    department: "",
    startDate: "",
    endDate: "",
  });
  const [selectedReason, setSelectedReason] = useState("");
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [searchField, setSearchField] = useState("code");
  const [isOpenSearchAdvanced, setIsOpenSearchAdvanced] = useState(false);


  useEffect(() => {
    setHeaderTitle(t("requestPurchase.list.title"));
    fetchDepartments();
    fetchBranches();
  }, [t, setHeaderTitle]);

  useEffect(() => {
    fetchRequestPurchase();
  }, [page, action]);

  const onChangePagination = (value) => {
    setPage(value);
  };

  const fetchRequestPurchase = async (page = 1, value) => {
    const searchValue = form.getFieldValue("searchValue");

    try {
      let payload = {
        page: page,
        limit: PAGINATION.limit,
        // ...searchParams,
        // startDate: searchParams.startDate
        //   ? dayjs(searchParams.startDate, FORMAT_DATE).toDate()
        //   : "",
        // endDate: searchParams.endDate
        //   ? dayjs(searchParams.endDate, FORMAT_DATE).toDate()
        //   : "",
        ...value,
        [searchField]: searchValue,

        action: action,
      };
      const res = await _unitOfWork.requestPurchase.getListRequestPurchases(
        payload
      );

      if (res && res.results && res.results?.results) {
        const data = res.results.results;
        const dataWithNames = await Promise.all(
          data.map(async (item) => {
            const createdAt = dayjs(item.createdAt).format(FORMAT_DATE);
            return {
              ...item,
              branchName: item.branch?.name,
              departmentName: item.department?.departmentName,
              createdAt,
            };
          })
        );
        setRequestPurchase(dataWithNames);
        setTotalRecord(res.results.totalResults);
      }
    } catch (error) {
      console.error("Failed to fetch request purchases:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const department = await _unitOfWork.department.getAllDepartment();
      if (department?.data) {
        const options = department.data.map((item) => ({
          label: item.departmentName,
          value: item.id,
        }));
        setDepartments(options);
      }
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    }
  };

  const fetchBranches = async () => {
    try {
      const branch = await _unitOfWork.branch.getAllBranch();
      if (branch?.data) {
        const options = branch.data.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        setBranches(options);
      }
    } catch (error) {
      console.error("Failed to fetch branches:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res =
        await _unitOfWork.requestPurchase.deleteRequestPurchase({ id });
      if (res && res.code === 1) {
        fetchRequestPurchase();
        message.success(t("purchase.messages.delete_success"));
      } else {
        message.error(t("purchase.messages.delete_error"));
      }
    } catch {
      message.error(t("purchase.messages.delete_error"));
    }
  };
  const showCancelReason = (record) => {
    setSelectedReason(record.comment || "");
    setShowReasonModal(true);
  };

  const columns = [
    {
      title: t("requestPurchase.list.table.index"),
      dataIndex: "id",
      key: "id",
      width: "60px",
      align: "center",
      render: (_text, _record, index) =>
        (page - 1) * PAGINATION.limit + index + 1,
    },
    {
      title: t("requestPurchase.list.table.code"),
      dataIndex: "code",
      key: "code",
    },
    {
      title: t("requestPurchase.list.table.branch"),
      dataIndex: "branchName",
      key: "branch",
    },
    {
      title: t("requestPurchase.list.table.department"),
      dataIndex: "departmentName",
      key: "department",
    },
    {
      title: t("requestPurchase.list.table.description"),
      dataIndex: "description",
      key: "description",
    },
    {
      title: t("requestPurchase.list.table.created_at"),
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      width: "180px",
      sorter: (a, b) =>
        dayjs(a.createdAt, FORMAT_DATE).toDate() -
        dayjs(b.createdAt, FORMAT_DATE).toDate(),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: t("requestPurchase.list.table.action"),
      dataIndex: "action",
      align: "center",
      width: "120px",
      render: (_, record) => (
        <div>
          {checkPermission(
            permissions,
            permissionCodeConstant.purchase_request_approve
          ) && (
              <Tooltip
                title={
                  action === "pendingApproval"
                    ? t("purchase.buttons.pending_approve")
                    : t("requestPurchase.form.detail_title")
                }
              >
                <Button
                  type="primary"
                  icon={
                    action === "pendingApproval" ? (
                      <CheckCircleOutlined />
                    ) : (
                      <EyeOutlined />
                    )
                  }
                  size="small"
                  className="ml-2"
                  style={{
                    backgroundColor: "#52c41a",
                    color: "#fff",
                    borderColor: "#52c41a",
                  }}
                  onClick={() =>
                    navigate(`${staticPath.approveRequestPurchase}/${record.id}`)
                  }
                />
              </Tooltip>
            )}

          {checkPermission(
            permissions,
            permissionCodeConstant.purchase_request_edit
          ) &&
            action === "pendingApproval" && (
              <Tooltip title={t("purchase.actions.edit")}>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  size="small"
                  className="ml-2"
                  onClick={() =>
                    navigate(
                      `${staticPath.updateRequestPurchase}/${record.id}`
                    )
                  }
                />
              </Tooltip>
            )}

          {checkPermission(
            permissions,
            permissionCodeConstant.purchase_request_delete
          ) &&
            action === "pendingApproval" && (
              <Tooltip title={t("purchase.actions.delete")}>
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                  className="ml-2"
                  onClick={() =>
                    Comfirm(
                      t("purchase.messages.confirm_delete"),
                      () => handleDelete(record.id)
                    )
                  }
                />
              </Tooltip>
            )}

          {checkPermission(
            permissions,
            permissionCodeConstant.purchase_request_reject
          ) &&
            action === "rejected" && (
              <Tooltip title={t("purchase.actions.view_reason")}>
                <Button
                  type="default"
                  icon={<InfoCircleOutlined />}
                  size="small"
                  className="ml-2"
                  onClick={() => {
                    showCancelReason(record);
                  }}
                />
              </Tooltip>
            )}
        </div>
      ),
    },
  ];

  const onClickGoToCreate = () => {
    navigate(staticPath.createRequestPurchase);
  };

  const handleSearch = () => {
    setPage(1);
    fetchRequestPurchase();
  };

  const handleReset = () => {
    setPage(1);
    form.resetFields();
    fetchRequestPurchase();

  };

  return (
    <div className="p-3">
      <Form
labelWrap
        form={form}
        layout="vertical"
        onFinish={handleSearch}
        initialValues={{
          code: "",
          startDate: "",
          endDate: "",
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              name="action"
              initialValue="pendingApproval"
            >
              <Radio.Group
                buttonStyle="solid"
                style={{ width: "100%" }}
                onChange={(e) => {
                  setPage(1);
                  setAction(e.target.value);

                }}
              >
                <Radio.Button
                  value="pendingApproval"
                  style={{ width: "15%", textAlign: "center" }}
                >
                  {t("purchase.tabs.pending")}
                </Radio.Button>
                <Radio.Button
                  value="approved"
                  style={{ width: "15%", textAlign: "center" }}
                >
                  {t("purchase.tabs.approved")}
                </Radio.Button>
                <Radio.Button
                  value="rejected"
                  style={{ width: "15%", textAlign: "center" }}
                >
                  {t("purchase.tabs.rejected")}
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row align="middle" gutter={16} style={{ marginBottom: 2 }}>
          <Col span={8}>
            <SearchSelectInput
              form={form}
              fieldValue={searchField}
              onFieldChange={setSearchField}
              options={[
                { value: "code", label: t("requestPurchase.list.search.code_label") },
              ]}
            />
          </Col>
          {/* <Col span={4}>
            <Form.Item
              name="code"
              label={t("requestPurchase.list.search.code_label")}
            >
              <Input
                placeholder={t(
                  "requestPurchase.list.search.placeholder_code"
                )}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="branch"
              label={t("requestPurchase.list.search.branch_label")}
            >
              <Select
                options={branches}
                placeholder={t(
                  "requestPurchase.list.search.placeholder_branch"
                )}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="department"
              label={t("requestPurchase.list.search.department_label")}
            >
              <Select
                options={departments}
                placeholder={t(
                  "requestPurchase.list.search.placeholder_department"
                )}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="startDate"
              label={t("requestPurchase.list.search.start_label")}
            >
              <DatePicker
                placeholder={t(
                  "requestPurchase.list.search.placeholder_start"
                )}
                format={FORMAT_DATE}
                style={{ width: "100%" }}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="endDate"
              label={t("requestPurchase.list.search.end_label")}
            >
              <DatePicker
                placeholder={t(
                  "requestPurchase.list.search.placeholder_end"
                )}
                format={FORMAT_DATE}
                style={{ width: "100%" }}
                allowClear
              />
            </Form.Item>
          </Col> */}
          <Col span={8} style={{ textAlign: "left" }}>
            <Space>
              <Button type="primary" className="mr-2" htmlType="submit">
                <SearchOutlined />
                {t("purchase.buttons.search")}
              </Button>
              <Button onClick={handleReset} className="bt-green mr-2">
                <RedoOutlined />
                {t("purchase.buttons.reset")}
              </Button>
              <Button
                icon={<FilterOutlined style={{ fontSize: 20, position: "relative", top: 1 }} />}
                title={t("preventive.buttons.advanced_search")}
                onClick={() => setIsOpenSearchAdvanced(true)}

              />
            </Space>
          </Col>
          <Col span={8} style={{ textAlign: "right" }}>
            <Space>
              <Tooltip title="Hỗ trợ" color="#616263">
                <QuestionCircleOutlined
                  style={{ fontSize: 20, cursor: "pointer", marginLeft: 10 }}
                />
              </Tooltip>
              {checkPermission(
                permissions,
                permissionCodeConstant.purchase_request_create
              ) && (
                  <Button
                    key="1"
                    type="primary"
                    onClick={onClickGoToCreate}
                    className="ml-3"
                  >
                    <PlusOutlined /> {t("purchase.buttons.create")}
                  </Button>
                )}
            </Space>
          </Col>
          <Col span={24} style={{ fontSize: 16, textAlign: "right" }}>
            <b>
              {t("requestPurchase.list.total", {
                count: totalRecord || 0,
              })}
            </b>
          </Col>
        </Row>
      </Form>
      <Table
        rowKey="id"
        columns={columns}
        key="id"
        dataSource={requestPurchase}
        bordered
        pagination={false}
      />
      <Pagination
        className="pagination-table mt-2"
        onChange={onChangePagination}
        pageSize={pagination.limit}
        total={totalRecord}
        current={page}
      />
      <ModalReason
        open={showReasonModal}
        onCancel={() => setShowReasonModal(false)}
        reason={selectedReason}
        title={t("purchase.reject.reason_title")}
      />
      <DrawerSearchPurchase
        isOpen={isOpenSearchAdvanced}
        onCallBack={(value) => {
          form.resetFields(["searchValue"]);
          fetchRequestPurchase(1, value);
        }}
        onClose={() => { setIsOpenSearchAdvanced(false) }}
      />
    </div>
  );
}