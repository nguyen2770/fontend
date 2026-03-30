import React, { useEffect, useRef, useState } from "react";
import {
  CheckSquareOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FilterOutlined,
  FolderOpenOutlined,
  MoreOutlined,
  RedoOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  SwapOutlined,
  UserAddOutlined,
  WechatWorkOutlined,
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
  PAGINATION,
  priorityType,
  schedulePreventiveStatus,
  calibrationGroupStatus,
  calibrationWorkStatus,
  dateType,
} from "../../../utils/constant";
import Comfirm from "../../../components/modal/Confirm";
import ShowSuccess from "../../../components/modal/result/successNotification";
import { parseDateHH } from "../../../helper/date-helper";
import useHeader from "../../../contexts/headerContext";
import { staticPath } from "../../../router/routerConfig";
import useSchedulePreventive from "../../../contexts/schedulePreventiveContext";
import useAuth from "../../../contexts/authContext";
import { useTranslation } from "react-i18next";
import ExpandRowCalibrationWorkAssignUser from "./ExpandRowCalibrationWorkAssignUser";
import AssignUser from "../breakdown/AssignUser";
import ShowError from "../../../components/modal/result/errorNotification";
import { cleanEmptyValues } from "../../../helper/check-search-value";
import ComfirmCloseCalibrationWork from "./ComfirmCloseCalibrationWork";
import ComfirmReOpenCalibrationWork from "./ComfirmReOpenCalibrationWork";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import { LabelValue } from "../../../helper/label-value";
import DrawerSearch from "../../../components/drawer/drawerSearch";
import { parseToLabel } from "../../../helper/parse-helper";

