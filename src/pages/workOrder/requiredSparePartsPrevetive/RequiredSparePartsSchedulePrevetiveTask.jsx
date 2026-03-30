import React, { useEffect, useRef, useState } from "react";
import {
  ExclamationCircleOutlined,
  EyeFilled,
  FilterOutlined,
  RedoOutlined,
  SearchOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Pagination,
  Row,
  Select,
  Table,
  Tooltip,
} from "antd";
import * as _unitOfWork from "../../../api";
import { useNavigate } from "react-router-dom";
import {
  breakdownUserStatus,
  PAGINATION,
  priorityType,
  ScheduleBasedOnType,
} from "../../../utils/constant";
import { staticPath } from "../../../router/routerConfig";
import { parseDate, parseDateHH } from "../../../helper/date-helper";
import useHeader from "../../../contexts/headerContext";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import useAuth from "../../../contexts/authContext";
import { useTranslation } from "react-i18next";
import ExpandRowSparePartRequest from "../breakdown/sparePartRequest/ExpandRowSparePartRequest";
import SparePartsReview from "./SparePartsReview";
import { LabelValue } from "../../../helper/label-value";
import DrawerSearch from "../../../components/drawer/drawerSearch";
import { cleanEmptyValues } from "../../../helper/check-search-value";
import { parseToLabel } from "../../../helper/parse-helper";

