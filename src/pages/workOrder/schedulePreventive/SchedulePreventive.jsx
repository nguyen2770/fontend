import React, { useEffect, useRef, useState } from "react";
import {
  CheckSquareOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FilePdfOutlined,
  FilterOutlined,
  FolderOpenOutlined,
  HourglassOutlined,
  MoreOutlined,
  NodeIndexOutlined,
  PlusCircleFilled,
  RedoOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  SwapOutlined,
  WechatWorkOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
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
import "./index.scss";
import { useLocation, useNavigate } from "react-router-dom";
import {
  assetType,
  frequencyAllOptions,
  PAGINATION,
  priorityType,
  ticketSchedulePreventiveStatus,
  schedulePreventiveStatus,
  FORMAT_DATE,
  ScheduleBasedOnType,
} from "../../../utils/constant";
import { parseToLabel } from "../../../helper/parse-helper";
import Comfirm from "../../../components/modal/Confirm";
import ShowSuccess from "../../../components/modal/result/successNotification";
import { parseDateHH } from "../../../helper/date-helper";
import useHeader from "../../../contexts/headerContext";
import ExpandRowSchedulePreventiveAssignUser from "../../../components/modal/schedulePreventive/ExpandRowSchedulePreventiveAssignUser.";
import ComfirmCancelSchdulePreventive from "./ComfirmCancelSchdulePreventive";
import ComfirmReOpenModal from "./ComfirmReOpenModal";
import ComfirmColseModal from "./ComfirmColseModal";
import { staticPath } from "../../../router/routerConfig";
import { filterOption } from "../../../helper/search-select-helper";
import PdfSchedulePreventiveExport from "./PdfSchedulePreventiveExport";
import { pdf } from "@react-pdf/renderer";
import ViewWorkingTime from "../../../components/modal/schedulePreventive/ViewWorkingTime";
import useSchedulePreventive from "../../../contexts/schedulePreventiveContext";
import useAuth from "../../../contexts/authContext";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import { useTranslation } from "react-i18next";
import DrawerSearchSchedulePreventive from "../../../components/drawer/drawerSearchSchedulePreventive";
import { LabelValue } from "../../../helper/label-value";
import { cleanEmptyValues } from "../../../helper/check-search-value";

export default function ScheduleschedulePreventive() {
  const { t } = useTranslation();
  const [schedulePreventives, setschedulePreventives] = useState([]);
  const [page, setPage] = useState(1);
  const { valueSearch, setValueSearch } = useSchedulePreventive();
  const [isShowCancelConfirm, setIsShowCancelConfirm] = useState(false);
  const navigate = useNavigate();
  const [totalRecord, setTotalRecord] = useState(0);
  const [searchForm] = Form.useForm();
  const [schedulePreventive, setSchedulePreventive] = useState(null);
  const [isOpenReOpen, setIsOpenReOpen] = useState(false);
  const [isOpenRecognize, setIsOpenRecognize] = useState(false);
  const [sortOrder, setSortOrder] = useState(-1);
  const [sortBy, setSortBy] = useState("startDate");
  const { setHeaderTitle } = useHeader();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const ticketStatus = queryParams.get("ticketStatus");
  const [isOpenSearchaAvanced, setIsOpenSearchaAvanced] = useState(false);
  const [isOpenViewDownTime, setIsOpenViewDownTime] = useState(false);
  const [downTime, setDownTime] = useState(null);
  const { permissions } = useAuth();
  const [searchField, setSearchField] = useState("searchText");
  const [searchFilter, setSearchFilter] = useState({});
  const drawerRef = useRef();

  useEffect(() => {
    setHeaderTitle(t("preventiveSchedule.list.title"));
    if (ticketStatus) {
      searchForm.setFieldsValue({
        ticketStatus: ticketStatus,
      });
    }
    if (valueSearch) {
      searchForm.setFieldsValue(valueSearch);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (page > 1) {
      fetchGetListSchedulePreventive(page, searchFilter);
    } else {
      fetchGetListSchedulePreventive(1, searchFilter);
    }
  }, [page, sortOrder, sortBy]); // eslint-disable-line react-hooks/exhaustive-deps
  const onChangePagination = (value) => {
    setPage(value);
  };

  const resetSearch = () => {
    setSearchFilter({});
    if (drawerRef.current) drawerRef.current.resetForm();
    const currentStatus = searchForm.getFieldValue("ticketStatus");
    searchForm.resetFields();
    searchForm.setFieldValue("ticketStatus", currentStatus);
    setPage(1);
    fetchGetListSchedulePreventive(1);
  };
  const fetchGetListSchedulePreventive = async (_page, value) => {
    const searchValue = searchForm.getFieldValue("searchValue");

    let payload = {
      page: _page || page,
      limit: PAGINATION.limit,
      sortBy,
      sortOrder,
      ...searchForm.getFieldsValue(),
      [searchField]: searchValue,
      ...cleanEmptyValues(value || {}),
    };
    setValueSearch(payload);
    const res =
      await _unitOfWork.schedulePreventive.getListSchedulePreventives(payload);
    if (res && res.code === 1) {
      setschedulePreventives(res?.schedulePreventives || []);
      setTotalRecord(res?.totalResults);
    }
  };

  const onClickDelete = async (value) => {
    let res = await _unitOfWork.schedulePreventive.deleteSchedulePreventive({
      id: value._id || value.id,
    });
    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("preventiveSchedule.list.title"),
        t("preventive.messages.delete_success"),
      );
      setPage(1);
      fetchGetListSchedulePreventive(1, searchFilter);
    }
  };
  const onSearch = () => {
    setPage(1);
    fetchGetListSchedulePreventive(1, searchFilter);
  };
  const onCancelSchedulePreventive = (record) => {
    setSchedulePreventive(record);
    setIsShowCancelConfirm(true);
  };
  const onClickRecognize = (record) => {
    setIsOpenRecognize(true);
    setSchedulePreventive(record);
  };
  const onClickReOpen = (record) => {
    setIsOpenReOpen(true);
    setSchedulePreventive(record);
  };
  const onClickViewSchedulePreventive = (value) => {
    navigate(staticPath.viewSchedulePreventive + "/" + (value._id || value.id));
  };
  const onClickCommet = (value) => {
    navigate(
      staticPath.schedulePreventiveComment + "/" + (value._id || value.id),
    );
  };
  const onClickDowntime = (value) => {
    setDownTime(value?.totalDownTimeSchedulePreventive);
    setIsOpenViewDownTime(true);
  };
  const onClickPDFExport = async (values) => {
    try {
      const blob = await pdf(
        <PdfSchedulePreventiveExport data={values} />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error("Export PDF error:", err);
    }
  };
  const columns = [
    {
      title: t("preventiveSchedule.list.table.index"),
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
      dataIndex: "info",
      className: "text-bold",
      render: (text, record) => {
        const option = priorityType.Option.find(
          (opt) => opt.value === record?.importance,
        );
        const barColor = option?.color || "#ff4d4f";
        return (
          <div>
            <span className="priority-number" style={{ color: barColor }}>
              <LabelValue label={t("Code")} value={record?.code} />
            </span>
            <LabelValue
              label={t("preventive.list.table.plan_name")}
              value={record?.preventive?.preventiveName}
            />
            <LabelValue
              label={t("preventive.list.table.schedule_based_on")}
              value={t(
                parseToLabel(
                  ScheduleBasedOnType.Option,
                  record?.preventive?.scheduleType,
                ),
              )}
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
            label={t("preventiveSchedule.list.table.asset_name")}
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
            label={t("preventiveSchedule.list.table.model")}
            value={text?.assetModel?.assetModelName}
          />
          <LabelValue
            label={t("preventiveSchedule.list.table.serial")}
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
      title: t("preventiveSchedule.list.table.status"),
      dataIndex: "status",
      align: "center",
      render: (status) => {
        const option = schedulePreventiveStatus.Options.find(
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
      title: t("preventiveSchedule.list.table.start_date"),
      dataIndex: "startDate",
      key: "startDate",
      align: "center",
      render: (text) => parseDateHH(text),
    },
    {
      title: t("preventiveSchedule.list.table.action"),
      dataIndex: "action",
      align: "center",
      fixed: "right",
      render: (_, record) => {
        const items = [];

        // Export PDF
        if (
          checkPermission(
            permissions,
            permissionCodeConstant.schedule_preventive_export_pdf,
          )
        ) {
          items.push({
            key: "export_pdf",
            label: t("preventiveSchedule.list.tooltips.export_pdf"),
            icon: <FilePdfOutlined />,
            onClick: () => onClickPDFExport(record),
          });
        }

        // New -> cancel + delete
        if (record.ticketStatus === ticketSchedulePreventiveStatus.new) {
          if (
            checkPermission(
              permissions,
              permissionCodeConstant.schedule_preventive_cancel,
            )
          ) {
            items.push({
              key: "cancel",
              label: t("preventiveSchedule.list.tooltips.cancel"),
              icon: <CloseCircleOutlined />,
              onClick: () => onCancelSchedulePreventive(record),
            });
          }

          if (
            checkPermission(
              permissions,
              permissionCodeConstant.schedule_preventive_delete,
            )
          ) {
            items.push({
              key: "delete",
              label: t("preventiveSchedule.list.tooltips.delete"),
              icon: <DeleteOutlined />,
              onClick: () =>
                Comfirm(
                  t("preventiveSchedule.list.tooltips.confirm_delete"),
                  () => onClickDelete(record),
                ),
            });
          }
        }

        // Downtime
        if (
          checkPermission(
            permissions,
            permissionCodeConstant.schedule_preventive_view_downtime,
          ) &&
          (record.status === schedulePreventiveStatus.waitingForAdminApproval ||
            record.status === schedulePreventiveStatus.completed)
        ) {
          items.push({
            key: "downtime",
            label: t("preventiveSchedule.list.tooltips.downtime"),
            icon: <HourglassOutlined />,
            onClick: () => onClickDowntime(record),
          });
        }

        // Close or reopen
        if (
          checkPermission(
            permissions,
            permissionCodeConstant.schedule_preventive_close_or_reopen,
          ) &&
          record.status === schedulePreventiveStatus.waitingForAdminApproval
        ) {
          items.push({
            key: "close",
            label: t("preventiveSchedule.list.tooltips.close"),
            icon: <CheckSquareOutlined />,
            onClick: () => onClickRecognize(record),
          });

          items.push({
            key: "reopen",
            label: t("preventiveSchedule.list.tooltips.reopen"),
            icon: <FolderOpenOutlined />,
            onClick: () => onClickReOpen(record),
          });
        }

        // Comment
        if (
          checkPermission(
            permissions,
            permissionCodeConstant.schedule_preventive_comment,
          )
        ) {
          items.push({
            key: "comment",
            label: t("preventiveSchedule.list.tooltips.comment"),
            icon: <WechatWorkOutlined />,
            onClick: () => onClickCommet(record),
          });
        }

        return (
          <div className="flex items-center justify-center">
            {/* View detail đứng riêng */}
            {checkPermission(
              permissions,
              permissionCodeConstant.schedule_preventive_view_detail,
            ) && (
              <Tooltip title={t("preventiveSchedule.list.tooltips.view")}>
                <Button
                  icon={<EyeOutlined />}
                  size="small"
                  onClick={() => onClickViewSchedulePreventive(record)}
                />
              </Tooltip>
            )}

            {/* Dropdown */}
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

  const placeholderMap = {
    searchText: t("preventive.common.all"),
    assetName: t("preventiveSchedule.list.search.asset_name"),
    code: t("preventiveSchedule.list.search.code"),
    preventiveName: t("preventiveSchedule.list.search.preventive_name"),
    serial: t("preventiveSchedule.list.search.serial"),
    assetModelName: t("preventiveSchedule.list.search.model"),
  };

  const sortOptions = [
    { value: "startDate", label: t("preventiveSchedule.list.sort.by_start") },
    { value: "createdAt", label: t("preventiveSchedule.list.sort.by_created") },
    { value: "updatedAt", label: t("preventiveSchedule.list.sort.by_updated") },
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
              name="ticketStatus"
              initialValue={ticketSchedulePreventiveStatus.new}
              style={{ marginBottom: 16 }}
            >
              <Radio.Group
                buttonStyle="solid"
                style={{ width: "100%" }}
                onChange={() => {
                  setPage(1);
                  fetchGetListSchedulePreventive();
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
        <Row className="mb-1" gutter={32}>
          {/* <Col span={6}>
            <Form.Item id="" label={t("preventiveSchedule.list.search.code")} name="code">
              <Input placeholder={t("preventiveSchedule.list.search.enter_code")}></Input>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item id="" label={t("preventiveSchedule.list.search.preventive_name")} name="preventiveName">
              <Input placeholder={t("preventiveSchedule.list.search.preventive_name")}></Input>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item id="" label={t("preventiveSchedule.list.search.serial")} name="serial">
              <Input placeholder={t("preventiveSchedule.list.search.serial")}></Input>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item id="" label={t("preventiveSchedule.list.search.model")} name="assetModelName">
              <Input placeholder={t("preventiveSchedule.list.search.model")}></Input>
            </Form.Item>
          </Col> */}

          {/* {isOpenSearchaAvanced && (
            <>
              <Col span={6}>
                <Form.Item label={t("preventiveSchedule.list.search.status")} name="schedulePreventiveStatus">
                  <Select
                    showSearch
                    allowClear
                    placeholder={t("preventiveSchedule.list.search.status")}
                    options={(schedulePreventiveStatus.Options || []).map(
                      (item) => ({
                        value: item.value,
                        label: t(item.label),
                      })
                    )}
                    filterOption={filterOption}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  id=""
                  labelAlign="left"
                  label={t("preventiveSchedule.list.search.asset_style")}
                  name="assetStyle"
                >
                  <Select
                    allowClear
                    placeholder={t("preventiveSchedule.list.search.asset_style")}
                    options={(assetType.Options || []).map((item) => ({
                      key: item.value,
                      value: item.value,
                      label: t(item.label),
                    }))}
                  ></Select>
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item name="startDate" label={t("preventiveSchedule.list.search.start_date_from")}>
                  <DatePicker
                    placeholder={t("preventiveSchedule.list.search.start_date_from")}
                    format={FORMAT_DATE}
                    style={{ width: "100%" }}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="endDate" label={t("preventiveSchedule.list.search.end_date_to")}>
                  <DatePicker
                    placeholder={t("preventiveSchedule.list.search.end_date_to")}
                    format={FORMAT_DATE}
                    style={{ width: "100%" }}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label={t("preventiveSchedule.list.search.priority")} name="importance">
                  <Select
                    showSearch
                    allowClear
                    placeholder={t("preventiveSchedule.list.search.priority")}
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
                  size="middle"
                  value={searchField}
                  style={{ width: "30%" }}
                  onChange={(value) => {
                    setSearchField(value);
                    searchForm.setFieldValue("searchValue", "");
                  }}
                  options={[
                    { value: "searchText", label: t("preventive.common.all") },
                    {
                      value: "code",
                      label: t("preventiveSchedule.list.search.code"),
                    },
                    {
                      value: "assetName",
                      label: t("preventiveSchedule.list.search.asset_name"),
                    },
                    {
                      value: "preventiveName",
                      label: t(
                        "preventiveSchedule.list.search.preventive_name",
                      ),
                    },
                    {
                      value: "serial",
                      label: t("preventiveSchedule.list.search.serial"),
                    },
                    {
                      value: "assetModelName",
                      label: t("preventiveSchedule.list.search.model"),
                    },
                  ]}
                />

                <Form.Item name="searchValue" noStyle>
                  <Input
                    size="middle"
                    style={{ width: "70%" }}
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
              {t("preventiveSchedule.buttons.search")}
            </Button>
            <Button className="bt-green mr-2" onClick={resetSearch}>
              <RedoOutlined />
              {t("preventiveSchedule.buttons.reset")}
            </Button>
            {/* <Button
              className="bt-green mr-2"
              onClick={() => setIsOpenSearchaAvanced(true)}
            >
              <PlusCircleFilled />
              {t("preventiveSchedule.buttons.advanced_search")}
            </Button>
            <Select
              value={sortBy}
              className="mr-2"
              onChange={(value) => setSortBy(value)}
            >
              <Select.Option value="startDate">
                {t("preventiveSchedule.list.sort.by_start")}
              </Select.Option>
              <Select.Option value="createdAt">
                {t("preventiveSchedule.list.sort.by_created")}
              </Select.Option>
              <Select.Option value="updatedAt">
                {t("preventiveSchedule.list.sort.by_updated")}
              </Select.Option>
            </Select> */}
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
          rowKey="_id"
          columns={columns}
          key={"_id"}
          dataSource={schedulePreventives}
          bordered
          pagination={false}
          scroll={{ x: "max-content" }}
          expandable={{
            expandedRowRender: (record) => (
              <ExpandRowSchedulePreventiveAssignUser
                schdulePreventive={record}
                fetchGetListSchedulePreventive={fetchGetListSchedulePreventive}
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
        <ComfirmCancelSchdulePreventive
          open={isShowCancelConfirm}
          onCancel={() => setIsShowCancelConfirm(false)}
          schedulePreventive={schedulePreventive}
          onRefresh={fetchGetListSchedulePreventive}
        />
        <ComfirmReOpenModal
          open={isOpenReOpen}
          onCancel={() => setIsOpenReOpen(false)}
          schedulePreventive={schedulePreventive}
          onRefresh={fetchGetListSchedulePreventive}
        />
        <ComfirmColseModal
          open={isOpenRecognize}
          onCancel={() => setIsOpenRecognize(false)}
          schedulePreventive={schedulePreventive}
          onRefresh={fetchGetListSchedulePreventive}
        />
        <ViewWorkingTime
          open={isOpenViewDownTime}
          onCancel={() => setIsOpenViewDownTime(false)}
          workingTime={downTime}
        />
        <DrawerSearchSchedulePreventive
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
              fetchGetListSchedulePreventive(1, value);
            }
          }}
        />
      </Form>
    </div>
  );
}
