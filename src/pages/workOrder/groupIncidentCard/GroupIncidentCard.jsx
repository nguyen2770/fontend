import React, { useEffect, useRef, useState } from "react";
import {
  EyeFilled,
  FilterOutlined,
  RedoOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Dropdown,
  Form,
  Input,
  Pagination,
  Radio,
  Row,
  Select,
  Table,
  Tooltip,
} from "antd";
import * as _unitOfWork from "../../../api";
import { useLocation, useNavigate } from "react-router-dom";
import {
  assetMaintenanceStatus,
  assetType,
  breakdownStatus,
  breakdownUserStatus,
  PAGINATION,
  priorityLevelStatus,
} from "../../../utils/constant";
import { getOptionColor, parseToLabel } from "../../../helper/parse-helper";
import { staticPath } from "../../../router/routerConfig";
import ExpandRowBreakdownAssignUser from "../../../components/modal/breakdownModel/ExpandRowBreakdownAssignUser";
import { parseDate } from "../../../helper/date-helper";
import useHeader from "../../../contexts/headerContext";
import useMyBreakdown from "../../../contexts/myBreakdownContext";
import useAuth from "../../../contexts/authContext";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import { cleanEmptyValues } from "../../../helper/check-search-value";
import { useTranslation } from "react-i18next";
import DrawerSearch from "../../../components/drawer/drawerSearch";
import { LabelValue } from "../../../helper/label-value";

const statusMap = {
  new: ["assigned", "rejected", "accepted", "reopen"],
  inProgress: [
    "inProgress",
    "requestForSupport",
    "WCA",
    "reassignment",
    "experimentalFix",
    "pending_approval",
    "approved",
    "submitted",
  ],
  overdue: [
    "assigned",
    "rejected",
    "accepted",
    "reopen",
    "inProgress",
    "requestForSupport",
    "WCA",
    "reassignment",
    "experimentalFix",
    "pending_approval",
    "approved",
    "submitted",
  ],
  completed: ["completed"],
  cloesed: ["cloesed", "cancelled", "replacement"],
};