export default function CalibrationWork() {
  const { t } = useTranslation();
  const [schedulePreventives, setschedulePreventives] = useState([]);
  const [page, setPage] = useState(1);
  const { valueSearch, setValueSearch } = useSchedulePreventive();
  const navigate = useNavigate();
  const [totalRecord, setTotalRecord] = useState(0);
  const [searchForm] = Form.useForm();
  const [isOpenReOpen, setIsOpenReOpen] = useState(false);
  const [isOpenRecognize, setIsOpenRecognize] = useState(false);
  const [sortOrder, setSortOrder] = useState(-1);
  const [sortBy, setSortBy] = useState("startDate");
  const { setHeaderTitle } = useHeader();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const groupStatus = queryParams.get("groupStatus");
  const [isOpenSearchAdvanced, setIsOpenSearchAdvanced] = useState(false);
  const { permissions } = useAuth();
  const [isOpenAssignUser, setIsOpenAssignUser] = useState(false);
  const [calibrationWork, setCalibrationWork] = useState("");
  const [calibrationWorkAssignUser, setCalibrationWorkAssignUser] =
    useState("");
  const [searchField, setSearchField] = useState("searchText");
  const [searchFilter, setSearchFilter] = useState({});
  const drawerRef = useRef();
  useEffect(() => {
    if (valueSearch) {
      searchForm.setFieldsValue(valueSearch);
    }
  }, []);
  useEffect(() => {
    if (groupStatus) {
      searchForm.setFieldsValue({
        groupStatus: groupStatus,
      });
    }
  }, [groupStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setHeaderTitle(t("menu.maintenance_request.calibration_task"));
  }, [t]);

  useEffect(() => {
    if (page > 1) {
      fetchGetListCalibrationWork(page, searchFilter);
    } else {
      fetchGetListCalibrationWork(1, searchFilter);
    }
  }, [page, sortOrder, sortBy]); // eslint-disable-line react-hooks/exhaustive-deps
  const onChangePagination = (value) => {
    setPage(value);
  };

  const resetSearch = () => {
    setSearchFilter({});
    if (drawerRef.current) drawerRef.current.resetForm();
    searchForm.resetFields();
    setPage(1);
    fetchGetListCalibrationWork(1);
  };
  const fetchGetListCalibrationWork = async (_page, value) => {
    const rawValues = cleanEmptyValues(searchForm.getFieldsValue());
    const searchValue = searchForm.getFieldValue("searchValue");
    let filterValue = cleanEmptyValues(value || {});
    let payload = {
      page: _page || page,
      limit: PAGINATION.limit,
      sortBy,
      sortOrder,
      ...rawValues,
      ...filterValue,
      [searchField]: searchValue,
    };
    setValueSearch(payload);
    const res = await _unitOfWork.calibrationWork.getCalibrationWorks(payload);
    if (res && res.code === 1) {
      setschedulePreventives(res?.results || []);
      setTotalRecord(res?.totalResults);
    }
  };

  const onClickDelete = async (value) => {
    let res = await _unitOfWork.calibrationWork.deleteCalibrationWorkById(
      value._id || value.id,
    );
    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("preventiveSchedule.list.title"),
        t("preventive.messages.delete_success"),
      );
      setPage(1);
      fetchGetListCalibrationWork(1, searchFilter);
    }
  };
  const onSearch = () => {
    setPage(1);
    fetchGetListCalibrationWork(1, searchFilter);
  };
  const onCancel = async (record) => {
    let res =
      await _unitOfWork.calibrationWork.comfirmCancelCalibrationWorkById(
        record._id || record.id,
      );
    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("common.messages.success.successfully"),
      );
      setPage(1);
      fetchGetListCalibrationWork(1, searchFilter);
    }
  };
  const onClickClose = (record) => {
    setIsOpenRecognize(true);
    setCalibrationWork(record);
  };
  const onClickReOpen = (record) => {
    setIsOpenReOpen(true);
    setCalibrationWork(record);
  };
  const onClickViewCalibrationWork = (value) => {
    navigate(staticPath.calibrationTaskView + "/" + (value._id || value.id));
  };
  const onClickCommet = (value) => {
    navigate(staticPath.calibrationWorkComment + "/" + (value._id || value.id));
  };
  // const onClickDowntime = (value) => {
  //   setDownTime(value?.totalDownTimeSchedulePreventive);
  //   setIsOpenViewDownTime(true);
  // };
  const onClickViewAssign = (value) => {
    setIsOpenAssignUser(true);
    setCalibrationWorkAssignUser(value?.assignUsers);
    setCalibrationWork(value);
  };
  const callbackAssignUser = async (value, selectedRowKeys) => {
    if (!selectedRowKeys || selectedRowKeys.length < 1) {
    }
    let res = await _unitOfWork.calibrationWork.assignUserCalibrationWork({
      user: selectedRowKeys[0],
      calibrationWork: calibrationWork?._id || calibrationWork?.id,
    });
    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("common.messages.success.assignment"),
      );
      setPage(1);
      fetchGetListCalibrationWork(1, searchFilter);
    } else {
      ShowError(
        "topRight",
        "common.notifications",
        t("common.messages.errors.assignment_failed"),
      );
    }
    setIsOpenAssignUser(false);
  };
  const columns = [
    {
      title: t("calibration.stt"),
      dataIndex: "id",
      key: "id",
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
      dataIndex: "code",
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
                  {text}
                </span>
              }
            />
            <LabelValue
              label={t("calibration.calibration_name")}
              value={record?.calibrationName}
            />
            <LabelValue
              label={t("calibration.cycle")}
              value={
                record?.numberNext +
                " " +
                parseToLabel(dateType.Options, record?.dateType)
              }
            />
            <LabelValue
              label={t("calibration.contract")}
              value={record?.calibrationContract?.contractNo}
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
                {text?.assetModel?.asset?.assetName}
              </span>
            }
          />
          <LabelValue
            label={t("preventive.list.table.model")}
            value={text?.assetModel?.assetModelName}
          />
          <LabelValue
            label={t("preventive.list.table.serial")}
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
            value={record?.assetMaintenance?.objectBranch?.name}
          />
          <LabelValue
            label={t("breakdown.map.fields.department")}
            value={record?.assetMaintenance?.objectDepartments?.departmentName}
          />
          <LabelValue
            label={t("preventive.list.table.customer")}
            value={record?.assetMaintenance?.customer?.customerName}
          />
        </div>
      ),
    },
    {
      title: t("calibration.status"),
      dataIndex: "status",
      align: "center",
      render: (status) => {
        const option = calibrationWorkStatus.Options.find(
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
    // {
    //   title: t("calibration.asset_style"),
    //   dataIndex: "assetMaintenance",
    //   render: (text) => t(parseToLabel(assetType.Options, text?.assetStyle)),
    // },
    // {
    //   title: t("calibration.asset_name"),
    //   dataIndex: "assetMaintenance",
    //   render: (text) => {
    //     return <span>{text?.assetModel?.asset?.assetName || []}</span>;
    //   },
    // },
    // {
    //   title: t("calibration.asset_model_name"),
    //   dataIndex: "assetMaintenance",
    //   render: (text) => {
    //     return <span>{text?.assetModel?.assetModelName || []}</span>;
    //   },
    // },
    // {
    //   title: t("calibration.serial"),
    //   dataIndex: "assetMaintenance",
    //   render: (text) => {
    //     return <span>{text?.serial || []}</span>;
    //   },
    // },
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
    //   render: (text) => t(parseToLabel(priorityType.Option, text)),
    // },
    {
      title: t("preventiveSchedule.list.table.action"),
      dataIndex: "action",
      align: "center",
      fixed: "right",
      render: (_, record) => {
        const items = [];

        if (
          checkPermission(
            permissions,
            permissionCodeConstant.calibration_work_assign,
          ) &&
          record?.assignUsers &&
          record?.assignUsers < 1
        ) {
          items.push({
            key: "",
            onClick: () => onClickViewAssign(record),
            label: <span>{t("common_buttons.assign")}</span>,
            icon: <UserAddOutlined />,
          });
        }

        if (
          checkPermission(
            permissions,
            permissionCodeConstant.calibration_work_cancel,
          ) &&
          record?.status === calibrationWorkStatus.new
        ) {
          items.push({
            key: "",
            onClick: () =>
              Comfirm(t("calibrationWork.comfirm.cancel"), () =>
                onCancel(record),
              ),
            label: <span>{t("common_buttons.cancel")}</span>,
            icon: <CloseCircleOutlined />,
          });
        }

        if (
          checkPermission(
            permissions,
            permissionCodeConstant.calibration_work_delete,
          )
        ) {
          items.push({
            key: "",
            onClick: () =>
              Comfirm(t("comfirm.comfirm_delete"), () => onClickDelete(record)),
            label: <span>{t("common_buttons.delete")}</span>,
            icon: <DeleteOutlined />,
          });
        }

        if (
          checkPermission(
            permissions,
            permissionCodeConstant.calibration_work_commet,
          )
        ) {
          items.push({
            key: "",
            onClick: () => onClickCommet(record),
            label: <span>{t("preventiveSchedule.list.tooltips.comment")}</span>,
            icon: <WechatWorkOutlined />,
          });
        }

        if (
          record.status === schedulePreventiveStatus.waitingForAdminApproval
        ) {
          if (
            checkPermission(
              permissions,
              permissionCodeConstant.calibration_work_close,
            )
          ) {
            items.push({
              key: "",
              onClick: () => onClickClose(record),
              label: <span>{t("preventiveSchedule.list.tooltips.close")}</span>,
              icon: <CheckSquareOutlined />,
            });
          }
          if (
            checkPermission(
              permissions,
              permissionCodeConstant.calibration_work_reopen,
            )
          ) {
            items.push({
              key: "",
              onClick: () => onClickReOpen(record),
              label: (
                <span>{t("preventiveSchedule.list.tooltips.reopen")}</span>
              ),
              icon: <FolderOpenOutlined />,
            });
          }
        }

        return (
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            {checkPermission(
              permissions,
              permissionCodeConstant.calibration_work_view_detail,
            ) && (
              <Tooltip title={t("preventiveSchedule.list.tooltips.view")}>
                <Button
                  icon={<EyeOutlined />}
                  size="small"
                  onClick={() => onClickViewCalibrationWork(record)}
                  className="ml-2"
                />
              </Tooltip>
            )}

            {items.length > 0 && (
              <Dropdown
                menu={{ items }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Button icon={<MoreOutlined />} size="small" />
              </Dropdown>
            )}
          </div>
        );
      },
    },
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

  const calibrationWorkFieldsConfig = [
    {
      name: "code",
      labelKey: "calibration.code",
      placeholderKey: "calibration.placeholder.enter_code",
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
      labelKey: "calibration.serial",
      placeholderKey: "calibration.placeholder.serial",
      component: "Input",
    },
    {
      name: "assetModelName",
      labelKey: "calibration.asset_model_name",
      placeholderKey: "calibration.placeholder.asset_model_name",
      component: "Input",
    },
    {
      name: "status",
      labelKey: "calibration.status",
      placeholderKey: "calibration.placeholder.status",
      component: "Select",
      options: "schedulePreventiveStatus",
    },
    {
      name: "assetStyle",
      labelKey: "calibration.asset_style",
      placeholderKey: "calibration.placeholder.asset_style",
      component: "Select",
      options: "assetType",
    },
    {
      name: "startDate",
      labelKey: "preventiveSchedule.list.search.start_date_from",
      placeholderKey: "preventiveSchedule.list.search.start_date_from",
      component: "DatePicker",
    },
    {
      name: "endDate",
      labelKey: "preventiveSchedule.list.search.end_date_to",
      placeholderKey: "preventiveSchedule.list.search.end_date_to",
      component: "DatePicker",
    },
    {
      name: "importance",
      labelKey: "preventiveSchedule.list.search.priority",
      placeholderKey: "preventiveSchedule.list.search.priority",
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
              name="groupStatus"
              initialValue={calibrationGroupStatus.new}
              style={{ marginBottom: 16 }}
            >
              <Radio.Group
                buttonStyle="solid"
                style={{ width: "100%" }}
                onChange={() => {
                  setPage(1);
                  fetchGetListCalibrationWork();
                }}
              >
                {calibrationGroupStatus.Options.map((item) => (
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
              {t("common_buttons.search")}
            </Button>
            <Button className="bt-green mr-2" onClick={resetSearch}>
              <RedoOutlined />
              {t("common_buttons.reset")}
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
          <Col
            span={4}
            style={{
              textAlign: "right",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <span style={{ fontWeight: 600, fontSize: "16px", marginRight: 5 }}>
              {t("preventiveSchedule.list.total", {
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
          dataSource={schedulePreventives}
          bordered
          pagination={false}
          scroll={{ x: "max-content" }}
          expandable={{
            expandedRowRender: (record) => (
              <ExpandRowCalibrationWorkAssignUser
                calibrationWork={record}
                fetchGetListCalibrationWork={fetchGetListCalibrationWork}
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
        <ComfirmCloseCalibrationWork
          open={isOpenRecognize}
          onClose={() => setIsOpenRecognize(false)}
          calibrationWork={calibrationWork}
          onCallback={fetchGetListCalibrationWork}
        />
        <ComfirmReOpenCalibrationWork
          open={isOpenReOpen}
          onClose={() => setIsOpenReOpen(false)}
          calibrationWork={calibrationWork}
          onCallback={fetchGetListCalibrationWork}
        />
        <DrawerSearch
          isOpen={isOpenSearchAdvanced}
          ref={drawerRef}
          onCallBack={(value) => {
            searchForm.resetFields(["searchValue"]);
            setSearchFilter(value);
            if (!value.isClose) {
              setPage(1);
              fetchGetListCalibrationWork(1, value);
            }
          }}
          onClose={() => {
            setIsOpenSearchAdvanced(false);
          }}
          fieldsConfig={calibrationWorkFieldsConfig}
        />
      </Form>
      <AssignUser
        open={isOpenAssignUser}
        hanldeColse={() => setIsOpenAssignUser(false)}
        assignUser={
          calibrationWorkAssignUser?.user?._id ||
          calibrationWorkAssignUser?.user?.id
        }
        onReset={fetchGetListCalibrationWork}
        callbackAssignUser={callbackAssignUser}
        selectMulti={false}
        noSelectContract={true}
      />
    </div>
  );
}
