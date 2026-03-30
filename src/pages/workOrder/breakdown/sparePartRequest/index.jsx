import React, { useEffect, useRef, useState } from "react";
import {
  EyeFilled,
  FilterOutlined,
  RedoOutlined,
  SearchOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Pagination,
  Row,
  Select,
  Table,
  Tooltip,
} from "antd";
import * as _unitOfWork from "../../../../api";
import { useNavigate } from "react-router-dom";
import {
  assetType,
  breakdownStatus,
  breakdownUserStatus,
  PAGINATION,
} from "../../../../utils/constant";
import { parseToLabel } from "../../../../helper/parse-helper";
import { staticPath } from "../../../../router/routerConfig";
import { parseDate } from "../../../../helper/date-helper";
import ApproveSparePartModal from "./ApproveSparePartModal";
import useHeader from "../../../../contexts/headerContext";
import ExpandRowSparePartRequest from "./ExpandRowSparePartRequest";
import { checkPermission } from "../../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../../utils/permissionConstant";
import useAuth from "../../../../contexts/authContext";
import { useTranslation } from "react-i18next";
import { LabelValue } from "../../../../helper/label-value";
import DrawerSearch from "../../../../components/drawer/drawerSearch";
import { cleanEmptyValues } from "../../../../helper/check-search-value";

