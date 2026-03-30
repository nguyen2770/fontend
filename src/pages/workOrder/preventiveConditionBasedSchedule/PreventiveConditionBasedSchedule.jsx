import React, { useEffect, useRef, useState } from "react";
import {
  FilterOutlined,
  FormOutlined,
  HistoryOutlined,
  RedoOutlined,
  SearchOutlined,
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
import {
  dateType,
  PAGINATION,
  ScheduleBasedOnType,
} from "../../../utils/constant";
import * as _unitOfWork from "../../../api";
import useHeader from "../../../contexts/headerContext";
import useAuth from "../../../contexts/authContext";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionConstant";
import { useTranslation } from "react-i18next";
import { parseToLabel } from "../../../helper/parse-helper";
import UpdatePreventiveConditionBasedSchedule from "./UpdatePreventiveConditionBasedSchedule";
import ViewPreventiveConditionBasedScheduleHistory from "./ViewPreventiveConditionBasedScheduleHistory";
import { LabelValue } from "../../../helper/label-value";
import { cleanEmptyValues } from "../../../helper/check-search-value";
import DrawerSearch from "../../../components/drawer/drawerSearch";

export default function PreventiveConditionBasedSchedule() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(PAGINATION);
  const [totalRecord, setTotalRecord] = useState(0);
  const [
    preventiveConditionBasedSchedules,
    setPreventiveConditionBasedSchedules,
  ] = useState([]);
  const { setHeaderTitle } = useHeader();
  const [searchForm] = Form.useForm();
  const { permissions } = useAuth();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [
    preventiveConditionBasedSchedule,
    setPreventiveConditionBasedSchedule,
  ] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [isOpenSearchAdvanced, setIsOpenSearchAdvanced] = useState(false);
  const [searchField, setSearchField] = useState("searchText");
  const [searchFilter, setSearchFilter] = useState({});
  const drawerRef = useRef();

  useEffect(() => {
    setHeaderTitle(t("preventiveConditionBased.title"));
    getAllCustomers();
    getAllSupervisors();
  }, [t, setHeaderTitle]);

  useEffect(() => {
    if (page > 1) {
      fetchGetPreventiveMonitoring(page, searchFilter);
    } else {
      fetchGetPreventiveMonitoring(1, searchFilter);
    }
  }, [page]);

  const onChangePagination = (value) => {
    setPage(value);
  };

  const fetchGetPreventiveMonitoring = async (_page, value) => {
    const searchValue = searchForm.getFieldValue("searchValue");
    let filterValue = cleanEmptyValues(value || {});
    let payload = {
      page: _page || page,
      limit: PAGINATION.limit,
      // ...searchForm.getFieldsValue(),
      ...filterValue,
      ...(searchValue ? { [searchField]: searchValue } : {}),
    };
    const res =
      await _unitOfWork.preventive.getPreventiveByConditionBasedSchedule(
        payload,
      );
    if (res && res.code === 1) {
      setTotalRecord(res?.totalResults);
      setPreventiveConditionBasedSchedules(res?.results || []);
    }
  };
  const getAllCustomers = async () => {
    const res = await _unitOfWork.customer.getAllCustomer();
    if (res) {
      const options = res.data.map((item) => ({
        label: item.customerName,
        value: item.id,
      }));
      setCustomers(options);
    }
  };
  const getAllSupervisors = async () => {
    const res = await _unitOfWork.user.getAllUser();
    if (res) {
      const options = res.data.map((item) => ({
        label: item.fullName,
        value: item.id,
      }));
      setSupervisors(options);
    }
  };
  const onClickUpdate = (record) => {
    setPreventiveConditionBasedSchedule(record);
    setShowUpdateModal(true);
  };
  const onClickView = (record) => {
    setPreventiveConditionBasedSchedule(record);
    setShowViewModal(true);
  };

  const columns = [
    {
      title: t("STT"),
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
              label={t("preventiveMonitoring.maintenance")}
              value={record?.code}
            />
            <LabelValue
              label={t("preventive.list.table.plan_name")}
              value={record?.preventiveName}
            />
            <LabelValue
              label={t("preventive.list.table.schedule_based_on")}
              value={t(
                parseToLabel(ScheduleBasedOnType.Option, record?.scheduleType),
              )}
            />
            <LabelValue
              label={t("preventive.form.cycle")}
              value={
                record?.frequency +
                " " +
                t(parseToLabel(dateType.Options, record?.cycle))
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
                {text?.asset?.assetName}
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
      dataIndex: "assetMaintenance",
      render: (text, record) => (
        <div>
          <LabelValue
            label={t("breakdown.map.fields.branch")}
            value={record?.assetMaintenance?.branch?.name}
          />
          <LabelValue
            label={t("breakdown.map.fields.department")}
            value={record?.assetMaintenance?.department?.departmentName}
          />
          <LabelValue
            label={t("preventive.list.table.customer")}
            value={text?.customer?.customerName}
          />
        </div>
      ),
    },
    {
      title: t("preventive.start_modal.supervisor"),
      dataIndex: "supervisor",
      render: (text) => {
        return <span>{text?.fullName || []}</span>;
      },
    },
    {
      title: t("preventiveMonitoring.action"),
      dataIndex: "action",
      align: "center",
      render: (_, record) => (
        <div>
          {" "}
          {checkPermission(
            permissions,
            permissionCodeConstant.preventive_conditioon_based_schedule_enter_measured_value,
          ) && (
            <Tooltip title={t("preventiveConditionBased.enter_measured_value")}>
              <Button
                type="primary"
                icon={<FormOutlined />}
                size="small"
                onClick={() => onClickUpdate(record)}
              />
            </Tooltip>
          )}
          {checkPermission(
            permissions,
            permissionCodeConstant.preventive_conditioon_based_schedule_view_history,
          ) && (
            <Tooltip
              title={t("preventiveConditionBased.view_measurement_history")}
            >
              <Button
                icon={<HistoryOutlined />}
                size="small"
                className="ml-2"
                onClick={() => onClickView(record)}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  const onSearch = () => {
    setPage(1);
    fetchGetPreventiveMonitoring(1, searchFilter);
  };

  const resetSearch = () => {
    setSearchFilter({});
    if (drawerRef.current) drawerRef.current.resetForm();
    setPage(1);
    searchForm.resetFields();
    fetchGetPreventiveMonitoring(1);
  };
  const fieldsConfig = [
    {
      name: "code",
      labelKey: "preventiveConditionBased.code",
      placeholderKey: "preventiveConditionBased.code",
      component: "Input",
    },
    {
      name: "assetName",
      labelKey: "preventive.list.table.asset_name",
      placeholderKey: "preventive.list.table.asset_name",
      component: "Input",
    },
    {
      name: "assetModelName",
      labelKey: "preventive.list.table.model",
      placeholderKey: "preventive.list.table.model",
      component: "Input",
    },
    {
      name: "serial",
      labelKey: "preventive.list.table.serial",
      placeholderKey: "preventive.list.table.serial",
      component: "Input",
    },
    {
      name: "assetNumber",
      labelKey: "assetMaintenance.asset_number",
      placeholderKey: "assetMaintenance.asset_number",
      component: "Input",
    },
    {
      name: "supervisor",
      labelKey: "preventive.start_modal.supervisor",
      placeholderKey: "preventive.start_modal.supervisor",
      component: "Select",
      options: supervisors,
    },
    {
      name: "customer",
      labelKey: "preventive.list.table.customer",
      placeholderKey: "preventive.list.table.customer",
      component: "Select",
      options: customers,
    },
  ];
  const placeholderMap = {
    searchText: t("preventive.common.all"),
    code: t("preventiveConditionBased.code"),
    assetName: t("preventive.list.table.asset_name"),
    assetModelName: t("preventive.list.table.model"),
    serial: t("preventive.list.table.serial"),
    assetNumber: t("assetMaintenance.asset_number"),
    supervisorName: t("preventive.start_modal.supervisor"),
    customerName: t("preventive.list.table.customer"),
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
        <Row className="mb-1" gutter={16}>
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
                      label: t("preventiveConditionBased.code"),
                    },
                    {
                      value: "assetName",
                      label: t("preventive.list.table.asset_name"),
                    },
                    {
                      value: "assetModelName",
                      label: t("preventive.list.table.model"),
                    },
                    {
                      value: "serial",
                      label: t("preventive.list.table.serial"),
                    },
                    {
                      value: "assetNumber",
                      label: t("assetMaintenance.asset_number"),
                    },
                    {
                      value: "supervisorName",
                      label: t("preventive.start_modal.supervisor"),
                    },
                    {
                      value: "customerName",
                      label: t("preventive.list.table.customer"),
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
            span={9}
            style={{ display: "flex", alignItems: "center", marginBottom: 2 }}
          >
            <Button type="primary" className="mr-2" htmlType="submit">
              <SearchOutlined />
              {t("purchase.buttons.search")}
            </Button>
            <Button className="bt-green mr-2" onClick={resetSearch}>
              <RedoOutlined />
              {t("purchase.buttons.reset")}
            </Button>
            <Button
              title={t("preventive.buttons.advanced_search")}
              className="px-2 mr-2"
              onClick={() => setIsOpenSearchAdvanced(true)}
            >
              <FilterOutlined style={{ fontSize: 20, cursor: "pointer" }} />
            </Button>
          </Col>
          <Col
            span={7}
            style={{ fontSize: 16, textAlign: "right", marginTop: 20 }}
          >
            <b>{t("asset.list.total", { count: totalRecord || 0 })}</b>
          </Col>
        </Row>

        <Table
          rowKey="id"
          columns={columns}
          key={"id"}
          dataSource={preventiveConditionBasedSchedules}
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
        <UpdatePreventiveConditionBasedSchedule
          open={showUpdateModal}
          handleCancel={() => setShowUpdateModal(false)}
          preventiveConditionBasedSchedule={preventiveConditionBasedSchedule}
          onRefresh={fetchGetPreventiveMonitoring}
        />
        <ViewPreventiveConditionBasedScheduleHistory
          open={showViewModal}
          handleCancel={() => setShowViewModal(false)}
          preventiveConditionBasedSchedule={preventiveConditionBasedSchedule}
        />
      </Form>
      <DrawerSearch
        isOpen={isOpenSearchAdvanced}
        ref={drawerRef}
        onCallBack={(value) => {
          searchForm.resetFields(["searchValue"]);
          setSearchFilter(value);
          if (!value.isClose) {
            setPage(1);
            fetchGetPreventiveMonitoring(1, value);
          }
        }}
        onClose={() => {
          setIsOpenSearchAdvanced(false);
        }}
        fieldsConfig={fieldsConfig}
      />
    </div>
  );
}