export default function RequiredSparePartsSchedulePrevetiveTask() {
  const { t } = useTranslation();
  const [
    schedulePrevetiveTaskReSpareParts,
    setSchedulePrevetiveTaskReSpareParts,
  ] = useState([]);
  const [
    schedulePrevetiveTaskReSparePart,
    setSchedulePrevetiveTaskReSparePart,
  ] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [pagination, setPagination] = useState(PAGINATION);
  const [totalRecord, setTotalRecord] = useState(0);
  const [searchForm] = Form.useForm();
  const { permissions } = useAuth();
  const [isOpenModalApprover, setIsOpenModalApprover] = useState(false);
  const [searchParams, setSearchParams] = useState(null);

  const { setHeaderTitle } = useHeader();
  const [searchField, setSearchField] = useState("searchText");
  const [isOpenSearchAdvanced, setIsOpenSearchAdvanced] = useState(false);
  const [searchFilter, setSearchFilter] = useState({});
  const drawerRef = useRef();
  useEffect(() => {
    setHeaderTitle(
      t("menu.maintenance_request.required_spare_parts_prevetive"),
    );
  }, [t]);
  useEffect(() => {
    if (page > 1)
      fetchListSchedulePrevetiveTaskSpareRequest(page, searchFilter);
    else fetchListSchedulePrevetiveTaskSpareRequest(1, searchFilter);
  }, [page, searchParams]);

  const onChangePagination = (value) => {
    setPage(value);
  };
  const resetSearch = () => {
    setSearchFilter({});
    if (drawerRef.current) drawerRef.current.resetForm();
    if (page !== 1) setPage(1);
    searchForm.resetFields();
    setSearchParams(null);
    fetchListSchedulePrevetiveTaskSpareRequest(1);
  };

  const fetchListSchedulePrevetiveTaskSpareRequest = async (_page, value) => {
    const searchValue = searchForm.getFieldValue("searchValue");
    let filterValue = cleanEmptyValues(value || {});
    let payload = {
      page: page,
      limit: PAGINATION.limit,
      ...searchParams,
      ...filterValue,
      [searchField]: searchValue,
    };
    const res =
      await _unitOfWork.schedulePreventiveTaskRequestSparepart.getListSchedulePrevetiveTaskSparePartRequests(
        payload,
      );
    if (res && res?.data) {
      setSchedulePrevetiveTaskReSpareParts(res.data);
      setTotalRecord(res?.totalResults);
    }
  };

  const onClicView = (value) => {
    navigate(
      staticPath.viewSchedulePreventive + "/" + value?.schedulePreventive?._id,
    );
  };

  const handleApproveSparePart = (record) => {
    setSchedulePrevetiveTaskReSparePart(record);
    setIsOpenModalApprover(true);
  };

  const columns = [
    {
      title: t("breakdown.spareRequest.table.index"),
      dataIndex: "id",
      key: "id",
      width: "60px",
      align: "center",
      render: (_text, _record, index) =>
        (page - 1) * PAGINATION.limit + index + 1,
    },
    {
      title: t("calibrationWork.detail.title_job_information"),
      className: "text-bold",
      render: (text, record) => {
        return (
          <div>
            <LabelValue
              label={t("Code")}
              value={record?.schedulePreventive?.code}
            />
            <LabelValue
              label={t("preventive.list.table.plan_name")}
              value={
                record?.schedulePreventiveObject?.preventive?.preventiveName
              }
            />
            <LabelValue
              label={t("myTask.myTask.table.task_name")}
              value={record?.schedulePreventiveTask?.taskName}
            />
            <LabelValue
              label={t("preventive.list.table.schedule_based_on")}
              value={t(
                parseToLabel(
                  ScheduleBasedOnType.Option,
                  record?.schedulePreventiveObject?.preventive?.scheduleType,
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
      dataIndex: "schedulePreventive",
      render: (text, record) => (
        <div>
          <LabelValue
            label={t("breakdown.map.fields.branch")}
            value={
              record?.schedulePreventiveObject?.preventive?.assetMaintenance
                ?.branch?.name
            }
          />
          <LabelValue
            label={t("breakdown.map.fields.department")}
            value={
              record?.schedulePreventiveObject?.preventive?.assetMaintenance
                ?.department?.departmentName
            }
          />
          <LabelValue
            label={t("preventive.list.table.customer")}
            value={text?.assetMaintenance?.customer?.customerName}
          />
        </div>
      ),
    },
    {
      title: t("breakdown.spareRequest.table.status"),
      dataIndex: "requestStatus",
      align: "center",
      render: (text) => {
        const matchedStatus = breakdownUserStatus.Option.find(
          (opt) => opt.value === text,
        );
        return (
          <span
            className="status-badge"
            style={{
              "--color": matchedStatus?.color || "#d9d9d9",
            }}
          >
            {t(matchedStatus?.label || text || "")}
          </span>
        );
      },
    },
    {
      title: t("Thông tin người gửi yêu cầu / nhận"),
      dataIndex: "schedulePreventive",
      render: (text, record) => (
        <div>
          <LabelValue
            label={t("breakdown.spareRequest.table.created_by")}
            value={record?.createdBy?.fullName || ""}
          />
          <LabelValue
            label={t("breakdown.spareRequest.table.date_of_request")}
            value={parseDateHH(record?.createdAt)}
          />
          <LabelValue
            label={t("breakdown.spareRequest.table.spare_parts_recipient")}
            value={record?.holder?.fullName || ""}
          />
          <LabelValue
            label={t("breakdown.spareRequest.table.approval_date")}
            value={parseDateHH(record?.assignUserDate) || ""}
          />
        </div>
      ),
    },
    {
      title: t("breakdown.spareRequest.table.action"),
      dataIndex: "action",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <>
          {checkPermission(
            permissions,
            permissionCodeConstant.required_spare_part_schedule_preventive_view,
          ) && (
            <Tooltip title={t("breakdown.spareRequest.modal.tooltips.view")}>
              <Button
                icon={<EyeFilled />}
                size="small"
                onClick={() => onClicView(record)}
                className="ml-2"
              />
            </Tooltip>
          )}
          {checkPermission(
            permissions,
            permissionCodeConstant.required_spare_part_schedule_preventive_approve,
          ) &&
            record.requestStatus !== breakdownUserStatus.rejected &&
            record.requestStatus !== breakdownUserStatus.submitted &&
            record.requestStatus !== breakdownUserStatus.spareReplace && (
              <Tooltip
                title={t("breakdown.spareRequest.modal.tooltips.approve")}
              >
                <Button
                  icon={<UserAddOutlined />}
                  size="small"
                  onClick={() => handleApproveSparePart(record)}
                  className="ml-2"
                />
              </Tooltip>
            )}
        </>
      ),
    },
  ];

  const onSearch = () => {
    setPage(1);
    setSearchParams(searchForm.getFieldsValue());
    fetchListSchedulePrevetiveTaskSpareRequest(1, searchFilter);
  };

  const RequiredSparePartSchedulePreventiveTaskFieldsConfig = [
    {
      name: "code",
      labelKey: "breakdown.spareRequest.table.code",
      placeholderKey: "breakdown.spareRequest.table.code",
      component: "Input",
    },
    {
      name: "status",
      labelKey: "breakdown.spareRequest.search.status",
      placeholderKey: "breakdown.spareRequest.search.status_placeholder",
      component: "Select",
      options: "schedulePreventiveTaskRequestSparePartStatus",
    },
    {
      name: "startDate",
      labelKey: "breakdown.spareRequest.search.start_date",
      placeholderKey: "breakdown.spareRequest.search.start_date_placeholder",
      component: "DatePicker",
    },
    {
      name: "endDate",
      labelKey: "breakdown.spareRequest.search.end_date",
      placeholderKey: "breakdown.spareRequest.search.end_date_placeholder",
      component: "DatePicker",
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

  return (
    <div className="p-3">
      <Form
        labelWrap
        className="search-form"
        form={searchForm}
        layout="vertical"
        onFinish={onSearch}
      >
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
              {t("breakdown.spareRequest.buttons.search")}
            </Button>
            <Button className="bt-green mr-2" onClick={resetSearch}>
              <RedoOutlined />
              {t("breakdown.spareRequest.buttons.reset")}
            </Button>
            <Button
              title={t("preventive.buttons.advanced_search")}
              className="px-2 mr-2"
              onClick={() => setIsOpenSearchAdvanced(true)}
            >
              <FilterOutlined style={{ fontSize: 20, cursor: "pointer" }} />
            </Button>
          </Col>
          <Col span={4} style={{ textAlign: "right", marginTop: "auto" }}>
            <b>
              {t("breakdown.spareRequest.misc.total", { count: totalRecord })}
            </b>
          </Col>
        </Row>
        <Table
          rowKey={(record) => record?._id || record?.id}
          columns={columns}
          key={"id"}
          dataSource={schedulePrevetiveTaskReSpareParts}
          bordered
          pagination={false}
          scroll={{ x: "max-content" }}
          expandable={{
            expandedRowRender: (record) => (
              <ExpandRowSparePartRequest
                dataSource={
                  record?.schedulePrevetiveTaskSparePartRequestDetails
                }
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
        <SparePartsReview
          open={isOpenModalApprover}
          onCancel={() => setIsOpenModalApprover(false)}
          data={schedulePrevetiveTaskReSparePart}
          onSubmit={() => {
            fetchListSchedulePrevetiveTaskSpareRequest();
            setIsOpenModalApprover(false);
          }}
        />
        <DrawerSearch
          isOpen={isOpenSearchAdvanced}
          ref={drawerRef}
          onCallBack={(value) => {
            searchForm.resetFields();
            setSearchFilter(value);
            if (!value.isClose) {
              setPage(1);
              fetchListSchedulePrevetiveTaskSpareRequest(1, value);
            }
          }}
          onClose={() => {
            setIsOpenSearchAdvanced(false);
          }}
          fieldsConfig={RequiredSparePartSchedulePreventiveTaskFieldsConfig}
        />
      </Form>
    </div>
  );
}