export default function SparePartRequest() {
  const { t } = useTranslation();
  const [breakdowns, setBreakdowns] = useState([]);
  const [breakdown, setBreakdown] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [pagination, setPagination] = useState(PAGINATION);
  const [totalRecord, setTotalRecord] = useState(0);
  const [searchForm] = Form.useForm();
  const { permissions } = useAuth();
  const [isOpenModalApprover, setIsOpenModalApprover] = useState(false);
  const [searchParams, setSearchParams] = useState(null);
  const { setHeaderTitle } = useHeader();
  const [isOpenSearchAdvanced, setIsOpenSearchAdvanced] = useState(false);
  const [searchField, setSearchField] = useState("breakdownCode");
  const [searchFilter, setSearchFilter] = useState({});
  const drawerRef = useRef();
  useEffect(() => {
    setHeaderTitle(t("breakdown.spareRequest.title"));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (page > 1) {
      fetchListBreakdownSpareRequest(page, searchFilter);
    } else {
      fetchListBreakdownSpareRequest(1, searchFilter);
    }
  }, [page, searchParams]);

  const onChangePagination = (value) => {
    setPage(value);
  };
  const resetSearch = () => {
    setSearchFilter({});
    if (drawerRef.current) drawerRef.current.resetForm();
    if (page === 1) {
      fetchListBreakdownSpareRequest(1);
    }
    setPage(1);
    searchForm.resetFields();
    setSearchParams(null);
  };

  const fetchListBreakdownSpareRequest = async (_page, value) => {
    const searchValue = searchForm.getFieldValue("searchValue");
    const values = searchForm.getFieldsValue();
    let filterValue = cleanEmptyValues(value || {});
    let payload = {
      page: page,
      limit: PAGINATION.limit,
      ...searchParams,
      [searchField]: searchValue,
      ...filterValue,
    };
    const res =
      await _unitOfWork.breakdownSpareRequest.getListBreakdownSpareRequests(
        payload,
      );
    if (res && res.results) {
      setBreakdowns(res.results.results);
      setTotalRecord(res.results.totalResults);
    }
  };

  const onClicView = (value) => {
    navigate(staticPath.viewWorkOrderBreakdown + "/" + value.id);
  };

  const handleApproveSparePart = (record) => {
    setBreakdown(record);
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
      title: t("breakdown.info_request_spare_part"),
      render: (text, record) => {
        const matchedStatus = breakdownStatus.Option.find(
          (opt) => opt.value === record?.breakdown?.status,
        );
        return (
          <div>
            <LabelValue
              label={t("breakdown.code_request_spare_part")}
              value={record?.code}
            />
            <LabelValue
              label={t("breakdown.common.code")}
              value={record?.breakdown?.code}
            />
            <LabelValue
              label={t("dashboard.comparison.breakdown_status_card")}
              value={
                <span
                  style={{
                    color: matchedStatus?.color || "#d9d9d9",
                    fontWeight: 600,
                  }}
                >
                  {t(matchedStatus?.label || text || "")}
                </span>
              }
            />
          </div>
        );
      },
    },
    {
      title: t("assetMaintenance.list.title_info"),
      dataIndex: "breakdown",
      render: (text) => (
        <div>
          <LabelValue
            label={t("breakdown.spareRequest.table.asset_name")}
            value={text?.assetMaintenance?.assetModel?.asset?.assetName}
          />
          <LabelValue
            label={t("breakdown.spareRequest.table.model")}
            value={text?.assetMaintenance?.assetModel?.assetModelName}
          />
          <LabelValue
            label={t("breakdown.spareRequest.table.serial")}
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
            value={record?.breakdown?.assetMaintenance?.branch?.name}
          />
          <LabelValue
            label={t("breakdown.map.fields.department")}
            value={
              record?.breakdown?.assetMaintenance?.department?.departmentName
            }
          />
          <LabelValue
            label={t("preventive.list.table.customer")}
            value={
              record?.breakdown?.assetMaintenance?.customer?.customerName || ""
            }
          />
        </div>
      ),
    },
    {
      title: t("breakdown.spareRequest.status"),
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
      title: t("dashboard.calendar.messages.time"),
      dataIndex: "assetMaintenance",
      render: (_, record) => {
        return (
          <div>
            <Tooltip title={t("breakdown.cretaedat_request_spare_part")}>
              {" "}
              <LabelValue
                label={t("breakdown.myWork.columns.created_at")}
                value={parseDate(record?.createdAt)}
              />
            </Tooltip>
            <Tooltip title={t("breakdown.create.fields.incident_deadline")}>
              {" "}
              <LabelValue
                label={t("breakdown.list.columns.deadline")}
                value={parseDate(record?.breakdown?.incidentDeadline)}
              />
            </Tooltip>
          </div>
        );
      },
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
            permissionCodeConstant.spare_view_detail,
          ) && (
            <Tooltip title={t("breakdown.spareRequest.modal.tooltips.view")}>
              <Button
                icon={<EyeFilled />}
                size="small"
                onClick={() => onClicView(record.breakdown)}
                className="ml-2"
              />
            </Tooltip>
          )}
          {checkPermission(permissions, permissionCodeConstant.spare_approve) &&
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
    fetchListBreakdownSpareRequest(1, searchFilter);
  };

  const placeholderMap = {
    // searchText: t("preventive.common.all"),
    code: t("breakdown.common.code"),
    // calibrationName: t("calibration.calibration_name"),
    // serial: t("breakdown.common.serial"),
    // assetName: t("preventive.list.table.asset_name"),
    // assetModelName: t("preventive.list.table.model"),
  };

  const sparePartRequestFieldsConfig = [
    {
      name: "breakdownCode",
      labelKey: "breakdown.spareRequest.search.code",
      placeholderKey: "breakdown.spareRequest.search.code",
      component: "Input",
    },
    // {
    //   name: "serial",
    //   labelKey: "breakdown.common.serial",
    //   placeholderKey: "breakdown.common.serial",
    //   component: "Input",
    // },
    {
      name: "status",
      labelKey: "breakdown.spareRequest.search.status",
      placeholderKey: "breakdown.spareRequest.search.status_placeholder",
      component: "Select",
      options: "breakdownSpareRequestStatus",
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
                    // { value: "searchText", label: t("preventive.common.all") },
                    {
                      value: "breakdownCode",
                      label: t("breakdown.common.code"),
                    },
                    // { value: "calibrationName", label: t("calibration.calibration_name") },
                    // { value: "serial", label: t("breakdown.common.serial") },
                    // { value: "assetName", label: t("preventive.list.table.asset_name") },
                    // { value: "assetModelName", label: t("preventive.list.table.model") },
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
              <ExpandRowSparePartRequest dataSource={record.details} />
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
        <ApproveSparePartModal
          open={isOpenModalApprover}
          onCancel={() => setIsOpenModalApprover(false)}
          data={breakdown}
          onSubmit={() => {
            fetchListBreakdownSpareRequest();
            setIsOpenModalApprover(false);
          }}
        />
        <DrawerSearch
          isOpen={isOpenSearchAdvanced}
          ref={drawerRef}
          onCallBack={(value) => {
            searchForm.resetFields(["searchValue"]);
            setSearchFilter(value);
            if (!value.isClose) {
              setPage(1);
              fetchListBreakdownSpareRequest(1, value);
            }
          }}
          onClose={() => {
            setIsOpenSearchAdvanced(false);
          }}
          fieldsConfig={sparePartRequestFieldsConfig}
        />
      </Form>
    </div>
  );
}
