import React, { useEffect, useRef, useState } from "react";
import {
  ExclamationCircleOutlined,
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
  assetType,
  PAGINATION,
  priorityType,
  ticketSchedulePreventiveStatus,
  schedulePreventiveStatus,
  calibrationWorkAssignUserStatus,
  dateType,
} from "../../../utils/constant";
import { parseToLabel } from "../../../helper/parse-helper";
import ShowSuccess from "../../../components/modal/result/successNotification";
import { parseDateHH } from "../../../helper/date-helper";
import { staticPath } from "../../../router/routerConfig";
import useHeader from "../../../contexts/headerContext";
import useMySchedulePreventive from "../../../contexts/mySchedulePreventiveContext";
import useAuth from "../../../contexts/authContext";
import { cleanEmptyValues } from "../../../helper/check-search-value";
import { useTranslation } from "react-i18next";
import ViewExpandRowCalibrationWorkAssignUser from "../../../components/modal/calibrationWork/ViewExpandRowCalibrationWorkAssignUser";
import { LabelValue } from "../../../helper/label-value";
import DrawerSearch from "../../../components/drawer/drawerSearch";
const statusMap = {
  new: ["assigned", "accepted"],
  inProgress: [
    "inProgress",
    "partiallyCompleted",
    "completeRecalibrationIssue",
  ],
  overdue: [
    "inProgress",
    "assigned",
    "accepted",
    "partiallyCompleted",
    "completeRecalibrationIssue",
  ],
  upcoming: ["assigned", "accepted"],
  history: ["completed", "cancelled", "reassignment", "replacement"],
};