export default function MyBreakdown() {
  const { t } = useTranslation();
  const [breakdowns, setBreakdowns] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [pagination, setPagination] = useState(PAGINATION);
  const [totalRecord, setTotalRecord] = useState(0);
  const [searchForm] = Form.useForm();
  const { setHeaderTitle } = useHeader();
  const userLocal = JSON.parse(localStorage.getItem("USER"));
  const _status = Form.useWatch("status", searchForm);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const ticketStatus = queryParams.get("ticketStatus");
  const { valueSearchMyBreakdown, setValueSearchMyBreakdown } =
    useMyBreakdown();
  const [isOpenSearchAdvanced, setIsOpenSearchAdvanced] = useState(false);
  const [sortOrder, setSortOrder] = useState(-1);
  const [sortBy, setSortBy] = useState("createdAt");
  const { permissions } = useAuth();
  const [searchField, setSearchField] = useState("searchText");
  const [searchFilter, setSearchFilter] = useState({});
  const drawerRef = useRef();

  useEffect(() => {
    if (ticketStatus) {
      searchForm.setFieldsValue({
        status: ticketStatus,
      });
    } else {
      searchForm.setFieldsValue({
        status: "new",
      });
    }
    if (valueSearchMyBreakdown) {
      searchForm.setFieldsValue(valueSearchMyBreakdown);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    setHeaderTitle(t("menu.maintenance_request.group_incident_card"));
  }, [t]);
  useEffect(() => {
    if (page > 1) {
      fetchGetListBreakdown(page, searchFilter);
    } else {
      fetchGetListBreakdown(1, searchFilter);
    }
  }, [page, _status, sortBy, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  const onChangePagination = (value) => {
    setPage(value);
  };

  const resetSearch = () => {
    setSearchFilter({});
    if (drawerRef.current) drawerRef.current.resetForm();
    searchForm.resetFields();
    searchForm.setFieldsValue({
      status: "new",
    });
    setPage(1);
    fetchGetListBreakdown(1);
  };

  const fetchGetListBreakdown = async (_page, value) => {
    const rawValues = cleanEmptyValues(searchForm.getFieldsValue());
    const values = searchForm.getFieldsValue();
    const searchValue = searchForm.getFieldValue("searchValue");
    let filterValue = cleanEmptyValues(value || {});
    let payload = {
      page: _page || page,
      limit: PAGINATION.limit,
      groupUser: true,
      code: rawValues.code,
      serial: rawValues.serial,
      assetStyle: rawValues.assetStyle,
      priorityLevel: rawValues.priorityLevel,
      breakdownAssignUserStatuses: statusMap[values.status],
      sortBy: sortBy,
      sortOrder: sortOrder,
      [searchField]: searchValue,
      ...filterValue,
    };
    if (values.status === "overdue") {
      payload.isOverdue = true;
    }
    setValueSearchMyBreakdown({
      ...payload,
      status: values.status,
    });
    const res = await _unitOfWork.breakdown.getListBreakdowns(payload);
    if (res && res?.results) {
      setBreakdowns(res?.results);
      setTotalRecord(res?.totalResults);
    }
  };

  const onClicView = (value) => {
    navigate(staticPath.viewWorkOrderBreakdown + "/" + value.id);
  };
  const parseUser = (record) => {
    const found = record?.breakdownAssignUsers?.find(
      (item) => (item?.user?._id || item?.user?.id) === userLocal?.id,
    );
    return found?.repairContract?.contractNo;
  };
  const parseStatusAssignUser = (record) => {
    const found = record?.breakdownAssignUsers?.find(
      (item) => (item?.user?._id || item?.user?.id) === userLocal?.id,
    );
    const option = breakdownUserStatus.Option.find(
      (opt) => opt.value === found?.status,
    );
    const label = option ? t(option.label) : found?.status;
    const color = option?.color || "#d9d9d9";
    return (
      <span
        style={{
          color: color,
          fontWeight: 600,
        }}
      >
        {label}
      </span>
    );
  };
  const columns = [
    {
      title: t("breakdown.list.columns.stt"),
      dataIndex: "id",
      key: "id",
      width: "60px",
      align: "center",
      render: (_text, _record, index) =>
        (page - 1) * PAGINATION.limit + index + 1,
    },
    {
      title: t("breakdown.info"),
      render: (text, _record) => {
        const priorityText = parseToLabel(
          priorityLevelStatus.Options,
          _record?.priorityLevel,
        );
        const assetStatusText = t(
          parseToLabel(
            assetMaintenanceStatus.Options,
            _record?.assetMaintenanceStatus,
          ),
        );

        return (
          <div>
            <LabelValue
              label={t("breakdown.list.columns.code")}
              value={_record?.code}
            />
            <LabelValue
              label={t("breakdown.list.columns.priority")}
              value={
                <span
                  style={{
                    color: getOptionColor(
                      priorityLevelStatus.Options,
                      _record?.priorityLevel,
                    ),
                  }}
                >
                  {priorityText}
                </span>
              }
            />
            <LabelValue
              label={t("breakdown.list.columns.asset_status")}
              value={
                <span
                  style={{
                    color: getOptionColor(
                      assetMaintenanceStatus.Options,
                      _record?.assetMaintenanceStatus,
                    ),
                  }}
                >
                  {assetStatusText}
                </span>
              }
            />
            <LabelValue
              label={t("breakdown.list.columns.amc_no")}
              value={parseUser(_record)}
            />
          </div>
        );
      },
    },
    {
      title: t("assetMaintenance.list.title_info"),
      dataIndex: "assetMaintenance",
      render: (text) => (
        <div>
          <LabelValue
            label={t("breakdown.list.columns.asset_name")}
            value={
              <span
                style={{
                  display: "block",
                  maxWidth: 150,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {text?.assetModel?.asset?.assetName}
              </span>
            }
          />
          <LabelValue
            label={t("breakdown.list.columns.model")}
            value={text?.assetModel?.assetModelName}
          />
          <LabelValue
            label={t("breakdown.list.columns.serial")}
            value={text?.serial}
          />
          <LabelValue
            label={t("assetMaintenance.asset_number")}
            value={text?.assetNumber}
          />
        </div>
      ),
    },
    {
      title: t("preventiveSchedule.modal.map_title"),
      render: (text, record) => (
        <div>
          <LabelValue
            label={t("breakdown.map.fields.branch")}
            value={record?.objectBranch?.name}
          />
          <LabelValue
            label={t("breakdown.map.fields.department")}
            value={record?.assetMaintenance?.department?.departmentName}
          />
          <LabelValue
            label={t("preventive.list.table.customer")}
            value={record?.assetMaintenance?.customer?.customerName}
          />
        </div>
      ),
    },
    {
      title: t("breakdown.common.status"),
      render: (text, record) => {
        const status = parseToLabel(breakdownStatus.Option, record?.status);
        return (
          <div>
            <LabelValue
              label={t("breakdown.breakdown_status")}
              value={
                <span
                  style={{
                    fontWeight: 600,
                    color: getOptionColor(
                      breakdownStatus.Option,
                      record?.status,
                    ),
                  }}
                >
                  {t(status)}
                </span>
              }
            />
            <LabelValue
              label={t("breakdown.engineer_status")}
              value={parseStatusAssignUser(record)}
            />
          </div>
        );
      },
    },
    // {
    //   title: t("breakdown.list.columns.job_status"),
    //   dataIndex: "status",
    //   align: "center",
    //   render: (status) => {
    //     const option = breakdownStatus.Option.find(
    //       (opt) => opt.value === status,
    //     );
    //     const label = option ? t(option.label) : status;
    //     const color = option?.color || "#d9d9d9";
    //     return (
    //       <span
    //         className="status-badge"
    //         style={{
    //           "--color": color,
    //         }}
    //       >
    //         {label}
    //       </span>
    //     );
    //   },
    // },
    {
      title: t("dashboard.calendar.messages.time"),
      dataIndex: "assetMaintenance",
      render: (_, record) => {
        const found = record?.breakdownAssignUsers?.find(
          (item) => (item?.user?._id || item?.user?.id) === userLocal?.id,
        );

        return (
          <div>
            <LabelValue
              label={t("breakdown.myWork.columns.created_at")}
              value={parseDate(record?.createdAt)}
            />
            <LabelValue
              label={t("breakdown.myWork.columns.expected_repair_time")}
              value={parseDate(found?.expectedRepairTime)}
            />
            <LabelValue
              label={t("breakdown.list.columns.deadline")}
              value={parseDate(record?.incidentDeadline)}
            />
          </div>
        );
      },
    },
    {
      title: t("breakdown.list.columns.action"),
      dataIndex: "action",
      align: "center",
      render: (_, record) => (
        <>
          {checkPermission(
            permissions,
            permissionCodeConstant.ticket_view_detail,
          ) && (
            <Tooltip title={t("breakdown.list.tooltips.view")}>
              <Button
                icon={<EyeFilled />}
                size="small"
                onClick={() => onClicView(record)}
                className="ml-2"
              />
            </Tooltip>
          )}
        </>
      ),
    },
  ];

  const onSearch = () => {
    pagination.page = 1;
    fetchGetListBreakdown(1, searchFilter);
  };

  const placeholderMap = {
    searchText: t("preventive.common.all"),
    code: t("breakdown.common.code"),
    // calibrationName: t("calibration.calibration_name"),
    serial: t("breakdown.common.serial"),
    assetName: t("preventive.list.table.asset_name"),
    assetModelName: t("preventive.list.table.model"),
  };

  const sortOptions = [
    { value: "createdAt", label: t("preventiveSchedule.list.sort.by_created") },
    { value: "updatedAt", label: t("preventiveSchedule.list.sort.by_updated") },
  ];

  const groupIncidentCardFieldsConfig = [
    // {
    //   name: "code",
    //   labelKey: "breakdown.common.code",
    //   placeholderKey: "breakdown.common.code",
    //   component: "Input",
    // },
    // {
    //   name: "serial",
    //   labelKey: "breakdown.common.serial",
    //   placeholderKey: "breakdown.common.serial",
    //   component: "Input",
    // },
    {
      name: "assetStyle",
      labelKey: "breakdown.common.asset_type",
      placeholderKey: "breakdown.common.asset_type",
      component: "Select",
      options: "assetType",
    },
    {
      name: "priorityLevel",
      labelKey: "breakdown.common.priority",
      placeholderKey: "breakdown.common.priority",
      component: "Select",
      options: "priorityLevelStatus",
    },
    {
      name: "breakdownStatus",
      labelKey: "breakdown.common.status",
      placeholderKey: "breakdown.common.status",
      component: "Select",
      options: "breakdownStatus",
    },
  ];

  return (
    <div className="p-3">
      <Form
        labelWrap
        className="search-form"
        form={searchForm}
        layout="vertical"
        onFinish={onSearch}
      >
        <Row className="mb-1" gutter={32}>
          <Col span={24}>
            <Form.Item label="" name="status" style={{ marginBottom: 16 }}>
              <Radio.Group buttonStyle="solid" style={{ width: "100%" }}>
                <Radio.Button
                  value="new"
                  style={{ width: "15%", textAlign: "center" }}
                >
                  {t("breakdown.ticketStatusTabs.new")}
                </Radio.Button>
                <Radio.Button
                  value="inProgress"
                  style={{ width: "15%", textAlign: "center" }}
                >
                  {t("breakdown.ticketStatusTabs.inProgress")}
                </Radio.Button>
                <Radio.Button
                  value="overdue"
                  style={{ width: "15%", textAlign: "center" }}
                >
                  {t("breakdown.ticketStatusTabs.overdue")}
                </Radio.Button>
                <Radio.Button
                  value="completed"
                  style={{ width: "15%", textAlign: "center" }}
                >
                  {t("breakdown.ticketStatusTabs.completed")}
                </Radio.Button>
                <Radio.Button
                  value="cloesed"
                  style={{ width: "15%", textAlign: "center" }}
                >
                  {t("breakdown.ticketStatusTabs.cloesed")}
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8} className="mt-2">
            <Form.Item>
              <Input.Group compact>
                <Select
                  value={searchField}
                  style={{ width: "30%", height: 32, lineHeight: "32px" }}
                  onChange={(value) => {
                    setSearchField(value);
                    searchForm.setFieldValue("searchValue", "");
                  }}
                  options={[
                    { value: "searchText", label: t("preventive.common.all") },
                    { value: "code", label: t("breakdown.common.code") },
                    // { value: "calibrationName", label: t("calibration.calibration_name") },
                    { value: "serial", label: t("breakdown.common.serial") },
                    {
                      value: "assetName",
                      label: t("preventive.list.table.asset_name"),
                    },
                    {
                      value: "assetModelName",
                      label: t("preventive.list.table.model"),
                    },
                  ]}
                />

                <Form.Item name="searchValue" noStyle>
                  <Input
                    style={{ width: "70%", height: 32, lineHeight: "32px" }}
                    placeholder={placeholderMap[searchField]}
                  />
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>
          <Col
            span={12}
            style={{ display: "flex", alignItems: "center", marginBottom: 3 }}
          >
            <Button type="primary" className="mr-2" htmlType="submit">
              <SearchOutlined />
              {t("breakdown.common.search")}
            </Button>
            <Button className="bt-green mr-2" onClick={resetSearch}>
              <RedoOutlined />
              {t("breakdown.common.reset")}
            </Button>
            <Dropdown
              className="mr-2"
              trigger={["click"]}
              menu={{
                items: sortOptions.map((opt) => ({
                  key: opt.value,
                  label: opt.label,
                  className: sortBy === opt.value ? "active-sort-item" : "",
                })),
                onClick: ({ key }) => setSortBy(key),
              }}
            >
              <Button icon={<SwapOutlined />} />
            </Dropdown>
            <Button
              icon={
                sortOrder === -1 ? (
                  <SortDescendingOutlined />
                ) : (
                  <SortAscendingOutlined />
                )
              }
              className="mr-2"
              onClick={() => {
                sortOrder === -1 ? setSortOrder(1) : setSortOrder(-1);
              }}
            ></Button>
            <Button
              title={t("preventive.buttons.advanced_search")}
              className="px-2 mr-2"
              onClick={() => setIsOpenSearchAdvanced(true)}
            >
              <FilterOutlined style={{ fontSize: 20, cursor: "pointer" }} />
            </Button>
          </Col>
          <Col span={4} style={{ textAlign: "right", marginTop: "auto" }}>
            <span style={{ fontWeight: 600, fontSize: "16px", marginRight: 5 }}>
              {t("breakdown.common.total", {
                count: totalRecord ? totalRecord : 0,
              })}
            </span>
          </Col>
        </Row>
        <Table
          className="mt-3"
          rowKey="id"
          columns={columns}
          key={"id"}
          dataSource={breakdowns}
          bordered
          pagination={false}
          scroll={{ x: "max-content" }}
          expandable={{
            expandedRowRender: (record) => (
              <ExpandRowBreakdownAssignUser
                breakdowns={record}
                fetchGetListBreakdown={fetchGetListBreakdown}
                hideAction={true}
              />
            ),
          }}
        ></Table>
        <Pagination
          className="pagination-table mt-2"
          onChange={onChangePagination}
          pageSize={pagination.limit}
          total={totalRecord}
          current={page}
        />
        <DrawerSearch
          isOpen={isOpenSearchAdvanced}
          ref={drawerRef}
          onCallBack={(value) => {
            searchForm.resetFields(["searchValue"]);
            setSearchFilter(value);
            if (!value.isClose) {
              setPage(1);
              fetchGetListBreakdown(1, value);
            }
          }}
          onClose={() => {
            setIsOpenSearchAdvanced(false);
          }}
          fieldsConfig={groupIncidentCardFieldsConfig}
        />
      </Form>
    </div>
  );
}
