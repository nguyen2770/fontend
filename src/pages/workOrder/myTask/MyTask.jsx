import React, { useEffect, useRef, useState } from "react";
import {
  CarryOutOutlined,
  ClockCircleOutlined,
  CloseSquareOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FilterOutlined,
  RedoOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
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
import "./index.scss";
import { useLocation, useNavigate } from "react-router-dom";
import {
  PAGINATION,
  priorityType,
  ticketSchedulePreventiveStatus,
  schedulePreventiveStatus,
  schedulePreventiveTaskAssignUserStatus,
  statusMyTaskMap,
  ScheduleBasedOnType,
} from "../../../utils/constant";
import Comfirm from "../../../components/modal/Confirm";
import ShowSuccess from "../../../components/modal/result/successNotification";
import { parseDateHH } from "../../../helper/date-helper";
import { staticPath } from "../../../router/routerConfig";
import useHeader from "../../../contexts/headerContext";
import ExpandRowSchedulePreventiveAssignUser from "../../../components/modal/schedulePreventive/ExpandRowSchedulePreventiveAssignUser.";
import ConfirmCancelMyTask from "./ConfirmCancelMyTask";
import useMySchedulePreventive from "../../../contexts/mySchedulePreventiveContext";
import { checkPermission } from "../../../helper/permission-helper";
import useAuth from "../../../contexts/authContext";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import { cleanEmptyValues } from "../../../helper/check-search-value";
import { useTranslation } from "react-i18next";
import DrawerSearchMyTask from "../../../components/drawer/drawerSearchMyTask";
import { LabelValue } from "../../../helper/label-value";
import { parseToLabel } from "../../../helper/parse-helper";

export default function MyTask() {
  const { t } = useTranslation();
  const [
    schedulePreventiveTaskAssignUsers,
    setSchedulePreventiveTaskAssignUsers,
  ] = useState([]);
  const [page, setPage] = useState(1);
  const { valueSearchMySchedule, setValueSearchMySchedule } =
    useMySchedulePreventive();
  const [isShowCancelConfirm, setIsShowCancelConfirm] = useState(false);
  const navigate = useNavigate();
  const [totalRecord, setTotalRecord] = useState(0);
  const [searchForm] = Form.useForm();
  const [
    schedulePreventiveTaskAssignUser,
    setSchedulePreventiveTaskAssignUser,
  ] = useState(null);
  const { setHeaderTitle } = useHeader();
  const _status = Form.useWatch("status", searchForm);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const ticketStatus = queryParams.get("ticketStatus");
  const [isOpenSearchaAvanced, setIsOpenSearchaAvanced] = useState(false);
  const [sortOrder, setSortOrder] = useState(-1);
  const { permissions } = useAuth();
  const [searchField, setSearchField] = useState("searchText");
  const [searchFilter, setSearchFilter] = useState({});
  const drawerRef = useRef();

  useEffect(() => {
    setHeaderTitle(t("myTask.myTask.title"));
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

  const onChangePagination = (value) => {
    setPage(value);
  };

  useEffect(() => {
    if (_status) {
      if (page > 1) {
        fetchGetListMySchedulePreventive(page, searchFilter);
      } else {
        fetchGetListMySchedulePreventive(1, searchFilter);
      }
    }
  }, [page, _status, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  const resetSearch = () => {
    setSearchFilter({});
    if (drawerRef.current) drawerRef.current.resetForm();
    const currentStatus = searchForm.getFieldValue("status");
    searchForm.resetFields();
    searchForm.setFieldValue("status", currentStatus);
    fetchGetListMySchedulePreventive(1);
  };
  const onSearch = () => {
    setPage(1);
    fetchGetListMySchedulePreventive(1, searchFilter);
  };
  const onClickConfirmSchedulePreventive = async (record) => {
    const payload = {
      schedulePreventiveTask: record?.schedulePreventiveTask?._id,
    };
    let res = await _unitOfWork.schedulePreventive.userConfirm(payload);
    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("common.messages.update_success"),
      );
      fetchGetListMySchedulePreventive(1, searchFilter);
    }
  };
  const fetchGetListMySchedulePreventive = async (_page, values) => {
    // const rawValues = cleanEmptyValues(searchForm.getFieldsValue());
    // const values = searchForm.getFieldsValue();
    const searchValue = searchForm.getFieldValue("searchValue");
    const status = searchForm.getFieldValue("status");
    let payload = {
      page: _page || page,
      limit: PAGINATION.limit,
      ...cleanEmptyValues(values || {}),
      [searchField]: searchValue,
      schedulePreventiveTaskAssignUserStatuses: statusMyTaskMap[status],
      ticketSchedulePreventiveTaskAssignUserStatus: status,
      sortBy: "startDate",
      sortOrder: sortOrder,
    };
    setValueSearchMySchedule(payload);
    const res =
      await _unitOfWork.schedulePreventive.getMySchedulePreventives(payload);
    if (res && res.code === 1) {
      setSchedulePreventiveTaskAssignUsers(
        res?.schedulePreventiveTaskAssignUser || [],
      );
      setTotalRecord(res?.totalResults);
    }
  };

  const onClickCheckinCheckout = (value) => {
    navigate(staticPath.schedulePreventiveCheckinCheckout + "/" + value._id);
  };
  const onClicCancelkConfirmSchedulePreventive = (record) => {
    setSchedulePreventiveTaskAssignUser(record);
    setIsShowCancelConfirm(true);
  };
  const onCallbackCancelConfirm = () => {
    setIsShowCancelConfirm(false);
    fetchGetListMySchedulePreventive();
  };
  const onClickViewSchedulePreventive = (value) => {
    navigate(
      staticPath.viewSchedulePreventive + "/" + value?.schedulePreventive?._id,
    );
  };
  const columns = [
    {
      title: t("myTask.myTask.table.index"),
      dataIndex: "id",
      key: "id",
      width: "60px",
      align: "center",
      render: (_text, _record, index) =>
        (page - 1) * PAGINATION.limit + index + 1,
    },
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
      className: "text-bold",
      dataIndex: "schedulePreventiveTask",
      render: (text, record) => {
        const option = priorityType.Option.find(
          (opt) => opt.value === record?.importance,
        );
        const barColor = option?.color || "#ff4d4f";
        return (
          <div>
            <span className="priority-number" style={{ color: barColor }}>
              <LabelValue
                label={t("Code")}
                value={record?.schedulePreventive?.code}
              />
            </span>
            <LabelValue
              label={t("preventive.list.table.plan_name")}
              value={record?.schedulePreventive?.preventive?.preventiveName}
            />
            <LabelValue
              label={t("myTask.myTask.table.task_name")}
              value={text?.taskName}
            />
            <LabelValue
              label={t("preventive.list.table.schedule_based_on")}
              value={t(
                parseToLabel(
                  ScheduleBasedOnType.Option,
                  record?.schedulePreventive?.preventive?.scheduleType,
                ),
              )}
            />
          </div>
        );
      },
    },
    {
      title: t("assetMaintenance.list.title_info"),
      dataIndex: "schedulePreventive",
      render: (text) => (
        <div>
          <LabelValue
            label={t("myTask.myTask.table.asset_name")}
            value={text?.assetMaintenance?.assetModel?.asset?.assetName}
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
              record?.schedulePreventive?.assetMaintenance?.objectBranch?.name
            }
          />
          <LabelValue
            label={t("breakdown.map.fields.department")}
            value={
              record?.schedulePreventive?.assetMaintenance?.objectDepartments
                ?.departmentName
            }
          />
          <LabelValue
            label={t("preventive.list.table.customer")}
            value={
              record?.schedulePreventive?.assetMaintenance?.customer
                ?.customerName
            }
          />
        </div>
      ),
    },
    {
      title: t("myTask.myTask.table.status"),
      dataIndex: "status",
      align: "center",
      render: (status) => {
        const option = schedulePreventiveTaskAssignUserStatus.Options.find(
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
      title: t("myTask.myTask.table.start_date"),
      dataIndex: "schedulePreventive",
      key: "schedulePreventive",
      align: "center",
      render: (text) => parseDateHH(text.startDate),
    },
    {
      title: t("myTask.myTask.table.action"),
      dataIndex: "action",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <div>
          {checkPermission(
            permissions,
            permissionCodeConstant.schedule_preventive_my_task_accept,
          ) &&
            record.status ===
              schedulePreventiveTaskAssignUserStatus.assigned && (
              <Tooltip title={t("myTask.myTask.tooltips.accept")}>
                <Button
                  type="primary"
                  icon={<CarryOutOutlined />}
                  size="small"
                  onClick={() =>
                    Comfirm(t("myTask.myTask.dialogs.confirm_task"), () =>
                      onClickConfirmSchedulePreventive(record),
                    )
                  }
                  className="ml-2"
                />
              </Tooltip>
            )}
          {checkPermission(
            permissions,
            permissionCodeConstant.schedule_preventive_my_task_rejected,
          ) &&
            record.status ===
              schedulePreventiveTaskAssignUserStatus.assigned && (
              <Tooltip title={t("myTask.myTask.tooltips.reject")}>
                <Button
                  icon={<CloseSquareOutlined />}
                  size="small"
                  onClick={() => onClicCancelkConfirmSchedulePreventive(record)}
                  className="ml-2"
                />
              </Tooltip>
            )}
          {checkPermission(
            permissions,
            permissionCodeConstant.schedule_preventive_my_task_checkin_checkout,
          ) &&
            (record.status ===
              schedulePreventiveTaskAssignUserStatus.accepted ||
              record.status ===
                schedulePreventiveTaskAssignUserStatus.inProgress) && (
              <Tooltip title={t("myTask.myTask.tooltips.checkin_checkout")}>
                <Button
                  type="primary"
                  icon={<ClockCircleOutlined />}
                  size="small"
                  onClick={() => onClickCheckinCheckout(record)}
                  className="ml-2"
                />
              </Tooltip>
            )}{" "}
          {checkPermission(
            permissions,
            permissionCodeConstant.schedule_preventive_view_detail,
          ) && (
            <Tooltip title={t("preventiveSchedule.list.tooltips.view")}>
              <Button
                icon={<EyeOutlined />}
                size="small"
                onClick={() => onClickViewSchedulePreventive(record)}
                className="ml-2"
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  const placeholderMap = {
    searchText: t("preventive.common.all"),

    code: t("myTask.myTask.search.code"),
    taskName: t("myTask.myTask.search.task_name"),
    serial: t("myTask.myTask.search.serial"),
    assetModelName: t("myTask.myTask.search.model"),
    assetName: t("myTask.myTask.search.asset_name"),
  };

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
        <Row className="mb-1" gutter={32}>
          {/* <Col span={6}>
            <Form.Item id="" label={t("myTask.myTask.search.code")} name="code">
              <Input placeholder={t("myTask.myTask.search.code")}></Input>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              id=""
              label={t("myTask.myTask.search.task_name")}
              name="taskName"
            >
              <Input placeholder={t("myTask.myTask.search.task_name")}></Input>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              id=""
              label={t("myTask.myTask.search.serial")}
              name="serial"
            >
              <Input placeholder={t("myTask.myTask.search.serial")}></Input>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              id=""
              label={t("myTask.myTask.search.model")}
              name="assetModelName"
            >
              <Input placeholder={t("myTask.myTask.search.model")}></Input>
            </Form.Item>
          </Col>
          {isOpenSearchaAvanced && (
            <>
              <Col span={6}>
                <Form.Item
                  id=""
                  label={t("myTask.myTask.search.asset_name")}
                  name="assetName"
                >
                  <Input
                    placeholder={t("myTask.myTask.search.asset_name")}
                  ></Input>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={t("myTask.myTask.search.status")}
                  name="schedulePreventiveTaskAssignUserStatus"
                >
                  <Select
                    showSearch
                    allowClear
                    placeholder={t("myTask.myTask.search.status")}
                    options={(
                      schedulePreventiveTaskAssignUserStatus.Options || []
                    ).map((item) => ({
                      value: item.value,
                      label: t(item.label),
                    }))}
                    filterOption={filterOption}
                  />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  name="startDate"
                  label={t("myTask.myTask.search.start_date_from")}
                >
                  <DatePicker
                    placeholder={t("myTask.myTask.search.start_date_from")}
                    format={FORMAT_DATE}
                    style={{ width: "100%" }}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="endDate"
                  label={t("myTask.myTask.search.end_date_to")}
                >
                  <DatePicker
                    placeholder={t("myTask.myTask.search.end_date_to")}
                    format={FORMAT_DATE}
                    style={{ width: "100%" }}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={t("myTask.myTask.search.priority")}
                  name="importance"
                >
                  <Select
                    showSearch
                    allowClear
                    placeholder={t("myTask.myTask.search.priority")}
                    options={(priorityType.Option || []).map((item) => ({
                      value: item.value,
                      label: t(item.label),
                    }))}
                    filterOption={filterOption}
                  />
                </Form.Item>
              </Col>
            </>
          )} */}
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
                    { value: "code", label: t("myTask.myTask.search.code") },
                    {
                      value: "taskName",
                      label: t("myTask.myTask.search.task_name"),
                    },
                    {
                      value: "serial",
                      label: t("myTask.myTask.search.serial"),
                    },
                    {
                      value: "assetModelName",
                      label: t("myTask.myTask.search.model"),
                    },
                    {
                      value: "assetName",
                      label: t("myTask.myTask.search.asset_name"),
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
            {/* <Button
              className="bt-green mr-2"
              onClick={() => setIsOpenSearchaAvanced(true)}
            >
              <PlusCircleFilled />
              {t("myTask.myTask.buttons.advanced_search")}
            </Button> */}
            <Button
              title={t("preventive.buttons.advanced_search")}
              className="px-2 mr-2"
              onClick={() => setIsOpenSearchaAvanced(true)}
            >
              <FilterOutlined style={{ fontSize: 20, cursor: "pointer" }} />
            </Button>
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
          </Col>
          <Col
            span={4}
            style={{
              textAlign: "right",
              marginTop: "auto",
            }}
          >
            <span style={{ fontWeight: 600, fontSize: "16px", marginRight: 5 }}>
              {t("myTask.myTask.misc.total", {
                count: totalRecord ? totalRecord : 0,
              })}
            </span>
          </Col>
        </Row>
        <Table
          rowKey="_id"
          columns={columns}
          key={"_id"}
          dataSource={schedulePreventiveTaskAssignUsers}
          bordered
          pagination={false}
          scroll={{ x: "max-content" }}
          expandable={{
            expandedRowRender: (record) => (
              <ExpandRowSchedulePreventiveAssignUser
                schdulePreventive={record}
                fetchGetListSchedulePreventive={
                  fetchGetListMySchedulePreventive
                }
                isActive={true}
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
        <ConfirmCancelMyTask
          open={isShowCancelConfirm}
          schedulePreventiveTaskAssignUser={schedulePreventiveTaskAssignUser}
          onCallback={onCallbackCancelConfirm}
        />
        <DrawerSearchMyTask
          isOpen={isOpenSearchaAvanced}
          onClose={() => {
            setIsOpenSearchaAvanced(false);
          }}
          ref={drawerRef}
          onCallBack={(value) => {
            searchForm.resetFields(["searchValue"]);
            setSearchFilter(value);
            if (!value.isClose) {
              setPage(1);
              fetchGetListMySchedulePreventive(1, value);
            }
          }}
        />
      </Form>
    </div>
  );
}