export default function GroupCalibrationWork() {
  const { t } = useTranslation();
  const [calibrationWorkAssignUsers, setCalibrationWorkAssignUsers] = useState(
    [],
  );
  const [page, setPage] = useState(1);
  const { valueSearchMySchedule, setValueSearchMySchedule } =
    useMySchedulePreventive();
  const navigate = useNavigate();
  const [totalRecord, setTotalRecord] = useState(0);
  const [searchForm] = Form.useForm();
  const { setHeaderTitle } = useHeader();
  const _status = Form.useWatch("status", searchForm);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const ticketStatus = queryParams.get("ticketStatus");
  const [isOpenSearchAdvanced, setIsOpenSearchAdvanced] = useState(false);
  const [sortOrder, setSortOrder] = useState(-1);
  const [sortBy, setSortBy] = useState("startDate");
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
        status: schedulePreventiveStatus.new,
      });
    }
    if (valueSearchMySchedule) {
      searchForm.setFieldsValue(valueSearchMySchedule);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setHeaderTitle(t("menu.maintenance_request.group_calibration_task"));
  }, [t]);
  const onChangePagination = (value) => {
    setPage(value);
  };

  useEffect(() => {
    if (page > 1) {
      fetchGetListMyCalibrationWork(page, searchFilter);
    } else {
      fetchGetListMyCalibrationWork(1, searchFilter);
    }
  }, [page, sortBy, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  const resetSearch = () => {
    setSearchFilter({});
    if (drawerRef.current) drawerRef.current.resetForm();
    searchForm.resetFields();
    setPage(1);
    fetchGetListMyCalibrationWork(1);
  };
  const onSearch = () => {
    fetchGetListMyCalibrationWork(1, searchFilter);
  };
  const onClickConfirmSchedulePreventive = async (record) => {
    const payload = {
      calibrationWork: record?.calibrationWork?._id,
    };
    let res =
      await _unitOfWork.calibrationWork.comfirmAcceptCalibrationWork(payload);
    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("common.messages.success.successfully"),
      );
      fetchGetListMyCalibrationWork();
    }
  };
  const fetchGetListMyCalibrationWork = async (_page, value) => {
    const rawValues = cleanEmptyValues(searchForm.getFieldsValue());
    const values = searchForm.getFieldsValue();
    const searchValue = searchForm.getFieldValue("searchValue");
    let filterValue = cleanEmptyValues(value || {});
    let payload = {
      page: _page || page,
      limit: PAGINATION.limit,
      sortBy: sortBy,
      sortOrder: sortOrder,
      ...rawValues,
      calibrationWorkAssignUserStatus:
        rawValues.calibrationWorkAssignUserStatus,
      calibrationWorkAssignUserStatuses: statusMap[values.status],
      calibrationWorkAssignUserGroupStatus: values.groupStatus,
      ...filterValue,
      [searchField]: searchValue,
    };
    setValueSearchMySchedule(payload);
    const res =
      await _unitOfWork.calibrationWork.getGroupCalibrationWorks(payload);
    if (res && res.code === 1) {
      setCalibrationWorkAssignUsers(res?.myCalibrationWorkAssignUsers || []);
      setTotalRecord(res?.totalResults);
    }
  };

  const columns = [
    {
      title: t("calibration.stt"),
      dataIndex: "id",
      key: "id",
      width: "60px",
      align: "center",
      render: (_text, _record, index) =>
        (page - 1) * PAGINATION.limit + index + 1,
    },
    // {
    //   title: t("calibration.code"),
    //   dataIndex: "calibrationWork",
    //   align: "center",
    //   render: (text) => {
    //     return <span style={{ fontWeight: 600 }}>{text?.code || []}</span>;
    //   },
    // },
    {
      title: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span style={{ margin: "0 auto" }}>
            {t("calibrationWork.detail.title_job_information")}
          </span>
          <Tooltip
            trigger="click"
            title={
              <div>
                {t("preventive.list.table.priority")}
                {priorityType.Option.map((opt) => (
                  <div
                    key={opt.value}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: 12,
                        height: 12,
                        background: opt.color,
                        borderRadius: 3,
                      }}
                    />
                    <span>{t(opt.label)}</span>
                  </div>
                ))}
              </div>
            }
          >
            <ExclamationCircleOutlined
              style={{ fontSize: 16, color: "#faad14", cursor: "pointer" }}
            />
          </Tooltip>
        </div>
      ),
      align: "center",
      render: (text, record) => {
        const option = priorityType.Option.find(
          (opt) => opt.value === record.importance,
        );
        const barColor = option?.color || "#ff4d4f";
        return (
          <div>
            <LabelValue
              label={t("jobSummaty.code")}
              value={
                <span
                  className="priority-number"
                  style={{ color: barColor, fontWeight: 600 }}
                >
                  {record?.calibrationWork.code}
                </span>
              }
            />
            <LabelValue
              label={t("calibration.calibration_name")}
              value={record?.calibrationWork?.calibrationName}
            />
            <LabelValue
              label={t("calibration.cycle")}
              value={
                record?.calibrationWork?.numberNext +
                " " +
                parseToLabel(
                  dateType.Options,
                  record?.calibrationWork?.dateType,
                )
              }
            />
            <LabelValue
              label={t("calibration.contract")}
              value={record?.calibrationWork?.calibrationContract?.contractNo}
            />
          </div>
        );
      },
    },
    {
      title: t("assetMaintenance.list.title_info"),
      dataIndex: "calibrationWork",
      render: (text) => (
        <div>
          <LabelValue
            label={t("calibration.asset_style")}
            value={t(
              parseToLabel(
                assetType.Options,
                text?.assetMaintenance?.assetStyle,
              ),
            )}
          />
          <LabelValue
            label={t("preventive.list.table.asset_name")}
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
                {text?.assetMaintenance?.assetModel?.asset?.assetName}
              </span>
            }
          />
          <LabelValue
            label={t("preventive.list.table.model")}
            value={text?.assetMaintenance?.assetModel?.assetModelName}
          />
          <LabelValue
            label={t("preventive.list.table.serial")}
            value={text?.assetMaintenance?.serial}
          />
          <LabelValue
            label={t("assetMaintenance.asset_number")}
            value={text?.assetMaintenance?.assetNumber}
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
            value={
              record?.calibrationWork?.assetMaintenance?.objectBranch?.name
            }
          />
          <LabelValue
            label={t("breakdown.map.fields.department")}
            value={
              record?.calibrationWork?.assetMaintenance?.objectDepartments
                ?.departmentName
            }
          />
          <LabelValue
            label={t("preventive.list.table.customer")}
            value={
              record?.calibrationWork?.assetMaintenance?.customer?.customerName
            }
          />
        </div>
      ),
    },
    {
      title: t("calibration.status"),
      dataIndex: "status",
      align: "center",
      render: (status) => {
        const option = calibrationWorkAssignUserStatus.Options.find(
          (opt) => opt.value === status,
        );
        const label = option ? t(option.label) : status;
        const color = option?.color || "#d9d9d9";
        return (
          <span
            className="status-badge"
            style={{
              "--color": color,
            }}
          >
            {label}
          </span>
        );
      },
    },
    {
      title: t("calibration.start_date"),
      dataIndex: "startDate",
      key: "startDate",
      align: "center",
      render: (text) => parseDateHH(text),
    },
    // {
    //   title: t("calibration.importance"),
    //   dataIndex: "importance",
    //   align: "center",
    //   render: (text, record) =>
    //     t(
    //       parseToLabel(priorityType.Option, record?.calibrationWork?.importance)
    //     ),
    // },
  ];

  const placeholderMap = {
    searchText: t("preventive.common.all"),
    code: t("calibration.code"),
    calibrationName: t("calibration.calibration_name"),
    serial: t("preventive.common.serial"),
    assetName: t("preventive.list.table.asset_name"),
    assetModelName: t("preventive.list.table.model"),
  };

  const sortOptions = [
    { value: "startDate", label: t("preventiveSchedule.list.sort.by_start") },
    { value: "createdAt", label: t("preventiveSchedule.list.sort.by_created") },
    { value: "updatedAt", label: t("preventiveSchedule.list.sort.by_updated") },
  ];

  const myCalibrationWorkFieldsConfig = [
    {
      name: "code",
      labelKey: "myTask.myTask.search.code",
      placeholderKey: "myTask.myTask.search.code",
      component: "Input",
    },
    {
      name: "calibrationName",
      labelKey: "calibration.calibration_name",
      placeholderKey: "calibration.placeholder.calibration_name",
      component: "Input",
    },
    {
      name: "serial",
      labelKey: "myTask.myTask.search.serial",
      placeholderKey: "myTask.myTask.search.serial",
      component: "Input",
    },
    {
      name: "assetModelName",
      labelKey: "myTask.myTask.search.model",
      placeholderKey: "myTask.myTask.search.model",
      component: "Input",
    },
    {
      name: "assetName",
      labelKey: "myTask.myTask.search.asset_name",
      placeholderKey: "myTask.myTask.search.asset_name",
      component: "Input",
    },
    {
      name: "calibrationWorkAssignUserStatus",
      labelKey: "myTask.myTask.search.status",
      placeholderKey: "calibration.placeholder.status",
      component: "Select",
      options: "calibrationWorkAssignUserStatus",
    },
    {
      name: "startDate",
      labelKey: "myTask.myTask.search.start_date_from",
      placeholderKey: "myTask.myTask.search.start_date_from",
      component: "DatePicker",
    },
    {
      name: "endDate",
      labelKey: "myTask.myTask.search.end_date_to",
      placeholderKey: "myTask.myTask.search.end_date_to",
      component: "DatePicker",
    },
    {
      name: "importance",
      labelKey: "myTask.myTask.search.priority",
      placeholderKey: "myTask.myTask.search.priority",
      component: "Select",
      options: "priorityType",
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
            <Form.Item
              label=""
              name="status"
              style={{ marginBottom: 16 }}
              initialValue={ticketSchedulePreventiveStatus.new}
            >
              <Radio.Group
                buttonStyle="solid"
                style={{ width: "100%" }}
                onChange={() => {
                  setPage(1);
                  fetchGetListMyCalibrationWork();
                }}
              >
                {ticketSchedulePreventiveStatus.Options.map((item) => (
                  <Radio.Button
                    key={item.value}
                    value={item.value}
                    style={{ width: "15%", textAlign: "center" }}
                  >
                    {t(item.label)}
                  </Radio.Button>
                ))}
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
                    { value: "code", label: t("calibration.code") },
                    {
                      value: "calibrationName",
                      label: t("calibration.calibration_name"),
                    },
                    { value: "serial", label: t("preventive.common.serial") },
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
              {t("myTask.myTask.buttons.search")}
            </Button>
            <Button className="bt-green mr-2" onClick={resetSearch}>
              <RedoOutlined />
              {t("myTask.myTask.buttons.reset")}
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
              {t("myTask.myTask.misc.total", {
                count: totalRecord ? totalRecord : 0,
              })}
            </span>
          </Col>
        </Row>
        <Table
          className="mt-3"
          rowKey="_id"
          columns={columns}
          key={"_id"}
          dataSource={calibrationWorkAssignUsers}
          bordered
          pagination={false}
          scroll={{ x: "max-content" }}
          expandable={{
            expandedRowRender: (record) => (
              <ViewExpandRowCalibrationWorkAssignUser
                assignUsers={record?.assignUsers}
              />
            ),
          }}
        ></Table>
        <Pagination
          className="pagination-table mt-2"
          onChange={onChangePagination}
          pageSize={PAGINATION.limit}
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
              fetchGetListMyCalibrationWork(1, value);
            }
          }}
          onClose={() => {
            setIsOpenSearchAdvanced(false);
          }}
          fieldsConfig={myCalibrationWorkFieldsConfig}
        />
      </Form>
    </div>
  );
}
