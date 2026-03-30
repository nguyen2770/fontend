import React, { useEffect, useRef, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FilterOutlined,
  LogoutOutlined,
  MoreOutlined,
  PauseCircleOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  RedoOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  SwapOutlined,
  TransactionOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Dropdown,
  Form,
  Input,
  Menu,
  Pagination,
  Row,
  Select,
  Table,
  Tooltip,
} from "antd";
import * as _unitOfWork from "../../../api";
import Comfirm from "../../../components/modal/Confirm";
import { useNavigate } from "react-router-dom";
import {
  assetType,
  calibrationStatus,
  dateType,
  PAGINATION,
  preventiveStatus,
  priorityType,
} from "../../../utils/constant";
import { parseToLabel } from "../../../helper/parse-helper";
import useHeader from "../../../contexts/headerContext";
import ExpandRowPreventiveAssignUser from "../../../components/modal/preventive/ExpandRowPreventiveAssignUser";
import useAuth from "../../../contexts/authContext";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import { useTranslation } from "react-i18next";
import { staticPath } from "../../../router/routerConfig";
import { filterOption } from "../../../helper/search-select-helper";
import ShowSuccess from "../../../components/modal/result/successNotification";
import ShowError from "../../../components/modal/result/errorNotification";
import AssignUser from "../breakdown/AssignUser";
import ExpandRowCalibrationAssignUser from "./ExpandRowCalibrationAssignUser";
import ComfirmStartOrStopCalibration from "./ComfirmStartOrStopCalibration";
import { cleanEmptyValues } from "../../../helper/check-search-value";
import { LabelValue } from "../../../helper/label-value";
import DrawerSearch from "../../../components/drawer/drawerSearch";
export default function Calibration() {
  const { t } = useTranslation();
  const [calibrations, setCalibrations] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [totalRecord, setTotalRecord] = useState(0);
  const [searchForm] = Form.useForm();
  const { setHeaderTitle } = useHeader();
  const { permissions } = useAuth();
  const [isOpenAssignUser, setIsOpenAssignUser] = useState(false);
  const [calibrationAssignUser, setCalibrationAssignUser] = useState("");
  const [calibration, setCalibration] = useState("");
  const [searchField, setSearchField] = useState("searchText");
  const [
    isShowComfirmCalibrationStartOrStop,
    setIsShowComfirmCalibrationStartOrStop,
  ] = useState(false);
  const [isOpenSearchAdvanced, setIsOpenSearchAdvanced] = useState(false);
  const [searchFilter, setSearchFilter] = useState({});
  const drawerRef = useRef();
  const [sortOrder, setSortOrder] = useState(-1);
  const [sortBy, setSortBy] = useState("createdAt");
  useEffect(() => {
    setHeaderTitle(t("menu.maintenance_request.calibration_plan"));
  }, [t]);

  useEffect(() => {
    if (page > 1) {
      fetchGetListCalibration(page, searchFilter);
    } else {
      fetchGetListCalibration(1, searchFilter);
    }
  }, [page, sortOrder, sortBy]);

  const onChangePagination = (value) => {
    setPage(value);
  };
  const resetSearch = () => {
    setSearchFilter({});
    if (drawerRef.current) drawerRef.current.resetForm();
    searchForm.resetFields();
    setPage(1);
    fetchGetListCalibration(1);
  };

  const onReset = () => {
    setPage(1);
    fetchGetListCalibration(1);
  };

  const fetchGetListCalibration = async (_page, value) => {
    const values = cleanEmptyValues(searchForm.getFieldsValue());
    let payload = {
      page: _page || page,
      limit: PAGINATION.limit,
      ...cleanEmptyValues(value || {}),
      [searchField]: values.searchValue,
      // sortBy: "createdAt",
      // sortOrder: -1,
      // ...values,
      sortBy,
      sortOrder,
    };
    let res = await _unitOfWork.calibration.getCalibrations(payload);
    if (res && res?.code === 1) {
      setCalibrations(res?.results);
      setTotalRecord(res?.totalResults);
    }
  };

  const onDeleteCalibraion = async (values) => {
    let res = await _unitOfWork.calibration.deleteCalibrationById({
      id: values?._id || values?.id,
    });
    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("common.messages.success.delete"),
      );
      fetchGetListCalibration(1, searchFilter);
    } else {
      ShowError(
        "topRight",
        t("common.notifications"),
        t("common.messages.errors.delete_failed"),
      );
    }
  };
  const onClickComfirmOrStop = (record) => {
    setCalibration(record);
    setIsShowComfirmCalibrationStartOrStop(true);
  };
  const onClickCreate = () => {
    navigate(staticPath.calibrationCreate);
  };
  // const onClickStart = async (value) => {
  //   let res = await _unitOfWork.calibration.startCalibration({
  //     id: value?._id || value?.id,
  //   });
  //   if (res && res.code === 1) {
  //     ShowSuccess("topRight", "Thông báo", "Bắt đầu thành công !");
  //     fetchGetListCalibration(1);
  //   } else {
  //     ShowError("topRight", "Thông báo", "Bắt đầu thất bại !");
  //   }
  // };
  // const onClickStop = async (value) => {
  //   let res = await _unitOfWork.calibration.stopCalibration({
  //     id: value?._id || value?.id,
  //   });
  //   if (res && res.code === 1) {
  //     ShowSuccess("topRight", "Thông báo", "Dừng thành công !");
  //     fetchGetListCalibration(1);
  //   } else {
  //     ShowError("topRight", "Thông báo", "Dừng thất bại !");
  //   }
  // };
  const onClickUpdate = (record) => {
    navigate(staticPath.calibrationUpdate + "/" + record?._id);
  };
  const onClickViewDeltail = (record) => {
    navigate(staticPath.calibrationView + "/" + record?._id);
  };
  const onClickClone = (values) => {
    navigate(`${staticPath.calibrationUpdate}/${values._id}?mode=clone`);
  };

  const callbackAssignUser = async (value, selectedRowKeys) => {
    if (selectedRowKeys.length > 0) {
      let res = await _unitOfWork.calibration.assignUser({
        user: selectedRowKeys[0],
        calibration: calibration?._id,
      });
      if (res && res.code === 1) {
        ShowSuccess(
          "topRight",
          t("common.notifications"),
          t("common.messages.success.assignment"),
        );
        fetchGetListCalibration(1, searchFilter);
      } else {
        ShowError(
          "topRight",
          t("common.notifications"),
          t("common.messages.errors.assignment_failed"),
        );
      }
    }
    setIsOpenAssignUser(false);
  };
  const onClickViewAssign = (value) => {
    setIsOpenAssignUser(true);
    setCalibrationAssignUser(value?.assignUsers);
    setCalibration(value);
  };
  const onClickChange = async (value) => {
    navigate(staticPath.changeOfContractCalibration + "/" + value._id);
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
            {t("calibration.info_calibration")}
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
              label={t("preventiveSchedule.fields.plan_code")}
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
        const option = calibrationStatus.Options.find(
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
    //   ellipsis: true,
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
    //   ellipsis: true,
    //   render: (text) => {
    //     return <span>{text?.assetModel?.assetModelName || []}</span>;
    //   },
    // },
    // {
    //   title: t("calibration.serial"),
    //   dataIndex: "assetMaintenance",
    //   ellipsis: true,
    //   render: (text) => {
    //     return <span>{text?.serial || []}</span>;
    //   },
    // },
    // {
    //   title: t("calibration.importance"),
    //   dataIndex: "importance",
    //   align: "center",
    //   render: (text) => t(parseToLabel(priorityType.Option, text)),
    // },
    {
      title: t("calibration.action"),
      dataIndex: "action",
      fixed: "right",
      align: "center",
      render: (_, record) => {
        const menuItems = [];
        if (
          checkPermission(
            permissions,
            permissionCodeConstant.calibration_update,
          )
        ) {
          menuItems.push(
            <Menu.Item key="view" onClick={() => onClickViewDeltail(record)}>
              <EyeOutlined className="mr-1" />
              {t("preventiveSchedule.list.tooltips.view")}
            </Menu.Item>,
          );
        }
        if (
          checkPermission(
            permissions,
            permissionCodeConstant.calibration_change_of_calibration_contract,
          )
        ) {
          menuItems.push(
            <Menu.Item key="change" onClick={() => onClickChange(record)}>
              <TransactionOutlined className="mr-1" />
              {t("preventive.buttons.edit_contract")}
            </Menu.Item>,
          );
        }
        if (
          checkPermission(
            permissions,
            permissionCodeConstant.calibration_update,
          ) &&
          record.isStart === false
        ) {
          menuItems.push(
            <Menu.Item key="update" onClick={() => onClickUpdate(record)}>
              <EditOutlined className="mr-1" />
              {t("common_buttons.update")}
            </Menu.Item>,
          );
        }

        // ASSIGN
        if (
          checkPermission(
            permissions,
            permissionCodeConstant.calibration_assign,
          ) &&
          record?.assignUsers?.length < 1
        ) {
          menuItems.push(
            <Menu.Item key="assign" onClick={() => onClickViewAssign(record)}>
              <UserAddOutlined className="mr-1" />
              {t("tooltip.assign")}
            </Menu.Item>,
          );
        }

        if (checkPermission(permissions, permissionCodeConstant.asset_create)) {
          menuItems.push(
            <Menu.Item key="clone" onClick={() => onClickClone(record)}>
              <PlusCircleOutlined className="mr-1" />
              {t("preventive.buttons.clone")}
            </Menu.Item>,
          );
        }

        // DELETE
        if (
          checkPermission(
            permissions,
            permissionCodeConstant.calibration_delete,
          )
        ) {
          menuItems.push(
            <Menu.Item
              key="delete"
              danger
              onClick={() =>
                Comfirm(t("comfirm.comfirm_delete"), () =>
                  onDeleteCalibraion(record),
                )
              }
            >
              <DeleteOutlined className="mr-1" />
              {t("tooltip.delete")}
            </Menu.Item>,
          );
        }

        const actionMenu = <Menu>{menuItems}</Menu>;

        return (
          <div>
            {/* Start / Stop luôn hiển thị */}
            {record.isStart
              ? checkPermission(
                  permissions,
                  permissionCodeConstant.calibration_stop,
                ) && (
                  <Tooltip title={t("common_buttons.stop")}>
                    <Button
                      type="default"
                      icon={<LogoutOutlined />}
                      size="small"
                      onClick={() => onClickComfirmOrStop(record)}
                    />
                  </Tooltip>
                )
              : checkPermission(
                  permissions,
                  permissionCodeConstant.calibration_start,
                ) && (
                  <Tooltip title={t("common_buttons.start")}>
                    <Button
                      type="primary"
                      icon={<PauseCircleOutlined />}
                      size="small"
                      onClick={() => onClickComfirmOrStop(record)}
                    />
                  </Tooltip>
                )}

            {/* More chứa Update + Assign + Delete */}
            {menuItems.length > 0 && (
              <Dropdown overlay={actionMenu} trigger={["click"]}>
                <Button icon={<MoreOutlined />} size="small" className="ml-2" />
              </Dropdown>
            )}
          </div>
        );
      },
    },
  ];
  const onSearch = () => {
    setPage(1);
    fetchGetListCalibration(1, searchFilter);
  };
  const placeholderMap = {
    searchText: t("preventive.common.all"),
    code: t("calibration.placeholder.enter_code"),
    calibrationName: t("calibration.placeholder.calibration_name"),
    serial: t("calibration.placeholder.serial"),
    // status: t("calibration.placeholder.status"),
    assetName: t("calibration.placeholder.asset_name"),
    assetModelName: t("calibration.placeholder.asset_model_name"),
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
          {/* <Col span={6}>
            <Form.Item id="" label={t("calibration.code")} name="code">
              <Input placeholder={t("calibration.placeholder.enter_code")} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              id=""
              label={t("calibration.calibration_name")}
              name="calibrationName"
            >
              <Input
                placeholder={t("calibration.placeholder.calibration_name")}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item id="" label={t("calibration.serial")} name="serial">
              <Input placeholder={t("calibration.placeholder.serial")} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={t("calibration.status")} name="status">
              <Select
                showSearch
                allowClear
                placeholder={t("calibration.placeholder.status")}
                options={(calibrationStatus.Options || []).map((item) => ({
                  value: item.value,
                  label: t(item.label),
                }))}
                filterOption={filterOption}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              id=""
              label={t("calibration.asset_name")}
              name="assetName"
            >
              <Input placeholder={t("calibration.placeholder.asset_name")} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              id=""
              label={t("calibration.asset_model_name")}
              name="assetModelName"
            >
              <Input
                placeholder={t("calibration.placeholder.asset_model_name")}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              id=""
              labelAlign="left"
              label={t("calibration.asset_style")}
              name="assetStyle"
            >
              <Select
                allowClear
                placeholder={t("calibration.placeholder.asset_style")}
                options={(assetType.Options || []).map((item) => ({
                  key: item.value,
                  value: item.value,
                  label: t(item.label),
                }))}
              ></Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={t("calibration.importance")} name="importance">
              <Select
                showSearch
                allowClear
                placeholder={t("calibration.placeholder.importance")}
                options={(priorityType.Option || []).map((item) => ({
                  value: item.value,
                  label: t(item.label),
                }))}
                filterOption={filterOption}
              />
            </Form.Item>
          </Col> */}
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
                    { value: "serial", label: t("calibration.serial") },
                    // { value: "status", label: t("calibration.status") },
                    { value: "assetName", label: t("calibration.asset_name") },
                    {
                      value: "assetModelName",
                      label: t("calibration.asset_model_name"),
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
            style={{ display: "flex", alignItems: "center", marginBottom: 2 }}
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
          <Col span={4} style={{ textAlign: "right" }}>
            {checkPermission(
              permissions,
              permissionCodeConstant.calibration_create,
            ) && (
              <Button
                key="1"
                type="primary"
                className="ml-2 mt-2"
                onClick={() => onClickCreate()}
              >
                <PlusOutlined />
                {t("common_buttons.create")}
              </Button>
            )}
          </Col>
          <Col span={24} style={{ textAlign: "right" }}>
            <span style={{ fontWeight: 600, fontSize: "16px", marginRight: 5 }}>
              {t("preventive.common.total", { count: totalRecord })}
            </span>
          </Col>
        </Row>
        <Table
          rowKey="_id"
          columns={columns}
          key={"_id"}
          dataSource={calibrations}
          bordered
          pagination={false}
          scroll={{ x: "max-content" }}
          expandable={{
            expandedRowRender: (record, index) => (
              <ExpandRowCalibrationAssignUser
                calibration={record}
                fetchGetListCalibration={fetchGetListCalibration}
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
      </Form>
      <AssignUser
        open={isOpenAssignUser}
        hanldeColse={() => setIsOpenAssignUser(false)}
        assignUser={
          calibrationAssignUser?.user?._id || calibrationAssignUser?.user?.id
        }
        onReset={fetchGetListCalibration}
        callbackAssignUser={callbackAssignUser}
        selectMulti={false}
        noSelectContract={true}
      />
      <ComfirmStartOrStopCalibration
        open={isShowComfirmCalibrationStartOrStop}
        hanldeColse={() => setIsShowComfirmCalibrationStartOrStop(false)}
        calibration={calibration}
        onReset={() => fetchGetListCalibration(1)}
      />
      <DrawerSearch
        isOpen={isOpenSearchAdvanced}
        onClose={() => setIsOpenSearchAdvanced(false)}
        ref={drawerRef}
        onCallBack={(value) => {
          searchForm.resetFields(["searchValue"]);
          setSearchFilter(value);
          if (!value.isClose) {
            setPage(1);
            fetchGetListCalibration(1, value);
          }
        }}
        fieldsConfig={calibrationWorkFieldsConfig}
      />
    </div>
  );
}
