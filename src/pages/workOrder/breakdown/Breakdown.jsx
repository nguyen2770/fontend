import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeFilled,
  FilterOutlined,
  FolderOpenOutlined,
  HourglassOutlined,
  MoreOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  RedoOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
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
import CreateBreakdown from "./CreateBreakdown";
import UpdateBreakdown from "./UpdateBreakdown";
import * as _unitOfWork from "../../../api";
import Comfirm from "../../../components/modal/Confirm";
import { useNavigate } from "react-router-dom";
import ShowSuccess from "../../../components/modal/result/successNotification";
import {
  assetMaintenanceStatus,
  assetType,
  breakdownStatus,
  breakdownTicketStatus,
  breakdownUserStatus,
  PAGINATION,
  priorityLevelStatus,
} from "../../../utils/constant";
import { getOptionColor, parseToLabel } from "../../../helper/parse-helper";
import AssignUser from "./AssignUser";
import { staticPath } from "../../../router/routerConfig";
import ExpandRowBreakdownAssignUser from "../../../components/modal/breakdownModel/ExpandRowBreakdownAssignUser";
import ComfirmCloseBreakdown from "./ComfirmCloseBreakdown";
import ReopenBreakdown from "./ReopenBreakdown";
import { parseDate, parseDateDDMMYYYY } from "../../../helper/date-helper";
import ComfirmCancelBreakdown from "./ComfirmCancelBreakdown";
import "./index.scss";
import useHeader from "../../../contexts/headerContext";
import ViewWorkingTime from "./ViewWorkingTime";
import { useLocation } from "react-router-dom";
import useBreakdown from "../../../contexts/breakdownContext";
import useAuth from "../../../contexts/authContext";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import { cleanEmptyValues } from "../../../helper/check-search-value";
import { useTranslation } from "react-i18next";
import DrawerSearchBreakdown from "../../../components/drawer/drawerSearchBreakdown";
import { LabelValue } from "../../../helper/label-value";
import CloneBreakdown from "./CloneBreakdown";
const statusMap = {
  new: ["new"],
  inProgress: ["inProgress"],
  overdue: ["new", "inProgress"],
  completed: ["completed"],
  cloesed: ["cloesed"],
};
export default function Breakdown() {
  const { t } = useTranslation();
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const { valueSearchBreakdown, setValueSearchBreakdown } = useBreakdown();
  const [breakdowns, setBreakdowns] = useState([]);
  const [breakdownId, setBreakdownId] = useState([]);
  const [breakdown, setBreakdown] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [totalRecord, setTotalRecord] = useState(0);
  const [searchForm] = Form.useForm();
  const [subBreakdowns, setSubBreakdowns] = useState();
  const [isOpenAssignUser, setIsOpenAssignUser] = useState(false);
  const [isComfirmCloseBreakdown, setIsComfirmCloseBreakdown] = useState(false);
  const [isReopenBreakdown, setIsReopenBreakdown] = useState(false);
  const [assignUser, setAssignUser] = useState([]);
  const [isComfirmCancelBreakdown, setIsComfirmCancelBreakdown] =
    useState(false);
  const [isOpenViewWorkingTime, setIsOpenViewWorkingTime] = useState(false);
  const [workingTime, setWorkingTime] = useState(null);
  const { setHeaderTitle } = useHeader();
  const location = useLocation();
  const [sortOrder, setSortOrder] = useState(-1);
  const [isOpenSearchaAvanced, setIsisOpenSearchaAvanced] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const ticketStatus = queryParams.get("ticketStatus");
  const { permissions } = useAuth();
  const [searchField, setSearchField] = useState("searchText");
  const [isOpenClone, setIsOpenClone] = useState(false);
  const [searchFilter, setSearchFilter] = useState({});
  const drawerRef = useRef();

  useEffect(() => {
    fetchGetSubBreakdown();
    setHeaderTitle(t("breakdown.list.title"));
    if (ticketStatus) {
      searchForm.setFieldsValue({
        ticketStatus: ticketStatus,
      });
    }
    if (valueSearchBreakdown) {
      searchForm.setFieldsValue(valueSearchBreakdown);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (page > 1) {
      fetchGetListBreakdown(page, searchFilter);
    } else {
      fetchGetListBreakdown(1, searchFilter);
    }
  }, [page, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  const resetSearch = () => {
    setSearchFilter({});
    if (drawerRef.current) drawerRef.current.resetForm();
    searchForm.resetFields();
    setPage(1);
    fetchGetListBreakdown(1);
  };
  const fetchGetSubBreakdown = async () => {
    let res = await _unitOfWork.breakdown.getAllSubBreakdown();
    if (res && res.code === 1) {
      setSubBreakdowns(res.data);
    }
  };
  const fetchGetListBreakdown = async (customPage, value) => {
    const values = searchForm.getFieldsValue();

    let payload = {
      ...cleanEmptyValues(value || {}),
      [searchField]: values.searchValue,
      page: customPage || page,
      limit: PAGINATION.limit,
      // code: rawValues.code,
      // serial: rawValues.serial,
      // assetStyle: rawValues.assetStyle,
      // priorityLevel: rawValues.priorityLevel,
      // breakdownStatus: values.breakdownStatus,
      // assetName: rawValues.assetName,
      // assetModelName: rawValues.assetModelName,
      ticketStatuses: statusMap[values.ticketStatus],

      sortBy: "createdAt",
      sortOrder: sortOrder,
    };
    if (values.ticketStatus === "overdue") {
      payload.isOverdue = true;
    }
    setValueSearchBreakdown({
      ...payload,
      ticketStatus: values.ticketStatus,
    });
    const res = await _unitOfWork.breakdown.getListBreakdowns(payload);

    if (res && res.results) {
      setBreakdowns(res.results);
      setTotalRecord(res.totalResults);
    }
  };
  const onChangePagination = (value) => {
    setPage(value);
    // fetchGetListBreakdown(value);
  };
  const onClickUpdate = (values) => {
    setBreakdownId(values.id);
    setBreakdown(values);
    setIsOpenUpdate(true);
  };

  const onClickClone = (values) => {
    setBreakdownId(values.id);
    setBreakdown(values);
    setIsOpenClone(true);
  };

  const onClickComfirmCancel = (values) => {
    setBreakdown(values);
    setIsComfirmCancelBreakdown(true);
  };

  const onDeleteCategory = async (values) => {
    const res = await _unitOfWork.breakdown.deleteBreakdown({
      id: values.id,
    });
    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("common.notifications"),
        t("breakdown.list.messages.delete_success"),
      );
      fetchGetListBreakdown(1, searchFilter);
    }
  };
  const onRefresh = () => {
    fetchGetListBreakdown(page);
  };
  const onClickAssginUser = (value) => {
    setIsOpenAssignUser(true);
    setAssignUser(value);
  };

  const onClicView = (value) => {
    navigate(staticPath.viewWorkOrderBreakdown + "/" + value.id);
  };

  const onClickCommet = (value) => {
    navigate(staticPath.breakdownComment + "/" + value.id);
  };

  const onClickReopen = (value) => {
    setIsReopenBreakdown(true);
    setBreakdown(value);
  };

  const onClickClose = (value) => {
    setIsComfirmCloseBreakdown(true);
    setBreakdown(value);
  };
  const onClickWorkingtime = (value) => {
    setWorkingTime(value);
    setIsOpenViewWorkingTime(true);
  };

  const onClickStatus = () => {
    setPage(1);
    fetchGetListBreakdown(1);
  };
  const columns = [
    {
      title: t("breakdown.list.columns.stt"),
      dataIndex: "id",
      key: "id",
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
      title: t("breakdown.list.columns.job_status"),
      dataIndex: "status",
      align: "center",
      render: (status) => {
        const option = breakdownStatus.Option.find(
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
      title: t("dashboard.calendar.messages.time"),
      dataIndex: "assetMaintenance",
      render: (_, record) => (
        <div>
          <LabelValue
            label={t("breakdown.list.columns.created_at")}
            value={parseDate(record?.createdAt)}
          />
          <LabelValue
            label={t("breakdown.list.columns.deadline")}
            value={parseDate(record?.incidentDeadline)}
          />
        </div>
      ),
    },
    {
      title: t("breakdown.create.fields.description"),
      dataIndex: "defectDescription",
    },
    {
      title: t("breakdown.list.columns.action"),
      dataIndex: "action",
      fixed: "right",
      align: "center",
      render: (_, record) => {
        const items = [];

        // Downtime
        if (
          checkPermission(
            permissions,
            permissionCodeConstant.breakdown_view_downtime,
          ) &&
          record.workingTime &&
          record.status !== breakdownStatus.cancelled
        ) {
          items.push({
            key: "downtime",
            label: t("breakdown.list.tooltips.downtime"),
            icon: <HourglassOutlined />,
            onClick: () => onClickWorkingtime(record),
          });
        }

        // Update
        if (
          checkPermission(
            permissions,
            permissionCodeConstant.breakdown_update,
          ) &&
          record.ticketStatus === breakdownTicketStatus.new
        ) {
          items.push({
            key: "edit",
            label: t("breakdown.list.tooltips.edit"),
            icon: <EditOutlined />,
            onClick: () => onClickUpdate(record),
          });
        }

        // Cancel ticket
        if (
          checkPermission(
            permissions,
            permissionCodeConstant.breakdown_cancel_ticket,
          ) &&
          ((record.ticketStatus === breakdownTicketStatus.new &&
            record.status !== breakdownUserStatus.accepted) ||
            (record.ticketStatus === breakdownTicketStatus.inProgress &&
              record.status === breakdownUserStatus.requestForSupport))
        ) {
          items.push({
            key: "cancel_ticket",
            label: t("breakdown.list.tooltips.cancel_ticket"),
            icon: <CloseCircleOutlined />,
            onClick: () => onClickComfirmCancel(record),
          });
        }

        // checkPermission(permissions, permissionCodeConstant.breakdown_create) &&
        // {
        //   key: "clone",
        //   label: t("preventive.buttons.clone"),
        //   icon: <PlusCircleOutlined />,
        //   onClick: () => onClickClone(record),
        // }

        if (
          checkPermission(permissions, permissionCodeConstant.breakdown_create)
        ) {
          items.push({
            key: "clone",
            label: t("preventive.buttons.clone"),
            icon: <PlusCircleOutlined />,
            onClick: () => onClickClone(record),
          });
        }

        // Close / Reopen
        if (
          checkPermission(
            permissions,
            permissionCodeConstant.breakdown_close_and_reopen,
          ) &&
          record.status === breakdownUserStatus.WWA
        ) {
          items.push(
            {
              key: "close",
              label: t("breakdown.list.tooltips.close_ticket"),
              icon: <CheckCircleOutlined />,
              onClick: () => onClickClose(record),
            },
            {
              key: "reopen",
              label: t("breakdown.list.tooltips.reopen"),
              icon: <FolderOpenOutlined />,
              onClick: () => onClickReopen(record),
            },
          );
        }

        // Assign user
        if (
          checkPermission(
            permissions,
            permissionCodeConstant.breakdown_assign_engineer,
          ) &&
          record.ticketStatus === breakdownTicketStatus.new &&
          record.breakdownAssignUsers.length === 0
        ) {
          items.push({
            key: "assign_user",
            label: t("breakdown.list.tooltips.assign_user"),
            icon: <UserAddOutlined />,
            onClick: () => onClickAssginUser(record),
          });
        }

        // Comment
        if (
          checkPermission(permissions, permissionCodeConstant.breakdown_comment)
        ) {
          items.push({
            key: "comment",
            label: t("breakdown.list.tooltips.comment"),
            icon: <WechatWorkOutlined />,
            onClick: () => onClickCommet(record),
          });
        }

        // Delete
        if (
          checkPermission(
            permissions,
            permissionCodeConstant.breakdown_delete,
          ) &&
          record.ticketStatus === breakdownTicketStatus.new &&
          record.status === breakdownStatus.new
        ) {
          items.push({
            key: "delete",
            label: t("breakdown.list.tooltips.delete"),
            icon: <DeleteOutlined />,
            onClick: () =>
              Comfirm(t("breakdown.common.confirm_delete"), () =>
                onDeleteCategory(record),
              ),
          });
        }

        return (
          <div className="flex items-center justify-center">
            {/* View detail đứng riêng */}
            {checkPermission(
              permissions,
              permissionCodeConstant.breakdown_view_detail,
            ) && (
              <Tooltip title={t("breakdown.list.tooltips.view")}>
                <Button
                  icon={<EyeFilled />}
                  size="small"
                  className="ml-2"
                  onClick={() => onClicView(record)}
                />
              </Tooltip>
            )}

            {/* Dropdown gom tất cả action còn lại */}
            {items.length > 0 && (
              <Dropdown trigger={["click"]} menu={{ items }}>
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
    fetchGetListBreakdown(1, searchFilter);
  };
  const placeholderMap = {
    searchText: t("preventive.common.all"),

    code: t("breakdown.common.code"),
    serial: t("breakdown.common.serial"),
    assetName: t("breakdown.common.asset_name"),
    assetModelName: t("breakdown.common.model"),
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
            <Form.Item
              label=""
              name="ticketStatus"
              initialValue={breakdownTicketStatus.new}
              style={{ marginBottom: 16 }}
            >
              <Radio.Group
                buttonStyle="solid"
                style={{ width: "100%" }}
                onChange={onClickStatus}
              >
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
          {/* <Col span={6}>
            <Form.Item id="" label={t("breakdown.common.code")} name="code">
              <Input placeholder={t("breakdown.common.code")}></Input>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item id="" label={t("breakdown.common.serial")} name="serial">
              <Input placeholder={t("breakdown.common.serial")}></Input>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t("breakdown.common.asset_name")}
              name="assetName"
            >
              <Input placeholder={t("breakdown.common.asset_name")}></Input>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t("breakdown.common.model")}
              name="assetModelName"
            >
              <Input placeholder={t("breakdown.common.model")}></Input>
            </Form.Item>
          </Col>

          {isOpenSearchaAvanced && (
            <>
              <Col span={6}>
                <Form.Item
                  id=""
                  labelAlign="left"
                  label={t("breakdown.common.asset_type")}
                  name="assetStyle"
                >
                  <Select
                    showSearch
                    allowClear
                    placeholder={t("breakdown.common.asset_type")}
                    options={(assetType.Options || []).map((item) => ({
                      key: item.value,
                      value: item.value,
                      label: t(item.label),
                    }))}
                    filterOption={filterOption}
                  ></Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={t("breakdown.common.priority")}
                  name="priorityLevel"
                  labelAlign="left"
                >
                  <Select
                    placeholder={t("breakdown.common.priority")}
                    allowClear
                    options={(priorityLevelStatus.Options || []).map(
                      (item) => ({
                        value: item.value,
                        label: t(item.label),
                      })
                    )}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label={t("breakdown.common.status")}
                  name="breakdownStatus"
                >
                  <Select
                    showSearch
                    allowClear
                    placeholder={t("breakdown.common.status")}
                    options={(breakdownStatus.Option || []).map((item) => ({
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
                    { value: "code", label: t("breakdown.common.code") },
                    { value: "serial", label: t("breakdown.common.serial") },
                    {
                      value: "assetName",
                      label: t("breakdown.common.asset_name"),
                    },
                    {
                      value: "assetModelName",
                      label: t("breakdown.common.model"),
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
            {/* <Button
              className="bt-green mr-2"
              onClick={() => setIsisOpenSearchaAvanced(!isOpenSearchaAvanced)}
            >
              <PlusCircleFilled />
              {t("breakdown.common.advanced_search")}
            </Button> */}
            <Button
              title={t("breakdown.common.advanced_search")}
              className="px-2 mr-2"
              onClick={() => setIsisOpenSearchaAvanced(true)}
            >
              <FilterOutlined style={{ fontSize: 20, cursor: "pointer" }} />
            </Button>
            <Button
              icon={
                sortOrder == -1 ? (
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
          <Col span={4} style={{ textAlign: "right" }} className="mt-2">
            {checkPermission(
              permissions,
              permissionCodeConstant.breakdown_create,
            ) && (
              <Button
                key="1"
                type="primary"
                onClick={() => setIsOpenCreate(true)}
                className="ml-2"
              >
                <PlusOutlined />
                {t("breakdown.list.buttons.create")}
              </Button>
            )}
          </Col>
          <Col span={24} style={{ textAlign: "right" }}>
            <span style={{ fontWeight: 600, fontSize: "16px", marginRight: 5 }}>
              {t("breakdown.common.total", {
                count: totalRecord ? totalRecord : 0,
              })}
            </span>
          </Col>
        </Row>
        <Table
          rowKey="id"
          columns={columns}
          key={"id"}
          dataSource={breakdowns}
          bordered
          pagination={false}
          scroll={{ x: "max-content" }}
          expandable={{
            expandedRowRender: (record, index) => (
              <ExpandRowBreakdownAssignUser
                breakdowns={record}
                fetchGetListBreakdown={fetchGetListBreakdown}
              />
            ),
          }}
        ></Table>
        <Pagination
          className="pagination-table mt-2"
          onChange={onChangePagination}
          pageSize={PAGINATION.limit}
          current={page}
          total={totalRecord}
        />
        <CreateBreakdown
          open={isOpenCreate}
          handleCancel={() => setIsOpenCreate(false)}
          onRefresh={onRefresh}
          subBreakdowns={subBreakdowns}
        />
        <UpdateBreakdown
          open={isOpenUpdate}
          handleCancel={() => setIsOpenUpdate(false)}
          id={breakdownId}
          onRefresh={onRefresh}
          breakdown={breakdown}
          subBreakdowns={subBreakdowns}
        />
        <AssignUser
          open={isOpenAssignUser}
          hanldeColse={() => setIsOpenAssignUser(false)}
          assignUser={assignUser}
          onReset={onRefresh}
        />
        <ComfirmCloseBreakdown
          open={isComfirmCloseBreakdown}
          onCancel={() => setIsComfirmCloseBreakdown(false)}
          breakdown={breakdown}
          onRefresh={fetchGetListBreakdown}
        />
        <ReopenBreakdown
          open={isReopenBreakdown}
          onCancel={() => setIsReopenBreakdown(false)}
          breakdown={breakdown}
          onRefresh={fetchGetListBreakdown}
        />
        <ComfirmCancelBreakdown
          open={isComfirmCancelBreakdown}
          onCancel={() => setIsComfirmCancelBreakdown(false)}
          breakdown={breakdown}
          onRefresh={fetchGetListBreakdown}
        />
        <ViewWorkingTime
          open={isOpenViewWorkingTime}
          onCancel={() => setIsOpenViewWorkingTime(false)}
          workingTime={workingTime}
        />
        <DrawerSearchBreakdown
          isOpen={isOpenSearchaAvanced}
          onClose={() => setIsisOpenSearchaAvanced(false)}
          ref={drawerRef}
          onCallBack={(value) => {
            searchForm.resetFields(["searchValue"]);
            setSearchFilter(value);
            if (!value.isClose) {
              setPage(1);
              fetchGetListBreakdown(1, value);
            }
          }}
        />
        <CloneBreakdown
          open={isOpenClone}
          handleCancel={() => setIsOpenClone(false)}
          onRefresh={onRefresh}
          breakdown={breakdown}
        />
      </Form>
    </div>
  );
}
